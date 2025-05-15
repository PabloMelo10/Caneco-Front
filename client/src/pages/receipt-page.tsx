import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Sale } from "@shared/schema";

export default function ReceiptPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const saleId = parseInt(params.saleId);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch sale data
  const { data: sale, isLoading, error } = useQuery<Sale>({
    queryKey: [`/api/sales/${saleId}`],
  });

  if (!user) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleBackToMenu = () => {
    setLocation("/menu");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-xl">Erro ao carregar recibo</p>
          <Button 
            onClick={handleBackToMenu}
            className="mt-4"
          >
            Voltar ao Menu Principal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-neutral-light">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <span className="material-icons text-success text-6xl mb-2">check_circle</span>
          <h2 className="text-2xl font-bold text-neutral-dark">Venda Concluída!</h2>
          <p className="text-neutral-gray">Venda #{sale.id} processada com sucesso</p>
        </div>
        
        <div className="receipt bg-neutral-light rounded-lg p-4 mb-6">
          <div className="text-center mb-4">
            <h3 className="font-bold text-neutral-dark text-lg">CUPOM NÃO FISCAL</h3>
            <p className="text-neutral-gray text-sm">Sistema PDV - CNPJ: 12.345.678/0001-90</p>
            <p className="text-neutral-gray text-sm">{formatDate(sale.createdAt!)}</p>
          </div>
          
          <div className="border-t border-b border-neutral-gray py-3 my-3">
            <div className="grid grid-cols-4 text-sm text-neutral-dark mb-2">
              <div className="col-span-2 font-medium">Item</div>
              <div className="text-right font-medium">Qtd</div>
              <div className="text-right font-medium">Valor</div>
            </div>
            
            {sale.items && Array.isArray(sale.items) && sale.items.map((item: any, index) => (
              <div key={index} className="grid grid-cols-4 text-sm text-neutral-dark">
                <div className="col-span-2">{item.name}</div>
                <div className="text-right">{item.quantity}</div>
                <div className="text-right">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-neutral-dark font-bold">
            <span>TOTAL</span>
            <span>{formatCurrency(Number(sale.total))}</span>
          </div>
          
          <div className="mt-3 text-sm text-neutral-gray">
            <p className="flex justify-between">
              <span>Forma de Pagamento:</span>
              <span>{sale.paymentMethod}</span>
            </p>
            {sale.amountReceived && (
              <p className="flex justify-between">
                <span>Valor Recebido:</span>
                <span>{formatCurrency(Number(sale.amountReceived))}</span>
              </p>
            )}
            {sale.change && (
              <p className="flex justify-between">
                <span>Troco:</span>
                <span>{formatCurrency(Number(sale.change))}</span>
              </p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={handlePrintReceipt}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
          >
            <span className="material-icons mr-2">print</span>
            Imprimir Recibo
          </Button>
          <Button 
            onClick={handleBackToMenu}
            variant="outline"
            className="bg-neutral-medium hover:bg-neutral-gray text-neutral-dark font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
          >
            <span className="material-icons mr-2">home</span>
            Voltar ao Menu Principal
          </Button>
        </div>
      </div>
    </div>
  );
}
