const internalApi = "http://localhost:65534";
const businesses = `${internalApi}/business`;
const customers = `${internalApi}/user/customer`;

export const apis = {
  getBusinesses: businesses + "/get-businesses",
  loginUser: customers + "/auth",
  registerUser: customers + "/add",
  getCustomerInfo: customers + "/info",
};
