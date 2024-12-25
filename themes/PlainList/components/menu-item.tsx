import EditableImage from "@/components/custom/EditableImage";
import EditableText from "@/components/custom/EditableText";
import RenderImage from "@/components/custom/RenderImage";
import ScrollHandler from "@/components/custom/ScrollHandler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMenuItem } from "@/interface/MenuItem.interface";
import { usePreview } from "@/providers/PreviewProvider";

interface MenuItemProps {
  item: IMenuItem;
}

export function MenuItem({ item }: MenuItemProps) {
  return (
    <ScrollHandler
      edit={{
        type: "edit",
        target: "item",
        data: {
          id: item.id,
        },
      }}
    >
      <Card className="w-full">
        <CardContent className="p-6">
          <EditableImage
            edit={{
              type: "edit",
              target: "item",
              data: {
                field: "image",
                id: item.id,
                menuId: item.menuId,
                categoryId: item.categoryId,
                itemId: item.id,
              },
            }}
          >
            <RenderImage
              className="rounded-lg h-[250px] mb-2 bg-offbackground"
              imageId={item.imageId || ""}
              imageUrl={item.imageUrl || ""}
              alt={item.title}
              cover={true}
            />
          </EditableImage>
          <EditableText
            size="20px"
            edit={{
              type: "edit",
              target: "item",
              data: {
                field: "title",
                id: item.id,
                menuId: item.menuId,
                categoryId: item.categoryId,
                itemId: item.id,
              },
            }}
          >
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </EditableText>

          {item.caption && (
            <EditableText
              size="18px"
              edit={{
                type: "edit",
                target: "item",
                data: {
                  field: "caption",
                  id: item.id,
                  menuId: item.menuId,
                  categoryId: item.categoryId,
                  itemId: item.id,
                },
              }}
            >
              <CardDescription className="whitespace-pre text-wrap break-words">
                {item.caption}
              </CardDescription>
            </EditableText>
          )}
          {item.price && (
            <EditableText
              size="18px"
              edit={{
                type: "edit",
                target: "item",
                data: {
                  field: "price",
                  id: item.id,
                  menuId: item.menuId,
                  categoryId: item.categoryId,
                  itemId: item.id,
                },
              }}
            >
              <p className="font-bold">{item.price}</p>
            </EditableText>
          )}
        </CardContent>
      </Card>
    </ScrollHandler>
  );
}
