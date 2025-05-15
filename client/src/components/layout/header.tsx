import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  actions?: React.ReactNode;
}

export function Header({ title, showBackButton = false, backPath = "/menu", actions }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation(backPath);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={handleBack} 
              className="mr-4"
              aria-label="Voltar"
            >
              <span className="material-icons">arrow_back</span>
            </button>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {actions}
          
          {user && (
            <>
              <span className="font-medium hidden md:inline-block">Operador: {user.name}</span>
              <button 
                onClick={handleLogout} 
                className="text-white hover:text-neutral-light"
                aria-label="Sair"
              >
                <span className="material-icons">logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
