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
export const userRelations = relations(userTable, ({ many }) => {
  return {
    // 1 Usuário x N Endereços de envio
    shippingAddresses: many(shippingAddressTable),
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
