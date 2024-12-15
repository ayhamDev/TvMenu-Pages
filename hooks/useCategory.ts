import { ICategory } from "@/interface/Category.interface";
import { CategoryApi } from "@/utils/api/category";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useEnableQuery from "./useEnableQuery";

const useCategory = (domain: string, menuId: string, categoryId: string) => {
  const QueryKey = ["page", domain, "menu", menuId, "category", categoryId];
  const qc = useQueryClient();
  const enabledQuery = useEnableQuery();
  const pageData = qc.getQueryData<ICategory>(QueryKey);
  const [Category, SetCategory] = useState<ICategory | null>(pageData || null);

  const { data } = useQuery<ICategory>({
    queryKey: QueryKey,
    queryFn: () => CategoryApi.FindOne(domain, categoryId),
    enabled: enabledQuery && !Category,
  });

  useEffect(() => {
    if (data) {
      SetCategory(data);
    }
  }, [data]);

  return Category;
};

export default useCategory;
