'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartTable } from '@/db/schema';
import { auth } from '@/lib/auth';

const getCartItems = async () => {
  // Busca a sessão do usuário
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Se o usuário não está logado
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  // Busca os itens do carrinho
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      cartItems: {
        with: {
          variant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  // Se não existir o carrinho, cria um
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();

    return { ...newCart, cartItems: [] };
  }

  return cart;
};

export default getCartItems;
