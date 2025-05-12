import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { balanceReasons } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { InsertCashTransaction } from "@shared/schema";

const addBalanceSchema = z.object({
  amount: z.number().positive("O valor deve ser maior que zero"),
  reason: z.string().min(1, "Selecione um motivo"),
  notes: z.string().optional(),
});

export default function AddBalancePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof addBalanceSchema>>({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: {
      amount: 0,
      reason: "",
      notes: "",
    },
  });

  // Create cash transaction mutation
  const createCashTransactionMutation = useMutation({
    mutationFn: async (transactionData: InsertCashTransaction) => {
      const res = await apiRequest("POST", "/api/cash-transactions", transactionData);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate cash transactions query
      queryClient.invalidateQueries({ queryKey: ["/api/cash-transactions"] });
      
      toast({
        title: "Saldo adicionado",
        description: "O valor foi adicionado ao caixa com sucesso.",
      });
      
      // Redirect to main menu
      setLocation("/menu");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar saldo",
        description: error.message || "Ocorreu um erro ao adicionar o saldo. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof addBalanceSchema>) => {
    if (!user) return;
    
    const transactionData: InsertCashTransaction = {
      amount: values.amount,
      reason: values.reason,
      notes: values.notes,
      operatorId: user.id,
    };
    
    createCashTransactionMutation.mutate(transactionData);
  };

  if (!user) return null;

  const watchReason = form.watch("reason");

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Adicionar Saldo" 
        showBackButton 
        backPath="/menu"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-neutral-dark mb-6">Adicionar Dinheiro ao Caixa</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-neutral-dark font-medium mb-2">Valor (R$)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-neutral-dark font-medium mb-2">Motivo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 border border-neutral-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                          <SelectValue placeholder="Selecione um motivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {balanceReasons.map((reason) => (
                          <SelectItem key={reason.id} value={reason.id}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchReason === "other" && (
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-neutral-dark font-medium mb-2">Especifique o Motivo</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button 
                type="submit"
                disabled={createCashTransactionMutation.isPending}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
              >
                {createCashTransactionMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">add_circle</span>
                    Adicionar Saldo
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
