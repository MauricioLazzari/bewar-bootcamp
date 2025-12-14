import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

// Schema/Regras do formuário
const formSchema = z.object({
  email: z.email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
});

// Extrai o tipo TypeScript diretamente do schema do Zod
type FormValues = z.infer<typeof formSchema>;

// Função SignInForm
export const SignInForm = () => {
  // Navegação
  const router = useRouter();
  // Formulário
  const form = useForm<FormValues>({
    // Conecta o Zod ao form
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Botão para enviar os dados de login
  async function onSubmit(values: FormValues) {
    // Desestrutura os dados e error
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess: () => {
          // Redireciona para a página inicial
          router.push('/');
        },
        onError: (ctx) => {
          // Verifica o erro e exibe uma mensagem
          switch (ctx.error?.code) {
            case 'INVALID_EMAIL_OR_PASSWORD':
              form.setError('email', {
                type: 'manual',
                message: 'E-mail ou senha inválidos!',
              });
              toast.error('E-mail ou senha inválidos!');
              break;
            default:
              toast.error(ctx.error?.message);
              break;
          }
        },
      },
    });
  }

  // Botão para enviar os dados de login com Google
  async function onGoogleSubmit() {
    const data = await authClient.signIn.social({
      provider: 'google',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo e-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Campo senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full cursor-pointer">
            Entrar
          </Button>
          <Button
            type="button"
            onClick={onGoogleSubmit}
            className="w-full cursor-pointer border-2 border-gray-100 bg-white text-black hover:bg-white"
          >
            <FcGoogle className="h-5 w-5" />
            Entrar com Google
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
