import { ICategory } from "@/interface/Category.interface";
import MenuItem from "./MenuItem";

const MenuCategory = ({ category }: { category: ICategory }) => {
  return (
    <div key={category.id} className="mb-12">
      <h2 className="text-4xl font-bold mb-6 text-yellow-400 border-b-2 border-yellow-400 pb-2">
        {category.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category?.item?.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
