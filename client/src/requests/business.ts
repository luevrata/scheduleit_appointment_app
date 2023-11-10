import { QueryObserverResult, useQuery } from "react-query";
import { ListResult } from "../representations/results";
import { apis } from "../lib/apis";

export const useGetBusinesses = (
    queryConfig?
): QueryObserverResult<ListResult<any>> => {
    return useQuery<ListResult<any>, Error>("businesses", async () => {
        const response = await fetch(apis.getBusinesses);
        return response.json();
    });
};
