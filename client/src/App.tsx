import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login-page";
import MainMenu from "@/pages/main-menu";
import CategoriesPage from "@/pages/categories-page";
import ProductsPage from "@/pages/products-page";
import CheckoutPage from "@/pages/checkout-page";
import ReceiptPage from "@/pages/receipt-page";
import SalesHistoryPage from "@/pages/sales-history-page";
import AddBalancePage from "@/pages/add-balance-page";
import CloseRegisterPage from "@/pages/close-register-page";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/menu" component={MainMenu} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/products/:categoryId" component={ProductsPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/receipt/:saleId" component={ReceiptPage} />
      <Route path="/sales-history" component={SalesHistoryPage} />
      <Route path="/add-balance" component={AddBalancePage} />
      <Route path="/close-register" component={CloseRegisterPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
