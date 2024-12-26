import EditableImage from "@/components/custom/EditableImage";
import EditableText from "@/components/custom/EditableText";
import RenderImage from "@/components/custom/RenderImage";
import ScrollHandler from "@/components/custom/ScrollHandler";
import { Separator } from "@/components/ui/separator";
import { IMenu } from "@/interface/Menu.interface";
import { cn } from "@/lib/utils";
import { Category } from "./category";
import ScrollableCategories from "./ScrollableCategories";

interface MenuProps {
  menu: IMenu;
  showTitle?: boolean;
}

export function Menu({ menu, showTitle = true }: MenuProps) {
  return (
    <ScrollHandler
      scrollBehavior="start"
      edit={{
        target: "menu",
        type: "edit",
        data: { id: menu.id },
      }}
    >
      <div className="mb-12">
        {showTitle && (
          <>
            <div className="sticky top-0 z-10 bg-background">
              <EditableText
                edit={{
                  type: "edit",
                  target: "menu",
                  data: { field: "title", id: menu.id, menuId: menu.id },
                }}
              >
                <h1
                  className={cn(
                    `text-3xl font-bold p-4 pr-0 pl-0 w-fit rounded-md`
                  )}
                >
                  {menu.title}
                </h1>
              </EditableText>
            </div>

            {menu.caption && (
              <EditableText
                size="20px"
                className="mb-6 mt-1"
                edit={{
                  type: "edit",
                  target: "menu",
                  data: { field: "caption", id: menu.id, menuId: menu.id },
                }}
              >
                <p
                  className={cn(
                    `whitespace-pre text-xl text-muted-foreground flex items-center gap-4 rounded-md w-fit p-2 pl-0`
                  )}
                >
                  {menu.caption}
                </p>
              </EditableText>
            )}
          </>
        )}
        {(menu.imageUrl || menu.imageId) && (
          <EditableImage
            edit={{
              type: "edit",
              target: "menu",
              data: { field: "image", id: menu.id, menuId: menu.id },
            }}
          >
            <RenderImage
              className="rounded-lg h-64"
              imageId={menu.imageId || ""}
              imageUrl={menu.imageUrl || ""}
              alt={menu.title}
              cover={true}
            />
          </EditableImage>
        )}
        <span className="mb-6 block"></span>

        <ScrollableCategories
          categories={menu.category || []}
          menuId={menu.id}
        />

        <Separator />
      </div>
    </ScrollHandler>
  );
}
