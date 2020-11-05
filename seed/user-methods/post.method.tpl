<!--@@name--> = (<!--@@args-->) => {
fetch('<!--@@targetURL-->', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: <!--@@body-->
  }).then((response) => {
    //console.log(response);
    if (response.status === 200) {
      <!--@@status200Code-->
      return response.json();
    } else {
      <!--@@statusOtherCode-->
      console.log(`${response.status}: ${response.statusText}`);
    }
  })
  .then((responseJson) => {
    if (responseJson === undefined) {
      <!--@@responseFailedCode-->
    } else {
      <!--@@responseSucceedCode-->
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
