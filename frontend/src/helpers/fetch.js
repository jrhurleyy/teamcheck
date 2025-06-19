function getData(url) {
  return fetch(url, {
    method: "GET",
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function postData(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

module.exports = {
  getData,
};
