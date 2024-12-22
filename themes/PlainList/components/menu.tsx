import { IMenu } from "@/interface/Menu.interface";
import { Category } from "./category";
import RenderImage from "@/components/custom/RenderImage";
import { Separator } from "@/components/ui/separator";

interface MenuProps {
  menu: IMenu;
  showTitle?: boolean;
}

export function Menu({ menu, showTitle = true }: MenuProps) {
  return (
    <div className="mb-12">
      {showTitle && (
        <>
          <h1 className="text-3xl font-bold sticky top-0 z-10 mb-2 bg-background p-4 pl-0 ">
            {menu.title}
          </h1>
          {menu.caption && (
            <p className="text-xl text-muted-foreground mb-6">{menu.caption}</p>
          )}
        </>
      )}
      {menu.imageUrl && (
        <RenderImage
          className="rounded-lg h-64 "
          imageId={menu.imageId || ""}
          imageUrl={menu.imageUrl || ""}
          alt={menu.title}
          cover={true}
        />
      )}
      <span className="mb-6 block"></span>

      {menu.category?.map((category) => (
        <Category key={category.id} category={category} />
      ))}
      <Separator />
    </div>
  );
}
