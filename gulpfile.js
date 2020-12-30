const _ = require('lodash');
const gulp = require('gulp');
const FS = require('fs');
const USER_COMPONENT_JSON = 'seed/user-components';
const USER_COMPONENT_TEMPLATE_FILE_PATH = 'seed/user-components/userComponent.js.tpl';
const USER_COMPONENT_DIST = 'src/components/UserCommon';
const ROUTES_JSON = 'seed/routes/routes.json';
const ROUTES_DASHBOARD = 'seed/routes/dashboard.txt';
const USER_PAGE_PATH = 'src/pages-user';
const PREFIX_DASHBOARD = 'dashboard-';

/**
 * Merge Language Files
 */
gulp.task('locales', function (done) {
  let merge = require('gulp-merge-json');
  _.forEach(['en', 'gr', 'it', 'ja', 'rs', 'sp'], function (val) {
    return gulp.src('src/locales/' + val + '/**/*.json')
      .pipe(merge({fileName: 'translation.json'}))
      .pipe(gulp.dest('src/locales/dist/' + val));
  });
  done();
});

gulp.task('create-user-components', function (done) {
  _cleanDirectories(USER_COMPONENT_DIST);
  let userComponentsJSONFilePaths = _jsonFilePaths(USER_COMPONENT_JSON);
  console.log(userComponentsJSONFilePaths);
  if (userComponentsJSONFilePaths === null) {
    console.log("There is no user component...");
    done();
    return;
  }
  let userComponents = [];
  _.forEach(userComponentsJSONFilePaths, (userComponentJSONFilePath) => {
    let userComponentJSON = _JSONdata(userComponentJSONFilePath);
    let userComponentName = _componentName(userComponentJSON.componentName);
    let tags = [];
    _htmlTagRecursive(userComponentJSON, tags);
    let componentMethods = [];
    _componentMethodRecursiveWithOverlapCheck(userComponentJSON, componentMethods);
    let userComponentSet = {};
    userComponentSet['name'] = userComponentName;
    userComponentSet['html'] = _tagToHtml(tags);
    userComponentSet['import'] = userComponentJSON.import;
    userComponentSet['methods'] = componentMethods;
    userComponentSet['fetch'] = userComponentJSON.fetch;
    userComponentSet['lifeCycleMethods'] = userComponentJSON.lifeCycleMethods;
    userComponentSet['renderBeforeReturn'] = userComponentJSON.renderBeforeReturn;
    userComponents.push(userComponentSet);
  });
  _createUserComponentFile(userComponents);
  done();
});

/**
 * Create User Pages
 */
gulp.task('create-pages', function (done){
  // Dashboard
  let baseList = _dashboardList();
  _cleanDirectories(USER_PAGE_PATH);
  _createUserPageDirectories(baseList, PREFIX_DASHBOARD);
  _createUserPageIndexFile(baseList, PREFIX_DASHBOARD);
  // Other
  let rawJSONData = _JSONdata(ROUTES_JSON);
  let groupNameList = _groupNameList(rawJSONData);
  let pageDirectories = _pageDirectoryList(groupNameList, rawJSONData);
  _createUserPageDirectories(pageDirectories);
  _createUserPageIndexFile(pageDirectories);
  done();
});

/**
 * Update Route for Dashboard
 */
gulp.task('dashboard-route', function (done){
  // Dashboard
  let baseList = _dashboardList();
  let templateFilePath = 'seed/routes/index.js.tpl';
  let fileBuffer = _readWholeFile(templateFilePath);
  let routeDashboardImportString = _importComponentString(baseList, PREFIX_DASHBOARD);
  let routeDashboardPathComponent = _routePathComponentString(baseList, PREFIX_DASHBOARD);
  fileBuffer = _replaceTag('DASHBOARD_IMPORT', routeDashboardImportString, fileBuffer, '// ');
  fileBuffer = _replaceTag('DASHBOARD_ROUTES', routeDashboardPathComponent, fileBuffer, '// ');
  // Other
  let rawJSONData = _JSONdata(ROUTES_JSON);
  let groupNameList = _groupNameList(rawJSONData);
  let groupDirectoryList = _pageDirectoryList(groupNameList, rawJSONData);
  // let query = _directoryToQuery(groupDirectoryList);
  let routeOtherImportString = _importComponentString(groupDirectoryList);
  let routeOtherPathComponent = _routePathComponentString(groupDirectoryList);
  fileBuffer = _replaceTag('OTHER_IMPORT', routeOtherImportString, fileBuffer, '// ');
  fileBuffer = _replaceTag('OTHER_ROUTES', routeOtherPathComponent, fileBuffer, '// ');
  _writeDistFile(_distFilePath(templateFilePath), fileBuffer);
  done();
});

gulp.task('update-route',
  gulp.series('dashboard-route'));

/**
 * Update Navibar Navigation
 */
gulp.task('navigation-navbar', function (done){
  let baseList = _dashboardList();
  let templateFilePath = 'seed/components/HorizontalLayout/Navbar.js.tpl';
  let fileBuffer = _readWholeFile(templateFilePath);
  let replacedString = _navbarDashboardLinks(baseList);
  fileBuffer = _replaceTag('NAVBAR_DASHBOARD', replacedString, fileBuffer);
  fileBuffer = _navbarOther(fileBuffer);
  _writeDistFile(_distFilePath(templateFilePath), fileBuffer);
  done();
});

/**
 * Update Sidebar Navigation
 */
gulp.task('navigation-sidebar', function (done){
  let dashboardList = _dashboardList();
  let templateFilePath = 'seed/components/VerticalLayout/SidebarContent.js.tpl';
  let fileBuffer = _readWholeFile(templateFilePath);
  let replacedString = _sidebarDashboardLinks(dashboardList);
  fileBuffer = _replaceTag('SIDEBAR_DASHBOARD', replacedString, fileBuffer);
  fileBuffer = _sidebarOther(fileBuffer);
  _writeDistFile(_distFilePath(templateFilePath), fileBuffer);
  done();
});

gulp.task('update-navigation',
  gulp.series(
    'navigation-navbar',
    'navigation-sidebar'));

/**
 * gulp default task
 */
gulp.task('default',
  gulp.series(gulp.parallel(
    'locales',
    'create-user-components',
    'create-pages',
    'update-route',
    'update-navigation'), function (done) {
    done();
  }));

gulp.task('test', function (done) {
  done();
});

let SP = function (indent, depth = 1) {
  return _.repeat(' ', (indent * 2) * depth);
}

let _jsonFilePaths = function (dirPath) {
  let allFiles = FS.readdirSync(dirPath);
  if (allFiles && _.isArray(allFiles)) {
    let jsonFilePathList = allFiles.filter(function (filePath) {
      return FS.statSync(`${dirPath}/${filePath}`).isFile() && /.*\.json$/.test(filePath);
    });
    jsonFilePathList = jsonFilePathList.map(filePath => `${dirPath}/${filePath}`);
    return jsonFilePathList;
  }
  return null;
}

let _JSONdata = function (filePath) {
  let fileBuffer = _readWholeFile(filePath);
  if (fileBuffer === null) return '';
  let jsonData = JSON.parse(fileBuffer);
  console.log(jsonData);
  return jsonData;
}

let _readWholeFile = function (targetPath) {
  try {
    return FS.readFileSync(targetPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`Could not find: "${targetPath}"`);
      return null;
    }
    console.log(err);
    return null;
  }
}

let _writeDistFile = function (distFilePath, buffer) {
  try {
    FS.writeFileSync(distFilePath, buffer);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

let _cleanDirectories = function (targetPath) {
  _deleteDirectoryRecursive(targetPath);
  FS.mkdirSync(targetPath, (err) =>{
    console.log(err);
  });
}

let _htmlTagRecursive = function (sauceJSON, tags, closeTag, type) {
  if (_.isUndefined(sauceJSON.tags) === false) {
    _.forEach(sauceJSON.tags, (component) => {
      let openTagSet = {"open": component.tag, "props": _componentProperties(component)};
      let closeTag = component.tag;
      if (_.isUndefined(component.type) === false) openTagSet['type'] = component.type;
      if (_.isUndefined(component.close) === false) closeTag = component.close;
      if (_.isUndefined(component.content) === false) openTagSet['content'] = component.content;
      if (_.isUndefined(component.rawContent) === false) openTagSet['rawContent'] = component.rawContent;
      if (_.isUndefined(component.single) === false) openTagSet['single'] = component.single;
      tags.push(openTagSet);
      if (_.isUndefined(component.child) === false) {
        _htmlTagRecursive(component.child, tags, closeTag, component.type);
      } else if (_.isUndefined(component.single) === true) {
        let closeTagSet = {};
        if (_.isUndefined(component.tag) === false) closeTagSet['close'] = component.tag;
        if (_.isUndefined(component.noCR) === false) closeTagSet['noCR'] = component.noCR;
        if (_.isUndefined(component.contentAT) === false) closeTagSet['contentAfterTag'] = component.contentAT;
        if (_.isUndefined(component.rawContent) === false) closeTagSet['rawContent'] = component.rawContent;
        if (_.isEmpty(closeTagSet) === false) tags.push(closeTagSet);
      }
    });
    let closeTagSet = {};
    if (_.isUndefined(closeTag) === false) closeTagSet['close'] = closeTag;
    if (_.isUndefined(type) === false) closeTagSet['type'] = type;
    if (_.isEmpty(closeTagSet) === false) tags.push(closeTagSet);
  }
}

let _tagToHtml = function (tags) {
  let result = '';
  let beforeTag = "none";
  let isBeforeSingle = undefined;
  _.forEach(tags, (tag, i) => {
    if (tag.open && _.isUndefined(isBeforeSingle)) {
      beforeTag = "open";
    }
    if (tag.close) {
      beforeTag = "close";
    }
    let cr = (i > 0 ? '\n' : '');
    let space = _.isUndefined(tag.noCR) ? cr : '';
    result += space + (tag.type === "raw" ? _rawTag(tag) : _htmlTag(tag));
    isBeforeSingle = tag.single;
  });
  return result;
}

let _htmlTag = function (tag) {
  let result = '';
  if (tag.open) {
    result = `<${tag.open}${tag.props}${(tag.single?' /':'')}>` + (tag.content?(_rawContent(tag, tag.content)):'');
  } else if (tag.close) {
    result = (tag.single?'':`</${tag.close}>`) + (tag.contentAfterTag?(_rawContent(tag, tag.contentAfterTag)):'');
  }
  return result;
}

let _rawContent = function (tag, content) {
  if (tag.rawContent === 'yes') {
    return content;
  } else {
    return `{this.props.t(${content})}`;
  }
}

let _rawTag = function (tag) {
  let result = '';
  if (tag.open) {
    result = `${tag.open}`;
  } else if (tag.close) {
    result = `${tag.close}`;
  }
  return result;
}

let _componentMethodRecursiveWithOverlapCheck = function (sauceJSON, componentMethods) {
  if (_.isUndefined(sauceJSON.tags) === false) {
    _.forEach(sauceJSON.tags, (component) => {
      if (_.isUndefined(component.componentMethod) === false) {
        _.forEach(componentMethods, (existComponentMethod) => {
          _.forEach(existComponentMethod.states, (overlapCheckComponentStat) => {
            if (_.find(component.componentMethod.states, (v) => { return v.name === overlapCheckComponentStat.name})) {
              throw "Duplicate component function status name!";
            }
          });
          _.forEach(existComponentMethod.methods, (overlapCheckComponentMethod) => {
            if (_.find(component.componentMethod.methods, (v) => { return v.name === overlapCheckComponentMethod.name})) {
              throw "Duplicate component function name!";
            }
          });
        });
        componentMethods.push(component.componentMethod);
      }
      if (_.isUndefined(component.child) === false) {
        _componentMethodRecursiveWithOverlapCheck(component.child, componentMethods);
      }
    });
  }
}

let _createUserComponentFile = function (userComponents, prefix='') {
  let orgFileBuffer = _readWholeFile(USER_COMPONENT_TEMPLATE_FILE_PATH);
  userComponents.forEach((userComponentSet) => {
    let componentFilePath = USER_COMPONENT_DIST + '/' + userComponentSet.name + '.js';
    let fileBuffer = _replaceTag('COMOPNENT_NAME', userComponentSet.name, orgFileBuffer);
    fileBuffer = _replaceTag('RENDER_HTML', userComponentSet.html, fileBuffer);
    let userComponentImportComponents = [], userComponentDefaultImportComponents = [], userImportCss = [];
    _.forEach(userComponentSet.import, (component) => {
      _dedupeImportComponents(component, userComponentImportComponents);
      _dedupeDefaultImportComponents(component, userComponentDefaultImportComponents);
      _dedupeImportCss(component, userImportCss);
    });
    let fetchData = _userPageIndexFetchData(userComponentSet);
    fileBuffer = _replaceTag('FETCH_DATA', fetchData, fileBuffer);
    let userComponentConstructor = _componentConstructor(
          _componentState(userComponentSet.methods),
          _componentBindFunction(userComponentSet.methods));
    if (fetchData.length > 0 && userComponentConstructor.length === 0) {
      userComponentConstructor = _basicConstructor();
    }
    fileBuffer = _replaceTag('COMOPNENT_CONSTRUCTOR', userComponentConstructor, fileBuffer);
    let lifeCycleMethod = _userPageIndexLifeCycleMethod(userComponentSet);
    fileBuffer = _replaceTag('LIFE_CYCLE_METHOD', lifeCycleMethod, fileBuffer);
    let userComponentMethod = _componentMethod(userComponentSet.methods);
    fileBuffer = _replaceTag('COMOPNENT_FUNCTION', userComponentMethod, fileBuffer);
    let renderFetchDone = _userPageIndexFetchDone(userComponentSet);
    fileBuffer = _replaceTag('RENDER_FETCHDONE', renderFetchDone, fileBuffer);
    let renderBeforeReturn = _userPageIndexRenderBeforeReturn(userComponentSet);
    fileBuffer = _replaceTag('RENDER_BEFORE_RETURN', renderBeforeReturn, fileBuffer);
    let userComponentImportDeclaration = _importComponentDeclaration(userComponentImportComponents);
    fileBuffer = _replaceTag('IMPORT_COMPONENTS', userComponentImportDeclaration, fileBuffer);
    let userComopnentDefaultImportDeclaration = _importDefaultImportComponentDeclaration(userComponentDefaultImportComponents);
    fileBuffer = _replaceTag('DEFAULT_IMPORT_COMPONENTS', userComopnentDefaultImportDeclaration, fileBuffer);
    let userImportCssDeclaration = _importImportCssDeclaration(userImportCss);
    fileBuffer = _replaceTag('IMPORT_CSS', userImportCssDeclaration, fileBuffer);
    _writeDistFile(_distFilePath(componentFilePath), fileBuffer);
  });
}

let _componentConstructor = function (componentState, componentBindFunction) {
  if (componentState === "" && componentBindFunction === "") {
    return "";
  }
  return `constructor(props) {
    super(props);
    ${componentState}
    ${componentBindFunction}
  }`;
}

let _componentState = function (userComponentMethods) {
  let result = "";
  const spaces = SP(3);
  _.forEach(userComponentMethods, (userComponentMethod) => {
    _.forEach(userComponentMethod.states, (userComponentState) => {
      let decoration = (result.length > 0 ? ',\n' : '') + spaces;
      result += `${decoration}${userComponentState.name}: ${userComponentState.initial}`;
    });
  });
  if (result) {
    let functionSpaces = SP(2);
    result = `${functionSpaces}this.state = {\n${result}\n${functionSpaces}}`;
  }
  return result;
}

let _componentBindFunction = function (userComponentMethods) {
  let result = "";
  _.forEach(userComponentMethods, (userComponentMethod) => {
    _.forEach(userComponentMethod.methods, (userComponentMethod) => {
      if (userComponentMethod.bind === true) {
        let decoration = (result.length > 0 ? '\n' : '') + SP(2);
        result += `${decoration}this.${userComponentMethod.name}.bind(this);`;
      }
    });
  });
  return result;
}

let _componentMethod = function (userComponentMethods) {
  let result = ""
  _.forEach(userComponentMethods, (userComponentMethod) => {
    _.forEach(userComponentMethod.methods, (userComponentMethod) => {
      result += _userFunction(userComponentMethod.methodType, userComponentMethod);
    });
  });
  return result;
}

let _userFunction = function (template, userComponentMethod) {
  let methodParams = _readWholeFile(`seed/user-methods/${template}.param`);
  console.log(`seed/user-methods/${template}.param`);
  if (methodParams === null) {
    throw `Could not find method params file: ${template}`;
  }
  let methodTemplate = _readWholeFile(`seed/user-methods/${template}.method.tpl`);
  if (methodTemplate === null) {
    throw `Could not find method template: ${template}`;
  }
  methodParams = methodParams.split('\n').filter(v => v);
  methodTemplate = _replaceTag('args', _userMethodArgs(userComponentMethod.args), methodTemplate);
  _.forEach(methodParams, methodParam => {
    _isSet(userComponentMethod, methodParam, `${template}()`, true);
    methodTemplate = _replaceTag(methodParam, userComponentMethod[methodParam], methodTemplate);
  });
  return methodTemplate;
}

let _userMethodArgs = function (methodArgs) {
  let result = "";
  if (methodArgs === undefined) return result;
  if (methodArgs.length === 0) return result;
  let duplicate = methodArgs.filter(function (x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicate.length) {
    throw `Function argument '${duplicate[0]}' has duplicated.`;
  }
  result = methodArgs.join(',');
  return result;
}

let _dashboardList = function () {
  let fileBuffer = _readWholeFile(ROUTES_DASHBOARD);
  let trimmedDashboardArray = fileBuffer.split('\n').filter(v => v);
  let result = [];
  trimmedDashboardArray.forEach(dashboardName => {
    let dashboard = [];
    dashboard['dir'] = dashboardName;
    dashboard['parent'] = 'Dashboard';
    dashboard['child'] = dashboardName.toLowerCase();
    result.push(dashboard);
  })
  // console.log(result);
  return result;
}

let _groupNameList = function (jsonData) {
  return _.keys(jsonData);
}

let _pageDirectoryList = function (groupNameList, rawJSONData) {
  let dirList = [];
  groupNameList.forEach((groupName) => {
    rawJSONData[groupName].forEach((unit) => {
      if (unit.type === "single") {
        dirList.push(_pageDataSet(groupName, unit, unit.name));
      } else if (unit.type === 'parent') {
        let result = _digGroupArray(groupName, unit.name, unit);
        if (_.isArray(result)) dirList = _.concat(dirList, result);
      }
    });
  });
  // console.log(dirList);
  return dirList;
}

let _digGroupArray = function (groupName, parentName, targetArray) {
  try {
    if (targetArray.type === 'parent' && _.isArray(targetArray.child)) {
      let result = [];
      targetArray.child.forEach((unit) => {
        // console.log(unit);
        if (unit.type === 'single') {
          result.push(_pageDataSet(groupName, unit, parentName + '-' + unit.name));
        }
      });
      // console.log(result);
      return result;
    } else {
      console.log('_digGroupArray(): ');
      console.log(targetArray);
      return null;
    }
  }
  catch (e) {
    console.error(e);
  }
}

let _pageDataSet = function (groupName, pageData, childName) {
  let result = [];
  result['dir'] = _.capitalize(groupName) + '-' + _.capitalize(childName);
  result['parent'] = _.capitalize(groupName);
  result['child'] = _.capitalize(pageData.name);
  result['lifeCycleMethods'] = pageData.lifeCycleMethods;
  result['layout'] = pageData.layout;
  result['fetch'] = pageData.fetch;
  result['renderBeforeReturn'] = pageData.renderBeforeReturn;
  return result;
}

let _isSet = function (targetObject, propertyName, methodName, enableThrow=false) {
  if (_.isUndefined(targetObject[propertyName])) {
    let log = `There is no ${propertyName} object: ${methodName}`;
    if (enableThrow) throw log;
    // console.log(log);
    return false;
  }
  return true;
}

let _distFilePath = function (templateFilePath){
  let resultPath = templateFilePath.replace('seed', 'src');
  resultPath = resultPath.replace('.tpl', '');
  // console.log(resultPath);
  return resultPath;
}

let _replaceTag = function (tagString, replaceString, buffer, startWith='') {
  tagString = new RegExp(startWith + '<!--@@' + tagString + '-->','g');
  console.log('REPLACE: ' + tagString + ' ==> ' + replaceString);
  // console.log(buffer);
  return buffer.replace(tagString, replaceString);
};

let _deleteDirectoryRecursive = function(path) {
  if(FS.existsSync(path)) {
    FS.readdirSync(path).forEach(function(file) {
      let curPath = path + "/" + file;
      if(FS.lstatSync(curPath).isDirectory()) { // recurse
        _deleteDirectoryRecursive(curPath);
      } else { // delete file
        FS.unlinkSync(curPath);
      }
    });
    FS.rmdirSync(path);
  }
};

let _caption = function (captionString) {
  return (_.startCase(captionString));
}

let _componentName = function (component) {
  return component.charAt(0).toUpperCase() + _.camelCase(component).slice(1);
}

let _createUserPageDirectories = function (pageDirectories, prefix='') {
  pageDirectories.forEach((pageDirectoryInfo, index) => {
    let pageDirectoryName = pageDirectoryInfo.dir ? pageDirectoryInfo.dir : pageDirectoryInfo;
    let pageDirectory = USER_PAGE_PATH + '/' + _.capitalize(prefix + pageDirectoryName);
    FS.mkdirSync(pageDirectory, (err) =>{
      console.log(err);
    });
    console.log('Page directory created: ' + pageDirectory);
  });
};

let _createUserPageIndexFile = function (pageDirectories, prefix='') {
  let templateFilePath = 'seed/pages/index.js.tpl';
  let orgFileBuffer = _readWholeFile(templateFilePath);
  pageDirectories.forEach((pageDirectoryInfo) => {
    let indexFilePath = USER_PAGE_PATH + '/' + _.capitalize(prefix + pageDirectoryInfo.dir) + '/index.js';
    let lifeCycleMethod = _userPageIndexLifeCycleMethod(pageDirectoryInfo);
    let fileBuffer = _replaceTag('LIFE_CYCLE_METHOD', lifeCycleMethod, orgFileBuffer);
    let fetchData = _userPageIndexFetchData(pageDirectoryInfo);
    fileBuffer = _replaceTag('FETCH_DATA', fetchData, fileBuffer);
    let renderFetchDone = _userPageIndexFetchDone(pageDirectoryInfo);
    fileBuffer = _replaceTag('RENDER_FETCHDONE', renderFetchDone, fileBuffer);
    let renderBeforeReturn = _userPageIndexRenderBeforeReturn(pageDirectoryInfo);
    fileBuffer = _replaceTag('RENDER_BEFORE_RETURN', renderBeforeReturn, fileBuffer);
    fileBuffer = _replaceTag('TITLE_PARENT', _caption(pageDirectoryInfo.parent), fileBuffer);
    fileBuffer = _replaceTag('TITLE_CHILD', _caption(pageDirectoryInfo.child), fileBuffer);
    let pageImportComponents = [], pageDefaultImportComponents = [];
    let pageLayout = _userPageIndexLayout(pageDirectoryInfo, pageImportComponents, pageDefaultImportComponents);
    let pageImportDeclaration = _importComponentDeclaration(pageImportComponents);
    fileBuffer = _replaceTag('IMPORT_COMPONENTS', pageImportDeclaration, fileBuffer);
    let pageDefaultImportDeclaration = _importDefaultImportComponentDeclaration(pageDefaultImportComponents);
    fileBuffer = _replaceTag('DEFAULT_IMPORT_COMPONENTS', pageDefaultImportDeclaration, fileBuffer);
    let pageConstructor = _basicConstructor();
    fileBuffer = _replaceTag('PAGE_CONSTRUCTOR', pageConstructor, fileBuffer);
    fileBuffer = _replaceTag('PAGE_LAYOUT', pageLayout, fileBuffer);
    _writeDistFile(_distFilePath(indexFilePath), fileBuffer);
  });
}

let _userPageIndexLifeCycleMethod = function (pageDataSet) {
  let functionName = '_userPageIndexFetchData()';
  if (_isSet(pageDataSet, 'lifeCycleMethods', functionName) === false) return '';
  let lifeCycleMethods = '';
  _.forEach(pageDataSet.lifeCycleMethods, (lifeCycleMethod) => {
    lifeCycleMethods += `${lifeCycleMethod.methodName}(){${lifeCycleMethod.code}}`;
  });
  return lifeCycleMethods;
}

let _userPageIndexFetchData = function (pageDataSet) {
  let functionName = '_userPageIndexFetchData()';
  if (_isSet(pageDataSet, 'fetch', functionName) === false) return '';
  if (_isSet(pageDataSet.fetch, 'format', functionName) === false) return '';
  if (_isSet(pageDataSet.fetch, 'apis', functionName) === false) return '';
  let templateFetchDataFilePath = 'seed/pages/' + pageDataSet.fetch.format + '.js.tpl';
  let fetchApi = '', res = '', resJSON = '', state = 'let state = {};';
  _.forEach(pageDataSet.fetch.apis, (api) => {
    fetchApi += (fetchApi?', ': '') + `fetch('${api.api}'${(api.init?', '+api.init:'')})`;
    res += (res?', ': '') + api.name;
    resJSON += (resJSON?', ': '') + `${api.name}.json()`;
    state += `${'\n'+ SP(3)}Object.assign(state, this.properlyAssignObject('${api.name}', ${api.name}));`;
  });
  let fetchDataBuffer = _readWholeFile(templateFetchDataFilePath);
  fetchDataBuffer = _replaceTag('FETCH', fetchApi, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('RESOURCE', res, fetchDataBuffer);
  fetchDataBuffer = _replaceTag('RESOURCE_JSON', resJSON, fetchDataBuffer);
  state += `${'\n'+SP(3)}this.setState(state);`;
  fetchDataBuffer = _replaceTag('SET_STATUS', state, fetchDataBuffer);
  // console.log(fetchDataBuffer);
  return fetchDataBuffer;
}

let _userPageIndexFetchDone = function (pageDataSet) {
  let functionName = '_userPageIndexFetchDone()';
  if (_isSet(pageDataSet, 'fetch', functionName) === false) return '';
  if (_isSet(pageDataSet.fetch, 'apis', functionName) === false) return '';
  let fetchDoneCondition = '';
  _.forEach(pageDataSet.fetch.apis, (api) => {
    fetchDoneCondition += (fetchDoneCondition?' || ': '') + `this.state.${api.name} === undefined`;
  });
  let fetchDone = `if (${fetchDoneCondition}) { return <React.Fragment />;}`;
  return fetchDone;
}

let _userPageIndexRenderBeforeReturn = function (pageDataSet) {
  let functionName = '_userPageIndexRenderBeforeReturn()';
  if (_isSet(pageDataSet, 'renderBeforeReturn', functionName) === false) return '';
  let renderBeforeReturn = '';
  _.forEach(pageDataSet.renderBeforeReturn, (code) => {
    renderBeforeReturn += (renderBeforeReturn?'\n': '') + code;
  });
  return renderBeforeReturn;
}

let _importComponentDeclaration = function (userPageImportComponents) {
  let result = '';
  for(let importFrom in userPageImportComponents) {
    if(!userPageImportComponents.hasOwnProperty(importFrom)) continue;
    let components = userPageImportComponents[importFrom];
    let commaSeparatedComponents = '';
    _.forEach(components, (component) => {
      commaSeparatedComponents += (commaSeparatedComponents ? ' ,' : '') + component;
    });
    result += (result ? '\n' : '') + 'import { ' + commaSeparatedComponents + ' } from "' + importFrom + '";';
  }
  // console.log(result);
  return result;
}

let _importDefaultImportComponentDeclaration = function (userPageDefaultImportComponents) {
  let result = '';
  _.forEach(userPageDefaultImportComponents, declaration => {
    result += (result ? '\n' : '') + 'import ' + declaration.name + ' from "' + declaration.from + '";';
  });
  return result;
}

let _basicConstructor = function () {
  return `
  constructor(props) {
    super(props);
    this.state = {};
  }`;
}
let _importImportCssDeclaration = function (userPageDefaultImportComponents) {
  let result = '';
  _.forEach(userPageDefaultImportComponents, declaration => {
    result += (result ? '\n' : '') + 'import ' + declaration.name;
  });
  return result;
}

let _userPageIndexLayout = function (pageDataSet, userPageImportComponents, userPageDefaultImportComponents) {
  let functionName = '_userPageIndexLayout()';
  if (_isSet(pageDataSet, 'layout', functionName) === false) return '';
  let result = '';
  _.forEach(pageDataSet.layout, (layout) => {
    let templateFrameFilePath = 'seed/pages/layout/' + layout.frame + '.tpl';
    _templateFrameRequiredImportComponents(layout.frame, userPageImportComponents, userPageDefaultImportComponents)
    let innerPageLayout = '';
    let frameBuffer = _readWholeFile(templateFrameFilePath);
    _.forEach(layout.components, (component, i) => {
      _dedupeImportComponents(component, userPageImportComponents);
      _dedupeDefaultImportComponents(component, userPageDefaultImportComponents);
      if (!_.isUndefined(component.importOnly) && component.importOnly == "yes") return;
      let properties = _componentProperties(component);
      innerPageLayout += (i>0?`\n${SP(7)}`:'') + '<' + component.name + properties + ' />';
    });
    result += _replaceTag('INNER_PAGE_LAYOUT', innerPageLayout, frameBuffer);
  });
  // console.log(result);
  return result;
}

let _templateFrameRequiredImportComponents = function (frameName, userPageImportComponents, userPageDefaultImportComponents) {
  let templateFrameFilePath = 'seed/pages/layout/' + frameName + '.json';
  let frameComponents = _JSONdata(templateFrameFilePath);
  if (frameComponents === "") return;
  _.forEach(frameComponents.components, (component) => {
    _dedupeImportComponents(component, userPageImportComponents);
    _dedupeDefaultImportComponents(component, userPageDefaultImportComponents);
  });
}

let _typePackage = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "package") {
    return true;
  }
  return false;
}

let _typeDefault = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "default") {
    return true;
  }
  return false;
}

let _typeCss = function (component) {
  if (_.isUndefined(component.type) === false && component.type.toLowerCase() === "css") {
    return true;
  }
  return false;
}

let _dedupeImportComponents = function (component, userPageImportComponents) {
  if (_typePackage(component) === false) return;
  if (_.isUndefined(userPageImportComponents[component.from])) {
    let componentName = [];
    componentName.push(component.name);
    userPageImportComponents[component.from] = componentName;
  } else {
    let existGroupComponents = userPageImportComponents[component.from];
    if (_.isUndefined(existGroupComponents[component.name])) existGroupComponents.push(component.name);
    userPageImportComponents[component.from] = existGroupComponents;
  }
}

let _dedupeDefaultImportComponents = function (component, userPageDefaultImportComponents) {
  if (_typeDefault(component) === false) return;
  // if (_.isUndefined(component.type) || component.type !== "default") return;
  let importSet = { name: component.name, from: component.from };
  if (_.find(userPageDefaultImportComponents, (v) => { return (v.name === component.name) })) {
    console.log(`Duplicate component: ${component.name}`);
    return;
  }
  userPageDefaultImportComponents.push(importSet);
}

let _dedupeImportCss = function (component, userImportCss) {
  if (_typeCss(component) === false) return;
  let importSet = { name: component.name };
  if (_.find(userImportCss, (v) => { return (v.name === component.name) })) {
    console.log(`Duplicate css: ${component.name}`);
    return;
  }
  userImportCss.push(importSet);
}

let _componentProperties = function (component) {
  let functionName = '_componentProperties()';
  if (_isSet(component, 'props', functionName) === false) return '';
  let props = '';
  _.forEach(component.props, (prop) => {
    props += ' ' + prop;
  });
  return props;
}

let _importComponentString = function (pageDirectories, groupNamePrefix='') {
  let result = '';
  pageDirectories.forEach((pageDirectoryInfo, index) => {
    let importString = (index > 0 ? '\n':'')
      + 'import ' + _componentName(groupNamePrefix + pageDirectoryInfo.dir) + ' from "../pages-user/' + _.capitalize(groupNamePrefix + pageDirectoryInfo.dir) + '/index";';
    // console.log(importString);
    result += importString;
  });
  return result;
}

let _routePathComponentString = function (pageDirectories, groupNamePrefix='') {
  let result = '';
  pageDirectories.forEach((pageDirectoryInfo, index) => {
    let writeString = (index > 0 ? '\n' + SP(1):'')
      + '{ path: "/' + pageDirectoryInfo.dir.toLowerCase() + '", component: ' + _componentName(groupNamePrefix + pageDirectoryInfo.dir) + ' },';
    // console.log(writeString);
    result += writeString;
  });
  return result;
}

let _navigation = function (unit) {
  if (_.isUndefined(unit.noNavigation)) {
    return true;
  }
  if (unit.noNavigation.toLowerCase() === "yes") {
    return false;
  }
  return true;
}

let _navbarDashboardLinks = function (dashboardList) {
  let result = '';
  dashboardList.forEach((line, index) => {
    let writeString = (index > 0 ? '\n' + SP(11):'')
      + '<Link to="' + line.dir + '" className="dropdown-item">{this.props.t(\'' + _caption(line.child) + '\')}</Link>';
    // console.log(writeString);
    result += writeString;
  });
  return result;
}

let _navbarOther = function (fileBuffer) {
  let rawJSONData = _JSONdata(ROUTES_JSON);
  let groupNameList = _groupNameList(rawJSONData);
  let navbarOtherLinks = '';
  groupNameList.forEach((groupName) => {
    navbarOtherLinks += _navbarOtherLinks(groupName, rawJSONData[groupName]);
  });
  fileBuffer = _replaceTag('NAVBAR_OTHER', navbarOtherLinks, fileBuffer);
  return fileBuffer;
}

let _navbarOtherLinks = function (groupName, groupArray) {
  let navbarFrametemplateFilePath = 'seed/components/HorizontalLayout/NavbarFrame.tpl';
  let frameFileBuffer = _readWholeFile(navbarFrametemplateFilePath);
  let navbarSingleFilePath = 'seed/components/HorizontalLayout/NavbarSingle.tpl';
  let singleFileBuffer = _readWholeFile(navbarSingleFilePath);
  let navbarHierarchyTemplateFilePath = 'seed/components/HorizontalLayout/NavbarHierarchy.tpl';
  let hierarchyFileBuffer = _readWholeFile(navbarHierarchyTemplateFilePath);
  frameFileBuffer = _replaceTag('GROUP', groupName, frameFileBuffer);
  frameFileBuffer = _replaceTag('GROUP_CAPTION', _caption(groupName), frameFileBuffer);
  let parentMenu = '';
  _.forEach(groupArray, (unit) => {
    console.log(unit.type + ' ' + unit.name);
    if (unit.type === 'single' && _navigation(unit) === true) {
      let menuLink = groupName + '-' + unit.name;
      let replacedBuffer = _replaceTag('MENU_LINK', menuLink, singleFileBuffer);
      replacedBuffer = _replaceTag('MENU_CAPTION', _caption(unit.name), replacedBuffer);
      parentMenu += replacedBuffer;
    } else if (unit.type === 'parent') {
      if (!_.isArray(unit.child)) {
        throw 'JSON data is corrupted!';
      }
      let replacedBuffer = _replaceTag('PARENT', unit.name, hierarchyFileBuffer);
      replacedBuffer = _replaceTag('PARENT_CAPTION', _caption(unit.name), replacedBuffer);
      let childMenuBuffer = '';
      _.forEach(unit.child, (secondUnit) => {
        if (secondUnit.type === "single" && _navigation(secondUnit) === true) {
          let menuLink = groupName + '-' + unit.name + '-' + secondUnit.name;
          let replacedBuffer = _replaceTag('MENU_LINK', menuLink, singleFileBuffer);
          replacedBuffer = _replaceTag('MENU_CAPTION', _caption(secondUnit.name), replacedBuffer);
          childMenuBuffer += replacedBuffer;
        }
      });
      replacedBuffer = _replaceTag('CHILD', childMenuBuffer, replacedBuffer);
      parentMenu += replacedBuffer;
    }
  });
  frameFileBuffer = _replaceTag('NAVBAR_PARENT', parentMenu, frameFileBuffer);
  return frameFileBuffer;
}

let _sidebarDashboardLinks = function (dashboardList) {
  let result = '';
  dashboardList.forEach((line, index) => {
    let menuName = _.capitalize(line.child);
    let writeString = (index > 0 ? '\n' + SP(9):'')
      + '<li><Link to="/' + line.child + '">{this.props.t(\'' + menuName + '\')}</Link></li>';
    console.log(writeString);
    result += writeString;
  });
  return result;
}

let _sidebarOther = function (fileBuffer) {
  let rawJSONData = _JSONdata(ROUTES_JSON);
  let groupNameList = _groupNameList(rawJSONData);
  let sidebarOtherLinks = '';
  groupNameList.forEach((groupName) => {
    sidebarOtherLinks += _sidebarOtherLinks(groupName, rawJSONData[groupName]);
  });
  fileBuffer = _replaceTag('SIDEBAR_OTHER', sidebarOtherLinks, fileBuffer);
  return fileBuffer;
}

let _sidebarOtherLinks = function (groupName, groupArray) {
  let sidebarFrametemplateFilePath = 'seed/components/VerticalLayout/SidebarContentFrame.tpl';
  let frameFileBuffer = _readWholeFile(sidebarFrametemplateFilePath);
  let sidebarSingleFilePath = 'seed/components/VerticalLayout/SidebarContentSingle.tpl';
  let singleFileBuffer = _readWholeFile(sidebarSingleFilePath);
  let sidebarChildFilePath = 'seed/components/VerticalLayout/SidebarContentChild.tpl';
  let childFileBuffer = _readWholeFile(sidebarChildFilePath);
  let sidebarHierarchyTemplateFilePath = 'seed/components/VerticalLayout/SidebarContentHierarchy.tpl';
  let hierarchyFileBuffer = _readWholeFile(sidebarHierarchyTemplateFilePath);
  frameFileBuffer = _replaceTag('GROUP', groupName, frameFileBuffer);
  frameFileBuffer = _replaceTag('GROUP_CAPTION', _caption(groupName), frameFileBuffer);
  let parentMenu = '';
  _.forEach(groupArray, (unit) => {
    console.log(unit.type + ' ' + unit.name);
    if (unit.type === 'single' && _navigation(unit) === true){
      let menuLink = groupName + '-' + unit.name;
      let bxStyle = unit.bx ? unit.bx : "none";
      let replacedBuffer = _replaceTag('BXSTYLE', bxStyle, singleFileBuffer);
      replacedBuffer = _replaceTag('MENU_LINK', menuLink, replacedBuffer);
      replacedBuffer = _replaceTag('MENU_CAPTION', _caption(unit.name), replacedBuffer);
      parentMenu += replacedBuffer;
    } else if (unit.type === 'parent') {
      if (!_.isArray(unit.child)) {
        throw 'JSON data is corrupted!';
      }
      let bxStyle = unit.bx ? unit.bx : "none";
      let replacedBuffer = _replaceTag('PARENT', unit.name, hierarchyFileBuffer);
      replacedBuffer = _replaceTag('BXSTYLE', bxStyle, replacedBuffer);
      replacedBuffer = _replaceTag('PARENT_CAPTION', _caption(unit.name), replacedBuffer);
      let childMenuBuffer = '';
      _.forEach(unit.child, (secondUnit) => {
        if (secondUnit.type === "single" && _navigation(secondUnit) === true) {
          let menuLink = groupName + '-' + unit.name + '-' + secondUnit.name;
          let bxStyle = secondUnit.bx ? secondUnit.bx : "none";
          let replacedBuffer = _replaceTag('BXSTYLE', bxStyle, childFileBuffer);
          replacedBuffer = _replaceTag('MENU_LINK', menuLink, replacedBuffer);
          replacedBuffer = _replaceTag('MENU_CAPTION', _caption(secondUnit.name), replacedBuffer);
          childMenuBuffer += replacedBuffer;
        }
      });
      replacedBuffer = _replaceTag('CHILD', childMenuBuffer, replacedBuffer);
      parentMenu += replacedBuffer;
    }
  });
  frameFileBuffer = _replaceTag('SIDEBAR_PARENT', parentMenu, frameFileBuffer);
  return frameFileBuffer;
}
