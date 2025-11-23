import { Button } from '@/components/ui/button';
import { categoryTable } from '@/db/schema';

interface CategorySelectorProps {
  // Categorias
  categories: (typeof categoryTable.$inferSelect)[];
}

function CategorySelector({ categories }: CategorySelectorProps) {
  return (
    <div className="rounded-3xl bg-[#F4EFFF] p-6">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            className="cursor-pointer rounded-full border border-purple-950 bg-white font-semibold"
            variant="ghost"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
