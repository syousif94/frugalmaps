import User from "./User";

export const url = "https://frugal.ideakeg.xyz/api/";

function api(endpoint, payload) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Request timed out..");
    }, 20000);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    if (User.token) {
      headers["Authorization"] = `bearer ${User.token}`;
    }

    const res = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    }).catch(error => {
      clearTimeout(timeout);
      reject(error.message);
    });
    clearTimeout(timeout);
    if (!res || !res.ok) {
      reject("Request failed..");
      return;
    }
    const json = await res.json();
    if (json.error) {
      reject(json.error);
      return;
    }
    resolve(json);
  });
}

export default api;
