import { IMenu } from "@/interface/Menu.interface";
import { MenuApi } from "@/utils/api/menu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useEnableQuery from "./useEnableQuery";

const useMenu = (domain: string, menuId: string) => {
  const QueryKey = ["page", domain, "menu", menuId];
  const qc = useQueryClient();
  const enabledQuery = useEnableQuery();
  const pageData = qc.getQueryData<IMenu>(QueryKey);
  const [Menu, SetMenu] = useState<IMenu | null>(pageData || null);

  const { data } = useQuery<IMenu>({
    queryKey: QueryKey,
    queryFn: () => MenuApi.FindOne(domain, menuId),
    enabled: enabledQuery && !Menu,
  });

  useEffect(() => {
    if (data) {
      SetMenu(data);
    }
  }, [data]);

  return Menu;
};

export default useMenu;
