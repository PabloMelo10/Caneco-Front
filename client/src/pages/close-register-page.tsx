import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { InsertDailyRegister } from "@shared/schema";

interface RegisterSummary {
  systemBalance: number;
  cashSales: number;
  cardSales: number;
  pixSales: number;
  salesCount: number;
  totalSales: number;
}

const closeRegisterSchema = z.object({
  cashCount: z.number().min(0, "O valor não pode ser negativo"),
  differenceReason: z.string().optional(),
  notes: z.string().optional(),
});

export default function CloseRegisterPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasDifference, setHasDifference] = useState(false);
  const [difference, setDifference] = useState(0);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch register summary
  const { data: summary, isLoading: isLoadingSummary } = useQuery<RegisterSummary>({
    queryKey: ["/api/register-summary"],
  });

  const form = useForm<z.infer<typeof closeRegisterSchema>>({
    resolver: zodResolver(closeRegisterSchema),
    defaultValues: {
      cashCount: 0,
      differenceReason: "",
      notes: "",
    },
  });

  // Calculate difference when cash count changes
  const watchCashCount = form.watch("cashCount");
  
  useEffect(() => {
    if (summary) {
      const diff = watchCashCount - summary.systemBalance;
      setDifference(diff);
      setHasDifference(Math.abs(diff) > 0.01);
    }
  }, [watchCashCount, summary]);

  // Create daily register mutation
  const closeDailyRegisterMutation = useMutation({
    mutationFn: async (registerData: InsertDailyRegister) => {
      const res = await apiRequest("POST", "/api/daily-registers", registerData);
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/daily-registers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/register-summary"] });
      
      toast({
        title: "Caixa fechado",
        description: "O caixa foi fechado com sucesso.",
      });
      
      // Redirect to main menu
      setLocation("/menu");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fechar caixa",
        description: error.message || "Ocorreu um erro ao fechar o caixa. Por favor, tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof closeRegisterSchema>) => {
    if (!user || !summary) return;
    
    const registerData: InsertDailyRegister = {
      openingBalance: summary.systemBalance - summary.cashSales, // Approximate opening balance
      closingBalance: values.cashCount,
      systemBalance: summary.systemBalance,
      cashSales: summary.cashSales,
      cardSales: summary.cardSales,
      pixSales: summary.pixSales,
      operatorId: user.id,
      difference: hasDifference ? difference : undefined,
      differenceReason: hasDifference ? values.differenceReason : undefined,
      notes: values.notes,
    };
    
    closeDailyRegisterMutation.mutate(registerData);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Fechar Caixa" 
        showBackButton 
        backPath="/menu"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-neutral-dark mb-6">Resumo do Dia</h2>
          
          {isLoadingSummary ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : summary ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-neutral-light p-4 rounded-lg">
                  <h3 className="text-neutral-dark font-bold mb-2">Total de Vendas</h3>
                  <p className="text-primary text-2xl font-bold">{formatCurrency(summary.totalSales)}</p>
                  <p className="text-neutral-gray text-sm">{summary.salesCount} vendas hoje</p>
                </div>
                
                <div className="bg-neutral-light p-4 rounded-lg">
                  <h3 className="text-neutral-dark font-bold mb-2">Saldo em Caixa</h3>
                  <p className="text-primary text-2xl font-bold">{formatCurrency(summary.systemBalance)}</p>
                  <p className="text-neutral-gray text-sm">Incluindo abertura</p>
                </div>
                
                <div className="bg-neutral-light p-4 rounded-lg">
                  <h3 className="text-neutral-dark font-bold mb-2">Por Método</h3>
                  <div className="text-sm">
                    <p className="flex justify-between">
                      <span>Dinheiro:</span>
                      <span className="font-medium">{formatCurrency(summary.cashSales)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Cartão:</span>
                      <span className="font-medium">{formatCurrency(summary.cardSales)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>PIX:</span>
                      <span className="font-medium">{formatCurrency(summary.pixSales)}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cashCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-neutral-dark font-medium mb-2">Contagem de Dinheiro em Caixa (R$)</FormLabel>
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
                  
                  {hasDifference && (
                    <div className="bg-warning/20 border border-warning p-4 rounded-lg">
                      <h3 className="text-neutral-dark font-bold mb-2">Diferença Detectada</h3>
                      <p className="text-neutral-dark">
                        Diferença de <span className="font-bold">{formatCurrency(Math.abs(difference))}</span> entre o sistema e a contagem manual.
                      </p>
                      <FormField
                        control={form.control}
                        name="differenceReason"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormLabel className="block text-neutral-dark font-medium mb-2">Motivo da Diferença</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                className="w-full px-4 py-3 border border-neutral-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-neutral-dark font-medium mb-2">Observações</FormLabel>
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
                  
                  <Button 
                    type="submit"
                    disabled={closeDailyRegisterMutation.isPending}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    {closeDailyRegisterMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">check_circle</span>
                        Confirmar Fechamento
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center text-destructive">
              Erro ao carregar resumo do caixa. Por favor, tente novamente.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
