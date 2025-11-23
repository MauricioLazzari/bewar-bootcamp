import Image from 'next/image';

import Header from '@/app/common/header';
import { db } from '@/db';

import CategorySelector from './common/category-selector';
import ProductList from './common/product-list';

// Componente Home
async function Home() {
  // Produtos e suas variantes
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  // Categorias
  const categories = await db.query.categoryTable.findMany();

  return (
    <div>
      <Header />
      <div className="space-y-5 px-5">
        {/* Banner principal */}
        <Image
          src="/banner-01.png"
          alt="Leve uma vida com estilo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />

        {/* Lista de produtos */}
        <ProductList title="Mais Vendidos" products={products} />
        {/* Lista de categorias */}
        <CategorySelector categories={categories} />

        {/* Banner secundário */}
        <Image
          src="/banner-02.png"
          alt="Leve uma vida com estilo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

export default Home;
