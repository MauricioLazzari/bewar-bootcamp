import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Tabela de usuários
export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
});

// Tabela de categorias
export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 1 Categoria x N Produtos
export const categoryRelations = relations(categoryTable, ({ many }) => {
  return {
    products: many(productTable),
  };
});

// Tabela de produtos
export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => categoryTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 1 Produto x 1 Categoria
// 1 Produto x N Variantes
export const productRelations = relations(productTable, ({ one, many }) => {
  return {
    category: one(categoryTable, {
      fields: [productTable.categoryId],
      references: [categoryTable.id],
    }),
    variants: many(productVariantTable),
  };
});

// Tabela de variantes de produtos
export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id").references(() => productTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  imageUrl: text("image_url").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 1 Variant x 1 Produto
export const productVariantsRelations = relations(
  productVariantTable,
  ({ one }) => {
    return {
      variants: one(productTable, {
        fields: [productVariantTable.productId],
        references: [productTable.id],
      }),
    };
  },
);
