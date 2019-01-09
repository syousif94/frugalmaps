const url = "https://us-central1-frugalmaps.cloudfunctions.net/api/";

function api(endpoint, payload) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject("Request failed..");
    }, 12000);

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
