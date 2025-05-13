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
      title: "Nova Venda",
      description: "Iniciar nova venda",
      icon: "shopping_cart",
      path: "/categories",
      primary: true,
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
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header title="CANECO - Sistema PDV" />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold app-title mb-2">Bem-vindo, {user.name}!</h1>
          <p className="text-secondary-foreground">O que você deseja fazer hoje?</p>
        </div>
        
        {/* Principal card destacado */}
        <div className="max-w-4xl mx-auto mb-8" onClick={() => setLocation("/categories")}>
          <div className="menu-card caneco-gradient">
            <div className="flex items-center p-8">
              <div className="bg-white/20 rounded-full p-4 mr-6">
                <span className="material-icons text-5xl">shopping_cart</span>
              </div>
              <div>
                <h2 className="font-bold text-2xl mb-2">Nova Venda</h2>
                <p className="opacity-90">Iniciar um novo atendimento no caixa</p>
              </div>
              <div className="ml-auto">
                <span className="material-icons text-4xl">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Grid de outros cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {menuItems.filter(item => !item.primary).map((item) => (
            <div 
              key={item.id}
              className="menu-card"
              onClick={() => setLocation(item.path)}
            >
              <div className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-3xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-xl text-center text-secondary-foreground mb-2">{item.title}</h3>
                <p className="text-secondary-foreground/70 text-center text-sm">{item.description}</p>
              </div>
            </div>
          ))}

          {/* Card de administração - visível somente para admin */}
          {user.isAdmin && (
            <div className="menu-card bg-secondary/20 border border-primary/20"
                 onClick={() => alert("Módulo de administração em desenvolvimento")}>
              <div className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-3xl">admin_panel_settings</span>
                </div>
                <h3 className="font-bold text-xl text-center text-secondary-foreground mb-2">Administração</h3>
                <p className="text-secondary-foreground/70 text-center text-sm">Gerenciar produtos e usuários</p>
              </div>
            </div>
          )}
        </div>

        {/* Resumo do caixa atual */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-xl text-secondary-foreground mb-4">Resumo do Caixa Atual</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <p className="text-sm text-secondary-foreground/70">Vendas Hoje</p>
                <p className="text-2xl font-bold text-primary">3</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4">
                <p className="text-sm text-secondary-foreground/70">Total em Vendas</p>
                <p className="text-2xl font-bold text-primary">R$ 75,40</p>
              </div>
              <div className="bg-secondary/20 rounded-lg p-4">
                <p className="text-sm text-secondary-foreground/70">Saldo em Caixa</p>
                <p className="text-2xl font-bold text-primary">R$ 175,40</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-sm text-secondary-foreground/70 border-t">
        <p>CANECO - Caixa Automatizado para Negócios E Controle Operacional &copy; 2025</p>
      </footer>
    </div>
  );
}
