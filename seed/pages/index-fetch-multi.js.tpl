  fetchAll() {
    Promise.all([<!--@@FETCH-->])
    .then(([<!--@@RESOURCE-->]) => {
      return Promise.all([<!--@@RESOURCE_JSON-->])
    })
    .then(([<!--@@RESOURCE-->]) => {
      <!--@@SET_STATUS-->
    });
  }
  properlyAssignObject(name, targetObject) {
    if (targetObject[name] === undefined) {
      let resultObject = {};
      resultObject[name] = targetObject;
      return (resultObject);
    } else {
      return targetObject;
    }
  }
