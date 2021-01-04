export async function baseAccessToken(code) {
  let result = null;
  await fetch('https://2crpfwmpki.execute-api.ap-northeast-1.amazonaws.com/dev/access-token?code=' + code)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.access_token !== undefined && data.body.refresh_token !== undefined) {
        // console.log(data.body.access_token);
        // console.log(data.body.refresh_token);
        result = {
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token
        }
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}

export async function baseRefreshToken(refreshToken) {
  let result = null;
  await fetch('https://2crpfwmpki.execute-api.ap-northeast-1.amazonaws.com/dev/refresh-token?token=' + refreshToken)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.access_token !== undefined && data.body.refresh_token !== undefined) {
        // console.log(data.body.access_token);
        // console.log(data.body.refresh_token);
        result = {
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token
        }
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}
