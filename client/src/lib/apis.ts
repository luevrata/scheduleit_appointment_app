const internalApi = "http://localhost:65534";
const businesses = `${internalApi}/business`;

export const apis = {
    getBusinesses: businesses + "/get-businesses"
};
