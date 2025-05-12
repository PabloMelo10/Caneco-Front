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
  const categoryId = parseInt(params.categoryId);
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
      className="relative"
      aria-label="Ver carrinho"
    >
      <span className="material-icons text-2xl">shopping_cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col">
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
              className="w-full px-4 py-3 pl-12 border border-neutral-gray rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray">search</span>
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.map((product) => (
              <div key={product.id} className="product-card">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-neutral-dark">{product.name}</h3>
                    <span className="font-bold text-primary">{formatCurrency(Number(product.price))}</span>
                  </div>
                  {product.description && (
                    <p className="text-neutral-gray text-sm mb-4">{product.description}</p>
                  )}
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  >
                    <span className="material-icons mr-2">add_shopping_cart</span>
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
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Carrinho</h2>
            <button onClick={toggleCart} className="text-white">
              <span className="material-icons">close</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-neutral-gray">
                <span className="material-icons text-4xl mb-2">shopping_cart</span>
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between bg-neutral-light p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-neutral-dark">{item.name}</h4>
                        <p className="text-primary font-medium">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="bg-neutral-medium hover:bg-neutral-gray text-neutral-dark rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => useCart().updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <span className="material-icons text-sm">remove</span>
                      </button>
                      <span className="text-neutral-dark font-medium w-6 text-center">{item.quantity}</span>
                      <button 
                        className="bg-neutral-medium hover:bg-neutral-gray text-neutral-dark rounded-full w-8 h-8 flex items-center justify-center"
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
          
          <div className="border-t border-neutral-medium p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-dark font-medium">Total:</span>
              <span className="text-primary text-xl font-bold">{formatCurrency(useCart().cartTotal)}</span>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
              onClick={() => setLocation("/checkout")}
              disabled={cartItems.length === 0}
            >
              <span className="material-icons mr-2">payment</span>
              Finalizar Compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
