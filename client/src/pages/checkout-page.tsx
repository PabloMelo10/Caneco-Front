import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/layout/header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, paymentMethods } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InsertSale, Sale } from "@shared/schema";

const paymentSchema = z.object({
  paymentMethod: z.enum(["cash", "credit", "debit", "pix"]),
  cashAmount: z.number().optional(),
});

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [change, setChange] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
    
    // Redirect to categories if cart is empty
    if (cartItems.length === 0) {
      setLocation("/categories");
    }
  }, [user, cartItems, setLocation]);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "cash",
      cashAmount: 0,
    },
  });

  // Update change amount when cash amount changes
  const watchCashAmount = form.watch("cashAmount");
  const watchPaymentMethod = form.watch("paymentMethod");
  
  useEffect(() => {
    if (watchPaymentMethod === "cash" && watchCashAmount) {
      setChange(Math.max(0, watchCashAmount - cartTotal));
    } else {
      setChange(0);
    }
  }, [watchCashAmount, watchPaymentMethod, cartTotal]);

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (saleData: InsertSale) => {
      const res = await apiRequest("POST", "/api/sales", saleData);
      return await res.json() as Sale;
    },
    onSuccess: (data) => {
      // Invalidate sales query
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      
      // Clear the cart
      clearCart();
      
      // Redirect to receipt page
      setLocation(`/receipt/${data.id}`);
    },
  });

  const onSubmit = (values: z.infer<typeof paymentSchema>) => {
    if (!user) return;
    
    const paymentMethodMap: Record<string, string> = {
      cash: "Dinheiro",
      credit: "Cartão de Crédito",
      debit: "Cartão de Débito",
      pix: "PIX"
    };
    
    const saleData: InsertSale = {
      total: cartTotal,
      paymentMethod: paymentMethodMap[values.paymentMethod],
      operatorId: user.id,
      items: cartItems,
      amountReceived: values.paymentMethod === "cash" ? values.cashAmount : undefined,
      change: values.paymentMethod === "cash" ? change : undefined,
    };
    
    createSaleMutation.mutate(saleData);
  };

  if (!user || cartItems.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Finalizar Compra" 
        showBackButton 
        backPath="/categories"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-4">Resumo da Compra</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center pb-2 border-b border-neutral-medium">
                    <div>
                      <h4 className="font-medium text-neutral-dark">{item.name}</h4>
                      <p className="text-neutral-gray text-sm">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium text-neutral-dark">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center py-2 border-t border-primary-light">
                <span className="text-lg font-bold text-neutral-dark">Total:</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-neutral-dark mb-4">Método de Pagamento</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-4"
                        >
                          {paymentMethods.map((method) => (
                            <FormItem key={method.id} className="flex items-center p-3 border border-neutral-medium rounded-lg cursor-pointer hover:border-primary-light transition-colors">
                              <FormControl>
                                <RadioGroupItem value={method.id} id={method.id} className="mr-3" />
                              </FormControl>
                              <FormLabel htmlFor={method.id} className="flex items-center cursor-pointer flex-1">
                                <span className="material-icons text-primary mr-3">{method.icon}</span>
                                <span>{method.label}</span>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormItem>
                    )}
                  />
                  
                  {watchPaymentMethod === "cash" && (
                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="cashAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-neutral-dark font-medium mb-2">Valor Recebido (R$)</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value || 0}
                                onChange={field.onChange}
                                min={cartTotal}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="mt-4">
                        <p className="text-neutral-dark font-medium mb-2">Troco:</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(change)}</p>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="submit"
                    disabled={createSaleMutation.isPending}
                    className="w-full bg-success hover:bg-success/90 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    {createSaleMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">check_circle</span>
                        Finalizar Venda
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
