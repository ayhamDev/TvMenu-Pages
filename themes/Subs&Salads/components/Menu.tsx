import { IMenu } from "@/interface/Menu.interface";
import MenuCategory from "./MenuCategory";
const Menu = ({ menu }: { menu: IMenu }) => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-8 text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">
          {menu.title}
        </h1>
      </div>
      {menu?.category?.map((category) => (
        <MenuCategory key={category.id} category={category} />
      ))}
    </div>
  );
};

export default Menu;
