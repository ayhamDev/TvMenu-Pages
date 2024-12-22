import RenderImage from "@/components/custom/RenderImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMenuItem } from "@/interface/MenuItem.interface";

interface MenuItemProps {
  item: IMenuItem;
}

export function MenuItem({ item }: MenuItemProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <RenderImage
          className="rounded-lg h-[250px] mb-2 bg-offbackground"
          imageId={item.imageId || ""}
          imageUrl={item.imageUrl || ""}
          alt={item.title}
          cover={true}
        />

        <CardTitle className="text-lg">{item.title}</CardTitle>
        {item.caption && (
          <CardDescription className="text-wrap break-words">
            {item.caption}
          </CardDescription>
        )}
        {item.price && <p className="mt-2 font-bold">{item.price}</p>}
      </CardContent>
    </Card>
  );
}
