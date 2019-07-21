export const url = "https://frugal.ideakeg.xyz/api/";

function api(endpoint, payload) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Request timed out..");
    }, 40000);

    const res = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).catch(error => {
      clearTimeout(timeout);
      reject(error.message);
    });
    clearTimeout(timeout);
    if (!res.ok) {
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
