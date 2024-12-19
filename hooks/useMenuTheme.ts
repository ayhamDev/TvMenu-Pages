import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useEnableQuery from "./useEnableQuery";
import { ThemeApi } from "@/utils/api/theme";
import { ITheme } from "@/interface/Theme.interface";

const useMenuTheme = (domain: string) => {
  const QueryKey = ["page", domain, "theme"];
  const qc = useQueryClient();
  const enabledQuery = useEnableQuery();
  const pageData = qc.getQueryData<ITheme[]>(QueryKey);
  const [Theme, SetTheme] = useState<ITheme[] | null>(pageData || null);

  const { data } = useQuery<ITheme[]>({
    queryKey: QueryKey,
    queryFn: () => ThemeApi.GetAll(domain),
    enabled: enabledQuery && !Theme,
  });

  useEffect(() => {
    if (data) {
      SetTheme(data);
    }
  }, [data]);

  return Theme;
};

export default useMenuTheme;
