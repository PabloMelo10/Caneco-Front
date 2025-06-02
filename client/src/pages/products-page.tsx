import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Header } from "@/components/layout/header";
import { Product, Category } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function ProductsPage() {
  const { user } = useAuth();
  const { cartCount, cartItems, addToCart } = useCart();
  const [, setLocation] = useLocation();
  const params = useParams();
  const categoryId = params.categoryId ? parseInt(params.categoryId) : 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Fetch category
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
  });

  // Fetch products for the selected category
  const { 
    data: products, 
    isLoading: isProductsLoading, 
    error: productsError 
  } = useQuery<Product[]>({
    queryKey: [`/api/products?categoryId=${categoryId}`],
    queryFn: async () => {
      console.log(`Fetching products for category ${categoryId}`);
      const res = await fetch(`/api/products?categoryId=${categoryId}`);
      if (!res.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      return res.json();
    }
  });

  if (!user) return null;

  const isLoading = isCategoryLoading || isProductsLoading;

  // Filter products by search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const CartButton = () => (
    <button 
      onClick={toggleCart}
      className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
      aria-label="Ver carrinho"
      title="Ver carrinho"
    >
      <span className="material-icons text-2xl">Carrinho de Compras</span>
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
        title={category?.name || "Produtos"} 
        showBackButton 
        backPath="/categories" 
        actions={<CartButton />}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-foreground/60">Pesquisar</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : productsError ? (
          <div className="text-center text-destructive">
            Erro ao carregar produtos. Por favor, tente novamente.
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
              <span className="material-icons text-primary/70 text-3xl">Busca não encontrada</span>
            </div>
            <h3 className="text-xl font-medium text-secondary-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-secondary-foreground/70">Tente buscar por outro termo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.map((product) => (
              <div key={product.id} className="product-card">
                {product.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-destructive text-white px-3 py-1 rounded-md font-medium">Fora de estoque</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-secondary-foreground">{product.name}</h3>
                    <span className="font-bold text-primary">{formatCurrency(Number(product.price))}</span>
                  </div>
                  {product.description && (
                    <p className="text-secondary-foreground/70 text-sm mb-4">{product.description}</p>
                  )}
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary"
                    disabled={product.inStock === false}
                  >
                    <span className="material-icons mr-2">Adicionar ao Carrinho</span>
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Shopping Cart Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50`}>
        <div className="flex flex-col h-full">
          <div className="caneco-gradient p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Carrinho</h2>
            <button onClick={toggleCart} className="text-white bg-white/10 hover:bg-white/20 p-1 rounded-full">
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-secondary-foreground/70">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                  <span className="material-icons text-primary/70 text-3xl">Carrinho de Compras</span>
                </div>
                <p className="text-secondary-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-secondary-foreground/70 mt-2">Adicione produtos para continuar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-secondary-foreground">{item.name}</h4>
                        <p className="text-primary font-medium">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => useCart().updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <span className="material-icons text-sm">remove</span>
                      </button>
                      <span className="text-secondary-foreground font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => useCart().updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <span className="material-icons text-sm">add</span>
                      </button>
                      <button 
                        className="ml-2 text-destructive"
                        onClick={() => useCart().removeFromCart(item.productId)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="border-t border-secondary/20 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-secondary-foreground font-medium">Total:</span>
              <span className="text-primary text-xl font-bold">{formatCurrency(useCart().cartTotal)}</span>
            </div>
            <Button 
              className="w-full btn-primary"
              onClick={() => setLocation("/checkout")}
              disabled={cartItems.length === 0}
            >
              <span className="material-icons mr-2">pagamento</span>
              Finalizar Compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
