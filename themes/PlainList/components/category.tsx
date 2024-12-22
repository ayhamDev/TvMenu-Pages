import { ICategory } from "@/interface/Category.interface";
import { MenuItem } from "./menu-item";

interface CategoryProps {
  category: ICategory;
}

export function Category({ category }: CategoryProps) {
  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl sticky top-[67px] z-[9] bg-offbackground p-3 rounded-md font-bold mb-4">
        {category.title}
      </h2>
      {category.caption && (
        <p className="text-muted-foreground mb-4">{category.caption}</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.item?.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
