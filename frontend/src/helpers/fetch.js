function getData(url, auth = null) {
  const headers = {};
  if (auth) {
    headers.Authorization = `Basic ${btoa(
      `${auth.username}:${auth.password}`
    )}`;
  }

  return fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  }).then((response) => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  });
}

function postData(url, data, auth = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (auth) {
    headers.Authorization = `Basic ${btoa(
      `${auth.username}:${auth.password}`
    )}`;
  }

  return fetch(url, {
    method: "POST",
    headers,
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
  postData,
};
