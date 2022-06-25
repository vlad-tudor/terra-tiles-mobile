import Config from "react-native-config";

//export const GOOGLEMAPS = process.env.REACT_APP_GOOGLEMAPS || "";
export const WHAT3WORDS = Config.REACT_APP_WHAT3WORDS || "";

const postParams: Partial<RequestInit> = {
  headers: {
    Accept: "*/*",
  },
};

export const getApi = <T>(url = "") =>
  fetch(url, {
    ...postParams,
    method: "GET",
  }).then(async (res) => {
    if (res.ok) {
      return res.json() as unknown as T;
    } else {
      let error = `${res.status} ${res.statusText}: ${await res.text()}`;
      throw new Error(error);
    }
  });

export const postApi = <T, P>(url = "", data: P) =>
  fetch(url, {
    ...postParams,
    body: JSON.stringify(data),
  }).then(async (res) => {
    if (res.ok) {
      return res.json() as unknown as T;
    } else {
      let error = `${res.status} ${res.statusText}: ${await res.text()}`;
      throw new Error(error);
    }
  });
