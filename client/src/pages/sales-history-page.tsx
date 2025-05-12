import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";
import { Sale } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SalesHistoryPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchDate, setSearchDate] = useState<string>("");
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Format today's date for the date input default value
  const today = new Date().toISOString().split('T')[0];

  // Fetch sales data
  const { data: sales, isLoading, error } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  if (!user) return null;

  // Filter sales by date if search date is provided
  const filteredSales = searchDate
    ? sales?.filter(sale => {
        const saleDate = new Date(sale.createdAt!).toISOString().split('T')[0];
        return saleDate === searchDate;
      })
    : sales;

  const handleSearchDate = () => {
    // The filtering is already done in the filteredSales calculation
  };

  const handleViewSaleDetails = (saleId: number) => {
    setLocation(`/receipt/${saleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Histórico de Vendas" 
        showBackButton 
        backPath="/menu"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-neutral-dark mb-4 sm:mb-0">Vendas Recentes</h2>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                max={today}
                className="px-3 py-2 border border-neutral-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleSearchDate}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                <span className="material-icons">search</span>
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive">
              Erro ao carregar histórico de vendas. Por favor, tente novamente.
            </div>
          ) : filteredSales && filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-medium">
                    <th className="py-3 px-4 text-left text-neutral-dark">#</th>
                    <th className="py-3 px-4 text-left text-neutral-dark">Data/Hora</th>
                    <th className="py-3 px-4 text-left text-neutral-dark">Valor</th>
                    <th className="py-3 px-4 text-left text-neutral-dark">Pagamento</th>
                    <th className="py-3 px-4 text-left text-neutral-dark">Operador</th>
                    <th className="py-3 px-4 text-left text-neutral-dark">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-neutral-medium hover:bg-neutral-light transition-colors">
                      <td className="py-3 px-4 text-neutral-dark">#{sale.id}</td>
                      <td className="py-3 px-4 text-neutral-dark">{formatDate(sale.createdAt!)}</td>
                      <td className="py-3 px-4 text-neutral-dark font-medium">{formatCurrency(Number(sale.total))}</td>
                      <td className="py-3 px-4 text-neutral-dark">{sale.paymentMethod}</td>
                      <td className="py-3 px-4 text-neutral-dark">{user.name}</td>
                      <td className="py-3 px-4">
                        <button 
                          className="text-primary hover:text-primary-dark"
                          onClick={() => handleViewSaleDetails(sale.id)}
                        >
                          <span className="material-icons">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-gray">
              <p>Nenhuma venda encontrada para o período selecionado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
