import Image from 'next/image';

import Header from '@/app/common/header';
import { db } from '@/db';

import ProductList from './common/product-list';

// Componente Home
async function Home() {
  // Produtos e suas variantes
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  console.log(products);

  return (
    <div>
      <Header />
      {/* Banner principal */}
      <div className="space-y-5 px-5">
        <Image
          src="/banner-01.png"
          alt="Leve uma vida com estilo"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />

        <ProductList title="Mais Vendidos" products={products} />

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
