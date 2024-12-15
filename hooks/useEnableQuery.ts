import React, { useMemo } from "react";
import useAuth from "./useAuth";
const useEnableQuery = () => {
  const { admin, client } = useAuth();
  const EnableQueries = useMemo(
    () => (admin.accessToken ? true : client.accessToken ? true : false),
    [admin, client]
  );
  return EnableQueries;
};

export default useEnableQuery;
