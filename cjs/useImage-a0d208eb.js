'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

// returns a Promisized version of Image() api
var imagePromiseFactory = (function (_ref) {
  var _ref$decode = _ref.decode,
    decode = _ref$decode === void 0 ? true : _ref$decode,
    _ref$crossOrigin = _ref.crossOrigin,
    crossOrigin = _ref$crossOrigin === void 0 ? '' : _ref$crossOrigin;
  return function (src) {
    return new Promise(function (resolve, reject) {
      var i = new Image();
      if (crossOrigin) i.crossOrigin = crossOrigin;
      i.onload = function () {
        decode && i.decode ? i.decode().then(resolve)["catch"](reject) : resolve();
      };
      i.onerror = reject;
      i.src = src;
    });
  };
});

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty__default["default"](target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var removeBlankArrayElements = function removeBlankArrayElements(a) {
  return a.filter(function (x) {
    return x;
  });
};
var stringToArray = function stringToArray(x) {
  return Array.isArray(x) ? x : [x];
};
var cache = {};
// sequential map.find for promises
var promiseFind = function promiseFind(arr, promiseFactory) {
  var done = false;
  return new Promise(function (resolve, reject) {
    var queueNext = function queueNext(src) {
      return promiseFactory(src).then(function () {
        done = true;
        resolve(src);
      });
    };
    arr.reduce(function (p, src) {
      // ensure we aren't done before enquing the next source
      return p["catch"](function () {
        if (!done) return queueNext(src);
      });
    }, queueNext(arr.shift()))["catch"](reject);
  });
};
function useImage(_ref) {
  var srcList = _ref.srcList,
    _ref$imgPromise = _ref.imgPromise,
    imgPromise = _ref$imgPromise === void 0 ? imagePromiseFactory({
      decode: true
    }) : _ref$imgPromise,
    _ref$useSuspense = _ref.useSuspense,
    useSuspense = _ref$useSuspense === void 0 ? true : _ref$useSuspense;
  var _useState = React.useState(true),
    setIsLoading = _useState[1];
  var sourceList = removeBlankArrayElements(stringToArray(srcList));
  var sourceKey = sourceList.join('');
  if (!cache[sourceKey]) {
    // create promise to loop through sources and try to load one
    cache[sourceKey] = {
      promise: promiseFind(sourceList, imgPromise),
      cache: 'pending',
      error: null
    };
  }
  // when promise resolves/reject, update cache & state
  cache[sourceKey].promise
  // if a source was found, update cache
  // when not using suspense, update state to force a rerender
  .then(function (src) {
    cache[sourceKey] = _objectSpread(_objectSpread({}, cache[sourceKey]), {}, {
      cache: 'resolved',
      src: src
    });
    if (!useSuspense) setIsLoading(false);
  })
  // if no source was found, or if another error occured, update cache
  // when not using suspense, update state to force a rerender
  ["catch"](function (error) {
    cache[sourceKey] = _objectSpread(_objectSpread({}, cache[sourceKey]), {}, {
      cache: 'rejected',
      error: error
    });
    if (!useSuspense) setIsLoading(false);
  });
  if (cache[sourceKey].cache === 'resolved') {
    return {
      src: cache[sourceKey].src,
      isLoading: false,
      error: null
    };
  }
  if (cache[sourceKey].cache === 'rejected') {
    if (useSuspense) throw cache[sourceKey].error;
    return {
      isLoading: false,
      error: cache[sourceKey].error,
      src: undefined
    };
  }
  // cache[sourceKey].cache === 'pending')
  if (useSuspense) throw cache[sourceKey].promise;
  return {
    isLoading: true,
    src: undefined,
    error: null
  };
}

exports.imagePromiseFactory = imagePromiseFactory;
exports.useImage = useImage;
//# sourceMappingURL=useImage-a0d208eb.js.map
