const BASE_URL = process.env.REACT_APP_BASE_API_ENDPOINT;

export function baseRedirectToAuthorization () {
  window.location.href = window.location.origin + '/base-auth';
}

export async function baseAccessToken(code) {
  let result = null;
  await fetch(BASE_URL + '/access-token?code=' + code)
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
  await fetch(BASE_URL + '/refresh-token?token=' + refreshToken)
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

export async function baseUserInfo(accessToken) {
  let result = null;
  await fetch(BASE_URL + '/user?at=' + accessToken)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.user !== undefined) {
        result = data.body.user;
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}

export async function baseOrders(accessToken) {
  let result = null;
  await fetch(BASE_URL + '/orders?at=' + accessToken)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.orders !== undefined) {
        result = data.body.orders;
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}

export async function baseNextOrders(accessToken, offset) {
  let result = null;
  await fetch(BASE_URL + '/next-orders?at=' + accessToken + '&offset=' + offset)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.orders !== undefined) {
        result = data.body.orders;
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}

export async function baseOrderDetail(accessToken, uniqueKey) {
  let result = null;
  await fetch(BASE_URL + '/order-detail?at=' + accessToken + '&unique_key=' + uniqueKey)
    .then(res => res.json())
    .then(data => {
      if (data.statusCode === 200 && data.body.order !== undefined) {
        result = data.body.order;
      } else {
        throw data;
      }
    })
    .catch(error => {
      console.error(error);
    });
  return result;
}
