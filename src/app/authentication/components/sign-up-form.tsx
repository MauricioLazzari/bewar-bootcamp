import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

// Schema/Regras do formuário
const formSchema = z
  .object({
    nome: z.string('Nome inválido.').trim().min(1, 'Nome é obrigatório'),
    email: z.email({ message: 'Por favor, insira um e-mail válido.' }),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    passwordConfirmation: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirmation;
    },
    {
      error: 'As senhas não conferem!',
      path: ['passwordConfirmation'],
    }
  );

// Extrai o tipo TypeScript diretamente do schema do Zod
type FormValues = z.infer<typeof formSchema>;

// Componente do formulário de cadastro
function SignUpForm() {
  // Router para redirecionar
  const router = useRouter();
  // Formulário
  const form = useForm<FormValues>({
    // Conecta o Zod ao form
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  // Botão para enviar os dados
  async function onSubmit(values: FormValues) {
    // Desestrutura os dados e o erro
    const { data, error } = await authClient.signUp.email({
      name: values.nome,
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
            case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
              toast.error('E-mail já cadastrado!');
              form.setError('email', {
                type: 'manual',
                message: 'E-mail já cadastrado!',
              });
              break;
            default:
              toast.error(ctx.error?.message);
              break;
          }
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Campo senha */}
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirme sua senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Botão criar conta */}
        <Button type="submit" className="w-full cursor-pointer">
          Criar conta
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
