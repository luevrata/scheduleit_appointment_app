import { UseMutationResult, useMutation, useQueryClient } from "react-query";
import { apis } from "../lib/apis";
//TODO: Uncomment when finalizing the project
// import { UserRepresentation } from "../representations/user";
import { GenericError } from "../representations/error";

export const usePostRegisterUser = (): UseMutationResult<any> => {
  const queryClient = useQueryClient();
  return useMutation<any>(
    (params: any) =>
      fetch(apis.registerUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }).then((response) => {
        response.json();
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
