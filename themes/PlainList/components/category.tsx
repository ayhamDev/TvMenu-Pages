import EditableText from "@/components/custom/EditableText";
import { ICategory } from "@/interface/Category.interface";
import { usePreview } from "@/providers/PreviewProvider";
import AddItem from "./AddItem";
import { MenuItem } from "./menu-item";
import ScrollHandler from "@/components/custom/ScrollHandler";

interface CategoryProps {
  category: ICategory;
}

export function Category({ category }: CategoryProps) {
  return (
    <ScrollHandler
      scrollBehavior="center"
      edit={{
        type: "edit",
        target: "category",
        data: {
          id: category.id,
        },
      }}
    >
      <div className="mb-8 relative">
        <div className="sticky top-[67px] z-[9] bg-offbackground rounded-b-md">
          <EditableText
            className="mb-4"
            size={"20px"}
            edit={{
              type: "edit",
              target: "category",
              data: {
                field: "title",
                id: category.id,
                menuId: category.menuId,
                categoryId: category.id,
              },
            }}
          >
            <h2 className="text-2xl p-3 font-bold pr-0">{category.title}</h2>
          </EditableText>
        </div>

        {category.caption && (
          <EditableText
            className="mb-4"
            size="16px"
            edit={{
              type: "edit",
              target: "category",
              data: {
                field: "caption",
                id: category.id,
                menuId: category.menuId,
                categoryId: category.id,
              },
            }}
          >
            <p className="whitespace-pre text-muted-foreground">
              {category.caption}
            </p>
          </EditableText>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.item?.map((item, index) => (
            <MenuItem key={item.id} item={item} />
          ))}
          <AddItem
            menuId={category.menuId}
            categoryId={category.id}
            key="add"
          />
        </div>
      </div>
    </ScrollHandler>
  );
}
