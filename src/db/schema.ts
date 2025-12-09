import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Tabela de categorias
export const categoryTable = pgTable('category', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 1 Categoria x N Produtos
export const categoryRelations = relations(categoryTable, ({ many }) => {
  return {
    products: many(productTable),
  };
});

// Tabela de produtos
export const productTable = pgTable('product', {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => categoryTable.id, { onDelete: 'set null' }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 1 Produto x 1 Categoria
// 1 Produto x N Variantes
export const productRelations = relations(productTable, ({ one, many }) => {
  return {
    // 1 Produto x 1 Categoria
    category: one(categoryTable, {
      fields: [productTable.categoryId],
      references: [categoryTable.id],
    }),
    // 1 Produto x N Variantes
    variants: many(productVariantTable),
  };
});

// Tabela de variantes de produtos
export const productVariantTable = pgTable('product_variant', {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => productTable.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  imageUrl: text('image_url').notNull(),
  priceInCents: integer('price_in_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 1 Variante x 1 Produto
export const productVariantsRelations = relations(productVariantTable, ({ one }) => {
  return {
    // 1 Variante x 1 Produto
    product: one(productTable, {
      fields: [productVariantTable.productId],
      references: [productTable.id],
    }),
  };
});

// Tabela de usuários
export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// 1 Usuário x N Endereços de envio
export const userRelations = relations(userTable, ({ many, one }) => {
  return {
    // 1 Usuário x N Endereços de envio
    shippingAddresses: many(shippingAddressTable),
    // 1 Usuário x 1 Carrinho
    cart: one(cartTable, {
      fields: [userTable.id],
      references: [cartTable.userId],
    }),
  };
});

// Tabela de endereços de envio
export const shippingAddressTable = pgTable('shipping_address', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
  recipientName: text('recipient_name').notNull(),
  street: text().notNull(),
  number: text().notNull(),
  complement: text(),
  city: text().notNull(),
  state: text().notNull(),
  neighborhood: text().notNull(),
  zipCode: text().notNull(),
  country: text().notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  cnpfcnpj: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 1 Endereço de envio x 1 Usuário
export const shippingAddressRelations = relations(shippingAddressTable, ({ one }) => {
  return {
    user: one(userTable, {
      fields: [shippingAddressTable.userId],
      references: [userTable.id],
    }),
    cart: one(cartTable, {
      fields: [shippingAddressTable.userId],
      references: [cartTable.userId],
    }),
  };
});

// Tabela do carrinho
export const cartTable = pgTable('cart', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text('user_id').references(() => userTable.id, { onDelete: 'cascade' }),
  shippingAddressId: uuid('shipping_address_id').references(() => shippingAddressTable.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 1 Carrinho x 1 Usuário
// 1 Carrinho x 1 Endereço de envio
export const cartRelations = relations(cartTable, ({ many, one }) => {
  return {
    // 1 Carrinho x 1 Usuário
    user: one(userTable, {
      fields: [cartTable.userId],
      references: [userTable.id],
    }),
    // 1 Carrinho x 1 Endereço de envio
    shippingAddress: one(shippingAddressTable, {
      fields: [cartTable.shippingAddressId],
      references: [shippingAddressTable.id],
    }),
    // 1 Carrinho x N Itens do carrinho
    cartItems: many(cartItemTable),
  };
});

// Itens do carrinho
export const cartItemTable = pgTable('cart_item', {
  id: uuid().primaryKey().defaultRandom(),
  cartId: uuid('cart_id').references(() => cartTable.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => productTable.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').references(() => productVariantTable.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 1 Item do carrinho x 1 Carrinho
export const cartItemRelations = relations(cartItemTable, ({ one }) => {
  return {
    cart: one(cartTable, {
      fields: [cartItemTable.cartId],
      references: [cartTable.id],
    }),
  };
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
});

export const accountTable = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationTable = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);
