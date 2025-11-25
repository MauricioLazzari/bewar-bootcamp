import Image from 'next/image';

const PartnersBrands = () => {
  // Marcas parceiras
  const brands = [
    {
      name: 'New Balance',
      image: '/logo-newbalance.svg',
    },
    {
      name: 'Adidas',
      image: '/logo-adidas.svg',
    },
    {
      name: 'Nike',
      image: '/logo-nike.svg',
    },
    {
      name: 'Puma',
      image: '/logo-puma.svg',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Parceiros</h3>
      <div className="flex gap-4">
        {brands.map((brand) => {
          return (
            <div key={brand.name} className="flex flex-col items-center justify-center space-y-2">
              <div className="flex aspect-square w-full rounded-2xl border-2 border-gray-100 p-5">
                <Image src={brand.image} alt={brand.name} width={100} height={100} className="object-contain" />
              </div>
              <p className="text-xs font-semibold">{brand.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnersBrands;
