export function queryParameters() {
  let urlParameterString = window.location.search;
  if (urlParameterString) {
    urlParameterString = urlParameterString.substring(1);
    let parameters = {};
    urlParameterString.split('&').forEach( param => {
      const temp = param.split('=')
      parameters = {
        ...parameters,
        [temp[0]]: temp[1]
      }
    });
    return parameters;
  }
  return null;
}

export function setQuery(queries) {
  const url = new URL(document.location.href);
  const params = new URLSearchParams(url.search);
  Object.keys(queries).map(key => {
    params.set(key, queries[key]);
  });
  url.search = params.toString();
  window.history.replaceState(null, null, url.href)
}

export function deleteQuery(queries) {
  const url = new URL(document.location.href);
  const params = new URLSearchParams(url.search);
  if (Array.isArray(queries) === true) {
    queries.forEach(query => {
      params.delete(query);
    })
  } else {
    params.delete(queries);
  }
  url.search = params.toString();
  window.history.replaceState(null, null, url.href)
}
