import { IPage } from "@/interface/Page.interface";
import { GetPage } from "@/utils/api/common/GetPageData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useEnableQuery from "./useEnableQuery";

const usePage = (domain: string) => {
  const QueryKey = ["page", domain];
  const qc = useQueryClient();
  const enabledQuery = useEnableQuery();
  const pageData = qc.getQueryData<IPage>(QueryKey);
  const [Page, SetPage] = useState<IPage | null>(pageData || null);

  const { data } = useQuery<IPage>({
    queryKey: QueryKey,
    queryFn: () => GetPage(domain),
    enabled: enabledQuery && !Page,
  });

  useEffect(() => {
    if (data) {
      SetPage(data);
    }
  }, [data]);

  return Page;
};

export default usePage;
