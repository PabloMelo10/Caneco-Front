import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const loginSchema = z.object({
  username: z.string().min(1, "Nome do operador é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export default function LoginPage() {
  const { loginMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to menu if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/menu");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        setLocation("/menu");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold app-title mb-2">CANECO</h1>
          <p className="text-secondary-foreground">Caixa Automatizado para Negócios E Controle Operacional</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="caneco-gradient p-6">
            <h2 className="text-center text-white text-2xl font-bold">Acesso ao Sistema</h2>
          </div>
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary-foreground font-medium">Nome do Operador</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray">
                            <span className="material-icons text-primary/70">person</span>
                          </span>
                          <Input 
                            {...field} 
                            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Digite seu nome de usuário"
                            autoComplete="off"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary-foreground font-medium">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray">
                            <span className="material-icons text-primary/70">lock</span>
                          </span>
                          <Input 
                            {...field} 
                            type="password"
                            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Digite sua senha"
                            autoComplete="off"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full btn-primary"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <span className="material-icons mr-2">arrow_forward</span>
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-foreground">
                <span className="material-icons text-sm align-text-bottom mr-1">info</span>
                Use <span className="font-semibold">admin</span> / <span className="font-semibold">password</span> ou <span className="font-semibold">vendedor</span> / <span className="font-semibold">123456</span> para testar
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-gray">
          <p>© 2025 CANECO - Sistema PDV para Supermercados</p>
        </div>
      </div>
    </div>
  );
}
