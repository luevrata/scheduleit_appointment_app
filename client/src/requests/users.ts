import {
  QueryObserverResult,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "react-query";
import { apis } from "../lib/apis";
//TODO: Uncomment when finalizing the project
// import { UserRepresentation } from "../representations/user";
import { GenericError } from "../representations/error";
import { ListResult } from "../representations/results";
import axios from "axios";

export const usePostRegisterUser = (): UseMutationResult<any> => {
  const queryClient = useQueryClient();

  return useMutation<any>(
    (params: any) =>
      axios
        .post(apis.registerUser, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
          credentials: "include",
        })
        .then((response) => {
          // response;
        }),
    { mutationKey: ["regidterUser"] },
  );
};

export const usePostLoginUser = (): UseMutationResult<any | GenericError> => {
  const queryClient = useQueryClient();
  return useMutation<any | GenericError, GenericError>(
    (params: any) =>
      fetch(apis.loginUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw { message: "Unauthorized" } as GenericError;
          }
          return response.json();
        })
        .catch((error) => {
          throw error;
        }),
    { mutationKey: ["loginUser"] },
  );
};

export const useGetCustomerInfo = (
  queryConfig?,
): QueryObserverResult<ListResult<any>> => {
  return useQuery<ListResult<any>, Error>("customer_info", async () => {
    return await axios.get(apis.getCustomerInfo, { withCredentials: true });
  });
};
