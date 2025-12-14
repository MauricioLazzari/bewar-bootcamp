'use client';

import { LogInIcon, LogOutIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { authClient } from '@/lib/auth-client';

import Cart from './cart';

// Componente Header
function Header() {
  // Sessão do usuário
  const session = authClient.useSession();
  // Navegação
  const router = useRouter();

  // Deslogar usuário
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/authentication');
        },
      },
    });
  }

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={130} height={34} />
      </Link>
      <div className="flex items-center gap-2">
        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center">
              <Button className="cursor-pointer" variant="outline" size="icon">
                <MenuIcon />
              </Button>
            </div>
          </SheetTrigger>
          {/* Menu Content */}
          <SheetContent>
            {/* Menu Header */}
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">Menu de navegação</SheetDescription>
            </SheetHeader>
            <div className="px-5">
              {/* Se usuário estiver logado */}
              {session?.data?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="items center flex gap-3">
                        <Avatar>
                          <AvatarImage src={session?.data?.user.image as string | undefined} />
                          <AvatarFallback>
                            {/* Pega a primeira letra do nome e do sobrenome */}
                            {session?.data?.user?.name?.charAt(0).toUpperCase()}
                            {session?.data?.user?.name?.split(' ')[1]?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-semibold">Olá, {session?.data?.user.name}</h3>
                        <span className="text-muted-foreground block text-xs">{session?.data?.user.email}</span>
                      </div>
                    </div>
                    <Button onClick={() => signOut()} className="cursor-pointer" asChild variant="outline" size="icon">
                      <Link href="/authentication">
                        <LogOutIcon />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Se usuário não estiver logado */}
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Olá. Faça seu login!</div>
                    <Button className="cursor-pointer" asChild variant="outline" size="icon">
                      <Link href="/authentication">
                        <LogInIcon />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
}

export default Header;
