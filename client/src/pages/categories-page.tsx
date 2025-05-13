import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/layout/header";
import { Category } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch categories
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (!user) return null;

  const handleCategoryClick = (categoryId: number) => {
    setLocation(`/products/${categoryId}`);
  };

  const CartButton = () => (
    <button 
      onClick={() => setLocation("/checkout")}
      className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
      aria-label="Ver carrinho"
      title="Ver carrinho"
    >
      <span className="material-symbols-outlined text-2xl">shopping_cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header 
        title="Selecione a Categoria" 
        showBackButton 
        backPath="/menu" 
        actions={<CartButton />}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium text-secondary-foreground">Escolha uma categoria para continuar</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive">
            Erro ao carregar categorias. Por favor, tente novamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories?.map((category) => (
              <div 
                key={category.id}
                className="category-card"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="caneco-gradient p-6 flex justify-center rounded-t-xl">
                  <span className="material-symbols-outlined text-6xl">{category.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-center text-secondary-foreground">{category.name}</h3>
                  <div className="flex justify-center mt-4">
                    <span className="material-icons text-primary/70">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
