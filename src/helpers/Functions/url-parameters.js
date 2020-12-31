export default function urlParameters() {
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
