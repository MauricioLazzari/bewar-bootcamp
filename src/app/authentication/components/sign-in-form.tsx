import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Schema/Regras do formuário
const formSchema = z.object({
  email: z.email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
});

// Extrai o tipo TypeScript diretamente do schema do Zod
type FormValues = z.infer<typeof formSchema>;

// Componente SignInForm
const SignInForm = () => {
  const form = useForm<FormValues>({
    // Conecta o Zod ao form
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Botão para enviar os dados
  function onSubmit(values: FormValues) {
    // Dados do formulário
    console.log('Valores validados:', values);
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
        {/* Botão entrar */}
        <Button type="submit" className="w-full cursor-pointer">
          Entrar
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
