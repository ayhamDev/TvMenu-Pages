import { Card } from "@/components/ui/card";
import { IMenuItem } from "@/interface/MenuItem.interface";

export default function MenuItem({ item }: { item: IMenuItem }) {
  return (
    <Card className="relative overflow-hidden bg-black border-2 border-yellow-400/50">
      <div className="aspect-video relative">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 bg-gradient-to-t from-black to-transparent absolute bottom-0 w-full">
        <h3 className="text-lg font-bold text-white bg-yellow-400/90 px-2 py-1 rounded inline-block">
          {item.title}
        </h3>

        <div className="mt-2 text-yellow-400 font-bold">
          <p className="text-2xl">${item.price}</p>
        </div>
      </div>
    </Card>
  );
}
