'use server';

import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { cartItemTable, cartTable, productVariantTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { AddCartProductSchema, addCartProductSchema } from './schema';

// Função para adicionar um produto ao carrinho
export const addProductToCart = async (data: AddCartProductSchema) => {
  // Valida os dados e se houver erro, lança um erro
  addCartProductSchema.parse(data);
  // Verifica se o usuário está autenticado
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // Se o usuário não estiver autenticado, lança um erro
  if (!session?.user) {
    throw new Error('Faça login para adicionar ao carrinho!');
  }

  // Busca o produto no banco de dados
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, data.productVariantId),
  });

  // Se o produto não existir, lança um erro
  if (!productVariant) {
    throw new Error('Produto não encontrado!');
  }

  // Busca o carrinho do usuário
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });

  // Armazena o ID do carrinho
  let cartId = cart?.id;

  // Se o carrinho não existir, cria um novo
  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    cartId = newCart.id;
  }

  // Mesmo após criar o carrinho, se o ID do carrinho não existir, lança um erro
  if (!cartId) {
    throw new Error('Erro ao recuperar o carrinho');
  }

  // Busca se o item já existe no carrinho
  const cartItem = await db.query.cartItemTable.findFirst({
    where: and(eq(cartItemTable.cartId, cartId), eq(cartItemTable.productVariantId, data.productVariantId)),
  });

  // Se o item existir, atualiza a quantidade
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
  } else {
    // Se o item não existir, adiciona ao carrinho
    await db.insert(cartItemTable).values({
      cartId,
      productId: productVariant.productId,
      productVariantId: data.productVariantId,
      quantity: data.quantity,
    });
  }
};
