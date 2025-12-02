import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import Header from '@/app/common/header';
import ProductItem from '@/app/common/product-item';
import { db } from '@/db';
import { categoryTable, productTable } from '@/db/schema';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Componente CategoryPage
const CategoryPage = async ({ params }: CategoryPageProps) => {
  // Desestrutura o slug passado na URL
  const { slug } = await params;
  // Busca a categoria no banco de dados
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  // Verifica se a categoria existe
  if (!category) {
    return notFound();
  }
  // Busca os produtos da categoria
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });

  return (
    <>
      <Header />
      <div className="space-y-6 px-5">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} textContainerClassName="max-w-full" />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
