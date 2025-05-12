import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/layout/header";

export default function MainMenu() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (!user) return null;

  const menuItems = [
    {
      id: "new-checkout",
      title: "Novo Checkout",
      description: "Iniciar nova venda",
      icon: "shopping_cart",
      path: "/categories",
    },
    {
      id: "sales-history",
      title: "Histórico de Vendas",
      description: "Ver vendas anteriores",
      icon: "receipt_long",
      path: "/sales-history",
    },
    {
      id: "add-balance",
      title: "Adicionar Saldo",
      description: "Adicionar fundos ao caixa",
      icon: "account_balance_wallet",
      path: "/add-balance",
    },
    {
      id: "close-register",
      title: "Fechar Caixa",
      description: "Encerrar operações do dia",
      icon: "point_of_sale",
      path: "/close-register",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Sistema PDV" />
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-neutral-dark mb-8 text-center">Menu Principal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              className="menu-card"
              onClick={() => setLocation(item.path)}
            >
              <div className="bg-primary-light text-white p-6 flex justify-center">
                <span className="material-icons text-6xl">{item.icon}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-center text-neutral-dark mb-2">{item.title}</h3>
                <p className="text-neutral-gray text-center">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
