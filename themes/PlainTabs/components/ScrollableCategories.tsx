import { ICategory } from "@/interface/Category.interface";
import React, { useState } from "react";
import { Category } from "./category";
import AddCategory from "./AddCategory";
import ScrollHandler from "@/components/custom/ScrollHandler";

interface ScrollableCategoriesProps {
  categories: ICategory[];
  menuId: string;
}

const ScrollableCategories: React.FC<ScrollableCategoriesProps> = ({
  categories,
  menuId,
}) => {
  const [activeTab, setActiveTab] = useState(categories[0]?.id);

  return (
    <div className="container mx-auto">
      {/* categories Navigation */}
      <div className="sticky top-[65px] bg-offbackground z-[5] rounded-b-md">
        <div className="flex overflow-x-auto no-scrollbar border-b">
          {categories.map((category) => (
            <ScrollHandler
              scrollBehavior="center"
              edit={{
                type: "edit",
                target: "category",
                data: {
                  id: category.id,
                },
              }}
              key={category.id}
              onScroll={() => {
                setActiveTab(category.id);
              }}
            >
              <button
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium ${
                  activeTab === category.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.title}
              </button>
            </ScrollHandler>
          ))}
          <AddCategory menuId={menuId} />
        </div>
      </div>

      {/* categories Content */}
      <div className="mt-4">
        {categories.map(
          (category) =>
            category.id === activeTab && (
              <Category key={category.id} category={category} />
            )
        )}
      </div>
    </div>
  );
};

export default ScrollableCategories;
