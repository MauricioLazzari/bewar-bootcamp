'use client';

import Header from '@/app/common/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SignInForm from './components/sign-in-form';
import SignUpForm from './components/sign-up-form';

const Authentication = () => {
  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          {/* Aba de login */}
          <TabsContent value="sign-in">
            <Card>
              <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>Faça login para continuar</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Formulário de login */}
                <SignInForm />
              </CardContent>
            </Card>
          </TabsContent>
          {/* Aba criar conta */}
          <TabsContent value="sign-up">
            <Card>
              <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>Crie uma conta para continuar.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Formulário de criar conta */}
                <SignUpForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
