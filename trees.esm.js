import { ref, proxyRefs, defineComponent, h, inject, computed, onUpdated, provide, watchEffect, onMounted, onUnmounted, nextTick, watch, cloneVNode, Teleport, reactive, openBlock, createBlock, createVNode, resolveComponent, withCtx, Transition, Fragment, renderList, toDisplayString, createCommentVNode, withModifiers, createTextVNode, renderSlot, TransitionGroup, withDirectives, vShow, resolveDynamicComponent, vModelText } from 'vue';

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
var buildFullPath = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = xhr;
  }
  return adapter;
}

var defaults$1 = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults$1.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults$1.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults$1.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults$1;

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
var isAxiosError = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios$1 = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios$1.Axios = Axios_1;

// Factory for creating new instances
axios$1.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios$1.Cancel = Cancel_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel;

// Expose all/spread
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;

// Expose isAxiosError
axios$1.isAxiosError = isAxiosError;

var axios_1 = axios$1;

// Allow use of default import syntax in TypeScript
var _default = axios$1;
axios_1.default = _default;

var axios = axios_1;

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true
});
const BaseAPI = {
  makeRequest(config, opts) {
    config.data = JSON.stringify(config.data);
    config.headers = {
      "Content-Type": "application/json"
    };
    return new Promise((resolve, reject) => {
      const wait = window.setTimeout(() => {
        if (opts.useLoader) window.VueBus.emit("Spinner-show");
      }, 200);
      apiAxiosInstance(config).then(success => {
        window.clearTimeout(wait);
        if (opts.useLoader) window.VueBus.emit("Spinner-hide");
        resolve(success.data);
      }, error => {
        // TODO: come back once we've finalized format for API response and
        // have nice UI that their session is expired with redirect to login
        // page
        window.clearTimeout(wait);
        if (opts.useLoader) window.VueBus.emit("Spinner-hide");
        reject(error.response);
      });
    });
  },

  get(path, opts, params) {
    return this.makeRequest({
      url: path,
      method: "GET",
      params
    }, opts);
  },

  delete(path, opts) {
    return this.makeRequest({
      url: path,
      method: "DELETE"
    }, opts);
  },

  post(path, data, opts) {
    return this.makeRequest({
      url: path,
      data,
      method: "POST"
    }, opts);
  },

  put(path, data, opts) {
    return this.makeRequest({
      url: path,
      data,
      method: "PUT"
    }, opts);
  }

};

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

/**
  * vue-class-component v8.0.0-rc.1
  * (c) 2015-present Evan You
  * @license MIT
  */

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}

function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function defineGetter(obj, key, getter) {
  Object.defineProperty(obj, key, {
    get: getter,
    enumerable: false,
    configurable: true
  });
}

function defineProxy(proxy, key, target) {
  Object.defineProperty(proxy, key, {
    get: function get() {
      return target[key].value;
    },
    set: function set(value) {
      target[key].value = value;
    },
    enumerable: true,
    configurable: true
  });
}

function getSuper(Ctor) {
  var superProto = Object.getPrototypeOf(Ctor.prototype);

  if (!superProto) {
    return undefined;
  }

  return superProto.constructor;
}

function getOwn(value, key) {
  return value.hasOwnProperty(key) ? value[key] : undefined;
}

var VueImpl = /*#__PURE__*/function () {
  function VueImpl(props, ctx) {
    var _this = this;

    _classCallCheck(this, VueImpl);

    defineGetter(this, '$props', function () {
      return props;
    });
    defineGetter(this, '$attrs', function () {
      return ctx.attrs;
    });
    defineGetter(this, '$slots', function () {
      return ctx.slots;
    });
    defineGetter(this, '$emit', function () {
      return ctx.emit;
    });
    Object.keys(props).forEach(function (key) {
      Object.defineProperty(_this, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: props[key]
      });
    });
  }

  _createClass(VueImpl, null, [{
    key: "registerHooks",
    value: function registerHooks(keys) {
      var _this$__h;

      (_this$__h = this.__h).push.apply(_this$__h, _toConsumableArray(keys));
    }
  }, {
    key: "with",
    value: function _with(Props) {
      var propsMeta = new Props();
      var props = {};
      Object.keys(propsMeta).forEach(function (key) {
        var meta = propsMeta[key];
        props[key] = meta !== null && meta !== void 0 ? meta : null;
      });

      var PropsMixin = /*#__PURE__*/function (_this2) {
        _inherits(PropsMixin, _this2);

        var _super = _createSuper(PropsMixin);

        function PropsMixin() {
          _classCallCheck(this, PropsMixin);

          return _super.apply(this, arguments);
        }

        return PropsMixin;
      }(this);

      PropsMixin.__b = {
        props: props
      };
      return PropsMixin;
    }
  }, {
    key: "__vccOpts",
    get: function get() {
      // Early return if `this` is base class as it does not have any options
      if (this === Vue) {
        return {};
      }

      var Ctor = this;
      var cache = getOwn(Ctor, '__c');

      if (cache) {
        return cache;
      } // If the options are provided via decorator use it as a base


      var options = _objectSpread2({}, getOwn(Ctor, '__o'));

      Ctor.__c = options; // Handle super class options

      var Super = getSuper(Ctor);

      if (Super) {
        options["extends"] = Super.__vccOpts;
      } // Inject base options as a mixin


      var base = getOwn(Ctor, '__b');

      if (base) {
        options.mixins = options.mixins || [];
        options.mixins.unshift(base);
      }

      options.methods = _objectSpread2({}, options.methods);
      options.computed = _objectSpread2({}, options.computed);
      var proto = Ctor.prototype;
      Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
          return;
        } // hooks


        if (Ctor.__h.indexOf(key) > -1) {
          options[key] = proto[key];
          return;
        }

        var descriptor = Object.getOwnPropertyDescriptor(proto, key); // methods

        if (typeof descriptor.value === 'function') {
          options.methods[key] = descriptor.value;
          return;
        } // computed properties


        if (descriptor.get || descriptor.set) {
          options.computed[key] = {
            get: descriptor.get,
            set: descriptor.set
          };
          return;
        }
      });

      options.setup = function (props, ctx) {
        var _promise;

        var data = new Ctor(props, ctx);
        var dataKeys = Object.keys(data);
        var plainData = {};
        var promise = null; // Initialize reactive data and convert constructor `this` to a proxy

        dataKeys.forEach(function (key) {
          // Skip if the value is undefined not to make it reactive.
          // If the value has `__s`, it's a value from `setup` helper, proceed it later.
          if (data[key] === undefined || data[key] && data[key].__s) {
            return;
          }

          plainData[key] = ref(data[key]);
          defineProxy(data, key, plainData);
        }); // Invoke composition functions

        dataKeys.forEach(function (key) {
          if (data[key] && data[key].__s) {
            var setupState = data[key].__s();

            if (setupState instanceof Promise) {
              if (!promise) {
                promise = Promise.resolve(plainData);
              }

              promise = promise.then(function () {
                return setupState.then(function (value) {
                  plainData[key] = proxyRefs(value);
                  return plainData;
                });
              });
            } else {
              plainData[key] = proxyRefs(setupState);
            }
          }
        });
        return (_promise = promise) !== null && _promise !== void 0 ? _promise : plainData;
      };

      var decorators = getOwn(Ctor, '__d');

      if (decorators) {
        decorators.forEach(function (fn) {
          return fn(options);
        });
      } // from Vue Loader


      var injections = ['render', 'ssrRender', '__file', '__cssModules', '__scopeId', '__hmrId'];
      injections.forEach(function (key) {
        if (Ctor[key]) {
          options[key] = Ctor[key];
        }
      });
      return options;
    }
  }]);

  return VueImpl;
}();

VueImpl.__h = ['data', 'beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUnmount', 'unmounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'render', 'errorCaptured', 'serverPrefetch'];
var Vue = VueImpl;

function Options(options) {
  return function (Component) {
    Component.__o = options;
    return Component;
  };
}
function createDecorator(factory) {
  return function (target, key, index) {
    var Ctor = typeof target === 'function' ? target : target.constructor;

    if (!Ctor.__d) {
      Ctor.__d = [];
    }

    if (typeof index !== 'number') {
      index = undefined;
    }

    Ctor.__d.push(function (options) {
      return factory(options, key, index);
    });
  };
}

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = (str) => str.replace(hyphenateRE, '-$1').toLowerCase();
/**
 * Decorator of an event-emitter function
 * @param  event The name of the event
 */
function Emit(event) {
    return createDecorator((componentOptions, propertyKey) => {
        const emitName = event || hyphenate(propertyKey);
        componentOptions.emits || (componentOptions.emits = []);
        componentOptions.emits.push(emitName);
        const original = componentOptions.methods[propertyKey];
        componentOptions.methods[propertyKey] = function emitter(...args) {
            const emit = (returnValue) => {
                if (returnValue === undefined) {
                    if (args.length === 0) {
                        this.$emit(emitName);
                    }
                    else if (args.length === 1) {
                        this.$emit(emitName, args[0]);
                    }
                    else {
                        this.$emit(emitName, ...args);
                    }
                }
                else {
                    args.unshift(returnValue);
                    this.$emit(emitName, ...args);
                }
            };
            const returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(emit);
            }
            else {
                emit(returnValue);
            }
            return returnValue;
        };
    });
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}

/**
 * Decorator for prop options
 * @param propOptions the options for the prop
 */
function Prop(propOptions) {
    return createDecorator((componentOptions, key) => {
        componentOptions.props || (componentOptions.props = Object.create(null));
        componentOptions.props[key] = propOptions;
    });
}

/**
 * Decorator for watch options
 * @param path the path or the expression to observe
 * @param watchOptions
 */
function Watch(path, watchOptions) {
    return createDecorator((componentOptions, handler) => {
        componentOptions.watch || (componentOptions.watch = Object.create(null));
        const watch = componentOptions.watch;
        if (typeof watch[path] === 'object' && !Array.isArray(watch[path])) {
            watch[path] = [watch[path]];
        }
        else if (typeof watch[path] === 'undefined') {
            watch[path] = [];
        }
        watch[path].push(Object.assign({ handler }, watchOptions));
    });
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

function match(value, lookup) {
  if (value in lookup) {
    var returnValue = lookup[value];

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return typeof returnValue === 'function' ? returnValue.apply(void 0, args) : returnValue;
  }

  var error = new Error("Tried to handle \"" + value + "\" but there is no handler defined. Only defined handlers are: " + Object.keys(lookup).map(function (key) {
    return "\"" + key + "\"";
  }).join(', ') + ".");
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

var Features;

(function (Features) {
  /** No features at all */
  Features[Features["None"] = 0] = "None";
  /**
   * When used, this will allow us to use one of the render strategies.
   *
   * **The render strategies are:**
   *    - **Unmount**   _(Will unmount the component.)_
   *    - **Hidden**    _(Will hide the component using the [hidden] attribute.)_
   */

  Features[Features["RenderStrategy"] = 1] = "RenderStrategy";
  /**
   * When used, this will allow the user of our component to be in control. This can be used when
   * you want to transition based on some state.
   */

  Features[Features["Static"] = 2] = "Static";
})(Features || (Features = {}));

var RenderStrategy;

(function (RenderStrategy) {
  RenderStrategy[RenderStrategy["Unmount"] = 0] = "Unmount";
  RenderStrategy[RenderStrategy["Hidden"] = 1] = "Hidden";
})(RenderStrategy || (RenderStrategy = {}));

function render$m(_ref) {
  var _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible,
      _ref$features = _ref.features,
      features = _ref$features === void 0 ? Features.None : _ref$features,
      main = _objectWithoutPropertiesLoose(_ref, ["visible", "features"]);

  // Visible always render
  if (visible) return _render(main);

  if (features & Features.Static) {
    // When the `static` prop is passed as `true`, then the user is in control, thus we don't care about anything else
    if (main.props["static"]) return _render(main);
  }

  if (features & Features.RenderStrategy) {
    var _main$props$unmount, _match;

    var strategy = ((_main$props$unmount = main.props.unmount) != null ? _main$props$unmount : true) ? RenderStrategy.Unmount : RenderStrategy.Hidden;
    return match(strategy, (_match = {}, _match[RenderStrategy.Unmount] = function () {
      return null;
    }, _match[RenderStrategy.Hidden] = function () {
      return _render(_extends({}, main, {
        props: _extends({}, main.props, {
          hidden: true,
          style: {
            display: 'none'
          }
        })
      }));
    }, _match));
  } // No features enabled, just render


  return _render(main);
}

function _render(_ref2) {
  var props = _ref2.props,
      attrs = _ref2.attrs,
      slots = _ref2.slots,
      slot = _ref2.slot,
      name = _ref2.name;

  var _omit = omit(props, ['unmount', 'static']),
      as = _omit.as,
      passThroughProps = _objectWithoutPropertiesLoose(_omit, ["as"]);

  var children = slots["default"] == null ? void 0 : slots["default"](slot);

  if (as === 'template') {
    if (Object.keys(passThroughProps).length > 0 || Object.keys(attrs).length > 0) {
      var _ref3 = children != null ? children : [],
          firstChild = _ref3[0],
          other = _ref3.slice(1);

      if (!isValidElement(firstChild) || other.length > 0) {
        throw new Error(['Passing props on "template"!', '', "The current component <" + name + " /> is rendering a \"template\".", "However we need to passthrough the following props:", Object.keys(passThroughProps).concat(Object.keys(attrs)).map(function (line) {
          return "  - " + line;
        }).join('\n'), '', 'You can apply a few solutions:', ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', 'Render a single element as the child so that we can forward the props onto that element.'].map(function (line) {
          return "  - " + line;
        }).join('\n')].join('\n'));
      }

      return cloneVNode(firstChild, passThroughProps);
    }

    if (Array.isArray(children) && children.length === 1) {
      return children[0];
    }

    return children;
  }

  return h(as, passThroughProps, children);
}

function omit(object, keysToOmit) {
  if (keysToOmit === void 0) {
    keysToOmit = [];
  }

  var clone = Object.assign({}, object);

  for (var _iterator = _createForOfIteratorHelperLoose(keysToOmit), _step; !(_step = _iterator()).done;) {
    var key = _step.value;
    if (key in clone) delete clone[key];
  }

  return clone;
}

function isValidElement(input) {
  if (input == null) return false; // No children

  if (typeof input.type === 'string') return true; // 'div', 'span', ...

  if (typeof input.type === 'object') return true; // Other components

  if (typeof input.type === 'function') return true; // Built-ins like Transition

  return false; // Comments, strings, ...
}

// TODO: This must already exist somewhere, right? 🤔
// Ref: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
var Keys;

(function (Keys) {
  Keys["Space"] = " ";
  Keys["Enter"] = "Enter";
  Keys["Escape"] = "Escape";
  Keys["Backspace"] = "Backspace";
  Keys["ArrowLeft"] = "ArrowLeft";
  Keys["ArrowUp"] = "ArrowUp";
  Keys["ArrowRight"] = "ArrowRight";
  Keys["ArrowDown"] = "ArrowDown";
  Keys["Home"] = "Home";
  Keys["End"] = "End";
  Keys["PageUp"] = "PageUp";
  Keys["PageDown"] = "PageDown";
  Keys["Tab"] = "Tab";
})(Keys || (Keys = {}));

var id = 0;

function generateId() {
  return ++id;
}

function useId() {
  return generateId();
}

//  - https://stackoverflow.com/a/30753870

var focusableSelector = /*#__PURE__*/['[contentEditable=true]', '[tabindex]', 'a[href]', 'area[href]', 'button:not([disabled])', 'iframe', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])'].map(function (selector) {
  return selector + ":not([tabindex='-1'])";
}).join(',');
var Focus;

(function (Focus) {
  /** Focus the first non-disabled element */
  Focus[Focus["First"] = 1] = "First";
  /** Focus the previous non-disabled element */

  Focus[Focus["Previous"] = 2] = "Previous";
  /** Focus the next non-disabled element */

  Focus[Focus["Next"] = 4] = "Next";
  /** Focus the last non-disabled element */

  Focus[Focus["Last"] = 8] = "Last";
  /** Wrap tab around */

  Focus[Focus["WrapAround"] = 16] = "WrapAround";
  /** Prevent scrolling the focusable elements into view */

  Focus[Focus["NoScroll"] = 32] = "NoScroll";
})(Focus || (Focus = {}));

var FocusResult;

(function (FocusResult) {
  FocusResult[FocusResult["Error"] = 0] = "Error";
  FocusResult[FocusResult["Overflow"] = 1] = "Overflow";
  FocusResult[FocusResult["Success"] = 2] = "Success";
  FocusResult[FocusResult["Underflow"] = 3] = "Underflow";
})(FocusResult || (FocusResult = {}));

var Direction;

(function (Direction) {
  Direction[Direction["Previous"] = -1] = "Previous";
  Direction[Direction["Next"] = 1] = "Next";
})(Direction || (Direction = {}));

function getFocusableElements(container) {
  if (container === void 0) {
    container = document.body;
  }

  if (container == null) return [];
  return Array.from(container.querySelectorAll(focusableSelector));
}
var FocusableMode;

(function (FocusableMode) {
  /** The element itself must be focusable. */
  FocusableMode[FocusableMode["Strict"] = 0] = "Strict";
  /** The element should be inside of a focusable element. */

  FocusableMode[FocusableMode["Loose"] = 1] = "Loose";
})(FocusableMode || (FocusableMode = {}));
function focusElement(element) {
  element == null ? void 0 : element.focus({
    preventScroll: true
  });
}
function focusIn(container, focus) {
  var elements = Array.isArray(container) ? container : getFocusableElements(container);
  var active = document.activeElement;

  var direction = function () {
    if (focus & (Focus.First | Focus.Next)) return Direction.Next;
    if (focus & (Focus.Previous | Focus.Last)) return Direction.Previous;
    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
  }();

  var startIndex = function () {
    if (focus & Focus.First) return 0;
    if (focus & Focus.Previous) return Math.max(0, elements.indexOf(active)) - 1;
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(active)) + 1;
    if (focus & Focus.Last) return elements.length - 1;
    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
  }();

  var focusOptions = focus & Focus.NoScroll ? {
    preventScroll: true
  } : {};
  var offset = 0;
  var total = elements.length;
  var next = undefined;

  do {
    var _next;

    // Guard against infinite loops
    if (offset >= total || offset + total <= 0) return FocusResult.Error;
    var nextIdx = startIndex + offset;

    if (focus & Focus.WrapAround) {
      nextIdx = (nextIdx + total) % total;
    } else {
      if (nextIdx < 0) return FocusResult.Underflow;
      if (nextIdx >= total) return FocusResult.Overflow;
    }

    next = elements[nextIdx]; // Try the focus the next element, might not work if it is "hidden" to the user.

    (_next = next) == null ? void 0 : _next.focus(focusOptions); // Try the next one in line

    offset += direction;
  } while (next !== document.activeElement); // This is a little weird, but let me try and explain: There are a few scenario's
  // in chrome for example where a focused `<a>` tag does not get the default focus
  // styles and sometimes they do. This highly depends on whether you started by
  // clicking or by using your keyboard. When you programmatically add focus `anchor.focus()`
  // then the active element (document.activeElement) is this anchor, which is expected.
  // However in that case the default focus styles are not applied *unless* you
  // also add this tabindex.


  if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '0');
  return FocusResult.Success;
}

function useWindowEvent(type, listener, options) {
  window.addEventListener(type, listener, options);
  onUnmounted(function () {
    return window.removeEventListener(type, listener, options);
  });
}

function contains(containers, element) {
  for (var _iterator = _createForOfIteratorHelperLoose(containers), _step; !(_step = _iterator()).done;) {
    var container = _step.value;
    if (container.contains(element)) return true;
  }

  return false;
}

function useFocusTrap(containers, enabled, options) {
  if (enabled === void 0) {
    enabled = ref(true);
  }

  if (options === void 0) {
    options = ref({});
  }

  var restoreElement = ref(typeof window !== 'undefined' ? document.activeElement : null);
  var previousActiveElement = ref(null);

  function handleFocus() {
    if (!enabled.value) return;
    if (containers.value.size !== 1) return;
    var initialFocus = options.value.initialFocus;
    var activeElement = document.activeElement;

    if (initialFocus) {
      if (initialFocus === activeElement) {
        return; // Initial focus ref is already the active element
      }
    } else if (contains(containers.value, activeElement)) {
      return; // Already focused within Dialog
    }

    restoreElement.value = activeElement; // Try to focus the initialFocus ref

    if (initialFocus) {
      focusElement(initialFocus);
    } else {
      var couldFocus = false;

      for (var _iterator = _createForOfIteratorHelperLoose(containers.value), _step; !(_step = _iterator()).done;) {
        var container = _step.value;
        var result = focusIn(container, Focus.First);

        if (result === FocusResult.Success) {
          couldFocus = true;
          break;
        }
      }

      if (!couldFocus) throw new Error('There are no focusable elements inside the <FocusTrap />');
    }

    previousActiveElement.value = document.activeElement;
  } // Restore when `enabled` becomes false


  function restore() {
    focusElement(restoreElement.value);
    restoreElement.value = null;
    previousActiveElement.value = null;
  } // Handle initial focus


  watchEffect(handleFocus);
  onUpdated(function () {
    enabled.value ? handleFocus() : restore();
  });
  onUnmounted(restore); // Handle Tab & Shift+Tab keyboard events

  useWindowEvent('keydown', function (event) {
    if (!enabled.value) return;
    if (event.key !== Keys.Tab) return;
    if (!document.activeElement) return;
    if (containers.value.size !== 1) return;
    event.preventDefault();

    for (var _iterator2 = _createForOfIteratorHelperLoose(containers.value), _step2; !(_step2 = _iterator2()).done;) {
      var element = _step2.value;
      var result = focusIn(element, (event.shiftKey ? Focus.Previous : Focus.Next) | Focus.WrapAround);

      if (result === FocusResult.Success) {
        previousActiveElement.value = document.activeElement;
        break;
      }
    }
  }); // Prevent programmatically escaping

  useWindowEvent('focus', function (event) {
    if (!enabled.value) return;
    if (containers.value.size !== 1) return;
    var previous = previousActiveElement.value;
    if (!previous) return;
    var toElement = event.target;

    if (toElement && toElement instanceof HTMLElement) {
      if (!contains(containers.value, toElement)) {
        event.preventDefault();
        event.stopPropagation();
        focusElement(previous);
      } else {
        previousActiveElement.value = toElement;
        focusElement(toElement);
      }
    } else {
      focusElement(previousActiveElement.value);
    }
  }, true);
}

var CHILDREN_SELECTOR = 'body > *';
var interactables = /*#__PURE__*/new Set();
var originals = /*#__PURE__*/new Map();

function inert(element) {
  element.setAttribute('aria-hidden', 'true'); // @ts-expect-error `inert` does not exist on HTMLElement (yet!)

  element.inert = true;
}

function restore(element) {
  var original = originals.get(element);
  if (!original) return;
  if (original['aria-hidden'] === null) element.removeAttribute('aria-hidden');else element.setAttribute('aria-hidden', original['aria-hidden']); // @ts-expect-error `inert` does not exist on HTMLElement (yet!)

  element.inert = original.inert;
}

function useInertOthers(container, enabled) {
  if (enabled === void 0) {
    enabled = ref(true);
  }

  watchEffect(function (onInvalidate) {
    if (!enabled.value) return;
    if (!container.value) return;
    var element = container.value; // Mark myself as an interactable element

    interactables.add(element); // Restore elements that now contain an interactable child

    for (var _iterator = _createForOfIteratorHelperLoose(originals.keys()), _step; !(_step = _iterator()).done;) {
      var original = _step.value;

      if (original.contains(element)) {
        restore(original);
        originals["delete"](original);
      }
    } // Collect direct children of the body


    document.querySelectorAll(CHILDREN_SELECTOR).forEach(function (child) {
      if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements
      // Skip the interactables, and the parents of the interactables

      for (var _iterator2 = _createForOfIteratorHelperLoose(interactables), _step2; !(_step2 = _iterator2()).done;) {
        var interactable = _step2.value;
        if (child.contains(interactable)) return;
      } // Keep track of the elements


      if (interactables.size === 1) {
        originals.set(child, {
          'aria-hidden': child.getAttribute('aria-hidden'),
          // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
          inert: child.inert
        }); // Mutate the element

        inert(child);
      }
    });
    onInvalidate(function () {
      // Inert is disabled on the current element
      interactables["delete"](element); // We still have interactable elements, therefore this one and its parent
      // will become inert as well.

      if (interactables.size > 0) {
        // Collect direct children of the body
        document.querySelectorAll(CHILDREN_SELECTOR).forEach(function (child) {
          if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements
          // Skip already inert parents

          if (originals.has(child)) return; // Skip the interactables, and the parents of the interactables

          for (var _iterator3 = _createForOfIteratorHelperLoose(interactables), _step3; !(_step3 = _iterator3()).done;) {
            var interactable = _step3.value;
            if (child.contains(interactable)) return;
          }

          originals.set(child, {
            'aria-hidden': child.getAttribute('aria-hidden'),
            // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
            inert: child.inert
          }); // Mutate the element

          inert(child);
        });
      } else {
        for (var _iterator4 = _createForOfIteratorHelperLoose(originals.keys()), _step4; !(_step4 = _iterator4()).done;) {
          var _element = _step4.value;
          // Restore
          restore(_element); // Cleanup

          originals["delete"](_element);
        }
      }
    });
  });
}

var StackContext = /*#__PURE__*/Symbol('StackContext');
var StackMessage;

(function (StackMessage) {
  StackMessage[StackMessage["AddElement"] = 0] = "AddElement";
  StackMessage[StackMessage["RemoveElement"] = 1] = "RemoveElement";
})(StackMessage || (StackMessage = {}));

function useStackContext() {
  return inject(StackContext, function () {});
}
function useElemenStack(element) {
  var notify = useStackContext();
  watchEffect(function (onInvalidate) {
    var domElement = element == null ? void 0 : element.value;
    if (!domElement) return;
    notify(StackMessage.AddElement, domElement);
    onInvalidate(function () {
      return notify(StackMessage.RemoveElement, domElement);
    });
  });
}
function useStackProvider(onUpdate) {
  var parentUpdate = useStackContext();

  function notify() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Notify our layer
    onUpdate == null ? void 0 : onUpdate.apply(void 0, args); // Notify the parent

    parentUpdate.apply(void 0, args);
  }

  provide(StackContext, notify);
}

var ForcePortalRootContext = /*#__PURE__*/Symbol('ForcePortalRootContext');
function usePortalRoot() {
  return inject(ForcePortalRootContext, false);
}
var ForcePortalRoot = /*#__PURE__*/defineComponent({
  name: 'ForcePortalRoot',
  props: {
    as: {
      type: [Object, String],
      "default": 'template'
    },
    force: {
      type: Boolean,
      "default": false
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    provide(ForcePortalRootContext, props.force);
    return function () {
      var passThroughProps = _objectWithoutPropertiesLoose(props, ["force"]);

      return render$m({
        props: passThroughProps,
        slot: {},
        slots: slots,
        attrs: attrs,
        name: 'ForcePortalRoot'
      });
    };
  }
});

function getPortalRoot() {
  var existingRoot = document.getElementById('headlessui-portal-root');
  if (existingRoot) return existingRoot;
  var root = document.createElement('div');
  root.setAttribute('id', 'headlessui-portal-root');
  return document.body.appendChild(root);
}

var Portal = /*#__PURE__*/defineComponent({
  name: 'Portal',
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    var forcePortalRoot = usePortalRoot();
    var groupContext = inject(PortalGroupContext, null);
    var myTarget = ref(forcePortalRoot === true ? getPortalRoot() : groupContext === null ? getPortalRoot() : groupContext.resolveTarget());
    watchEffect(function () {
      if (forcePortalRoot) return;
      if (groupContext === null) return;
      myTarget.value = groupContext.resolveTarget();
    });
    var element = ref(null);
    useElemenStack(element);
    onUnmounted(function () {
      var root = document.getElementById('headlessui-portal-root');
      if (!root) return;
      if (myTarget.value !== root) return;

      if (myTarget.value.children.length <= 0) {
        var _myTarget$value$paren;

        (_myTarget$value$paren = myTarget.value.parentElement) == null ? void 0 : _myTarget$value$paren.removeChild(myTarget.value);
      }
    });
    useStackProvider();
    return function () {
      if (myTarget.value === null) return null;
      var propsWeControl = {
        ref: element
      };
      return h( // @ts-expect-error Children can be an object, but TypeScript is not happy
      // with it. Once this is fixed upstream we can remove this assertion.
      Teleport, {
        to: myTarget.value
      }, render$m({
        props: _extends({}, props, propsWeControl),
        slot: {},
        attrs: attrs,
        slots: slots,
        name: 'Portal'
      }));
    };
  }
}); // ---

var PortalGroupContext = /*#__PURE__*/Symbol('PortalGroupContext');
var PortalGroup = /*#__PURE__*/defineComponent({
  name: 'PortalGroup',
  props: {
    as: {
      type: [Object, String],
      "default": 'template'
    },
    target: {
      type: Object,
      "default": null
    }
  },
  setup: function setup(props, _ref2) {
    var attrs = _ref2.attrs,
        slots = _ref2.slots;
    var api = reactive({
      resolveTarget: function resolveTarget() {
        return props.target;
      }
    });
    provide(PortalGroupContext, api);
    return function () {
      var passThroughProps = _objectWithoutPropertiesLoose(props, ["target"]);

      return render$m({
        props: passThroughProps,
        slot: {},
        attrs: attrs,
        slots: slots,
        name: 'PortalGroup'
      });
    };
  }
});

var DescriptionContext = /*#__PURE__*/Symbol('DescriptionContext');

function useDescriptions(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$slot = _ref.slot,
      slot = _ref$slot === void 0 ? ref({}) : _ref$slot,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'Description' : _ref$name,
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props;

  var descriptionIds = ref([]);

  function register(value) {
    descriptionIds.value.push(value);
    return function () {
      var idx = descriptionIds.value.indexOf(value);
      if (idx === -1) return;
      descriptionIds.value.splice(idx, 1);
    };
  }

  provide(DescriptionContext, {
    register: register,
    slot: slot,
    name: name,
    props: props
  }); // The actual id's as string or undefined.

  return computed(function () {
    return descriptionIds.value.length > 0 ? descriptionIds.value.join(' ') : undefined;
  });
} // ---

function dom(ref) {
  var _ref$value$$el;

  if (ref == null) return null;
  if (ref.value == null) return null;
  return (_ref$value$$el = ref.value.$el) != null ? _ref$value$$el : ref.value;
}

var Context = /*#__PURE__*/Symbol('Context');
var State;

(function (State) {
  State[State["Open"] = 0] = "Open";
  State[State["Closed"] = 1] = "Closed";
})(State || (State = {}));

function useOpenClosed() {
  return inject(Context, null);
}
function useOpenClosedProvider(value) {
  provide(Context, value);
}

var DialogStates;

(function (DialogStates) {
  DialogStates[DialogStates["Open"] = 0] = "Open";
  DialogStates[DialogStates["Closed"] = 1] = "Closed";
})(DialogStates || (DialogStates = {}));

var DialogContext = /*#__PURE__*/Symbol('DialogContext');

function useDialogContext(component) {
  var context = inject(DialogContext, null);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <Dialog /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDialogContext);
    throw err;
  }

  return context;
} // ---


var Missing = 'DC8F892D-2EBD-447C-A4C8-A03058436FF4';
var Dialog = /*#__PURE__*/defineComponent({
  name: 'Dialog',
  inheritAttrs: false,
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    },
    "static": {
      type: Boolean,
      "default": false
    },
    unmount: {
      type: Boolean,
      "default": true
    },
    open: {
      type: Boolean,
      "default": Missing
    },
    initialFocus: {
      type: Object,
      "default": null
    }
  },
  emits: ['close'],
  render: function render$1() {
    var _this = this;

    var propsWeControl = _extends({}, this.$attrs, {
      ref: 'el',
      id: this.id,
      role: 'dialog',
      'aria-modal': this.dialogState === DialogStates.Open ? true : undefined,
      'aria-labelledby': this.titleId,
      'aria-describedby': this.describedby,
      onClick: this.handleClick,
      onKeydown: this.handleKeyDown
    });

    var _this$$props = this.$props,
        passThroughProps = _objectWithoutPropertiesLoose(_this$$props, ["open", "initialFocus"]);

    var slot = {
      open: this.dialogState === DialogStates.Open
    };
    return h(ForcePortalRoot, {
      force: true
    }, function () {
      return h(Portal, function () {
        return h(PortalGroup, {
          target: _this.dialogRef
        }, function () {
          return h(ForcePortalRoot, {
            force: false
          }, function () {
            return render$m({
              props: _extends({}, passThroughProps, propsWeControl),
              slot: slot,
              attrs: _this.$attrs,
              slots: _this.$slots,
              visible: _this.visible,
              features: Features.RenderStrategy | Features.Static,
              name: 'Dialog'
            });
          });
        });
      });
    });
  },
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var containers = ref(new Set());
    var usesOpenClosedState = useOpenClosed();
    var open = computed(function () {
      // @ts-expect-error We are comparing to a uuid stirng at runtime
      if (props.open === Missing && usesOpenClosedState !== null) {
        var _match;

        // Update the `open` prop based on the open closed state
        return match(usesOpenClosedState.value, (_match = {}, _match[State.Open] = true, _match[State.Closed] = false, _match));
      }

      return props.open;
    }); // Validations
    // @ts-expect-error We are comparing to a uuid stirng at runtime

    var hasOpen = props.open !== Missing || usesOpenClosedState !== null;

    if (!hasOpen) {
      throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
    }

    if (typeof open.value !== 'boolean') {
      throw new Error("You provided an `open` prop to the `Dialog`, but the value is not a boolean. Received: " + (open.value === Missing ? undefined : props.open));
    }

    var dialogState = computed(function () {
      return props.open ? DialogStates.Open : DialogStates.Closed;
    });
    var visible = computed(function () {
      if (usesOpenClosedState !== null) {
        return usesOpenClosedState.value === State.Open;
      }

      return dialogState.value === DialogStates.Open;
    });
    var internalDialogRef = ref(null);
    var enabled = ref(dialogState.value === DialogStates.Open);
    onUpdated(function () {
      enabled.value = dialogState.value === DialogStates.Open;
    });
    var id = "headlessui-dialog-" + useId();
    var focusTrapOptions = computed(function () {
      return {
        initialFocus: props.initialFocus
      };
    });
    useFocusTrap(containers, enabled, focusTrapOptions);
    useInertOthers(internalDialogRef, enabled);
    useStackProvider(function (message, element) {
      var _match2;

      return match(message, (_match2 = {}, _match2[StackMessage.AddElement] = function () {
        containers.value.add(element);
      }, _match2[StackMessage.RemoveElement] = function () {
        containers.value["delete"](element);
      }, _match2));
    });
    var describedby = useDescriptions({
      name: 'DialogDescription',
      slot: computed(function () {
        return {
          open: open.value
        };
      })
    });
    var titleId = ref(null);
    var api = {
      titleId: titleId,
      dialogState: dialogState,
      setTitleId: function setTitleId(id) {
        if (titleId.value === id) return;
        titleId.value = id;
      },
      close: function close() {
        emit('close', false);
      }
    };
    provide(DialogContext, api); // Handle outside click

    useWindowEvent('mousedown', function (event) {
      var target = event.target;
      if (dialogState.value !== DialogStates.Open) return;
      if (containers.value.size !== 1) return;
      if (contains(containers.value, target)) return;
      api.close();
      nextTick(function () {
        return target == null ? void 0 : target.focus();
      });
    }); // Scroll lock

    watchEffect(function (onInvalidate) {
      if (dialogState.value !== DialogStates.Open) return;
      var overflow = document.documentElement.style.overflow;
      var paddingRight = document.documentElement.style.paddingRight;
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.paddingRight = scrollbarWidth + "px";
      onInvalidate(function () {
        document.documentElement.style.overflow = overflow;
        document.documentElement.style.paddingRight = paddingRight;
      });
    }); // Trigger close when the FocusTrap gets hidden

    watchEffect(function (onInvalidate) {
      if (dialogState.value !== DialogStates.Open) return;
      var container = dom(internalDialogRef);
      if (!container) return;
      var observer = new IntersectionObserver(function (entries) {
        for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
          var entry = _step.value;

          if (entry.boundingClientRect.x === 0 && entry.boundingClientRect.y === 0 && entry.boundingClientRect.width === 0 && entry.boundingClientRect.height === 0) {
            api.close();
          }
        }
      });
      observer.observe(container);
      onInvalidate(function () {
        return observer.disconnect();
      });
    });
    return {
      id: id,
      el: internalDialogRef,
      dialogRef: internalDialogRef,
      containers: containers,
      dialogState: dialogState,
      titleId: titleId,
      describedby: describedby,
      visible: visible,
      open: open,
      handleClick: function handleClick(event) {
        event.stopPropagation();
      },
      // Handle `Escape` to close
      handleKeyDown: function handleKeyDown(event) {
        if (event.key !== Keys.Escape) return;
        if (dialogState.value !== DialogStates.Open) return;
        if (containers.value.size > 1) return; // 1 is myself, otherwise other elements in the Stack

        event.preventDefault();
        event.stopPropagation();
        api.close();
      }
    };
  }
}); // ---

var DialogOverlay = /*#__PURE__*/defineComponent({
  name: 'DialogOverlay',
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    }
  },
  render: function render$1() {
    var api = useDialogContext('DialogOverlay');
    var propsWeControl = {
      ref: 'el',
      id: this.id,
      'aria-hidden': true,
      onClick: this.handleClick
    };
    var passThroughProps = this.$props;
    return render$m({
      props: _extends({}, passThroughProps, propsWeControl),
      slot: {
        open: api.dialogState.value === DialogStates.Open
      },
      attrs: this.$attrs,
      slots: this.$slots,
      name: 'DialogOverlay'
    });
  },
  setup: function setup() {
    var api = useDialogContext('DialogOverlay');
    var id = "headlessui-dialog-overlay-" + useId();
    return {
      id: id,
      handleClick: function handleClick(event) {
        event.preventDefault();
        event.stopPropagation();
        api.close();
      }
    };
  }
}); // ---

var DialogTitle = /*#__PURE__*/defineComponent({
  name: 'DialogTitle',
  props: {
    as: {
      type: [Object, String],
      "default": 'h2'
    }
  },
  render: function render$1() {
    var api = useDialogContext('DialogTitle');
    var propsWeControl = {
      id: this.id
    };
    var passThroughProps = this.$props;
    return render$m({
      props: _extends({}, passThroughProps, propsWeControl),
      slot: {
        open: api.dialogState.value === DialogStates.Open
      },
      attrs: this.$attrs,
      slots: this.$slots,
      name: 'DialogTitle'
    });
  },
  setup: function setup() {
    var api = useDialogContext('DialogTitle');
    var id = "headlessui-dialog-title-" + useId();
    onMounted(function () {
      api.setTitleId(id);
      onUnmounted(function () {
        return api.setTitleId(null);
      });
    });
    return {
      id: id
    };
  }
}); // ---

var DisclosureStates;

(function (DisclosureStates) {
  DisclosureStates[DisclosureStates["Open"] = 0] = "Open";
  DisclosureStates[DisclosureStates["Closed"] = 1] = "Closed";
})(DisclosureStates || (DisclosureStates = {}));

var DisclosureContext = /*#__PURE__*/Symbol('DisclosureContext');

function useDisclosureContext(component) {
  var context = inject(DisclosureContext, null);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <Disclosure /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDisclosureContext);
    throw err;
  }

  return context;
} // ---


var Disclosure = /*#__PURE__*/defineComponent({
  name: 'Disclosure',
  props: {
    as: {
      type: [Object, String],
      "default": 'template'
    },
    defaultOpen: {
      type: [Boolean],
      "default": false
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    var disclosureState = ref(props.defaultOpen ? DisclosureStates.Open : DisclosureStates.Closed);
    var panelRef = ref(null);
    var api = {
      disclosureState: disclosureState,
      panelRef: panelRef,
      toggleDisclosure: function toggleDisclosure() {
        var _match;

        disclosureState.value = match(disclosureState.value, (_match = {}, _match[DisclosureStates.Open] = DisclosureStates.Closed, _match[DisclosureStates.Closed] = DisclosureStates.Open, _match));
      }
    };
    provide(DisclosureContext, api);
    useOpenClosedProvider(computed(function () {
      var _match2;

      return match(disclosureState.value, (_match2 = {}, _match2[DisclosureStates.Open] = State.Open, _match2[DisclosureStates.Closed] = State.Closed, _match2));
    }));
    return function () {
      var passThroughProps = _objectWithoutPropertiesLoose(props, ["defaultOpen"]);

      var slot = {
        open: disclosureState.value === DisclosureStates.Open
      };
      return render$m({
        props: passThroughProps,
        slot: slot,
        slots: slots,
        attrs: attrs,
        name: 'Disclosure'
      });
    };
  }
}); // ---

var DisclosureButton = /*#__PURE__*/defineComponent({
  name: 'DisclosureButton',
  props: {
    as: {
      type: [Object, String],
      "default": 'button'
    },
    disabled: {
      type: [Boolean],
      "default": false
    }
  },
  render: function render$1() {
    var api = useDisclosureContext('DisclosureButton');
    var slot = {
      open: api.disclosureState.value === DisclosureStates.Open
    };
    var propsWeControl = {
      id: this.id,
      type: 'button',
      'aria-expanded': api.disclosureState.value === DisclosureStates.Open ? true : undefined,
      'aria-controls': this.ariaControls,
      onClick: this.handleClick,
      onKeydown: this.handleKeyDown,
      onKeyup: this.handleKeyUp
    };
    return render$m({
      props: _extends({}, this.$props, propsWeControl),
      slot: slot,
      attrs: this.$attrs,
      slots: this.$slots,
      name: 'DisclosureButton'
    });
  },
  setup: function setup(props) {
    var api = useDisclosureContext('DisclosureButton');
    var buttonId = "headlessui-disclosure-button-" + useId();
    var ariaControls = computed(function () {
      var _dom$id, _dom;

      return (_dom$id = (_dom = dom(api.panelRef)) == null ? void 0 : _dom.id) != null ? _dom$id : undefined;
    });
    return {
      id: buttonId,
      ariaControls: ariaControls,
      handleClick: function handleClick() {
        if (props.disabled) return;
        api.toggleDisclosure();
      },
      handleKeyDown: function handleKeyDown(event) {
        if (props.disabled) return;

        switch (event.key) {
          case Keys.Space:
          case Keys.Enter:
            event.preventDefault();
            event.stopPropagation();
            api.toggleDisclosure();
            break;
        }
      },
      handleKeyUp: function handleKeyUp(event) {
        switch (event.key) {
          case Keys.Space:
            // Required for firefox, event.preventDefault() in handleKeyDown for
            // the Space key doesn't cancel the handleKeyUp, which in turn
            // triggers a *click*.
            event.preventDefault();
            break;
        }
      }
    };
  }
}); // ---

var DisclosurePanel = /*#__PURE__*/defineComponent({
  name: 'DisclosurePanel',
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    },
    "static": {
      type: Boolean,
      "default": false
    },
    unmount: {
      type: Boolean,
      "default": true
    }
  },
  render: function render$1() {
    var api = useDisclosureContext('DisclosurePanel');
    var slot = {
      open: api.disclosureState.value === DisclosureStates.Open
    };
    var propsWeControl = {
      id: this.id,
      ref: 'el'
    };
    return render$m({
      props: _extends({}, this.$props, propsWeControl),
      slot: slot,
      attrs: this.$attrs,
      slots: this.$slots,
      features: Features.RenderStrategy | Features.Static,
      visible: this.visible,
      name: 'DisclosurePanel'
    });
  },
  setup: function setup() {
    var api = useDisclosureContext('DisclosurePanel');
    var panelId = "headlessui-disclosure-panel-" + useId();
    var usesOpenClosedState = useOpenClosed();
    var visible = computed(function () {
      if (usesOpenClosedState !== null) {
        return usesOpenClosedState.value === State.Open;
      }

      return api.disclosureState.value === DisclosureStates.Open;
    });
    return {
      id: panelId,
      el: api.panelRef,
      visible: visible
    };
  }
});

function assertNever(x) {
  throw new Error('Unexpected object: ' + x);
}

var Focus$1;

(function (Focus) {
  /** Focus the first non-disabled item. */
  Focus[Focus["First"] = 0] = "First";
  /** Focus the previous non-disabled item. */

  Focus[Focus["Previous"] = 1] = "Previous";
  /** Focus the next non-disabled item. */

  Focus[Focus["Next"] = 2] = "Next";
  /** Focus the last non-disabled item. */

  Focus[Focus["Last"] = 3] = "Last";
  /** Focus a specific item based on the `id` of the item. */

  Focus[Focus["Specific"] = 4] = "Specific";
  /** Focus no items at all. */

  Focus[Focus["Nothing"] = 5] = "Nothing";
})(Focus$1 || (Focus$1 = {}));

function calculateActiveIndex(action, resolvers) {
  var items = resolvers.resolveItems();
  if (items.length <= 0) return null;
  var currentActiveIndex = resolvers.resolveActiveIndex();
  var activeIndex = currentActiveIndex != null ? currentActiveIndex : -1;

  var nextActiveIndex = function () {
    switch (action.focus) {
      case Focus$1.First:
        return items.findIndex(function (item) {
          return !resolvers.resolveDisabled(item);
        });

      case Focus$1.Previous:
        {
          var idx = items.slice().reverse().findIndex(function (item, idx, all) {
            if (activeIndex !== -1 && all.length - idx - 1 >= activeIndex) return false;
            return !resolvers.resolveDisabled(item);
          });
          if (idx === -1) return idx;
          return items.length - 1 - idx;
        }

      case Focus$1.Next:
        return items.findIndex(function (item, idx) {
          if (idx <= activeIndex) return false;
          return !resolvers.resolveDisabled(item);
        });

      case Focus$1.Last:
        {
          var _idx = items.slice().reverse().findIndex(function (item) {
            return !resolvers.resolveDisabled(item);
          });

          if (_idx === -1) return _idx;
          return items.length - 1 - _idx;
        }

      case Focus$1.Specific:
        return items.findIndex(function (item) {
          return resolvers.resolveId(item) === action.id;
        });

      case Focus$1.Nothing:
        return null;

      default:
        assertNever(action);
    }
  }();

  return nextActiveIndex === -1 ? currentActiveIndex : nextActiveIndex;
}

function resolvePropValue(property, bag) {
  if (property === undefined) return undefined;
  if (typeof property === 'function') return property(bag);
  return property;
}

var ListboxStates;

(function (ListboxStates) {
  ListboxStates[ListboxStates["Open"] = 0] = "Open";
  ListboxStates[ListboxStates["Closed"] = 1] = "Closed";
})(ListboxStates || (ListboxStates = {}));

function useTreeWalker(_ref) {
  var container = _ref.container,
      accept = _ref.accept,
      walk = _ref.walk,
      enabled = _ref.enabled;
  watchEffect(function () {
    var root = container.value;
    if (!root) return;
    if (enabled !== undefined && !enabled.value) return;
    var acceptNode = Object.assign(function (node) {
      return accept(node);
    }, {
      acceptNode: accept
    });
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, acceptNode, false);

    while (walker.nextNode()) {
      walk(walker.currentNode);
    }
  });
}

var MenuStates;

(function (MenuStates) {
  MenuStates[MenuStates["Open"] = 0] = "Open";
  MenuStates[MenuStates["Closed"] = 1] = "Closed";
})(MenuStates || (MenuStates = {}));

function nextFrame$1(cb) {
  requestAnimationFrame(function () {
    return requestAnimationFrame(cb);
  });
}

var MenuContext = /*#__PURE__*/Symbol('MenuContext');

function useMenuContext(component) {
  var context = inject(MenuContext, null);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <Menu /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useMenuContext);
    throw err;
  }

  return context;
}

var Menu = /*#__PURE__*/defineComponent({
  name: 'Menu',
  props: {
    as: {
      type: [Object, String],
      "default": 'template'
    }
  },
  setup: function setup(props, _ref) {
    var slots = _ref.slots,
        attrs = _ref.attrs;
    var menuState = ref(MenuStates.Closed);
    var buttonRef = ref(null);
    var itemsRef = ref(null);
    var items = ref([]);
    var searchQuery = ref('');
    var activeItemIndex = ref(null);
    var api = {
      menuState: menuState,
      buttonRef: buttonRef,
      itemsRef: itemsRef,
      items: items,
      searchQuery: searchQuery,
      activeItemIndex: activeItemIndex,
      closeMenu: function closeMenu() {
        menuState.value = MenuStates.Closed;
        activeItemIndex.value = null;
      },
      openMenu: function openMenu() {
        return menuState.value = MenuStates.Open;
      },
      goToItem: function goToItem(focus, id) {
        var nextActiveItemIndex = calculateActiveIndex(focus === Focus$1.Specific ? {
          focus: Focus$1.Specific,
          id: id
        } : {
          focus: focus
        }, {
          resolveItems: function resolveItems() {
            return items.value;
          },
          resolveActiveIndex: function resolveActiveIndex() {
            return activeItemIndex.value;
          },
          resolveId: function resolveId(item) {
            return item.id;
          },
          resolveDisabled: function resolveDisabled(item) {
            return item.dataRef.disabled;
          }
        });
        if (searchQuery.value === '' && activeItemIndex.value === nextActiveItemIndex) return;
        searchQuery.value = '';
        activeItemIndex.value = nextActiveItemIndex;
      },
      search: function search(value) {
        searchQuery.value += value.toLowerCase();
        var match = items.value.findIndex(function (item) {
          return item.dataRef.textValue.startsWith(searchQuery.value) && !item.dataRef.disabled;
        });
        if (match === -1 || match === activeItemIndex.value) return;
        activeItemIndex.value = match;
      },
      clearSearch: function clearSearch() {
        searchQuery.value = '';
      },
      registerItem: function registerItem(id, dataRef) {
        // @ts-expect-error The expected type comes from property 'dataRef' which is declared here on type '{ id: string; dataRef: { textValue: string; disabled: boolean; }; }'
        items.value.push({
          id: id,
          dataRef: dataRef
        });
      },
      unregisterItem: function unregisterItem(id) {
        var nextItems = items.value.slice();
        var currentActiveItem = activeItemIndex.value !== null ? nextItems[activeItemIndex.value] : null;
        var idx = nextItems.findIndex(function (a) {
          return a.id === id;
        });
        if (idx !== -1) nextItems.splice(idx, 1);
        items.value = nextItems;

        activeItemIndex.value = function () {
          if (idx === activeItemIndex.value) return null;
          if (currentActiveItem === null) return null; // If we removed the item before the actual active index, then it would be out of sync. To
          // fix this, we will find the correct (new) index position.

          return nextItems.indexOf(currentActiveItem);
        }();
      }
    };
    useWindowEvent('mousedown', function (event) {
      var _dom, _dom2, _dom3;

      var target = event.target;
      var active = document.activeElement;
      if (menuState.value !== MenuStates.Open) return;
      if ((_dom = dom(buttonRef)) == null ? void 0 : _dom.contains(target)) return;
      if (!((_dom2 = dom(itemsRef)) == null ? void 0 : _dom2.contains(target))) api.closeMenu();
      if (active !== document.body && (active == null ? void 0 : active.contains(target))) return; // Keep focus on newly clicked/focused element

      if (!event.defaultPrevented) (_dom3 = dom(buttonRef)) == null ? void 0 : _dom3.focus({
        preventScroll: true
      });
    }); // @ts-expect-error Types of property 'dataRef' are incompatible.

    provide(MenuContext, api);
    useOpenClosedProvider(computed(function () {
      var _match;

      return match(menuState.value, (_match = {}, _match[MenuStates.Open] = State.Open, _match[MenuStates.Closed] = State.Closed, _match));
    }));
    return function () {
      var slot = {
        open: menuState.value === MenuStates.Open
      };
      return render$m({
        props: props,
        slot: slot,
        slots: slots,
        attrs: attrs,
        name: 'Menu'
      });
    };
  }
});
var MenuButton = /*#__PURE__*/defineComponent({
  name: 'MenuButton',
  props: {
    disabled: {
      type: Boolean,
      "default": false
    },
    as: {
      type: [Object, String],
      "default": 'button'
    }
  },
  render: function render$1() {
    var _dom4;

    var api = useMenuContext('MenuButton');
    var slot = {
      open: api.menuState.value === MenuStates.Open
    };
    var propsWeControl = {
      ref: 'el',
      id: this.id,
      type: 'button',
      'aria-haspopup': true,
      'aria-controls': (_dom4 = dom(api.itemsRef)) == null ? void 0 : _dom4.id,
      'aria-expanded': api.menuState.value === MenuStates.Open ? true : undefined,
      onKeydown: this.handleKeyDown,
      onKeyup: this.handleKeyUp,
      onClick: this.handleClick
    };
    return render$m({
      props: _extends({}, this.$props, propsWeControl),
      slot: slot,
      attrs: this.$attrs,
      slots: this.$slots,
      name: 'MenuButton'
    });
  },
  setup: function setup(props) {
    var api = useMenuContext('MenuButton');
    var id = "headlessui-menu-button-" + useId();

    function handleKeyDown(event) {
      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
        case Keys.Space:
        case Keys.Enter:
        case Keys.ArrowDown:
          event.preventDefault();
          event.stopPropagation();
          api.openMenu();
          nextTick(function () {
            var _dom5;

            (_dom5 = dom(api.itemsRef)) == null ? void 0 : _dom5.focus({
              preventScroll: true
            });
            api.goToItem(Focus$1.First);
          });
          break;

        case Keys.ArrowUp:
          event.preventDefault();
          event.stopPropagation();
          api.openMenu();
          nextTick(function () {
            var _dom6;

            (_dom6 = dom(api.itemsRef)) == null ? void 0 : _dom6.focus({
              preventScroll: true
            });
            api.goToItem(Focus$1.Last);
          });
          break;
      }
    }

    function handleKeyUp(event) {
      switch (event.key) {
        case Keys.Space:
          // Required for firefox, event.preventDefault() in handleKeyDown for
          // the Space key doesn't cancel the handleKeyUp, which in turn
          // triggers a *click*.
          event.preventDefault();
          break;
      }
    }

    function handleClick(event) {
      if (props.disabled) return;

      if (api.menuState.value === MenuStates.Open) {
        api.closeMenu();
        nextTick(function () {
          var _dom7;

          return (_dom7 = dom(api.buttonRef)) == null ? void 0 : _dom7.focus({
            preventScroll: true
          });
        });
      } else {
        event.preventDefault();
        event.stopPropagation();
        api.openMenu();
        nextFrame$1(function () {
          var _dom8;

          return (_dom8 = dom(api.itemsRef)) == null ? void 0 : _dom8.focus({
            preventScroll: true
          });
        });
      }
    }

    return {
      id: id,
      el: api.buttonRef,
      handleKeyDown: handleKeyDown,
      handleKeyUp: handleKeyUp,
      handleClick: handleClick
    };
  }
});
var MenuItems = /*#__PURE__*/defineComponent({
  name: 'MenuItems',
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    },
    "static": {
      type: Boolean,
      "default": false
    },
    unmount: {
      type: Boolean,
      "default": true
    }
  },
  render: function render$1() {
    var _api$items$value$api$, _dom9;

    var api = useMenuContext('MenuItems');
    var slot = {
      open: api.menuState.value === MenuStates.Open
    };
    var propsWeControl = {
      'aria-activedescendant': api.activeItemIndex.value === null ? undefined : (_api$items$value$api$ = api.items.value[api.activeItemIndex.value]) == null ? void 0 : _api$items$value$api$.id,
      'aria-labelledby': (_dom9 = dom(api.buttonRef)) == null ? void 0 : _dom9.id,
      id: this.id,
      onKeydown: this.handleKeyDown,
      onKeyup: this.handleKeyUp,
      role: 'menu',
      tabIndex: 0,
      ref: 'el'
    };
    var passThroughProps = this.$props;
    return render$m({
      props: _extends({}, passThroughProps, propsWeControl),
      slot: slot,
      attrs: this.$attrs,
      slots: this.$slots,
      features: Features.RenderStrategy | Features.Static,
      visible: this.visible,
      name: 'MenuItems'
    });
  },
  setup: function setup() {
    var api = useMenuContext('MenuItems');
    var id = "headlessui-menu-items-" + useId();
    var searchDebounce = ref(null);
    useTreeWalker({
      container: computed(function () {
        return dom(api.itemsRef);
      }),
      enabled: computed(function () {
        return api.menuState.value === MenuStates.Open;
      }),
      accept: function accept(node) {
        if (node.getAttribute('role') === 'menuitem') return NodeFilter.FILTER_REJECT;
        if (node.hasAttribute('role')) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
      walk: function walk(node) {
        node.setAttribute('role', 'none');
      }
    });

    function handleKeyDown(event) {
      if (searchDebounce.value) clearTimeout(searchDebounce.value);

      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
        // @ts-expect-error Fallthrough is expected here
        case Keys.Space:
          if (api.searchQuery.value !== '') {
            event.preventDefault();
            event.stopPropagation();
            return api.search(event.key);
          }

        // When in type ahead mode, fallthrough

        case Keys.Enter:
          event.preventDefault();
          event.stopPropagation();

          if (api.activeItemIndex.value !== null) {
            var _document$getElementB;

            var _id = api.items.value[api.activeItemIndex.value].id;
            (_document$getElementB = document.getElementById(_id)) == null ? void 0 : _document$getElementB.click();
          }

          api.closeMenu();
          nextTick(function () {
            var _dom10;

            return (_dom10 = dom(api.buttonRef)) == null ? void 0 : _dom10.focus({
              preventScroll: true
            });
          });
          break;

        case Keys.ArrowDown:
          event.preventDefault();
          event.stopPropagation();
          return api.goToItem(Focus$1.Next);

        case Keys.ArrowUp:
          event.preventDefault();
          event.stopPropagation();
          return api.goToItem(Focus$1.Previous);

        case Keys.Home:
        case Keys.PageUp:
          event.preventDefault();
          event.stopPropagation();
          return api.goToItem(Focus$1.First);

        case Keys.End:
        case Keys.PageDown:
          event.preventDefault();
          event.stopPropagation();
          return api.goToItem(Focus$1.Last);

        case Keys.Escape:
          event.preventDefault();
          event.stopPropagation();
          api.closeMenu();
          nextTick(function () {
            var _dom11;

            return (_dom11 = dom(api.buttonRef)) == null ? void 0 : _dom11.focus({
              preventScroll: true
            });
          });
          break;

        case Keys.Tab:
          event.preventDefault();
          event.stopPropagation();
          break;

        default:
          if (event.key.length === 1) {
            api.search(event.key);
            searchDebounce.value = setTimeout(function () {
              return api.clearSearch();
            }, 350);
          }

          break;
      }
    }

    function handleKeyUp(event) {
      switch (event.key) {
        case Keys.Space:
          // Required for firefox, event.preventDefault() in handleKeyDown for
          // the Space key doesn't cancel the handleKeyUp, which in turn
          // triggers a *click*.
          event.preventDefault();
          break;
      }
    }

    var usesOpenClosedState = useOpenClosed();
    var visible = computed(function () {
      if (usesOpenClosedState !== null) {
        return usesOpenClosedState.value === State.Open;
      }

      return api.menuState.value === MenuStates.Open;
    });
    return {
      id: id,
      el: api.itemsRef,
      handleKeyDown: handleKeyDown,
      handleKeyUp: handleKeyUp,
      visible: visible
    };
  }
});
var MenuItem = /*#__PURE__*/defineComponent({
  name: 'MenuItem',
  props: {
    as: {
      type: [Object, String],
      "default": 'template'
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    "class": {
      type: [String, Function],
      required: false
    },
    className: {
      type: [String, Function],
      required: false
    }
  },
  setup: function setup(props, _ref2) {
    var slots = _ref2.slots,
        attrs = _ref2.attrs;
    var api = useMenuContext('MenuItem');
    var id = "headlessui-menu-item-" + useId();
    var disabled = props.disabled,
        defaultClass = props["class"],
        _props$className = props.className,
        className = _props$className === void 0 ? defaultClass : _props$className;
    var active = computed(function () {
      return api.activeItemIndex.value !== null ? api.items.value[api.activeItemIndex.value].id === id : false;
    });
    var dataRef = ref({
      disabled: disabled,
      textValue: ''
    });
    onMounted(function () {
      var _document$getElementB2, _document$getElementB3;

      var textValue = (_document$getElementB2 = document.getElementById(id)) == null ? void 0 : (_document$getElementB3 = _document$getElementB2.textContent) == null ? void 0 : _document$getElementB3.toLowerCase().trim();
      if (textValue !== undefined) dataRef.value.textValue = textValue;
    });
    onMounted(function () {
      return api.registerItem(id, dataRef);
    });
    onUnmounted(function () {
      return api.unregisterItem(id);
    });
    watchEffect(function () {
      if (api.menuState.value !== MenuStates.Open) return;
      if (!active.value) return;
      nextTick(function () {
        var _document$getElementB4;

        return (_document$getElementB4 = document.getElementById(id)) == null ? void 0 : _document$getElementB4.scrollIntoView == null ? void 0 : _document$getElementB4.scrollIntoView({
          block: 'nearest'
        });
      });
    });

    function handleClick(event) {
      if (disabled) return event.preventDefault();
      api.closeMenu();
      nextTick(function () {
        var _dom12;

        return (_dom12 = dom(api.buttonRef)) == null ? void 0 : _dom12.focus({
          preventScroll: true
        });
      });
    }

    function handleFocus() {
      if (disabled) return api.goToItem(Focus$1.Nothing);
      api.goToItem(Focus$1.Specific, id);
    }

    function handleMove() {
      if (disabled) return;
      if (active.value) return;
      api.goToItem(Focus$1.Specific, id);
    }

    function handleLeave() {
      if (disabled) return;
      if (!active.value) return;
      api.goToItem(Focus$1.Nothing);
    }

    return function () {
      var slot = {
        active: active.value,
        disabled: disabled
      };
      var propsWeControl = {
        id: id,
        role: 'menuitem',
        tabIndex: -1,
        "class": resolvePropValue(className, slot),
        'aria-disabled': disabled === true ? true : undefined,
        onClick: handleClick,
        onFocus: handleFocus,
        onPointermove: handleMove,
        onMousemove: handleMove,
        onPointerleave: handleLeave,
        onMouseleave: handleLeave
      };
      return render$m({
        props: _extends({}, props, propsWeControl),
        slot: slot,
        attrs: attrs,
        slots: slots,
        name: 'MenuItem'
      });
    };
  }
});

var PopoverStates;

(function (PopoverStates) {
  PopoverStates[PopoverStates["Open"] = 0] = "Open";
  PopoverStates[PopoverStates["Closed"] = 1] = "Closed";
})(PopoverStates || (PopoverStates = {}));

var OptionState;

(function (OptionState) {
  OptionState[OptionState["Empty"] = 1] = "Empty";
  OptionState[OptionState["Active"] = 2] = "Active";
})(OptionState || (OptionState = {}));

function once(cb) {
  var state = {
    called: false
  };
  return function () {
    if (state.called) return;
    state.called = true;
    return cb.apply(void 0, arguments);
  };
}

function disposables() {
  var disposables = [];
  var api = {
    requestAnimationFrame: function (_requestAnimationFrame) {
      function requestAnimationFrame() {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function () {
      var raf = requestAnimationFrame.apply(void 0, arguments);
      api.add(function () {
        return cancelAnimationFrame(raf);
      });
    }),
    nextFrame: function nextFrame() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      api.requestAnimationFrame(function () {
        api.requestAnimationFrame.apply(api, args);
      });
    },
    setTimeout: function (_setTimeout) {
      function setTimeout() {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function () {
      var timer = setTimeout.apply(void 0, arguments);
      api.add(function () {
        return clearTimeout(timer);
      });
    }),
    add: function add(cb) {
      disposables.push(cb);
    },
    dispose: function dispose() {
      for (var _iterator = _createForOfIteratorHelperLoose(disposables.splice(0)), _step; !(_step = _iterator()).done;) {
        var dispose = _step.value;
        dispose();
      }
    }
  };
  return api;
}

function addClasses(node) {
  var _node$classList;

  for (var _len = arguments.length, classes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classes[_key - 1] = arguments[_key];
  }

  node && classes.length > 0 && (_node$classList = node.classList).add.apply(_node$classList, classes);
}

function removeClasses(node) {
  var _node$classList2;

  for (var _len2 = arguments.length, classes = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classes[_key2 - 1] = arguments[_key2];
  }

  node && classes.length > 0 && (_node$classList2 = node.classList).remove.apply(_node$classList2, classes);
}

var Reason;

(function (Reason) {
  Reason["Finished"] = "finished";
  Reason["Cancelled"] = "cancelled";
})(Reason || (Reason = {}));

function waitForTransition(node, done) {
  var d = disposables();
  if (!node) return d.dispose; // Safari returns a comma separated list of values, so let's sort them and take the highest value.

  var _getComputedStyle = getComputedStyle(node),
      transitionDuration = _getComputedStyle.transitionDuration,
      transitionDelay = _getComputedStyle.transitionDelay;

  var _map = [transitionDuration, transitionDelay].map(function (value) {
    var _value$split$filter$m = value.split(',') // Remove falseys we can't work with
    .filter(Boolean) // Values are returned as `0.3s` or `75ms`
    .map(function (v) {
      return v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000;
    }).sort(function (a, z) {
      return z - a;
    }),
        _value$split$filter$m2 = _value$split$filter$m[0],
        resolvedValue = _value$split$filter$m2 === void 0 ? 0 : _value$split$filter$m2;

    return resolvedValue;
  }),
      durationMs = _map[0],
      delaysMs = _map[1]; // Waiting for the transition to end. We could use the `transitionend` event, however when no
  // actual transition/duration is defined then the `transitionend` event is not fired.
  //
  // TODO: Downside is, when you slow down transitions via devtools this timeout is still using the
  // full 100% speed instead of the 25% or 10%.


  if (durationMs !== 0) {
    d.setTimeout(function () {
      return done(Reason.Finished);
    }, durationMs + delaysMs);
  } else {
    // No transition is happening, so we should cleanup already. Otherwise we have to wait until we
    // get disposed.
    done(Reason.Finished);
  } // If we get disposed before the timeout runs we should cleanup anyway


  d.add(function () {
    return done(Reason.Cancelled);
  });
  return d.dispose;
}

function transition(node, base, from, to, done) {
  var d = disposables();

  var _done = done !== undefined ? once(done) : function () {};

  addClasses.apply(void 0, [node].concat(base, from));
  d.nextFrame(function () {
    removeClasses.apply(void 0, [node].concat(from));
    addClasses.apply(void 0, [node].concat(to));
    d.add(waitForTransition(node, function (reason) {
      removeClasses.apply(void 0, [node].concat(to, base));
      return _done(reason);
    }));
  }); // Once we get disposed, we should ensure that we cleanup after ourselves. In case of an unmount,
  // the node itself will be nullified and will be a no-op. In case of a full transition the classes
  // are already removed which is also a no-op. However if you go from enter -> leave mid-transition
  // then we have some leftovers that should be cleaned.

  d.add(function () {
    return removeClasses.apply(void 0, [node].concat(base, from, to));
  }); // When we get disposed early, than we should also call the done method but switch the reason.

  d.add(function () {
    return _done(Reason.Cancelled);
  });
  return d.dispose;
}

function splitClasses(classes) {
  if (classes === void 0) {
    classes = '';
  }

  return classes.split(' ').filter(function (className) {
    return className.trim().length > 1;
  });
}

var TransitionContext = /*#__PURE__*/Symbol('TransitionContext');
var TreeStates;

(function (TreeStates) {
  TreeStates["Visible"] = "visible";
  TreeStates["Hidden"] = "hidden";
})(TreeStates || (TreeStates = {}));

function useTransitionContext() {
  var context = inject(TransitionContext, null);

  if (context === null) {
    throw new Error('A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.');
  }

  return context;
}

function useParentNesting() {
  var context = inject(NestingContext, null);

  if (context === null) {
    throw new Error('A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.');
  }

  return context;
}

var NestingContext = /*#__PURE__*/Symbol('NestingContext');

function hasChildren(bag) {
  if ('children' in bag) return hasChildren(bag.children);
  return bag.value.filter(function (_ref) {
    var state = _ref.state;
    return state === TreeStates.Visible;
  }).length > 0;
}

function useNesting(done) {
  var transitionableChildren = ref([]);
  var mounted = ref(false);
  onMounted(function () {
    return mounted.value = true;
  });
  onUnmounted(function () {
    return mounted.value = false;
  });

  function unregister(childId, strategy) {
    var _match;

    if (strategy === void 0) {
      strategy = RenderStrategy.Hidden;
    }

    var idx = transitionableChildren.value.findIndex(function (_ref2) {
      var id = _ref2.id;
      return id === childId;
    });
    if (idx === -1) return;
    match(strategy, (_match = {}, _match[RenderStrategy.Unmount] = function () {
      transitionableChildren.value.splice(idx, 1);
    }, _match[RenderStrategy.Hidden] = function () {
      transitionableChildren.value[idx].state = TreeStates.Hidden;
    }, _match));

    if (!hasChildren(transitionableChildren) && mounted.value) {
      done == null ? void 0 : done();
    }
  }

  function register(childId) {
    var child = transitionableChildren.value.find(function (_ref3) {
      var id = _ref3.id;
      return id === childId;
    });

    if (!child) {
      transitionableChildren.value.push({
        id: childId,
        state: TreeStates.Visible
      });
    } else if (child.state !== TreeStates.Visible) {
      child.state = TreeStates.Visible;
    }

    return function () {
      return unregister(childId, RenderStrategy.Unmount);
    };
  }

  return {
    children: transitionableChildren,
    register: register,
    unregister: unregister
  };
} // ---


var TransitionChildRenderFeatures = Features.RenderStrategy;
var TransitionChild = /*#__PURE__*/defineComponent({
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    },
    show: {
      type: [Boolean],
      "default": null
    },
    unmount: {
      type: [Boolean],
      "default": true
    },
    appear: {
      type: [Boolean],
      "default": false
    },
    enter: {
      type: [String],
      "default": ''
    },
    enterFrom: {
      type: [String],
      "default": ''
    },
    enterTo: {
      type: [String],
      "default": ''
    },
    leave: {
      type: [String],
      "default": ''
    },
    leaveFrom: {
      type: [String],
      "default": ''
    },
    leaveTo: {
      type: [String],
      "default": ''
    }
  },
  emits: ['beforeEnter', 'afterEnter', 'beforeLeave', 'afterLeave'],
  render: function render$1() {
    var _this$$props = this.$props,
        rest = _objectWithoutPropertiesLoose(_this$$props, ["appear", "show", "enter", "enterFrom", "enterTo", "leave", "leaveFrom", "leaveTo"]);

    var propsWeControl = {
      ref: 'el'
    };
    var passthroughProps = rest;
    return render$m({
      props: _extends({}, passthroughProps, propsWeControl),
      slot: {},
      slots: this.$slots,
      attrs: this.$attrs,
      features: TransitionChildRenderFeatures,
      visible: this.state === TreeStates.Visible,
      name: 'TransitionChild'
    });
  },
  setup: function setup(props, _ref4) {
    var emit = _ref4.emit;
    var container = ref(null);
    var state = ref(TreeStates.Visible);
    var strategy = computed(function () {
      return props.unmount ? RenderStrategy.Unmount : RenderStrategy.Hidden;
    });

    var _useTransitionContext = useTransitionContext(),
        show = _useTransitionContext.show,
        appear = _useTransitionContext.appear;

    var _useParentNesting = useParentNesting(),
        register = _useParentNesting.register,
        unregister = _useParentNesting.unregister;

    var initial = {
      value: true
    };
    var id = useId();
    var isTransitioning = {
      value: false
    };
    var nesting = useNesting(function () {
      // When all children have been unmounted we can only hide ourselves if and only if we are not
      // transitioning ourselves. Otherwise we would unmount before the transitions are finished.
      if (!isTransitioning.value) {
        state.value = TreeStates.Hidden;
        unregister(id);
        emit('afterLeave');
      }
    });
    onMounted(function () {
      var unregister = register(id);
      onUnmounted(unregister);
    });
    watchEffect(function () {
      var _match2;

      // If we are in another mode than the Hidden mode then ignore
      if (strategy.value !== RenderStrategy.Hidden) return;
      if (!id) return; // Make sure that we are visible

      if (show && state.value !== TreeStates.Visible) {
        state.value = TreeStates.Visible;
        return;
      }

      match(state.value, (_match2 = {}, _match2[TreeStates.Hidden] = function () {
        return unregister(id);
      }, _match2[TreeStates.Visible] = function () {
        return register(id);
      }, _match2));
    });
    var enterClasses = splitClasses(props.enter);
    var enterFromClasses = splitClasses(props.enterFrom);
    var enterToClasses = splitClasses(props.enterTo);
    var leaveClasses = splitClasses(props.leave);
    var leaveFromClasses = splitClasses(props.leaveFrom);
    var leaveToClasses = splitClasses(props.leaveTo);
    onMounted(function () {
      watchEffect(function () {
        if (state.value === TreeStates.Visible) {
          var domElement = dom(container); // When you return `null` from a component, the actual DOM reference will
          // be an empty comment... This means that we can never check for the DOM
          // node to be `null`. So instead we check for an empty comment.

          var isEmptyDOMNode = domElement instanceof Comment && domElement.data === '';

          if (isEmptyDOMNode) {
            throw new Error('Did you forget to passthrough the `ref` to the actual DOM node?');
          }
        }
      });
    });

    function executeTransition(onInvalidate) {
      // Skipping initial transition
      var skip = initial.value && !appear.value;
      var node = dom(container);
      if (!node || !(node instanceof HTMLElement)) return;
      if (skip) return;
      isTransitioning.value = true;
      if (show.value) emit('beforeEnter');
      if (!show.value) emit('beforeLeave');
      onInvalidate(show.value ? transition(node, enterClasses, enterFromClasses, enterToClasses, function (reason) {
        isTransitioning.value = false;
        if (reason === Reason.Finished) emit('afterEnter');
      }) : transition(node, leaveClasses, leaveFromClasses, leaveToClasses, function (reason) {
        isTransitioning.value = false;
        if (reason !== Reason.Finished) return; // When we don't have children anymore we can safely unregister from the parent and hide
        // ourselves.

        if (!hasChildren(nesting)) {
          state.value = TreeStates.Hidden;
          unregister(id);
          emit('afterLeave');
        }
      }));
    }

    onMounted(function () {
      watch([show, appear], function (_oldValues, _newValues, onInvalidate) {
        executeTransition(onInvalidate);
        initial.value = false;
      }, {
        immediate: true
      });
    });
    provide(NestingContext, nesting);
    useOpenClosedProvider(computed(function () {
      var _match3;

      return match(state.value, (_match3 = {}, _match3[TreeStates.Visible] = State.Open, _match3[TreeStates.Hidden] = State.Closed, _match3));
    }));
    return {
      el: container,
      state: state
    };
  }
}); // ---

var TransitionRoot = /*#__PURE__*/defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: [Object, String],
      "default": 'div'
    },
    show: {
      type: [Boolean],
      "default": null
    },
    unmount: {
      type: [Boolean],
      "default": true
    },
    appear: {
      type: [Boolean],
      "default": false
    },
    enter: {
      type: [String],
      "default": ''
    },
    enterFrom: {
      type: [String],
      "default": ''
    },
    enterTo: {
      type: [String],
      "default": ''
    },
    leave: {
      type: [String],
      "default": ''
    },
    leaveFrom: {
      type: [String],
      "default": ''
    },
    leaveTo: {
      type: [String],
      "default": ''
    }
  },
  emits: ['beforeEnter', 'afterEnter', 'beforeLeave', 'afterLeave'],
  render: function render$1() {
    var _this = this;

    var _this$$props2 = this.$props,
        unmount = _this$$props2.unmount,
        passThroughProps = _objectWithoutPropertiesLoose(_this$$props2, ["show", "appear", "unmount"]);

    var sharedProps = {
      unmount: unmount
    };
    return render$m({
      props: _extends({}, sharedProps, {
        as: 'template'
      }),
      slot: {},
      slots: _extends({}, this.$slots, {
        "default": function _default() {
          return [h(TransitionChild, _extends({}, _this.$attrs, sharedProps, passThroughProps), _this.$slots["default"])];
        }
      }),
      attrs: {},
      features: TransitionChildRenderFeatures,
      visible: this.state === TreeStates.Visible,
      name: 'Transition'
    });
  },
  setup: function setup(props) {
    var usesOpenClosedState = useOpenClosed();
    var show = computed(function () {
      if (props.show === null && usesOpenClosedState !== null) {
        var _match4;

        return match(usesOpenClosedState.value, (_match4 = {}, _match4[State.Open] = true, _match4[State.Closed] = false, _match4));
      }

      return props.show;
    });
    watchEffect(function () {
      if (![true, false].includes(show.value)) {
        throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
      }
    });
    var state = ref(show.value ? TreeStates.Visible : TreeStates.Hidden);
    var nestingBag = useNesting(function () {
      state.value = TreeStates.Hidden;
    });
    var initial = {
      value: true
    };
    var transitionBag = {
      show: show,
      appear: computed(function () {
        return props.appear || !initial.value;
      })
    };
    onMounted(function () {
      watchEffect(function () {
        initial.value = false;

        if (show.value) {
          state.value = TreeStates.Visible;
        } else if (!hasChildren(nestingBag)) {
          state.value = TreeStates.Hidden;
        }
      });
    });
    provide(NestingContext, nestingBag);
    provide(TransitionContext, transitionBag);
    return {
      state: state,
      show: show
    };
  }
});

function render$l(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z",
      "clip-rule": "evenodd"
    })
  ]))
}

function render$k(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, [
    createVNode("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" })
  ]))
}

var _dec$d, _dec2$b, _dec3$b, _dec4$a, _class$d, _class2$b, _descriptor$b, _descriptor2$9, _descriptor3$7;
let ActionsDropdown = (_dec$d = Options({
  components: {
    DotsVerticalIcon: render$k,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
  name: "ActionsDropdown"
}), _dec2$b = Prop({
  type: Object,
  required: true
}), _dec3$b = Prop({
  type: Array,
  required: true
}), _dec4$a = Prop({
  type: Object,
  required: true
}), _dec$d(_class$d = (_class2$b = class ActionsDropdown extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "currentUser", _descriptor$b, this);

    _initializerDefineProperty(this, "items", _descriptor2$9, this);

    _initializerDefineProperty(this, "propsData", _descriptor3$7, this);
  }

  emitEvent(event) {
    window.VueBus.emit(event, this.propsData);
  }

  show(item) {
    if (!item.show) return true;
    return item.show(this.propsData, this.currentUser);
  }

}, (_descriptor$b = _applyDecoratedDescriptor(_class2$b.prototype, "currentUser", [_dec2$b], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$9 = _applyDecoratedDescriptor(_class2$b.prototype, "items", [_dec3$b], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$7 = _applyDecoratedDescriptor(_class2$b.prototype, "propsData", [_dec4$a], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2$b)) || _class$d);

const _hoisted_1$c = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Open options", -1);

const _hoisted_2$a = {
  class: "py-1"
};
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DotsVerticalIcon = resolveComponent("DotsVerticalIcon");

  const _component_MenuButton = resolveComponent("MenuButton");

  const _component_MenuItem = resolveComponent("MenuItem");

  const _component_MenuItems = resolveComponent("MenuItems");

  const _component_Menu = resolveComponent("Menu");

  return openBlock(), createBlock(_component_Menu, {
    as: "div",
    class: "relative flex justify-end items-center"
  }, {
    default: withCtx(() => [createVNode(_component_MenuButton, {
      class: "w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    }, {
      default: withCtx(() => [_hoisted_1$c, createVNode(_component_DotsVerticalIcon, {
        class: "w-5 h-5",
        "aria-hidden": "true"
      })]),
      _: 1
    }), createVNode(Transition, {
      "enter-active-class": "transition ease-out duration-100",
      "enter-from-class": "transform opacity-0 scale-95",
      "enter-to-class": "transform opacity-100 scale-100",
      "leave-active-class": "transition ease-in duration-75",
      "leave-from-class": "transform opacity-100 scale-100",
      "leave-to-class": "transform opacity-0 scale-95"
    }, {
      default: withCtx(() => [createVNode(_component_MenuItems, {
        class: "z-10 mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
      }, {
        default: withCtx(() => [createVNode("div", _hoisted_2$a, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, idx) => {
          return openBlock(), createBlock(Fragment, {
            key: idx
          }, [_ctx.show(item) ? (openBlock(), createBlock(_component_MenuItem, {
            key: 0,
            as: "div"
          }, {
            default: withCtx(({
              active
            }) => [createVNode("button", {
              type: "submit",
              class: [active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm'],
              textContent: toDisplayString(item.label),
              onClick: $event => _ctx.emitEvent(item.event)
            }, null, 10, ["textContent", "onClick"])]),
            _: 2
          }, 1024)) : createCommentVNode("", true)], 64);
        }), 128))])]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  });
}

ActionsDropdown.render = render$j;

const HOOKS = [
    "onChange",
    "onClose",
    "onDayCreate",
    "onDestroy",
    "onKeyDown",
    "onMonthChange",
    "onOpen",
    "onParseConfig",
    "onReady",
    "onValueUpdate",
    "onYearChange",
    "onPreCalendarPosition",
];
const defaults = {
    _disable: [],
    allowInput: false,
    allowInvalidPreload: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" &&
        window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    autoFillDefaultTime: true,
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enableSeconds: false,
    enableTime: false,
    errorHandler: (err) => typeof console !== "undefined" && console.warn(err),
    getWeek: (givenDate) => {
        const date = new Date(givenDate.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        var week1 = new Date(date.getFullYear(), 0, 4);
        return (1 +
            Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7));
    },
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    monthSelectorType: "dropdown",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: undefined,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false,
};

const english = {
    weekdays: {
        shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        longhand: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        longhand: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: (nth) => {
        const s = nth % 100;
        if (s > 3 && s < 21)
            return "th";
        switch (s % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year",
    monthAriaLabel: "Month",
    hourAriaLabel: "Hour",
    minuteAriaLabel: "Minute",
    time_24hr: false,
};

const pad = (number, length = 2) => `000${number}`.slice(length * -1);
const int = (bool) => (bool === true ? 1 : 0);
function debounce(fn, wait) {
    let t;
    return function () {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
    };
}
const arrayify = (obj) => obj instanceof Array ? obj : [obj];

function toggleClass(elem, className, bool) {
    if (bool === true)
        return elem.classList.add(className);
    elem.classList.remove(className);
}
function createElement(tag, className, content) {
    const e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined)
        e.textContent = content;
    return e;
}
function clearNode(node) {
    while (node.firstChild)
        node.removeChild(node.firstChild);
}
function findParent(node, condition) {
    if (condition(node))
        return node;
    else if (node.parentNode)
        return findParent(node.parentNode, condition);
    return undefined;
}
function createNumberInput(inputClassName, opts) {
    const wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
        numInput.type = "number";
    }
    else {
        numInput.type = "text";
        numInput.pattern = "\\d*";
    }
    if (opts !== undefined)
        for (const key in opts)
            numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
}
function getEventTarget(event) {
    try {
        if (typeof event.composedPath === "function") {
            const path = event.composedPath();
            return path[0];
        }
        return event.target;
    }
    catch (error) {
        return event.target;
    }
}

const doNothing = () => undefined;
const monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
const revFormat = {
    D: doNothing,
    F: function (dateObj, monthName, locale) {
        dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: (dateObj, hour) => {
        dateObj.setHours(parseFloat(hour));
    },
    H: (dateObj, hour) => {
        dateObj.setHours(parseFloat(hour));
    },
    J: (dateObj, day) => {
        dateObj.setDate(parseFloat(day));
    },
    K: (dateObj, amPM, locale) => {
        dateObj.setHours((dateObj.getHours() % 12) +
            12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function (dateObj, shortMonth, locale) {
        dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: (dateObj, seconds) => {
        dateObj.setSeconds(parseFloat(seconds));
    },
    U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1000),
    W: function (dateObj, weekNum, locale) {
        const weekNumber = parseInt(weekNum);
        const date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
        date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
        return date;
    },
    Y: (dateObj, year) => {
        dateObj.setFullYear(parseFloat(year));
    },
    Z: (_, ISODate) => new Date(ISODate),
    d: (dateObj, day) => {
        dateObj.setDate(parseFloat(day));
    },
    h: (dateObj, hour) => {
        dateObj.setHours(parseFloat(hour));
    },
    i: (dateObj, minutes) => {
        dateObj.setMinutes(parseFloat(minutes));
    },
    j: (dateObj, day) => {
        dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: (dateObj, month) => {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    n: (dateObj, month) => {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    s: (dateObj, seconds) => {
        dateObj.setSeconds(parseFloat(seconds));
    },
    u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
    w: doNothing,
    y: (dateObj, year) => {
        dateObj.setFullYear(2000 + parseFloat(year));
    },
};
const tokenRegex = {
    D: "(\\w+)",
    F: "(\\w+)",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "(\\w+)",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "(\\w+)",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    u: "(.+)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})",
};
const formats = {
    Z: (date) => date.toISOString(),
    D: function (date, locale, options) {
        return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function (date, locale, options) {
        return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function (date, locale, options) {
        return pad(formats.h(date, locale, options));
    },
    H: (date) => pad(date.getHours()),
    J: function (date, locale) {
        return locale.ordinal !== undefined
            ? date.getDate() + locale.ordinal(date.getDate())
            : date.getDate();
    },
    K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
    M: function (date, locale) {
        return monthToStr(date.getMonth(), true, locale);
    },
    S: (date) => pad(date.getSeconds()),
    U: (date) => date.getTime() / 1000,
    W: function (date, _, options) {
        return options.getWeek(date);
    },
    Y: (date) => pad(date.getFullYear(), 4),
    d: (date) => pad(date.getDate()),
    h: (date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),
    i: (date) => pad(date.getMinutes()),
    j: (date) => date.getDate(),
    l: function (date, locale) {
        return locale.weekdays.longhand[date.getDay()];
    },
    m: (date) => pad(date.getMonth() + 1),
    n: (date) => date.getMonth() + 1,
    s: (date) => date.getSeconds(),
    u: (date) => date.getTime(),
    w: (date) => date.getDay(),
    y: (date) => String(date.getFullYear()).substring(2),
};

const createDateFormatter = ({ config = defaults, l10n = english, isMobile = false, }) => (dateObj, frmt, overrideLocale) => {
    const locale = overrideLocale || l10n;
    if (config.formatDate !== undefined && !isMobile) {
        return config.formatDate(dateObj, frmt, locale);
    }
    return frmt
        .split("")
        .map((c, i, arr) => formats[c] && arr[i - 1] !== "\\"
        ? formats[c](dateObj, locale, config)
        : c !== "\\"
            ? c
            : "")
        .join("");
};
const createDateParser = ({ config = defaults, l10n = english }) => (date, givenFormat, timeless, customLocale) => {
    if (date !== 0 && !date)
        return undefined;
    const locale = customLocale || l10n;
    let parsedDate;
    const dateOrig = date;
    if (date instanceof Date)
        parsedDate = new Date(date.getTime());
    else if (typeof date !== "string" &&
        date.toFixed !== undefined)
        parsedDate = new Date(date);
    else if (typeof date === "string") {
        const format = givenFormat || (config || defaults).dateFormat;
        const datestr = String(date).trim();
        if (datestr === "today") {
            parsedDate = new Date();
            timeless = true;
        }
        else if (/Z$/.test(datestr) ||
            /GMT$/.test(datestr))
            parsedDate = new Date(date);
        else if (config && config.parseDate)
            parsedDate = config.parseDate(date, format);
        else {
            parsedDate =
                !config || !config.noCalendar
                    ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                    : new Date(new Date().setHours(0, 0, 0, 0));
            let matched, ops = [];
            for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                const token = format[i];
                const isBackSlash = token === "\\";
                const escaped = format[i - 1] === "\\" || isBackSlash;
                if (tokenRegex[token] && !escaped) {
                    regexStr += tokenRegex[token];
                    const match = new RegExp(regexStr).exec(date);
                    if (match && (matched = true)) {
                        ops[token !== "Y" ? "push" : "unshift"]({
                            fn: revFormat[token],
                            val: match[++matchIndex],
                        });
                    }
                }
                else if (!isBackSlash)
                    regexStr += ".";
                ops.forEach(({ fn, val }) => (parsedDate = fn(parsedDate, val, locale) || parsedDate));
            }
            parsedDate = matched ? parsedDate : undefined;
        }
    }
    if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
        config.errorHandler(new Error(`Invalid date provided: ${dateOrig}`));
        return undefined;
    }
    if (timeless === true)
        parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
};
function compareDates(date1, date2, timeless = true) {
    if (timeless !== false) {
        return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
            new Date(date2.getTime()).setHours(0, 0, 0, 0));
    }
    return date1.getTime() - date2.getTime();
}
const isBetween = (ts, ts1, ts2) => {
    return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
const duration = {
    DAY: 86400000,
};
function getDefaultHours(config) {
    let hours = config.defaultHour;
    let minutes = config.defaultMinute;
    let seconds = config.defaultSeconds;
    if (config.minDate !== undefined) {
        const minHour = config.minDate.getHours();
        const minMinutes = config.minDate.getMinutes();
        const minSeconds = config.minDate.getSeconds();
        if (hours < minHour) {
            hours = minHour;
        }
        if (hours === minHour && minutes < minMinutes) {
            minutes = minMinutes;
        }
        if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
            seconds = config.minDate.getSeconds();
    }
    if (config.maxDate !== undefined) {
        const maxHr = config.maxDate.getHours();
        const maxMinutes = config.maxDate.getMinutes();
        hours = Math.min(hours, maxHr);
        if (hours === maxHr)
            minutes = Math.min(maxMinutes, minutes);
        if (hours === maxHr && minutes === maxMinutes)
            seconds = config.maxDate.getSeconds();
    }
    return { hours, minutes, seconds };
}

if (typeof Object.assign !== "function") {
    Object.assign = function (target, ...args) {
        if (!target) {
            throw TypeError("Cannot convert undefined or null to object");
        }
        for (const source of args) {
            if (source) {
                Object.keys(source).forEach((key) => (target[key] = source[key]));
            }
        }
        return target;
    };
}

const DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
    const self = {
        config: Object.assign(Object.assign({}, defaults), flatpickr.defaultConfig),
        l10n: english,
    };
    self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
    self._handlers = [];
    self.pluginElements = [];
    self.loadedPlugins = [];
    self._bind = bind;
    self._setHoursFromDate = setHoursFromDate;
    self._positionCalendar = positionCalendar;
    self.changeMonth = changeMonth;
    self.changeYear = changeYear;
    self.clear = clear;
    self.close = close;
    self._createElement = createElement;
    self.destroy = destroy;
    self.isEnabled = isEnabled;
    self.jumpToDate = jumpToDate;
    self.open = open;
    self.redraw = redraw;
    self.set = set;
    self.setDate = setDate;
    self.toggle = toggle;
    function setupHelperFunctions() {
        self.utils = {
            getDaysInMonth(month = self.currentMonth, yr = self.currentYear) {
                if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                    return 29;
                return self.l10n.daysInMonth[month];
            },
        };
    }
    function init() {
        self.element = self.input = element;
        self.isOpen = false;
        parseConfig();
        setupLocale();
        setupInputs();
        setupDates();
        setupHelperFunctions();
        if (!self.isMobile)
            build();
        bindEvents();
        if (self.selectedDates.length || self.config.noCalendar) {
            if (self.config.enableTime) {
                setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
            }
            updateValue(false);
        }
        setCalendarWidth();
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!self.isMobile && isSafari) {
            positionCalendar();
        }
        triggerEvent("onReady");
    }
    function bindToInstance(fn) {
        return fn.bind(self);
    }
    function setCalendarWidth() {
        const config = self.config;
        if (config.weekNumbers === false && config.showMonths === 1) {
            return;
        }
        else if (config.noCalendar !== true) {
            window.requestAnimationFrame(function () {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.style.visibility = "hidden";
                    self.calendarContainer.style.display = "block";
                }
                if (self.daysContainer !== undefined) {
                    const daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                    self.daysContainer.style.width = daysWidth + "px";
                    self.calendarContainer.style.width =
                        daysWidth +
                            (self.weekWrapper !== undefined
                                ? self.weekWrapper.offsetWidth
                                : 0) +
                            "px";
                    self.calendarContainer.style.removeProperty("visibility");
                    self.calendarContainer.style.removeProperty("display");
                }
            });
        }
    }
    function updateTime(e) {
        if (self.selectedDates.length === 0) {
            const defaultDate = self.config.minDate === undefined ||
                compareDates(new Date(), self.config.minDate) >= 0
                ? new Date()
                : new Date(self.config.minDate.getTime());
            const defaults = getDefaultHours(self.config);
            defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
            self.selectedDates = [defaultDate];
            self.latestSelectedDateObj = defaultDate;
        }
        if (e !== undefined && e.type !== "blur") {
            timeWrapper(e);
        }
        const prevValue = self._input.value;
        setHoursFromInputs();
        updateValue();
        if (self._input.value !== prevValue) {
            self._debouncedChange();
        }
    }
    function ampm2military(hour, amPM) {
        return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
    }
    function military2ampm(hour) {
        switch (hour % 24) {
            case 0:
            case 12:
                return 12;
            default:
                return hour % 12;
        }
    }
    function setHoursFromInputs() {
        if (self.hourElement === undefined || self.minuteElement === undefined)
            return;
        let hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
            ? (parseInt(self.secondElement.value, 10) || 0) % 60
            : 0;
        if (self.amPM !== undefined) {
            hours = ampm2military(hours, self.amPM.textContent);
        }
        const limitMinHours = self.config.minTime !== undefined ||
            (self.config.minDate &&
                self.minDateHasTime &&
                self.latestSelectedDateObj &&
                compareDates(self.latestSelectedDateObj, self.config.minDate, true) ===
                    0);
        const limitMaxHours = self.config.maxTime !== undefined ||
            (self.config.maxDate &&
                self.maxDateHasTime &&
                self.latestSelectedDateObj &&
                compareDates(self.latestSelectedDateObj, self.config.maxDate, true) ===
                    0);
        if (limitMaxHours) {
            const maxTime = self.config.maxTime !== undefined
                ? self.config.maxTime
                : self.config.maxDate;
            hours = Math.min(hours, maxTime.getHours());
            if (hours === maxTime.getHours())
                minutes = Math.min(minutes, maxTime.getMinutes());
            if (minutes === maxTime.getMinutes())
                seconds = Math.min(seconds, maxTime.getSeconds());
        }
        if (limitMinHours) {
            const minTime = self.config.minTime !== undefined
                ? self.config.minTime
                : self.config.minDate;
            hours = Math.max(hours, minTime.getHours());
            if (hours === minTime.getHours() && minutes < minTime.getMinutes())
                minutes = minTime.getMinutes();
            if (minutes === minTime.getMinutes())
                seconds = Math.max(seconds, minTime.getSeconds());
        }
        setHours(hours, minutes, seconds);
    }
    function setHoursFromDate(dateObj) {
        const date = dateObj || self.latestSelectedDateObj;
        if (date) {
            setHours(date.getHours(), date.getMinutes(), date.getSeconds());
        }
    }
    function setHours(hours, minutes, seconds) {
        if (self.latestSelectedDateObj !== undefined) {
            self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
        }
        if (!self.hourElement || !self.minuteElement || self.isMobile)
            return;
        self.hourElement.value = pad(!self.config.time_24hr
            ? ((12 + hours) % 12) + 12 * int(hours % 12 === 0)
            : hours);
        self.minuteElement.value = pad(minutes);
        if (self.amPM !== undefined)
            self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
        if (self.secondElement !== undefined)
            self.secondElement.value = pad(seconds);
    }
    function onYearInput(event) {
        const eventTarget = getEventTarget(event);
        const year = parseInt(eventTarget.value) + (event.delta || 0);
        if (year / 1000 > 1 ||
            (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
            changeYear(year);
        }
    }
    function bind(element, event, handler, options) {
        if (event instanceof Array)
            return event.forEach((ev) => bind(element, ev, handler, options));
        if (element instanceof Array)
            return element.forEach((el) => bind(el, event, handler, options));
        element.addEventListener(event, handler, options);
        self._handlers.push({
            remove: () => element.removeEventListener(event, handler),
        });
    }
    function triggerChange() {
        triggerEvent("onChange");
    }
    function bindEvents() {
        if (self.config.wrap) {
            ["open", "close", "toggle", "clear"].forEach((evt) => {
                Array.prototype.forEach.call(self.element.querySelectorAll(`[data-${evt}]`), (el) => bind(el, "click", self[evt]));
            });
        }
        if (self.isMobile) {
            setupMobile();
            return;
        }
        const debouncedResize = debounce(onResize, 50);
        self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
        if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
            bind(self.daysContainer, "mouseover", (e) => {
                if (self.config.mode === "range")
                    onMouseOver(getEventTarget(e));
            });
        bind(window.document.body, "keydown", onKeyDown);
        if (!self.config.inline && !self.config.static)
            bind(window, "resize", debouncedResize);
        if (window.ontouchstart !== undefined)
            bind(window.document, "touchstart", documentClick);
        else
            bind(window.document, "mousedown", documentClick);
        bind(window.document, "focus", documentClick, { capture: true });
        if (self.config.clickOpens === true) {
            bind(self._input, "focus", self.open);
            bind(self._input, "click", self.open);
        }
        if (self.daysContainer !== undefined) {
            bind(self.monthNav, "click", onMonthNavClick);
            bind(self.monthNav, ["keyup", "increment"], onYearInput);
            bind(self.daysContainer, "click", selectDate);
        }
        if (self.timeContainer !== undefined &&
            self.minuteElement !== undefined &&
            self.hourElement !== undefined) {
            const selText = (e) => getEventTarget(e).select();
            bind(self.timeContainer, ["increment"], updateTime);
            bind(self.timeContainer, "blur", updateTime, { capture: true });
            bind(self.timeContainer, "click", timeIncrement);
            bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
            if (self.secondElement !== undefined)
                bind(self.secondElement, "focus", () => self.secondElement && self.secondElement.select());
            if (self.amPM !== undefined) {
                bind(self.amPM, "click", (e) => {
                    updateTime(e);
                    triggerChange();
                });
            }
        }
        if (self.config.allowInput) {
            bind(self._input, "blur", onBlur);
        }
    }
    function jumpToDate(jumpDate, triggerChange) {
        const jumpTo = jumpDate !== undefined
            ? self.parseDate(jumpDate)
            : self.latestSelectedDateObj ||
                (self.config.minDate && self.config.minDate > self.now
                    ? self.config.minDate
                    : self.config.maxDate && self.config.maxDate < self.now
                        ? self.config.maxDate
                        : self.now);
        const oldYear = self.currentYear;
        const oldMonth = self.currentMonth;
        try {
            if (jumpTo !== undefined) {
                self.currentYear = jumpTo.getFullYear();
                self.currentMonth = jumpTo.getMonth();
            }
        }
        catch (e) {
            e.message = "Invalid date supplied: " + jumpTo;
            self.config.errorHandler(e);
        }
        if (triggerChange && self.currentYear !== oldYear) {
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        if (triggerChange &&
            (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
            triggerEvent("onMonthChange");
        }
        self.redraw();
    }
    function timeIncrement(e) {
        const eventTarget = getEventTarget(e);
        if (~eventTarget.className.indexOf("arrow"))
            incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
    }
    function incrementNumInput(e, delta, inputElem) {
        const target = e && getEventTarget(e);
        const input = inputElem ||
            (target && target.parentNode && target.parentNode.firstChild);
        const event = createEvent("increment");
        event.delta = delta;
        input && input.dispatchEvent(event);
    }
    function build() {
        const fragment = window.document.createDocumentFragment();
        self.calendarContainer = createElement("div", "flatpickr-calendar");
        self.calendarContainer.tabIndex = -1;
        if (!self.config.noCalendar) {
            fragment.appendChild(buildMonthNav());
            self.innerContainer = createElement("div", "flatpickr-innerContainer");
            if (self.config.weekNumbers) {
                const { weekWrapper, weekNumbers } = buildWeeks();
                self.innerContainer.appendChild(weekWrapper);
                self.weekNumbers = weekNumbers;
                self.weekWrapper = weekWrapper;
            }
            self.rContainer = createElement("div", "flatpickr-rContainer");
            self.rContainer.appendChild(buildWeekdays());
            if (!self.daysContainer) {
                self.daysContainer = createElement("div", "flatpickr-days");
                self.daysContainer.tabIndex = -1;
            }
            buildDays();
            self.rContainer.appendChild(self.daysContainer);
            self.innerContainer.appendChild(self.rContainer);
            fragment.appendChild(self.innerContainer);
        }
        if (self.config.enableTime) {
            fragment.appendChild(buildTime());
        }
        toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
        toggleClass(self.calendarContainer, "animate", self.config.animate === true);
        toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
        self.calendarContainer.appendChild(fragment);
        const customAppend = self.config.appendTo !== undefined &&
            self.config.appendTo.nodeType !== undefined;
        if (self.config.inline || self.config.static) {
            self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
            if (self.config.inline) {
                if (!customAppend && self.element.parentNode)
                    self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                else if (self.config.appendTo !== undefined)
                    self.config.appendTo.appendChild(self.calendarContainer);
            }
            if (self.config.static) {
                const wrapper = createElement("div", "flatpickr-wrapper");
                if (self.element.parentNode)
                    self.element.parentNode.insertBefore(wrapper, self.element);
                wrapper.appendChild(self.element);
                if (self.altInput)
                    wrapper.appendChild(self.altInput);
                wrapper.appendChild(self.calendarContainer);
            }
        }
        if (!self.config.static && !self.config.inline)
            (self.config.appendTo !== undefined
                ? self.config.appendTo
                : window.document.body).appendChild(self.calendarContainer);
    }
    function createDay(className, date, dayNumber, i) {
        const dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
        dayElement.dateObj = date;
        dayElement.$i = i;
        dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
        if (className.indexOf("hidden") === -1 &&
            compareDates(date, self.now) === 0) {
            self.todayDateElem = dayElement;
            dayElement.classList.add("today");
            dayElement.setAttribute("aria-current", "date");
        }
        if (dateIsEnabled) {
            dayElement.tabIndex = -1;
            if (isDateSelected(date)) {
                dayElement.classList.add("selected");
                self.selectedDateElem = dayElement;
                if (self.config.mode === "range") {
                    toggleClass(dayElement, "startRange", self.selectedDates[0] &&
                        compareDates(date, self.selectedDates[0], true) === 0);
                    toggleClass(dayElement, "endRange", self.selectedDates[1] &&
                        compareDates(date, self.selectedDates[1], true) === 0);
                    if (className === "nextMonthDay")
                        dayElement.classList.add("inRange");
                }
            }
        }
        else {
            dayElement.classList.add("flatpickr-disabled");
        }
        if (self.config.mode === "range") {
            if (isDateInRange(date) && !isDateSelected(date))
                dayElement.classList.add("inRange");
        }
        if (self.weekNumbers &&
            self.config.showMonths === 1 &&
            className !== "prevMonthDay" &&
            dayNumber % 7 === 1) {
            self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
        }
        triggerEvent("onDayCreate", dayElement);
        return dayElement;
    }
    function focusOnDayElem(targetNode) {
        targetNode.focus();
        if (self.config.mode === "range")
            onMouseOver(targetNode);
    }
    function getFirstAvailableDay(delta) {
        const startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
        const endMonth = delta > 0 ? self.config.showMonths : -1;
        for (let m = startMonth; m != endMonth; m += delta) {
            const month = self.daysContainer.children[m];
            const startIndex = delta > 0 ? 0 : month.children.length - 1;
            const endIndex = delta > 0 ? month.children.length : -1;
            for (let i = startIndex; i != endIndex; i += delta) {
                const c = month.children[i];
                if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                    return c;
            }
        }
        return undefined;
    }
    function getNextAvailableDay(current, delta) {
        const givenMonth = current.className.indexOf("Month") === -1
            ? current.dateObj.getMonth()
            : self.currentMonth;
        const endMonth = delta > 0 ? self.config.showMonths : -1;
        const loopDelta = delta > 0 ? 1 : -1;
        for (let m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
            const month = self.daysContainer.children[m];
            const startIndex = givenMonth - self.currentMonth === m
                ? current.$i + delta
                : delta < 0
                    ? month.children.length - 1
                    : 0;
            const numMonthDays = month.children.length;
            for (let i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                const c = month.children[i];
                if (c.className.indexOf("hidden") === -1 &&
                    isEnabled(c.dateObj) &&
                    Math.abs(current.$i - i) >= Math.abs(delta))
                    return focusOnDayElem(c);
            }
        }
        self.changeMonth(loopDelta);
        focusOnDay(getFirstAvailableDay(loopDelta), 0);
        return undefined;
    }
    function focusOnDay(current, offset) {
        const dayFocused = isInView(document.activeElement || document.body);
        const startElem = current !== undefined
            ? current
            : dayFocused
                ? document.activeElement
                : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                    ? self.selectedDateElem
                    : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                        ? self.todayDateElem
                        : getFirstAvailableDay(offset > 0 ? 1 : -1);
        if (startElem === undefined) {
            self._input.focus();
        }
        else if (!dayFocused) {
            focusOnDayElem(startElem);
        }
        else {
            getNextAvailableDay(startElem, offset);
        }
    }
    function buildMonthDays(year, month) {
        const firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
        const prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
        const daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
        let dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
        for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
            days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
        }
        for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
            days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
        }
        for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
            (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
            days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
        }
        const dayContainer = createElement("div", "dayContainer");
        dayContainer.appendChild(days);
        return dayContainer;
    }
    function buildDays() {
        if (self.daysContainer === undefined) {
            return;
        }
        clearNode(self.daysContainer);
        if (self.weekNumbers)
            clearNode(self.weekNumbers);
        const frag = document.createDocumentFragment();
        for (let i = 0; i < self.config.showMonths; i++) {
            const d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
        }
        self.daysContainer.appendChild(frag);
        self.days = self.daysContainer.firstChild;
        if (self.config.mode === "range" && self.selectedDates.length === 1) {
            onMouseOver();
        }
    }
    function buildMonthSwitch() {
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType !== "dropdown")
            return;
        const shouldBuildMonth = function (month) {
            if (self.config.minDate !== undefined &&
                self.currentYear === self.config.minDate.getFullYear() &&
                month < self.config.minDate.getMonth()) {
                return false;
            }
            return !(self.config.maxDate !== undefined &&
                self.currentYear === self.config.maxDate.getFullYear() &&
                month > self.config.maxDate.getMonth());
        };
        self.monthsDropdownContainer.tabIndex = -1;
        self.monthsDropdownContainer.innerHTML = "";
        for (let i = 0; i < 12; i++) {
            if (!shouldBuildMonth(i))
                continue;
            const month = createElement("option", "flatpickr-monthDropdown-month");
            month.value = new Date(self.currentYear, i).getMonth().toString();
            month.textContent = monthToStr(i, self.config.shorthandCurrentMonth, self.l10n);
            month.tabIndex = -1;
            if (self.currentMonth === i) {
                month.selected = true;
            }
            self.monthsDropdownContainer.appendChild(month);
        }
    }
    function buildMonth() {
        const container = createElement("div", "flatpickr-month");
        const monthNavFragment = window.document.createDocumentFragment();
        let monthElement;
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType === "static") {
            monthElement = createElement("span", "cur-month");
        }
        else {
            self.monthsDropdownContainer = createElement("select", "flatpickr-monthDropdown-months");
            self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
            bind(self.monthsDropdownContainer, "change", (e) => {
                const target = getEventTarget(e);
                const selectedMonth = parseInt(target.value, 10);
                self.changeMonth(selectedMonth - self.currentMonth);
                triggerEvent("onMonthChange");
            });
            buildMonthSwitch();
            monthElement = self.monthsDropdownContainer;
        }
        const yearInput = createNumberInput("cur-year", { tabindex: "-1" });
        const yearElement = yearInput.getElementsByTagName("input")[0];
        yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
        if (self.config.minDate) {
            yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
        }
        if (self.config.maxDate) {
            yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
            yearElement.disabled =
                !!self.config.minDate &&
                    self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
        }
        const currentMonth = createElement("div", "flatpickr-current-month");
        currentMonth.appendChild(monthElement);
        currentMonth.appendChild(yearInput);
        monthNavFragment.appendChild(currentMonth);
        container.appendChild(monthNavFragment);
        return {
            container,
            yearElement,
            monthElement,
        };
    }
    function buildMonths() {
        clearNode(self.monthNav);
        self.monthNav.appendChild(self.prevMonthNav);
        if (self.config.showMonths) {
            self.yearElements = [];
            self.monthElements = [];
        }
        for (let m = self.config.showMonths; m--;) {
            const month = buildMonth();
            self.yearElements.push(month.yearElement);
            self.monthElements.push(month.monthElement);
            self.monthNav.appendChild(month.container);
        }
        self.monthNav.appendChild(self.nextMonthNav);
    }
    function buildMonthNav() {
        self.monthNav = createElement("div", "flatpickr-months");
        self.yearElements = [];
        self.monthElements = [];
        self.prevMonthNav = createElement("span", "flatpickr-prev-month");
        self.prevMonthNav.innerHTML = self.config.prevArrow;
        self.nextMonthNav = createElement("span", "flatpickr-next-month");
        self.nextMonthNav.innerHTML = self.config.nextArrow;
        buildMonths();
        Object.defineProperty(self, "_hidePrevMonthArrow", {
            get: () => self.__hidePrevMonthArrow,
            set(bool) {
                if (self.__hidePrevMonthArrow !== bool) {
                    toggleClass(self.prevMonthNav, "flatpickr-disabled", bool);
                    self.__hidePrevMonthArrow = bool;
                }
            },
        });
        Object.defineProperty(self, "_hideNextMonthArrow", {
            get: () => self.__hideNextMonthArrow,
            set(bool) {
                if (self.__hideNextMonthArrow !== bool) {
                    toggleClass(self.nextMonthNav, "flatpickr-disabled", bool);
                    self.__hideNextMonthArrow = bool;
                }
            },
        });
        self.currentYearElement = self.yearElements[0];
        updateNavigationCurrentMonth();
        return self.monthNav;
    }
    function buildTime() {
        self.calendarContainer.classList.add("hasTime");
        if (self.config.noCalendar)
            self.calendarContainer.classList.add("noCalendar");
        const defaults = getDefaultHours(self.config);
        self.timeContainer = createElement("div", "flatpickr-time");
        self.timeContainer.tabIndex = -1;
        const separator = createElement("span", "flatpickr-time-separator", ":");
        const hourInput = createNumberInput("flatpickr-hour", {
            "aria-label": self.l10n.hourAriaLabel,
        });
        self.hourElement = hourInput.getElementsByTagName("input")[0];
        const minuteInput = createNumberInput("flatpickr-minute", {
            "aria-label": self.l10n.minuteAriaLabel,
        });
        self.minuteElement = minuteInput.getElementsByTagName("input")[0];
        self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
        self.hourElement.value = pad(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getHours()
            : self.config.time_24hr
                ? defaults.hours
                : military2ampm(defaults.hours));
        self.minuteElement.value = pad(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getMinutes()
            : defaults.minutes);
        self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
        self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
        self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
        self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
        self.hourElement.setAttribute("maxlength", "2");
        self.minuteElement.setAttribute("min", "0");
        self.minuteElement.setAttribute("max", "59");
        self.minuteElement.setAttribute("maxlength", "2");
        self.timeContainer.appendChild(hourInput);
        self.timeContainer.appendChild(separator);
        self.timeContainer.appendChild(minuteInput);
        if (self.config.time_24hr)
            self.timeContainer.classList.add("time24hr");
        if (self.config.enableSeconds) {
            self.timeContainer.classList.add("hasSeconds");
            const secondInput = createNumberInput("flatpickr-second");
            self.secondElement = secondInput.getElementsByTagName("input")[0];
            self.secondElement.value = pad(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getSeconds()
                : defaults.seconds);
            self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
            self.secondElement.setAttribute("min", "0");
            self.secondElement.setAttribute("max", "59");
            self.secondElement.setAttribute("maxlength", "2");
            self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
            self.timeContainer.appendChild(secondInput);
        }
        if (!self.config.time_24hr) {
            self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj
                ? self.hourElement.value
                : self.config.defaultHour) > 11)]);
            self.amPM.title = self.l10n.toggleTitle;
            self.amPM.tabIndex = -1;
            self.timeContainer.appendChild(self.amPM);
        }
        return self.timeContainer;
    }
    function buildWeekdays() {
        if (!self.weekdayContainer)
            self.weekdayContainer = createElement("div", "flatpickr-weekdays");
        else
            clearNode(self.weekdayContainer);
        for (let i = self.config.showMonths; i--;) {
            const container = createElement("div", "flatpickr-weekdaycontainer");
            self.weekdayContainer.appendChild(container);
        }
        updateWeekdays();
        return self.weekdayContainer;
    }
    function updateWeekdays() {
        if (!self.weekdayContainer) {
            return;
        }
        const firstDayOfWeek = self.l10n.firstDayOfWeek;
        let weekdays = [...self.l10n.weekdays.shorthand];
        if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
            weekdays = [
                ...weekdays.splice(firstDayOfWeek, weekdays.length),
                ...weekdays.splice(0, firstDayOfWeek),
            ];
        }
        for (let i = self.config.showMonths; i--;) {
            self.weekdayContainer.children[i].innerHTML = `
      <span class='flatpickr-weekday'>
        ${weekdays.join("</span><span class='flatpickr-weekday'>")}
      </span>
      `;
        }
    }
    function buildWeeks() {
        self.calendarContainer.classList.add("hasWeeks");
        const weekWrapper = createElement("div", "flatpickr-weekwrapper");
        weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
        const weekNumbers = createElement("div", "flatpickr-weeks");
        weekWrapper.appendChild(weekNumbers);
        return {
            weekWrapper,
            weekNumbers,
        };
    }
    function changeMonth(value, isOffset = true) {
        const delta = isOffset ? value : value - self.currentMonth;
        if ((delta < 0 && self._hidePrevMonthArrow === true) ||
            (delta > 0 && self._hideNextMonthArrow === true))
            return;
        self.currentMonth += delta;
        if (self.currentMonth < 0 || self.currentMonth > 11) {
            self.currentYear += self.currentMonth > 11 ? 1 : -1;
            self.currentMonth = (self.currentMonth + 12) % 12;
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        buildDays();
        triggerEvent("onMonthChange");
        updateNavigationCurrentMonth();
    }
    function clear(triggerChangeEvent = true, toInitial = true) {
        self.input.value = "";
        if (self.altInput !== undefined)
            self.altInput.value = "";
        if (self.mobileInput !== undefined)
            self.mobileInput.value = "";
        self.selectedDates = [];
        self.latestSelectedDateObj = undefined;
        if (toInitial === true) {
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
        }
        if (self.config.enableTime === true) {
            const { hours, minutes, seconds } = getDefaultHours(self.config);
            setHours(hours, minutes, seconds);
        }
        self.redraw();
        if (triggerChangeEvent)
            triggerEvent("onChange");
    }
    function close() {
        self.isOpen = false;
        if (!self.isMobile) {
            if (self.calendarContainer !== undefined) {
                self.calendarContainer.classList.remove("open");
            }
            if (self._input !== undefined) {
                self._input.classList.remove("active");
            }
        }
        triggerEvent("onClose");
    }
    function destroy() {
        if (self.config !== undefined)
            triggerEvent("onDestroy");
        for (let i = self._handlers.length; i--;) {
            self._handlers[i].remove();
        }
        self._handlers = [];
        if (self.mobileInput) {
            if (self.mobileInput.parentNode)
                self.mobileInput.parentNode.removeChild(self.mobileInput);
            self.mobileInput = undefined;
        }
        else if (self.calendarContainer && self.calendarContainer.parentNode) {
            if (self.config.static && self.calendarContainer.parentNode) {
                const wrapper = self.calendarContainer.parentNode;
                wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                if (wrapper.parentNode) {
                    while (wrapper.firstChild)
                        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
            else
                self.calendarContainer.parentNode.removeChild(self.calendarContainer);
        }
        if (self.altInput) {
            self.input.type = "text";
            if (self.altInput.parentNode)
                self.altInput.parentNode.removeChild(self.altInput);
            delete self.altInput;
        }
        if (self.input) {
            self.input.type = self.input._type;
            self.input.classList.remove("flatpickr-input");
            self.input.removeAttribute("readonly");
        }
        [
            "_showTimeInput",
            "latestSelectedDateObj",
            "_hideNextMonthArrow",
            "_hidePrevMonthArrow",
            "__hideNextMonthArrow",
            "__hidePrevMonthArrow",
            "isMobile",
            "isOpen",
            "selectedDateElem",
            "minDateHasTime",
            "maxDateHasTime",
            "days",
            "daysContainer",
            "_input",
            "_positionElement",
            "innerContainer",
            "rContainer",
            "monthNav",
            "todayDateElem",
            "calendarContainer",
            "weekdayContainer",
            "prevMonthNav",
            "nextMonthNav",
            "monthsDropdownContainer",
            "currentMonthElement",
            "currentYearElement",
            "navigationCurrentMonth",
            "selectedDateElem",
            "config",
        ].forEach((k) => {
            try {
                delete self[k];
            }
            catch (_) { }
        });
    }
    function isCalendarElem(elem) {
        if (self.config.appendTo && self.config.appendTo.contains(elem))
            return true;
        return self.calendarContainer.contains(elem);
    }
    function documentClick(e) {
        if (self.isOpen && !self.config.inline) {
            const eventTarget = getEventTarget(e);
            const isCalendarElement = isCalendarElem(eventTarget);
            const isInput = eventTarget === self.input ||
                eventTarget === self.altInput ||
                self.element.contains(eventTarget) ||
                (e.path &&
                    e.path.indexOf &&
                    (~e.path.indexOf(self.input) ||
                        ~e.path.indexOf(self.altInput)));
            const lostFocus = e.type === "blur"
                ? isInput &&
                    e.relatedTarget &&
                    !isCalendarElem(e.relatedTarget)
                : !isInput &&
                    !isCalendarElement &&
                    !isCalendarElem(e.relatedTarget);
            const isIgnored = !self.config.ignoredFocusElements.some((elem) => elem.contains(eventTarget));
            if (lostFocus && isIgnored) {
                if (self.timeContainer !== undefined &&
                    self.minuteElement !== undefined &&
                    self.hourElement !== undefined &&
                    self.input.value !== "" &&
                    self.input.value !== undefined) {
                    updateTime();
                }
                self.close();
                if (self.config &&
                    self.config.mode === "range" &&
                    self.selectedDates.length === 1) {
                    self.clear(false);
                    self.redraw();
                }
            }
        }
    }
    function changeYear(newYear) {
        if (!newYear ||
            (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
            (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
            return;
        const newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
        self.currentYear = newYearNum || self.currentYear;
        if (self.config.maxDate &&
            self.currentYear === self.config.maxDate.getFullYear()) {
            self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
        }
        else if (self.config.minDate &&
            self.currentYear === self.config.minDate.getFullYear()) {
            self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
        }
        if (isNewYear) {
            self.redraw();
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
    }
    function isEnabled(date, timeless = true) {
        var _a;
        const dateToCheck = self.parseDate(date, undefined, timeless);
        if ((self.config.minDate &&
            dateToCheck &&
            compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
            (self.config.maxDate &&
                dateToCheck &&
                compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
            return false;
        if (!self.config.enable && self.config.disable.length === 0)
            return true;
        if (dateToCheck === undefined)
            return false;
        const bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
        for (let i = 0, d; i < array.length; i++) {
            d = array[i];
            if (typeof d === "function" &&
                d(dateToCheck))
                return bool;
            else if (d instanceof Date &&
                dateToCheck !== undefined &&
                d.getTime() === dateToCheck.getTime())
                return bool;
            else if (typeof d === "string") {
                const parsed = self.parseDate(d, undefined, true);
                return parsed && parsed.getTime() === dateToCheck.getTime()
                    ? bool
                    : !bool;
            }
            else if (typeof d === "object" &&
                dateToCheck !== undefined &&
                d.from &&
                d.to &&
                dateToCheck.getTime() >= d.from.getTime() &&
                dateToCheck.getTime() <= d.to.getTime())
                return bool;
        }
        return !bool;
    }
    function isInView(elem) {
        if (self.daysContainer !== undefined)
            return (elem.className.indexOf("hidden") === -1 &&
                elem.className.indexOf("flatpickr-disabled") === -1 &&
                self.daysContainer.contains(elem));
        return false;
    }
    function onBlur(e) {
        const isInput = e.target === self._input;
        if (isInput &&
            (self.selectedDates.length > 0 || self._input.value.length > 0) &&
            !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
            self.setDate(self._input.value, true, e.target === self.altInput
                ? self.config.altFormat
                : self.config.dateFormat);
        }
    }
    function onKeyDown(e) {
        const eventTarget = getEventTarget(e);
        const isInput = self.config.wrap
            ? element.contains(eventTarget)
            : eventTarget === self._input;
        const allowInput = self.config.allowInput;
        const allowKeydown = self.isOpen && (!allowInput || !isInput);
        const allowInlineKeydown = self.config.inline && isInput && !allowInput;
        if (e.keyCode === 13 && isInput) {
            if (allowInput) {
                self.setDate(self._input.value, true, eventTarget === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
                return eventTarget.blur();
            }
            else {
                self.open();
            }
        }
        else if (isCalendarElem(eventTarget) ||
            allowKeydown ||
            allowInlineKeydown) {
            const isTimeObj = !!self.timeContainer &&
                self.timeContainer.contains(eventTarget);
            switch (e.keyCode) {
                case 13:
                    if (isTimeObj) {
                        e.preventDefault();
                        updateTime();
                        focusAndClose();
                    }
                    else
                        selectDate(e);
                    break;
                case 27:
                    e.preventDefault();
                    focusAndClose();
                    break;
                case 8:
                case 46:
                    if (isInput && !self.config.allowInput) {
                        e.preventDefault();
                        self.clear();
                    }
                    break;
                case 37:
                case 39:
                    if (!isTimeObj && !isInput) {
                        e.preventDefault();
                        if (self.daysContainer !== undefined &&
                            (allowInput === false ||
                                (document.activeElement && isInView(document.activeElement)))) {
                            const delta = e.keyCode === 39 ? 1 : -1;
                            if (!e.ctrlKey)
                                focusOnDay(undefined, delta);
                            else {
                                e.stopPropagation();
                                changeMonth(delta);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                        }
                    }
                    else if (self.hourElement)
                        self.hourElement.focus();
                    break;
                case 38:
                case 40:
                    e.preventDefault();
                    const delta = e.keyCode === 40 ? 1 : -1;
                    if ((self.daysContainer &&
                        eventTarget.$i !== undefined) ||
                        eventTarget === self.input ||
                        eventTarget === self.altInput) {
                        if (e.ctrlKey) {
                            e.stopPropagation();
                            changeYear(self.currentYear - delta);
                            focusOnDay(getFirstAvailableDay(1), 0);
                        }
                        else if (!isTimeObj)
                            focusOnDay(undefined, delta * 7);
                    }
                    else if (eventTarget === self.currentYearElement) {
                        changeYear(self.currentYear - delta);
                    }
                    else if (self.config.enableTime) {
                        if (!isTimeObj && self.hourElement)
                            self.hourElement.focus();
                        updateTime(e);
                        self._debouncedChange();
                    }
                    break;
                case 9:
                    if (isTimeObj) {
                        const elems = [
                            self.hourElement,
                            self.minuteElement,
                            self.secondElement,
                            self.amPM,
                        ]
                            .concat(self.pluginElements)
                            .filter((x) => x);
                        const i = elems.indexOf(eventTarget);
                        if (i !== -1) {
                            const target = elems[i + (e.shiftKey ? -1 : 1)];
                            e.preventDefault();
                            (target || self._input).focus();
                        }
                    }
                    else if (!self.config.noCalendar &&
                        self.daysContainer &&
                        self.daysContainer.contains(eventTarget) &&
                        e.shiftKey) {
                        e.preventDefault();
                        self._input.focus();
                    }
                    break;
            }
        }
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            switch (e.key) {
                case self.l10n.amPM[0].charAt(0):
                case self.l10n.amPM[0].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[0];
                    setHoursFromInputs();
                    updateValue();
                    break;
                case self.l10n.amPM[1].charAt(0):
                case self.l10n.amPM[1].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[1];
                    setHoursFromInputs();
                    updateValue();
                    break;
            }
        }
        if (isInput || isCalendarElem(eventTarget)) {
            triggerEvent("onKeyDown", e);
        }
    }
    function onMouseOver(elem) {
        if (self.selectedDates.length !== 1 ||
            (elem &&
                (!elem.classList.contains("flatpickr-day") ||
                    elem.classList.contains("flatpickr-disabled"))))
            return;
        const hoverDate = elem
            ? elem.dateObj.getTime()
            : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
        let containsDisabled = false;
        let minRange = 0, maxRange = 0;
        for (let t = rangeStartDate; t < rangeEndDate; t += duration.DAY) {
            if (!isEnabled(new Date(t), true)) {
                containsDisabled =
                    containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                if (t < initialDate && (!minRange || t > minRange))
                    minRange = t;
                else if (t > initialDate && (!maxRange || t < maxRange))
                    maxRange = t;
            }
        }
        for (let m = 0; m < self.config.showMonths; m++) {
            const month = self.daysContainer.children[m];
            for (let i = 0, l = month.children.length; i < l; i++) {
                const dayElem = month.children[i], date = dayElem.dateObj;
                const timestamp = date.getTime();
                const outOfRange = (minRange > 0 && timestamp < minRange) ||
                    (maxRange > 0 && timestamp > maxRange);
                if (outOfRange) {
                    dayElem.classList.add("notAllowed");
                    ["inRange", "startRange", "endRange"].forEach((c) => {
                        dayElem.classList.remove(c);
                    });
                    continue;
                }
                else if (containsDisabled && !outOfRange)
                    continue;
                ["startRange", "inRange", "endRange", "notAllowed"].forEach((c) => {
                    dayElem.classList.remove(c);
                });
                if (elem !== undefined) {
                    elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                        ? "startRange"
                        : "endRange");
                    if (initialDate < hoverDate && timestamp === initialDate)
                        dayElem.classList.add("startRange");
                    else if (initialDate > hoverDate && timestamp === initialDate)
                        dayElem.classList.add("endRange");
                    if (timestamp >= minRange &&
                        (maxRange === 0 || timestamp <= maxRange) &&
                        isBetween(timestamp, initialDate, hoverDate))
                        dayElem.classList.add("inRange");
                }
            }
        }
    }
    function onResize() {
        if (self.isOpen && !self.config.static && !self.config.inline)
            positionCalendar();
    }
    function open(e, positionElement = self._positionElement) {
        if (self.isMobile === true) {
            if (e) {
                e.preventDefault();
                const eventTarget = getEventTarget(e);
                if (eventTarget) {
                    eventTarget.blur();
                }
            }
            if (self.mobileInput !== undefined) {
                self.mobileInput.focus();
                self.mobileInput.click();
            }
            triggerEvent("onOpen");
            return;
        }
        else if (self._input.disabled || self.config.inline) {
            return;
        }
        const wasOpen = self.isOpen;
        self.isOpen = true;
        if (!wasOpen) {
            self.calendarContainer.classList.add("open");
            self._input.classList.add("active");
            triggerEvent("onOpen");
            positionCalendar(positionElement);
        }
        if (self.config.enableTime === true && self.config.noCalendar === true) {
            if (self.config.allowInput === false &&
                (e === undefined ||
                    !self.timeContainer.contains(e.relatedTarget))) {
                setTimeout(() => self.hourElement.select(), 50);
            }
        }
    }
    function minMaxDateSetter(type) {
        return (date) => {
            const dateObj = (self.config[`_${type}Date`] = self.parseDate(date, self.config.dateFormat));
            const inverseDateObj = self.config[`_${type === "min" ? "max" : "min"}Date`];
            if (dateObj !== undefined) {
                self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                    dateObj.getHours() > 0 ||
                        dateObj.getMinutes() > 0 ||
                        dateObj.getSeconds() > 0;
            }
            if (self.selectedDates) {
                self.selectedDates = self.selectedDates.filter((d) => isEnabled(d));
                if (!self.selectedDates.length && type === "min")
                    setHoursFromDate(dateObj);
                updateValue();
            }
            if (self.daysContainer) {
                redraw();
                if (dateObj !== undefined)
                    self.currentYearElement[type] = dateObj.getFullYear().toString();
                else
                    self.currentYearElement.removeAttribute(type);
                self.currentYearElement.disabled =
                    !!inverseDateObj &&
                        dateObj !== undefined &&
                        inverseDateObj.getFullYear() === dateObj.getFullYear();
            }
        };
    }
    function parseConfig() {
        const boolOpts = [
            "wrap",
            "weekNumbers",
            "allowInput",
            "allowInvalidPreload",
            "clickOpens",
            "time_24hr",
            "enableTime",
            "noCalendar",
            "altInput",
            "shorthandCurrentMonth",
            "inline",
            "static",
            "enableSeconds",
            "disableMobile",
        ];
        const userConfig = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
        const formats = {};
        self.config.parseDate = userConfig.parseDate;
        self.config.formatDate = userConfig.formatDate;
        Object.defineProperty(self.config, "enable", {
            get: () => self.config._enable,
            set: (dates) => {
                self.config._enable = parseDateRules(dates);
            },
        });
        Object.defineProperty(self.config, "disable", {
            get: () => self.config._disable,
            set: (dates) => {
                self.config._disable = parseDateRules(dates);
            },
        });
        const timeMode = userConfig.mode === "time";
        if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
            const defaultDateFormat = flatpickr.defaultConfig.dateFormat || defaults.dateFormat;
            formats.dateFormat =
                userConfig.noCalendar || timeMode
                    ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                    : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
        }
        if (userConfig.altInput &&
            (userConfig.enableTime || timeMode) &&
            !userConfig.altFormat) {
            const defaultAltFormat = flatpickr.defaultConfig.altFormat || defaults.altFormat;
            formats.altFormat =
                userConfig.noCalendar || timeMode
                    ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                    : defaultAltFormat + ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
        }
        Object.defineProperty(self.config, "minDate", {
            get: () => self.config._minDate,
            set: minMaxDateSetter("min"),
        });
        Object.defineProperty(self.config, "maxDate", {
            get: () => self.config._maxDate,
            set: minMaxDateSetter("max"),
        });
        const minMaxTimeSetter = (type) => (val) => {
            self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
        };
        Object.defineProperty(self.config, "minTime", {
            get: () => self.config._minTime,
            set: minMaxTimeSetter("min"),
        });
        Object.defineProperty(self.config, "maxTime", {
            get: () => self.config._maxTime,
            set: minMaxTimeSetter("max"),
        });
        if (userConfig.mode === "time") {
            self.config.noCalendar = true;
            self.config.enableTime = true;
        }
        Object.assign(self.config, formats, userConfig);
        for (let i = 0; i < boolOpts.length; i++)
            self.config[boolOpts[i]] =
                self.config[boolOpts[i]] === true ||
                    self.config[boolOpts[i]] === "true";
        HOOKS.filter((hook) => self.config[hook] !== undefined).forEach((hook) => {
            self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
        });
        self.isMobile =
            !self.config.disableMobile &&
                !self.config.inline &&
                self.config.mode === "single" &&
                !self.config.disable.length &&
                !self.config.enable &&
                !self.config.weekNumbers &&
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        for (let i = 0; i < self.config.plugins.length; i++) {
            const pluginConf = self.config.plugins[i](self) || {};
            for (const key in pluginConf) {
                if (HOOKS.indexOf(key) > -1) {
                    self.config[key] = arrayify(pluginConf[key])
                        .map(bindToInstance)
                        .concat(self.config[key]);
                }
                else if (typeof userConfig[key] === "undefined")
                    self.config[key] = pluginConf[key];
            }
        }
        if (!userConfig.altInputClass) {
            self.config.altInputClass =
                getInputElem().className + " " + self.config.altInputClass;
        }
        triggerEvent("onParseConfig");
    }
    function getInputElem() {
        return self.config.wrap
            ? element.querySelector("[data-input]")
            : element;
    }
    function setupLocale() {
        if (typeof self.config.locale !== "object" &&
            typeof flatpickr.l10ns[self.config.locale] === "undefined")
            self.config.errorHandler(new Error(`flatpickr: invalid locale ${self.config.locale}`));
        self.l10n = Object.assign(Object.assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
            ? self.config.locale
            : self.config.locale !== "default"
                ? flatpickr.l10ns[self.config.locale]
                : undefined));
        tokenRegex.K = `(${self.l10n.amPM[0]}|${self.l10n.amPM[1]}|${self.l10n.amPM[0].toLowerCase()}|${self.l10n.amPM[1].toLowerCase()})`;
        const userConfig = Object.assign(Object.assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
        if (userConfig.time_24hr === undefined &&
            flatpickr.defaultConfig.time_24hr === undefined) {
            self.config.time_24hr = self.l10n.time_24hr;
        }
        self.formatDate = createDateFormatter(self);
        self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
    }
    function positionCalendar(customPositionElement) {
        if (typeof self.config.position === "function") {
            return void self.config.position(self, customPositionElement);
        }
        if (self.calendarContainer === undefined)
            return;
        triggerEvent("onPreCalendarPosition");
        const positionElement = customPositionElement || self._positionElement;
        const calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, ((acc, child) => acc + child.offsetHeight), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
            (configPosVertical !== "below" &&
                distanceFromBottom < calendarHeight &&
                inputBounds.top > calendarHeight);
        const top = window.pageYOffset +
            inputBounds.top +
            (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
        toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
        toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
        if (self.config.inline)
            return;
        let left = window.pageXOffset + inputBounds.left;
        let isCenter = false;
        let isRight = false;
        if (configPosHorizontal === "center") {
            left -= (calendarWidth - inputBounds.width) / 2;
            isCenter = true;
        }
        else if (configPosHorizontal === "right") {
            left -= calendarWidth - inputBounds.width;
            isRight = true;
        }
        toggleClass(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
        toggleClass(self.calendarContainer, "arrowCenter", isCenter);
        toggleClass(self.calendarContainer, "arrowRight", isRight);
        const right = window.document.body.offsetWidth -
            (window.pageXOffset + inputBounds.right);
        const rightMost = left + calendarWidth > window.document.body.offsetWidth;
        const centerMost = right + calendarWidth > window.document.body.offsetWidth;
        toggleClass(self.calendarContainer, "rightMost", rightMost);
        if (self.config.static)
            return;
        self.calendarContainer.style.top = `${top}px`;
        if (!rightMost) {
            self.calendarContainer.style.left = `${left}px`;
            self.calendarContainer.style.right = "auto";
        }
        else if (!centerMost) {
            self.calendarContainer.style.left = "auto";
            self.calendarContainer.style.right = `${right}px`;
        }
        else {
            const doc = getDocumentStyleSheet();
            if (doc === undefined)
                return;
            const bodyWidth = window.document.body.offsetWidth;
            const centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
            const centerBefore = ".flatpickr-calendar.centerMost:before";
            const centerAfter = ".flatpickr-calendar.centerMost:after";
            const centerIndex = doc.cssRules.length;
            const centerStyle = `{left:${inputBounds.left}px;right:auto;}`;
            toggleClass(self.calendarContainer, "rightMost", false);
            toggleClass(self.calendarContainer, "centerMost", true);
            doc.insertRule(`${centerBefore},${centerAfter}${centerStyle}`, centerIndex);
            self.calendarContainer.style.left = `${centerLeft}px`;
            self.calendarContainer.style.right = "auto";
        }
    }
    function getDocumentStyleSheet() {
        let editableSheet = null;
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            try {
                sheet.cssRules;
            }
            catch (err) {
                continue;
            }
            editableSheet = sheet;
            break;
        }
        return editableSheet != null ? editableSheet : createStyleSheet();
    }
    function createStyleSheet() {
        const style = document.createElement("style");
        document.head.appendChild(style);
        return style.sheet;
    }
    function redraw() {
        if (self.config.noCalendar || self.isMobile)
            return;
        buildMonthSwitch();
        updateNavigationCurrentMonth();
        buildDays();
    }
    function focusAndClose() {
        self._input.focus();
        if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
            navigator.msMaxTouchPoints !== undefined) {
            setTimeout(self.close, 0);
        }
        else {
            self.close();
        }
    }
    function selectDate(e) {
        e.preventDefault();
        e.stopPropagation();
        const isSelectable = (day) => day.classList &&
            day.classList.contains("flatpickr-day") &&
            !day.classList.contains("flatpickr-disabled") &&
            !day.classList.contains("notAllowed");
        const t = findParent(getEventTarget(e), isSelectable);
        if (t === undefined)
            return;
        const target = t;
        const selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
        const shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
            selectedDate.getMonth() >
                self.currentMonth + self.config.showMonths - 1) &&
            self.config.mode !== "range";
        self.selectedDateElem = target;
        if (self.config.mode === "single")
            self.selectedDates = [selectedDate];
        else if (self.config.mode === "multiple") {
            const selectedIndex = isDateSelected(selectedDate);
            if (selectedIndex)
                self.selectedDates.splice(parseInt(selectedIndex), 1);
            else
                self.selectedDates.push(selectedDate);
        }
        else if (self.config.mode === "range") {
            if (self.selectedDates.length === 2) {
                self.clear(false, false);
            }
            self.latestSelectedDateObj = selectedDate;
            self.selectedDates.push(selectedDate);
            if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
                self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
        }
        setHoursFromInputs();
        if (shouldChangeMonth) {
            const isNewYear = self.currentYear !== selectedDate.getFullYear();
            self.currentYear = selectedDate.getFullYear();
            self.currentMonth = selectedDate.getMonth();
            if (isNewYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            triggerEvent("onMonthChange");
        }
        updateNavigationCurrentMonth();
        buildDays();
        updateValue();
        if (!shouldChangeMonth &&
            self.config.mode !== "range" &&
            self.config.showMonths === 1)
            focusOnDayElem(target);
        else if (self.selectedDateElem !== undefined &&
            self.hourElement === undefined) {
            self.selectedDateElem && self.selectedDateElem.focus();
        }
        if (self.hourElement !== undefined)
            self.hourElement !== undefined && self.hourElement.focus();
        if (self.config.closeOnSelect) {
            const single = self.config.mode === "single" && !self.config.enableTime;
            const range = self.config.mode === "range" &&
                self.selectedDates.length === 2 &&
                !self.config.enableTime;
            if (single || range) {
                focusAndClose();
            }
        }
        triggerChange();
    }
    const CALLBACKS = {
        locale: [setupLocale, updateWeekdays],
        showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
        minDate: [jumpToDate],
        maxDate: [jumpToDate],
        clickOpens: [
            () => {
                if (self.config.clickOpens === true) {
                    bind(self._input, "focus", self.open);
                    bind(self._input, "click", self.open);
                }
                else {
                    self._input.removeEventListener("focus", self.open);
                    self._input.removeEventListener("click", self.open);
                }
            },
        ],
    };
    function set(option, value) {
        if (option !== null && typeof option === "object") {
            Object.assign(self.config, option);
            for (const key in option) {
                if (CALLBACKS[key] !== undefined)
                    CALLBACKS[key].forEach((x) => x());
            }
        }
        else {
            self.config[option] = value;
            if (CALLBACKS[option] !== undefined)
                CALLBACKS[option].forEach((x) => x());
            else if (HOOKS.indexOf(option) > -1)
                self.config[option] = arrayify(value);
        }
        self.redraw();
        updateValue(true);
    }
    function setSelectedDate(inputDate, format) {
        let dates = [];
        if (inputDate instanceof Array)
            dates = inputDate.map((d) => self.parseDate(d, format));
        else if (inputDate instanceof Date || typeof inputDate === "number")
            dates = [self.parseDate(inputDate, format)];
        else if (typeof inputDate === "string") {
            switch (self.config.mode) {
                case "single":
                case "time":
                    dates = [self.parseDate(inputDate, format)];
                    break;
                case "multiple":
                    dates = inputDate
                        .split(self.config.conjunction)
                        .map((date) => self.parseDate(date, format));
                    break;
                case "range":
                    dates = inputDate
                        .split(self.l10n.rangeSeparator)
                        .map((date) => self.parseDate(date, format));
                    break;
            }
        }
        else
            self.config.errorHandler(new Error(`Invalid date supplied: ${JSON.stringify(inputDate)}`));
        self.selectedDates = (self.config.allowInvalidPreload
            ? dates
            : dates.filter((d) => d instanceof Date && isEnabled(d, false)));
        if (self.config.mode === "range")
            self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }
    function setDate(date, triggerChange = false, format = self.config.dateFormat) {
        if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
            return self.clear(triggerChange);
        setSelectedDate(date, format);
        self.latestSelectedDateObj =
            self.selectedDates[self.selectedDates.length - 1];
        self.redraw();
        jumpToDate(undefined, triggerChange);
        setHoursFromDate();
        if (self.selectedDates.length === 0) {
            self.clear(false);
        }
        updateValue(triggerChange);
        if (triggerChange)
            triggerEvent("onChange");
    }
    function parseDateRules(arr) {
        return arr
            .slice()
            .map((rule) => {
            if (typeof rule === "string" ||
                typeof rule === "number" ||
                rule instanceof Date) {
                return self.parseDate(rule, undefined, true);
            }
            else if (rule &&
                typeof rule === "object" &&
                rule.from &&
                rule.to)
                return {
                    from: self.parseDate(rule.from, undefined),
                    to: self.parseDate(rule.to, undefined),
                };
            return rule;
        })
            .filter((x) => x);
    }
    function setupDates() {
        self.selectedDates = [];
        self.now = self.parseDate(self.config.now) || new Date();
        const preloadedDate = self.config.defaultDate ||
            ((self.input.nodeName === "INPUT" ||
                self.input.nodeName === "TEXTAREA") &&
                self.input.placeholder &&
                self.input.value === self.input.placeholder
                ? null
                : self.input.value);
        if (preloadedDate)
            setSelectedDate(preloadedDate, self.config.dateFormat);
        self._initialDate =
            self.selectedDates.length > 0
                ? self.selectedDates[0]
                : self.config.minDate &&
                    self.config.minDate.getTime() > self.now.getTime()
                    ? self.config.minDate
                    : self.config.maxDate &&
                        self.config.maxDate.getTime() < self.now.getTime()
                        ? self.config.maxDate
                        : self.now;
        self.currentYear = self._initialDate.getFullYear();
        self.currentMonth = self._initialDate.getMonth();
        if (self.selectedDates.length > 0)
            self.latestSelectedDateObj = self.selectedDates[0];
        if (self.config.minTime !== undefined)
            self.config.minTime = self.parseDate(self.config.minTime, "H:i");
        if (self.config.maxTime !== undefined)
            self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
        self.minDateHasTime =
            !!self.config.minDate &&
                (self.config.minDate.getHours() > 0 ||
                    self.config.minDate.getMinutes() > 0 ||
                    self.config.minDate.getSeconds() > 0);
        self.maxDateHasTime =
            !!self.config.maxDate &&
                (self.config.maxDate.getHours() > 0 ||
                    self.config.maxDate.getMinutes() > 0 ||
                    self.config.maxDate.getSeconds() > 0);
    }
    function setupInputs() {
        self.input = getInputElem();
        if (!self.input) {
            self.config.errorHandler(new Error("Invalid input element specified"));
            return;
        }
        self.input._type = self.input.type;
        self.input.type = "text";
        self.input.classList.add("flatpickr-input");
        self._input = self.input;
        if (self.config.altInput) {
            self.altInput = createElement(self.input.nodeName, self.config.altInputClass);
            self._input = self.altInput;
            self.altInput.placeholder = self.input.placeholder;
            self.altInput.disabled = self.input.disabled;
            self.altInput.required = self.input.required;
            self.altInput.tabIndex = self.input.tabIndex;
            self.altInput.type = "text";
            self.input.setAttribute("type", "hidden");
            if (!self.config.static && self.input.parentNode)
                self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
        }
        if (!self.config.allowInput)
            self._input.setAttribute("readonly", "readonly");
        self._positionElement = self.config.positionElement || self._input;
    }
    function setupMobile() {
        const inputType = self.config.enableTime
            ? self.config.noCalendar
                ? "time"
                : "datetime-local"
            : "date";
        self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
        self.mobileInput.tabIndex = 1;
        self.mobileInput.type = inputType;
        self.mobileInput.disabled = self.input.disabled;
        self.mobileInput.required = self.input.required;
        self.mobileInput.placeholder = self.input.placeholder;
        self.mobileFormatStr =
            inputType === "datetime-local"
                ? "Y-m-d\\TH:i:S"
                : inputType === "date"
                    ? "Y-m-d"
                    : "H:i:S";
        if (self.selectedDates.length > 0) {
            self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
        }
        if (self.config.minDate)
            self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
        if (self.config.maxDate)
            self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
        if (self.input.getAttribute("step"))
            self.mobileInput.step = String(self.input.getAttribute("step"));
        self.input.type = "hidden";
        if (self.altInput !== undefined)
            self.altInput.type = "hidden";
        try {
            if (self.input.parentNode)
                self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
        }
        catch (_a) { }
        bind(self.mobileInput, "change", (e) => {
            self.setDate(getEventTarget(e).value, false, self.mobileFormatStr);
            triggerEvent("onChange");
            triggerEvent("onClose");
        });
    }
    function toggle(e) {
        if (self.isOpen === true)
            return self.close();
        self.open(e);
    }
    function triggerEvent(event, data) {
        if (self.config === undefined)
            return;
        const hooks = self.config[event];
        if (hooks !== undefined && hooks.length > 0) {
            for (let i = 0; hooks[i] && i < hooks.length; i++)
                hooks[i](self.selectedDates, self.input.value, self, data);
        }
        if (event === "onChange") {
            self.input.dispatchEvent(createEvent("change"));
            self.input.dispatchEvent(createEvent("input"));
        }
    }
    function createEvent(name) {
        const e = document.createEvent("Event");
        e.initEvent(name, true, true);
        return e;
    }
    function isDateSelected(date) {
        for (let i = 0; i < self.selectedDates.length; i++) {
            if (compareDates(self.selectedDates[i], date) === 0)
                return "" + i;
        }
        return false;
    }
    function isDateInRange(date) {
        if (self.config.mode !== "range" || self.selectedDates.length < 2)
            return false;
        return (compareDates(date, self.selectedDates[0]) >= 0 &&
            compareDates(date, self.selectedDates[1]) <= 0);
    }
    function updateNavigationCurrentMonth() {
        if (self.config.noCalendar || self.isMobile || !self.monthNav)
            return;
        self.yearElements.forEach((yearElement, i) => {
            const d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                self.monthElements[i].textContent =
                    monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
            }
            else {
                self.monthsDropdownContainer.value = d.getMonth().toString();
            }
            yearElement.value = d.getFullYear().toString();
        });
        self._hidePrevMonthArrow =
            self.config.minDate !== undefined &&
                (self.currentYear === self.config.minDate.getFullYear()
                    ? self.currentMonth <= self.config.minDate.getMonth()
                    : self.currentYear < self.config.minDate.getFullYear());
        self._hideNextMonthArrow =
            self.config.maxDate !== undefined &&
                (self.currentYear === self.config.maxDate.getFullYear()
                    ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                    : self.currentYear > self.config.maxDate.getFullYear());
    }
    function getDateStr(format) {
        return self.selectedDates
            .map((dObj) => self.formatDate(dObj, format))
            .filter((d, i, arr) => self.config.mode !== "range" ||
            self.config.enableTime ||
            arr.indexOf(d) === i)
            .join(self.config.mode !== "range"
            ? self.config.conjunction
            : self.l10n.rangeSeparator);
    }
    function updateValue(triggerChange = true) {
        if (self.mobileInput !== undefined && self.mobileFormatStr) {
            self.mobileInput.value =
                self.latestSelectedDateObj !== undefined
                    ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                    : "";
        }
        self.input.value = getDateStr(self.config.dateFormat);
        if (self.altInput !== undefined) {
            self.altInput.value = getDateStr(self.config.altFormat);
        }
        if (triggerChange !== false)
            triggerEvent("onValueUpdate");
    }
    function onMonthNavClick(e) {
        const eventTarget = getEventTarget(e);
        const isPrevMonth = self.prevMonthNav.contains(eventTarget);
        const isNextMonth = self.nextMonthNav.contains(eventTarget);
        if (isPrevMonth || isNextMonth) {
            changeMonth(isPrevMonth ? -1 : 1);
        }
        else if (self.yearElements.indexOf(eventTarget) >= 0) {
            eventTarget.select();
        }
        else if (eventTarget.classList.contains("arrowUp")) {
            self.changeYear(self.currentYear + 1);
        }
        else if (eventTarget.classList.contains("arrowDown")) {
            self.changeYear(self.currentYear - 1);
        }
    }
    function timeWrapper(e) {
        e.preventDefault();
        const isKeyDown = e.type === "keydown", eventTarget = getEventTarget(e), input = eventTarget;
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            self.amPM.textContent =
                self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
        }
        const min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
            (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
        let newValue = curValue + step * delta;
        if (typeof input.value !== "undefined" && input.value.length === 2) {
            const isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
            if (newValue < min) {
                newValue =
                    max +
                        newValue +
                        int(!isHourElem) +
                        (int(isHourElem) && int(!self.amPM));
                if (isMinuteElem)
                    incrementNumInput(undefined, -1, self.hourElement);
            }
            else if (newValue > max) {
                newValue =
                    input === self.hourElement ? newValue - max - int(!self.amPM) : min;
                if (isMinuteElem)
                    incrementNumInput(undefined, 1, self.hourElement);
            }
            if (self.amPM &&
                isHourElem &&
                (step === 1
                    ? newValue + curValue === 23
                    : Math.abs(newValue - curValue) > step)) {
                self.amPM.textContent =
                    self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
            }
            input.value = pad(newValue);
        }
    }
    init();
    return self;
}
function _flatpickr(nodeList, config) {
    const nodes = Array.prototype.slice
        .call(nodeList)
        .filter((x) => x instanceof HTMLElement);
    const instances = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        try {
            if (node.getAttribute("data-fp-omit") !== null)
                continue;
            if (node._flatpickr !== undefined) {
                node._flatpickr.destroy();
                node._flatpickr = undefined;
            }
            node._flatpickr = FlatpickrInstance(node, config || {});
            instances.push(node._flatpickr);
        }
        catch (e) {
            console.error(e);
        }
    }
    return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
    HTMLElement.prototype.flatpickr = function (config) {
        return _flatpickr([this], config);
    };
}
var flatpickr = function (selector, config) {
    if (typeof selector === "string") {
        return _flatpickr(window.document.querySelectorAll(selector), config);
    }
    else if (selector instanceof Node) {
        return _flatpickr([selector], config);
    }
    else {
        return _flatpickr(selector, config);
    }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
    en: Object.assign({}, english),
    default: Object.assign({}, english),
};
flatpickr.localize = (l10n) => {
    flatpickr.l10ns.default = Object.assign(Object.assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = (config) => {
    flatpickr.defaultConfig = Object.assign(Object.assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = createDateParser({});
flatpickr.formatDate = createDateFormatter({});
flatpickr.compareDates = compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
    jQuery.fn.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
}
Date.prototype.fp_incr = function (days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".flatpickr-calendar{\n  background:transparent;\n  opacity:0;\n  display:none;\n  text-align:center;\n  visibility:hidden;\n  padding:0;\n  -webkit-animation:none;\n  animation:none;\n  direction:ltr;\n  border:0;\n  font-size:14px;\n  line-height:24px;\n  border-radius:5px;\n  position:absolute;\n  width:307.875px;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  -ms-touch-action:manipulation;\n  touch-action:manipulation;\n  background:#fff;\n  -webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,0.08);\n  box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,0.08)\n}\n\n.flatpickr-calendar.open,.flatpickr-calendar.inline{\n  opacity:1;\n  max-height:640px;\n  visibility:visible\n}\n\n.flatpickr-calendar.open{\n  display:inline-block;\n  z-index:99999\n}\n\n.flatpickr-calendar.animate.open{\n  -webkit-animation:fpFadeInDown 300ms cubic-bezier(.23,1,.32,1);\n  animation:fpFadeInDown 300ms cubic-bezier(.23,1,.32,1)\n}\n\n.flatpickr-calendar.inline{\n  display:block;\n  position:relative;\n  top:2px\n}\n\n.flatpickr-calendar.static{\n  position:absolute;\n  top:calc(100% + 2px)\n}\n\n.flatpickr-calendar.static.open{\n  z-index:999;\n  display:block\n}\n\n.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+1) .flatpickr-day.inRange:nth-child(7n+7){\n  -webkit-box-shadow:none !important;\n  box-shadow:none !important\n}\n\n.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+2) .flatpickr-day.inRange:nth-child(7n+1){\n  -webkit-box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6;\n  box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6\n}\n\n.flatpickr-calendar .hasWeeks .dayContainer,.flatpickr-calendar .hasTime .dayContainer{\n  border-bottom:0;\n  border-bottom-right-radius:0;\n  border-bottom-left-radius:0\n}\n\n.flatpickr-calendar .hasWeeks .dayContainer{\n  border-left:0\n}\n\n.flatpickr-calendar.hasTime .flatpickr-time{\n  height:40px;\n  border-top:1px solid #e6e6e6\n}\n\n.flatpickr-calendar.noCalendar.hasTime .flatpickr-time{\n  height:auto\n}\n\n.flatpickr-calendar:before,.flatpickr-calendar:after{\n  position:absolute;\n  display:block;\n  pointer-events:none;\n  border:solid transparent;\n  content:'';\n  height:0;\n  width:0;\n  left:22px\n}\n\n.flatpickr-calendar.rightMost:before,.flatpickr-calendar.arrowRight:before,.flatpickr-calendar.rightMost:after,.flatpickr-calendar.arrowRight:after{\n  left:auto;\n  right:22px\n}\n\n.flatpickr-calendar.arrowCenter:before,.flatpickr-calendar.arrowCenter:after{\n  left:50%;\n  right:50%\n}\n\n.flatpickr-calendar:before{\n  border-width:5px;\n  margin:0 -5px\n}\n\n.flatpickr-calendar:after{\n  border-width:4px;\n  margin:0 -4px\n}\n\n.flatpickr-calendar.arrowTop:before,.flatpickr-calendar.arrowTop:after{\n  bottom:100%\n}\n\n.flatpickr-calendar.arrowTop:before{\n  border-bottom-color:#e6e6e6\n}\n\n.flatpickr-calendar.arrowTop:after{\n  border-bottom-color:#fff\n}\n\n.flatpickr-calendar.arrowBottom:before,.flatpickr-calendar.arrowBottom:after{\n  top:100%\n}\n\n.flatpickr-calendar.arrowBottom:before{\n  border-top-color:#e6e6e6\n}\n\n.flatpickr-calendar.arrowBottom:after{\n  border-top-color:#fff\n}\n\n.flatpickr-calendar:focus{\n  outline:0\n}\n\n.flatpickr-wrapper{\n  position:relative;\n  display:inline-block\n}\n\n.flatpickr-months{\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex\n}\n\n.flatpickr-months .flatpickr-month{\n  background:transparent;\n  color:rgba(0,0,0,0.9);\n  fill:rgba(0,0,0,0.9);\n  height:34px;\n  line-height:1;\n  text-align:center;\n  position:relative;\n  -webkit-user-select:none;\n  -moz-user-select:none;\n  -ms-user-select:none;\n  user-select:none;\n  overflow:hidden;\n  -webkit-box-flex:1;\n  -webkit-flex:1;\n  -ms-flex:1;\n  flex:1\n}\n\n.flatpickr-months .flatpickr-prev-month,.flatpickr-months .flatpickr-next-month{\n  text-decoration:none;\n  cursor:pointer;\n  position:absolute;\n  top:0;\n  height:34px;\n  padding:10px;\n  z-index:3;\n  color:rgba(0,0,0,0.9);\n  fill:rgba(0,0,0,0.9)\n}\n\n.flatpickr-months .flatpickr-prev-month.flatpickr-disabled,.flatpickr-months .flatpickr-next-month.flatpickr-disabled{\n  display:none\n}\n\n.flatpickr-months .flatpickr-prev-month i,.flatpickr-months .flatpickr-next-month i{\n  position:relative\n}\n\n.flatpickr-months .flatpickr-prev-month.flatpickr-prev-month,.flatpickr-months .flatpickr-next-month.flatpickr-prev-month{\n  /*\n      /*rtl:begin:ignore*/\n  left:0\n  /*\n      /*rtl:end:ignore*/\n}\n\n/*\n      /*rtl:begin:ignore*/\n\n/*\n      /*rtl:end:ignore*/\n\n.flatpickr-months .flatpickr-prev-month.flatpickr-next-month,.flatpickr-months .flatpickr-next-month.flatpickr-next-month{\n  /*\n      /*rtl:begin:ignore*/\n  right:0\n  /*\n      /*rtl:end:ignore*/\n}\n\n/*\n      /*rtl:begin:ignore*/\n\n/*\n      /*rtl:end:ignore*/\n\n.flatpickr-months .flatpickr-prev-month:hover,.flatpickr-months .flatpickr-next-month:hover{\n  color:#959ea9\n}\n\n.flatpickr-months .flatpickr-prev-month:hover svg,.flatpickr-months .flatpickr-next-month:hover svg{\n  fill:#f64747\n}\n\n.flatpickr-months .flatpickr-prev-month svg,.flatpickr-months .flatpickr-next-month svg{\n  width:14px;\n  height:14px\n}\n\n.flatpickr-months .flatpickr-prev-month svg path,.flatpickr-months .flatpickr-next-month svg path{\n  -webkit-transition:fill .1s;\n  transition:fill .1s;\n  fill:inherit\n}\n\n.numInputWrapper{\n  position:relative;\n  height:auto\n}\n\n.numInputWrapper input,.numInputWrapper span{\n  display:inline-block\n}\n\n.numInputWrapper input{\n  width:100%\n}\n\n.numInputWrapper input::-ms-clear{\n  display:none\n}\n\n.numInputWrapper input::-webkit-outer-spin-button,.numInputWrapper input::-webkit-inner-spin-button{\n  margin:0;\n  -webkit-appearance:none\n}\n\n.numInputWrapper span{\n  position:absolute;\n  right:0;\n  width:14px;\n  padding:0 4px 0 2px;\n  height:50%;\n  line-height:50%;\n  opacity:0;\n  cursor:pointer;\n  border:1px solid rgba(57,57,57,0.15);\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box\n}\n\n.numInputWrapper span:hover{\n  background:rgba(0,0,0,0.1)\n}\n\n.numInputWrapper span:active{\n  background:rgba(0,0,0,0.2)\n}\n\n.numInputWrapper span:after{\n  display:block;\n  content:\"\";\n  position:absolute\n}\n\n.numInputWrapper span.arrowUp{\n  top:0;\n  border-bottom:0\n}\n\n.numInputWrapper span.arrowUp:after{\n  border-left:4px solid transparent;\n  border-right:4px solid transparent;\n  border-bottom:4px solid rgba(57,57,57,0.6);\n  top:26%\n}\n\n.numInputWrapper span.arrowDown{\n  top:50%\n}\n\n.numInputWrapper span.arrowDown:after{\n  border-left:4px solid transparent;\n  border-right:4px solid transparent;\n  border-top:4px solid rgba(57,57,57,0.6);\n  top:40%\n}\n\n.numInputWrapper span svg{\n  width:inherit;\n  height:auto\n}\n\n.numInputWrapper span svg path{\n  fill:rgba(0,0,0,0.5)\n}\n\n.numInputWrapper:hover{\n  background:rgba(0,0,0,0.05)\n}\n\n.numInputWrapper:hover span{\n  opacity:1\n}\n\n.flatpickr-current-month{\n  font-size:135%;\n  line-height:inherit;\n  font-weight:300;\n  color:inherit;\n  position:absolute;\n  width:75%;\n  left:12.5%;\n  padding:7.48px 0 0 0;\n  line-height:1;\n  height:34px;\n  display:inline-block;\n  text-align:center;\n  -webkit-transform:translate3d(0,0,0);\n  transform:translate3d(0,0,0)\n}\n\n.flatpickr-current-month span.cur-month{\n  font-family:inherit;\n  font-weight:700;\n  color:inherit;\n  display:inline-block;\n  margin-left:.5ch;\n  padding:0\n}\n\n.flatpickr-current-month span.cur-month:hover{\n  background:rgba(0,0,0,0.05)\n}\n\n.flatpickr-current-month .numInputWrapper{\n  width:6ch;\n  width:7ch\\0;\n  display:inline-block\n}\n\n.flatpickr-current-month .numInputWrapper span.arrowUp:after{\n  border-bottom-color:rgba(0,0,0,0.9)\n}\n\n.flatpickr-current-month .numInputWrapper span.arrowDown:after{\n  border-top-color:rgba(0,0,0,0.9)\n}\n\n.flatpickr-current-month input.cur-year{\n  background:transparent;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  color:inherit;\n  cursor:text;\n  padding:0 0 0 .5ch;\n  margin:0;\n  display:inline-block;\n  font-size:inherit;\n  font-family:inherit;\n  font-weight:300;\n  line-height:inherit;\n  height:auto;\n  border:0;\n  border-radius:0;\n  vertical-align:initial;\n  -webkit-appearance:textfield;\n  -moz-appearance:textfield;\n  appearance:textfield\n}\n\n.flatpickr-current-month input.cur-year:focus{\n  outline:0\n}\n\n.flatpickr-current-month input.cur-year[disabled],.flatpickr-current-month input.cur-year[disabled]:hover{\n  font-size:100%;\n  color:rgba(0,0,0,0.5);\n  background:transparent;\n  pointer-events:none\n}\n\n.flatpickr-current-month .flatpickr-monthDropdown-months{\n  appearance:menulist;\n  background:transparent;\n  border:none;\n  border-radius:0;\n  box-sizing:border-box;\n  color:inherit;\n  cursor:pointer;\n  font-size:inherit;\n  font-family:inherit;\n  font-weight:300;\n  height:auto;\n  line-height:inherit;\n  margin:-1px 0 0 0;\n  outline:none;\n  padding:0 0 0 .5ch;\n  position:relative;\n  vertical-align:initial;\n  -webkit-box-sizing:border-box;\n  -webkit-appearance:menulist;\n  -moz-appearance:menulist;\n  width:auto\n}\n\n.flatpickr-current-month .flatpickr-monthDropdown-months:focus,.flatpickr-current-month .flatpickr-monthDropdown-months:active{\n  outline:none\n}\n\n.flatpickr-current-month .flatpickr-monthDropdown-months:hover{\n  background:rgba(0,0,0,0.05)\n}\n\n.flatpickr-current-month .flatpickr-monthDropdown-months .flatpickr-monthDropdown-month{\n  background-color:transparent;\n  outline:none;\n  padding:0\n}\n\n.flatpickr-weekdays{\n  background:transparent;\n  text-align:center;\n  overflow:hidden;\n  width:100%;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex;\n  -webkit-box-align:center;\n  -webkit-align-items:center;\n  -ms-flex-align:center;\n  align-items:center;\n  height:28px\n}\n\n.flatpickr-weekdays .flatpickr-weekdaycontainer{\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex;\n  -webkit-box-flex:1;\n  -webkit-flex:1;\n  -ms-flex:1;\n  flex:1\n}\n\nspan.flatpickr-weekday{\n  cursor:default;\n  font-size:90%;\n  background:transparent;\n  color:rgba(0,0,0,0.54);\n  line-height:1;\n  margin:0;\n  text-align:center;\n  display:block;\n  -webkit-box-flex:1;\n  -webkit-flex:1;\n  -ms-flex:1;\n  flex:1;\n  font-weight:bolder\n}\n\n.dayContainer,.flatpickr-weeks{\n  padding:1px 0 0 0\n}\n\n.flatpickr-days{\n  position:relative;\n  overflow:hidden;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex;\n  -webkit-box-align:start;\n  -webkit-align-items:flex-start;\n  -ms-flex-align:start;\n  align-items:flex-start;\n  width:307.875px\n}\n\n.flatpickr-days:focus{\n  outline:0\n}\n\n.dayContainer{\n  padding:0;\n  outline:0;\n  text-align:left;\n  width:307.875px;\n  min-width:307.875px;\n  max-width:307.875px;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  display:inline-block;\n  display:-ms-flexbox;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:flex;\n  -webkit-flex-wrap:wrap;\n  flex-wrap:wrap;\n  -ms-flex-wrap:wrap;\n  -ms-flex-pack:justify;\n  -webkit-justify-content:space-around;\n  justify-content:space-around;\n  -webkit-transform:translate3d(0,0,0);\n  transform:translate3d(0,0,0);\n  opacity:1\n}\n\n.dayContainer + .dayContainer{\n  -webkit-box-shadow:-1px 0 0 #e6e6e6;\n  box-shadow:-1px 0 0 #e6e6e6\n}\n\n.flatpickr-day{\n  background:none;\n  border:1px solid transparent;\n  border-radius:150px;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  color:#393939;\n  cursor:pointer;\n  font-weight:400;\n  width:14.2857143%;\n  -webkit-flex-basis:14.2857143%;\n  -ms-flex-preferred-size:14.2857143%;\n  flex-basis:14.2857143%;\n  max-width:39px;\n  height:39px;\n  line-height:39px;\n  margin:0;\n  display:inline-block;\n  position:relative;\n  -webkit-box-pack:center;\n  -webkit-justify-content:center;\n  -ms-flex-pack:center;\n  justify-content:center;\n  text-align:center\n}\n\n.flatpickr-day.inRange,.flatpickr-day.prevMonthDay.inRange,.flatpickr-day.nextMonthDay.inRange,.flatpickr-day.today.inRange,.flatpickr-day.prevMonthDay.today.inRange,.flatpickr-day.nextMonthDay.today.inRange,.flatpickr-day:hover,.flatpickr-day.prevMonthDay:hover,.flatpickr-day.nextMonthDay:hover,.flatpickr-day:focus,.flatpickr-day.prevMonthDay:focus,.flatpickr-day.nextMonthDay:focus{\n  cursor:pointer;\n  outline:0;\n  background:#e6e6e6;\n  border-color:#e6e6e6\n}\n\n.flatpickr-day.today{\n  border-color:#959ea9\n}\n\n.flatpickr-day.today:hover,.flatpickr-day.today:focus{\n  border-color:#959ea9;\n  background:#959ea9;\n  color:#fff\n}\n\n.flatpickr-day.selected,.flatpickr-day.startRange,.flatpickr-day.endRange,.flatpickr-day.selected.inRange,.flatpickr-day.startRange.inRange,.flatpickr-day.endRange.inRange,.flatpickr-day.selected:focus,.flatpickr-day.startRange:focus,.flatpickr-day.endRange:focus,.flatpickr-day.selected:hover,.flatpickr-day.startRange:hover,.flatpickr-day.endRange:hover,.flatpickr-day.selected.prevMonthDay,.flatpickr-day.startRange.prevMonthDay,.flatpickr-day.endRange.prevMonthDay,.flatpickr-day.selected.nextMonthDay,.flatpickr-day.startRange.nextMonthDay,.flatpickr-day.endRange.nextMonthDay{\n  background:#569ff7;\n  -webkit-box-shadow:none;\n  box-shadow:none;\n  color:#fff;\n  border-color:#569ff7\n}\n\n.flatpickr-day.selected.startRange,.flatpickr-day.startRange.startRange,.flatpickr-day.endRange.startRange{\n  border-radius:50px 0 0 50px\n}\n\n.flatpickr-day.selected.endRange,.flatpickr-day.startRange.endRange,.flatpickr-day.endRange.endRange{\n  border-radius:0 50px 50px 0\n}\n\n.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)),.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)),.flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)){\n  -webkit-box-shadow:-10px 0 0 #569ff7;\n  box-shadow:-10px 0 0 #569ff7\n}\n\n.flatpickr-day.selected.startRange.endRange,.flatpickr-day.startRange.startRange.endRange,.flatpickr-day.endRange.startRange.endRange{\n  border-radius:50px\n}\n\n.flatpickr-day.inRange{\n  border-radius:0;\n  -webkit-box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6;\n  box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6\n}\n\n.flatpickr-day.flatpickr-disabled,.flatpickr-day.flatpickr-disabled:hover,.flatpickr-day.prevMonthDay,.flatpickr-day.nextMonthDay,.flatpickr-day.notAllowed,.flatpickr-day.notAllowed.prevMonthDay,.flatpickr-day.notAllowed.nextMonthDay{\n  color:rgba(57,57,57,0.3);\n  background:transparent;\n  border-color:transparent;\n  cursor:default\n}\n\n.flatpickr-day.flatpickr-disabled,.flatpickr-day.flatpickr-disabled:hover{\n  cursor:not-allowed;\n  color:rgba(57,57,57,0.1)\n}\n\n.flatpickr-day.week.selected{\n  border-radius:0;\n  -webkit-box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7;\n  box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7\n}\n\n.flatpickr-day.hidden{\n  visibility:hidden\n}\n\n.rangeMode .flatpickr-day{\n  margin-top:1px\n}\n\n.flatpickr-weekwrapper{\n  float:left\n}\n\n.flatpickr-weekwrapper .flatpickr-weeks{\n  padding:0 12px;\n  -webkit-box-shadow:1px 0 0 #e6e6e6;\n  box-shadow:1px 0 0 #e6e6e6\n}\n\n.flatpickr-weekwrapper .flatpickr-weekday{\n  float:none;\n  width:100%;\n  line-height:28px\n}\n\n.flatpickr-weekwrapper span.flatpickr-day,.flatpickr-weekwrapper span.flatpickr-day:hover{\n  display:block;\n  width:100%;\n  max-width:none;\n  color:rgba(57,57,57,0.3);\n  background:transparent;\n  cursor:default;\n  border:none\n}\n\n.flatpickr-innerContainer{\n  display:block;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  overflow:hidden\n}\n\n.flatpickr-rContainer{\n  display:inline-block;\n  padding:0;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box\n}\n\n.flatpickr-time{\n  text-align:center;\n  outline:0;\n  display:block;\n  height:0;\n  line-height:40px;\n  max-height:40px;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  overflow:hidden;\n  display:-webkit-box;\n  display:-webkit-flex;\n  display:-ms-flexbox;\n  display:flex\n}\n\n.flatpickr-time:after{\n  content:\"\";\n  display:table;\n  clear:both\n}\n\n.flatpickr-time .numInputWrapper{\n  -webkit-box-flex:1;\n  -webkit-flex:1;\n  -ms-flex:1;\n  flex:1;\n  width:40%;\n  height:40px;\n  float:left\n}\n\n.flatpickr-time .numInputWrapper span.arrowUp:after{\n  border-bottom-color:#393939\n}\n\n.flatpickr-time .numInputWrapper span.arrowDown:after{\n  border-top-color:#393939\n}\n\n.flatpickr-time.hasSeconds .numInputWrapper{\n  width:26%\n}\n\n.flatpickr-time.time24hr .numInputWrapper{\n  width:49%\n}\n\n.flatpickr-time input{\n  background:transparent;\n  -webkit-box-shadow:none;\n  box-shadow:none;\n  border:0;\n  border-radius:0;\n  text-align:center;\n  margin:0;\n  padding:0;\n  height:inherit;\n  line-height:inherit;\n  color:#393939;\n  font-size:14px;\n  position:relative;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  -webkit-appearance:textfield;\n  -moz-appearance:textfield;\n  appearance:textfield\n}\n\n.flatpickr-time input.flatpickr-hour{\n  font-weight:bold\n}\n\n.flatpickr-time input.flatpickr-minute,.flatpickr-time input.flatpickr-second{\n  font-weight:400\n}\n\n.flatpickr-time input:focus{\n  outline:0;\n  border:0\n}\n\n.flatpickr-time .flatpickr-time-separator,.flatpickr-time .flatpickr-am-pm{\n  height:inherit;\n  float:left;\n  line-height:inherit;\n  color:#393939;\n  font-weight:bold;\n  width:2%;\n  -webkit-user-select:none;\n  -moz-user-select:none;\n  -ms-user-select:none;\n  user-select:none;\n  -webkit-align-self:center;\n  -ms-flex-item-align:center;\n  align-self:center\n}\n\n.flatpickr-time .flatpickr-am-pm{\n  outline:0;\n  width:18%;\n  cursor:pointer;\n  text-align:center;\n  font-weight:400\n}\n\n.flatpickr-time input:hover,.flatpickr-time .flatpickr-am-pm:hover,.flatpickr-time input:focus,.flatpickr-time .flatpickr-am-pm:focus{\n  background:#eee\n}\n\n.flatpickr-input[readonly]{\n  cursor:pointer\n}\n\n@-webkit-keyframes fpFadeInDown{\n  from{\n    opacity:0;\n    -webkit-transform:translate3d(0,-20px,0);\n    transform:translate3d(0,-20px,0)\n  }\n\n  to{\n    opacity:1;\n    -webkit-transform:translate3d(0,0,0);\n    transform:translate3d(0,0,0)\n  }\n}\n\n@keyframes fpFadeInDown{\n  from{\n    opacity:0;\n    -webkit-transform:translate3d(0,-20px,0);\n    transform:translate3d(0,-20px,0)\n  }\n\n  to{\n    opacity:1;\n    -webkit-transform:translate3d(0,0,0);\n    transform:translate3d(0,0,0)\n  }\n}";
styleInject(css_248z);

var _dec$c, _dec2$a, _dec3$a, _dec4$9, _class$c, _class2$a, _descriptor$a, _descriptor2$8;
let DateRangePicker = (_dec$c = Options({
  name: "DateRangePicker"
}), _dec2$a = Prop({
  type: Object,
  required: true
}), _dec3$a = Prop({
  type: Number,
  required: false
}), _dec4$9 = Emit("update:modelValue"), _dec$c(_class$c = (_class2$a = class DateRangePicker extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "modelValue", _descriptor$a, this);

    _initializerDefineProperty(this, "startDate", _descriptor2$8, this);
  }

  updateModelValue(value) {
    return value;
  }

  mounted() {
    flatpickr(this.$el, {
      dateFormat: "m-d-Y",
      mode: "range",
      maxDate: new Date(),
      // So far, we cannot have options past today for ranges
      minDate: this.startDate,
      onClose: selectedDates => {
        if (selectedDates.length === 2) {
          this.updateModelValue({
            minDate: selectedDates[0].getTime() / 1000,
            maxDate: Math.floor(selectedDates[1].setHours(23, 59, 59, 999) / 1000)
          });
        } else if (selectedDates.length === 0) {
          this.updateModelValue({
            minDate: 0,
            maxDate: 0
          });
        }
      }
    });
  }

}, (_descriptor$a = _applyDecoratedDescriptor(_class2$a.prototype, "modelValue", [_dec2$a], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$8 = _applyDecoratedDescriptor(_class2$a.prototype, "startDate", [_dec3$a], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$a.prototype, "updateModelValue", [_dec4$9], Object.getOwnPropertyDescriptor(_class2$a.prototype, "updateModelValue"), _class2$a.prototype)), _class2$a)) || _class$c);

const _hoisted_1$b = {
  type: "text",
  class: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
  placeholder: "mm-dd-yyyy range"
};
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("input", _hoisted_1$b);
}

DateRangePicker.render = render$i;

var _dec$b, _dec2$9, _dec3$9, _dec4$8, _dec5$6, _dec6$4, _class$b, _class2$9, _descriptor$9, _descriptor2$7, _descriptor3$6;
let DateFilter = (_dec$b = Options({
  components: {
    DateRangePicker
  },
  name: "DateFilter"
}), _dec2$9 = Prop({
  type: Object,
  required: true
}), _dec3$9 = Prop({
  type: String,
  required: true
}), _dec4$8 = Prop({
  type: String,
  required: true
}), _dec5$6 = Emit(), _dec6$4 = Emit(), _dec$b(_class$b = (_class2$9 = class DateFilter extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "dateRange", _descriptor$9, this);

    _initializerDefineProperty(this, "sortDir", _descriptor2$7, this);

    _initializerDefineProperty(this, "title", _descriptor3$6, this);
  }

  sortDirChanged(sortDir) {
    return sortDir;
  }

  dateRangeChanged(dateRange) {
    return dateRange;
  }

}, (_descriptor$9 = _applyDecoratedDescriptor(_class2$9.prototype, "dateRange", [_dec2$9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$7 = _applyDecoratedDescriptor(_class2$9.prototype, "sortDir", [_dec3$9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$6 = _applyDecoratedDescriptor(_class2$9.prototype, "title", [_dec4$8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$9.prototype, "sortDirChanged", [_dec5$6], Object.getOwnPropertyDescriptor(_class2$9.prototype, "sortDirChanged"), _class2$9.prototype), _applyDecoratedDescriptor(_class2$9.prototype, "dateRangeChanged", [_dec6$4], Object.getOwnPropertyDescriptor(_class2$9.prototype, "dateRangeChanged"), _class2$9.prototype)), _class2$9)) || _class$b);

const _hoisted_1$a = {
  class: "md:flex md:items-center md:justify-between bg-white mx-auto py-4 border-t border-gray-100"
};
const _hoisted_2$9 = {
  class: "flex-1 min-w-0"
};
const _hoisted_3$8 = {
  class: "text-lg leading-6 font-semibold text-gray-900"
};
const _hoisted_4$7 = {
  class: "mt-4 flex md:mt-0 md:ml-4"
};

const _hoisted_5$6 = /*#__PURE__*/createVNode("option", {
  value: "DESC"
}, "Newest-Oldest", -1);

const _hoisted_6$6 = /*#__PURE__*/createVNode("option", {
  value: "ASC"
}, "Oldest-Newest", -1);

function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DateRangePicker = resolveComponent("DateRangePicker");

  return openBlock(), createBlock("div", _hoisted_1$a, [createVNode("div", _hoisted_2$9, [createVNode("h1", _hoisted_3$8, toDisplayString(_ctx.title), 1)]), createVNode("div", _hoisted_4$7, [createVNode("select", {
    onChange: _cache[1] || (_cache[1] = $event => _ctx.sortDirChanged($event.target.value)),
    class: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  }, [_hoisted_5$6, _hoisted_6$6], 32), createVNode(_component_DateRangePicker, {
    modelValue: _ctx.dateRange,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => _ctx.dateRangeChanged($event)),
    class: "ml-3"
  }, null, 8, ["modelValue"])])]);
}

DateFilter.render = render$h;

var _dec$a, _dec2$8, _dec3$8, _class$a, _class2$8, _descriptor$8;
let Paginator = (_dec$a = Options({
  name: "Paginator"
}), _dec2$8 = Prop({
  type: Object,
  required: true
}), _dec3$8 = Emit("update:modelValue"), _dec$a(_class$a = (_class2$8 = class Paginator extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "modelValue", _descriptor$8, this);
  }

  updateModelValue() {
    return this.modelValue;
  }

  changePage(page) {
    this.modelValue.page = page;
    this.updateModelValue();
  }

  changePerPage(parent, perPage) {
    parent.blur();
    this.modelValue.page = 1;
    this.modelValue.perPage = perPage;
    this.updateModelValue();
  }

  get endingItem() {
    const end = this.modelValue.page * this.modelValue.perPage;
    return end > this.modelValue.totalItems ? this.modelValue.totalItems : end;
  }

  get pageShortcuts() {
    const shortcuts = []; // If total pages is less than or equal to 4, just return 1, 2, 3, 4

    if (this.modelValue.totalPages <= 4) {
      for (let i = 0; i < this.modelValue.totalPages; i++) {
        shortcuts.push(i + 1);
      }

      return shortcuts;
    } // If there are more than 3 pages left, show these
    // e.g. [4, 5, 6, 7] when there are 8 total pages and the current page is 4


    const pagesLeft = this.modelValue.totalPages - this.modelValue.page;

    if (pagesLeft >= 3) {
      for (let i = 0; i < 4; i++) {
        shortcuts.push(this.modelValue.page + i);
      }

      return shortcuts;
    } // If there are less than 3 pages left, count backwards from the last page
    // e.g. [5, 6, 7, 8] when on page 5, 6, 7, and 8 and there are 8 total pages


    for (let i = 0; i < 4; i++) {
      shortcuts.unshift(this.modelValue.totalPages - i);
    }

    return shortcuts;
  }

  get startingItem() {
    const start = this.modelValue.page * this.modelValue.perPage - this.modelValue.perPage + 1;
    return this.modelValue.totalItems === 0 ? 0 : start;
  }

}, (_descriptor$8 = _applyDecoratedDescriptor(_class2$8.prototype, "modelValue", [_dec2$8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$8.prototype, "updateModelValue", [_dec3$8], Object.getOwnPropertyDescriptor(_class2$8.prototype, "updateModelValue"), _class2$8.prototype)), _class2$8)) || _class$a);

const _hoisted_1$9 = {
  class: "px-4 flex items-center justify-between sm:px-0"
};
const _hoisted_2$8 = {
  class: "w-0 flex-1 flex"
};

const _hoisted_3$7 = /*#__PURE__*/createVNode("svg", {
  class: "mr-3 h-5 w-5",
  fill: "currentColor",
  viewBox: "0 0 20 20"
}, [/*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z",
  "clip-rule": "evenodd"
})], -1);

const _hoisted_4$6 = /*#__PURE__*/createTextVNode(" Previous ");

const _hoisted_5$5 = {
  class: "hidden md:flex"
};
const _hoisted_6$5 = {
  class: "w-0 flex-1 flex justify-end"
};

const _hoisted_7$5 = /*#__PURE__*/createTextVNode(" Next ");

const _hoisted_8$4 = /*#__PURE__*/createVNode("svg", {
  class: "ml-3 h-5 w-5",
  fill: "currentColor",
  viewBox: "0 0 20 20"
}, [/*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
})], -1);

function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1$9, [createVNode("div", _hoisted_2$8, [createVNode("a", {
    href: "#",
    class: ["-mt-px border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium focus:outline-none focus:text-gray-700 focus:border-gray-400", _ctx.modelValue.page == 1 ? 'text-gray-300 cursor-not-allowed pointer-events-none' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'],
    onClick: _cache[1] || (_cache[1] = withModifiers($event => _ctx.changePage(_ctx.modelValue.page - 1), ["prevent"]))
  }, [_hoisted_3$7, _hoisted_4$6], 2)]), createVNode("div", _hoisted_5$5, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.pageShortcuts, i => {
    return openBlock(), createBlock("a", {
      href: "#",
      class: ["-mt-px border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium", _ctx.modelValue.page === i ? 'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400'],
      key: i,
      textContent: toDisplayString(i),
      onClick: withModifiers($event => _ctx.changePage(i), ["prevent"])
    }, null, 10, ["textContent", "onClick"]);
  }), 128))]), createVNode("div", _hoisted_6$5, [createVNode("a", {
    href: "#",
    class: ["-mt-px border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium focus:outline-none focus:text-gray-700 focus:border-gray-400", _ctx.modelValue.page >= _ctx.modelValue.totalPages ? 'text-gray-300 cursor-not-allowed pointer-events-none' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'],
    onClick: _cache[2] || (_cache[2] = withModifiers($event => _ctx.changePage(_ctx.modelValue.page + 1), ["prevent"]))
  }, [_hoisted_7$5, _hoisted_8$4], 2)])]);
}

Paginator.render = render$g;

var _dec$9, _dec2$7, _dec3$7, _dec4$7, _dec5$5, _dec6$3, _dec7$1, _dec8$1, _dec9, _class$9, _class2$7, _descriptor$7, _descriptor2$6, _descriptor3$5, _descriptor4$5;
let DetailList = (_dec$9 = Options({
  components: {
    DateFilter,
    Paginator
  },
  name: "DetailList"
}), _dec2$7 = Prop({
  type: Number,
  required: false
}), _dec3$7 = Prop({
  type: Number,
  required: false
}), _dec4$7 = Prop({
  type: String,
  required: true
}), _dec5$5 = Prop({
  type: String,
  required: true
}), _dec6$3 = Watch("sortDir"), _dec7$1 = Watch("dateRange"), _dec8$1 = Watch("refreshTrigger"), _dec9 = Watch("reloadTrigger"), _dec$9(_class$9 = (_class2$7 = class DetailList extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "refreshTrigger", _descriptor$7, this);

    _initializerDefineProperty(this, "reloadTrigger", _descriptor2$6, this);

    _initializerDefineProperty(this, "title", _descriptor3$5, this);

    _initializerDefineProperty(this, "url", _descriptor4$5, this);

    _defineProperty$1(this, "dateRange", {
      minDate: 0,
      maxDate: 0
    });

    _defineProperty$1(this, "hasContent", true);

    _defineProperty$1(this, "items", []);

    _defineProperty$1(this, "pagination", {
      page: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 0
    });

    _defineProperty$1(this, "sortDir", "DESC");
  }

  onSortDir() {
    this.loadAndRender(false);
  }

  onDateRange() {
    this.loadAndRender(false);
  }

  onRefreshTrigger() {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.loadAndRender(false);
  }

  onReloadTrigger() {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.pagination.page = 1;
    this.loadAndRender(true);
  }

  created() {
    this.loadAndRender(true);
  }

  loadAndRender(checkForContent) {
    const params = {
      page: this.pagination.page,
      perPage: this.pagination.perPage,
      sortDir: this.sortDir
    };
    BaseAPI.get(this.url, {}, Object.assign(params, this.dateRange)).then(success => {
      this.pagination = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages
      };
      this.items = success.data.items;
      if (checkForContent) this.hasContent = this.items.length != 0;
    }, () => {
      window.VueBus.emit("Flash-show-generic-error", "archive@xyplanningnetwork.com");
    });
  }

}, (_descriptor$7 = _applyDecoratedDescriptor(_class2$7.prototype, "refreshTrigger", [_dec2$7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$6 = _applyDecoratedDescriptor(_class2$7.prototype, "reloadTrigger", [_dec3$7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$5 = _applyDecoratedDescriptor(_class2$7.prototype, "title", [_dec4$7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4$5 = _applyDecoratedDescriptor(_class2$7.prototype, "url", [_dec5$5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$7.prototype, "onSortDir", [_dec6$3], Object.getOwnPropertyDescriptor(_class2$7.prototype, "onSortDir"), _class2$7.prototype), _applyDecoratedDescriptor(_class2$7.prototype, "onDateRange", [_dec7$1], Object.getOwnPropertyDescriptor(_class2$7.prototype, "onDateRange"), _class2$7.prototype), _applyDecoratedDescriptor(_class2$7.prototype, "onRefreshTrigger", [_dec8$1], Object.getOwnPropertyDescriptor(_class2$7.prototype, "onRefreshTrigger"), _class2$7.prototype), _applyDecoratedDescriptor(_class2$7.prototype, "onReloadTrigger", [_dec9], Object.getOwnPropertyDescriptor(_class2$7.prototype, "onReloadTrigger"), _class2$7.prototype)), _class2$7)) || _class$9);

const _hoisted_1$8 = {
  key: 0,
  class: "shadow overflow-hidden sm:rounded-md border"
};
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DateFilter = resolveComponent("DateFilter");

  const _component_Paginator = resolveComponent("Paginator");

  return openBlock(), createBlock("div", null, [createVNode(_component_DateFilter, {
    "date-range": _ctx.dateRange,
    "sort-dir": _ctx.sortDir,
    title: _ctx.title,
    onSortDirChanged: _cache[1] || (_cache[1] = $event => _ctx.sortDir = $event),
    onDateRangeChanged: _cache[2] || (_cache[2] = $event => _ctx.dateRange = $event)
  }, null, 8, ["date-range", "sort-dir", "title"]), _ctx.hasContent ? (openBlock(), createBlock("div", _hoisted_1$8, [createVNode("ul", null, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, idx) => {
    return openBlock(), createBlock("li", {
      key: idx,
      class: {
        'border-t border-gray-200': idx > 0
      }
    }, [renderSlot(_ctx.$slots, "default", {
      item: item
    })], 2);
  }), 128))])])) : renderSlot(_ctx.$slots, "empty", {
    key: 1
  }), _ctx.hasContent ? (openBlock(), createBlock(_component_Paginator, {
    key: 2,
    modelValue: _ctx.pagination,
    "onUpdate:modelValue": [_cache[3] || (_cache[3] = $event => _ctx.pagination = $event), _cache[4] || (_cache[4] = $event => _ctx.loadAndRender(false))]
  }, null, 8, ["modelValue"])) : createCommentVNode("", true)]);
}

DetailList.render = render$f;

var _dec$8, _class$8;
let Flash = (_dec$8 = Options({
  name: "Flash"
}), _dec$8(_class$8 = class Flash extends Vue {
  constructor(...args) {
    super(...args);

    _defineProperty$1(this, "flashes", []);

    _defineProperty$1(this, "flashTypeBorderClass", {
      warning: "border-orange-500",
      error: "border-red-500",
      info: "border-blue-500",
      success: "border-green-500"
    });
  }

  mounted() {
    window.VueBus.on("Flash-show-message", flash => {
      this.renderFlash(flash);
    });
    window.VueBus.on("Flash-show-generic-error", email => {
      this.renderGenericError(email);
    });

    if (window.Flashes) {
      for (const flash of window.Flashes) {
        const values = flash.message.split(": ");
        this.renderFlash({
          type: values[0],
          message: values[1]
        });
      }
    }
  }

  remove(flash) {
    let index = 0;

    for (const f of this.flashes) {
      if (flash.message === f.message) {
        this.flashes.splice(index, 1);
        return;
      }

      index++;
    }
  }

  renderFlash(flash) {
    this.flashes.push(flash); // Super simple flash implementation. This could get "smarter" by adding an
    // id to the flash object, and then searching for the specific flash in the
    // array and splicing, instead of simply doing a pop().

    setTimeout(flashes => {
      flashes.pop();
    }, 10000, this.flashes);
  }

  renderGenericError(email) {
    this.renderFlash({
      type: "error",
      message: "Whoops! Something went wrong, please reach out to " + `<a class="underline text-xy-blue" href="mailto:${email}">${email}</a>` + " if the issue persists."
    });
  }

}) || _class$8);

const _hoisted_1$7 = {
  class: "fixed inset-0 flex flex-col items-end justify-end px-4 py-6 pointer-events-none sm:p-6 z-40"
};
const _hoisted_2$7 = {
  class: "rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
};
const _hoisted_3$6 = {
  class: "p-4"
};
const _hoisted_4$5 = {
  class: "flex items-center"
};
const _hoisted_5$4 = {
  class: "w-0 flex-1 flex justify-between"
};
const _hoisted_6$4 = {
  class: "ml-4 flex-shrink-0 flex"
};

const _hoisted_7$4 = /*#__PURE__*/createVNode("svg", {
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, [/*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
})], -1);

function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1$7, [createVNode(TransitionGroup, {
    tag: "div",
    class: "max-w-sm w-full",
    "enter-active-class": "ease-out duration-300",
    "enter-from-class": "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2",
    "enter-to-class": "translate-y-0 opacity-100 sm:translate-x-0",
    "leave-active-class": "ease-in duration-100",
    "leave-from-class": "opacity-100",
    "leave-to-class": "opacity-0"
  }, {
    default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.flashes, (flash, idx) => {
      return openBlock(), createBlock("div", {
        key: flash.message,
        class: ["bg-white shadow-lg rounded-lg pointer-events-auto border-t-4 transform", [{
          'mt-2': idx > 0
        }, _ctx.flashTypeBorderClass[flash.type]]]
      }, [createVNode("div", _hoisted_2$7, [createVNode("div", _hoisted_3$6, [createVNode("div", _hoisted_4$5, [createVNode("div", _hoisted_5$4, [createVNode("p", {
        class: "w-0 flex-1 text-sm leading-5 font-medium text-gray-900",
        innerHTML: flash.message
      }, null, 8, ["innerHTML"])]), createVNode("div", _hoisted_6$4, [createVNode("button", {
        onClick: $event => _ctx.remove(flash),
        class: "inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
      }, [_hoisted_7$4], 8, ["onClick"])])])])])], 2);
    }), 128))]),
    _: 1
  })]);
}

Flash.render = render$e;

function render$d(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    })
  ]))
}

function render$c(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    })
  ]))
}

function render$b(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M4 6h16M4 12h16M4 18h7"
    })
  ]))
}

function render$a(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M4 6h16M4 12h16M4 18h16"
    })
  ]))
}

function render$9(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    })
  ]))
}

function render$8(_ctx, _cache) {
  return (openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M6 18L18 6M6 6l12 12"
    })
  ]))
}

var _dec$7, _dec2$6, _dec3$6, _dec4$6, _dec5$4, _dec6$2, _dec7, _dec8, _class$7, _class2$6, _descriptor$6, _descriptor2$5, _descriptor3$4, _descriptor4$4, _descriptor5$2;
let Modal = (_dec$7 = Options({
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationIcon: render$c,
    XIcon: render$8
  },
  name: "Modal"
}), _dec2$6 = Prop({
  type: Boolean,
  required: false
}), _dec3$6 = Prop({
  type: Boolean,
  required: false
}), _dec4$6 = Prop({
  type: Boolean,
  required: true
}), _dec5$4 = Prop({
  type: String,
  required: false
}), _dec6$2 = Prop({
  type: String,
  required: false
}), _dec7 = Emit(), _dec8 = Emit("update:modelValue"), _dec$7(_class$7 = (_class2$6 = class Modal extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "destructive", _descriptor$6, this);

    _initializerDefineProperty(this, "disabled", _descriptor2$5, this);

    _initializerDefineProperty(this, "modelValue", _descriptor3$4, this);

    _initializerDefineProperty(this, "submitText", _descriptor4$4, this);

    _initializerDefineProperty(this, "title", _descriptor5$2, this);
  }

  submit() {
    return;
  }

  updateModelValue(value) {
    return value;
  }

}, (_descriptor$6 = _applyDecoratedDescriptor(_class2$6.prototype, "destructive", [_dec2$6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$5 = _applyDecoratedDescriptor(_class2$6.prototype, "disabled", [_dec3$6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$4 = _applyDecoratedDescriptor(_class2$6.prototype, "modelValue", [_dec4$6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4$4 = _applyDecoratedDescriptor(_class2$6.prototype, "submitText", [_dec5$4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5$2 = _applyDecoratedDescriptor(_class2$6.prototype, "title", [_dec6$2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$6.prototype, "submit", [_dec7], Object.getOwnPropertyDescriptor(_class2$6.prototype, "submit"), _class2$6.prototype), _applyDecoratedDescriptor(_class2$6.prototype, "updateModelValue", [_dec8], Object.getOwnPropertyDescriptor(_class2$6.prototype, "updateModelValue"), _class2$6.prototype)), _class2$6)) || _class$7);

const _hoisted_1$6 = {
  class: "flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
};

const _hoisted_2$6 = /*#__PURE__*/createVNode("span", {
  class: "hidden sm:inline-block sm:align-middle sm:h-screen",
  "aria-hidden": "true"
}, "​", -1);

const _hoisted_3$5 = {
  class: "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
};
const _hoisted_4$4 = {
  class: "block absolute top-0 right-0 pt-4 pr-4"
};

const _hoisted_5$3 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Close", -1);

const _hoisted_6$3 = {
  class: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
};
const _hoisted_7$3 = {
  class: "mt-3 sm:mt-0 sm:text-left"
};
const _hoisted_8$3 = {
  class: "mt-2"
};
const _hoisted_9$3 = {
  key: 0,
  class: "bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogOverlay = resolveComponent("DialogOverlay");

  const _component_TransitionChild = resolveComponent("TransitionChild");

  const _component_XIcon = resolveComponent("XIcon");

  const _component_DialogTitle = resolveComponent("DialogTitle");

  const _component_Dialog = resolveComponent("Dialog");

  const _component_TransitionRoot = resolveComponent("TransitionRoot");

  return openBlock(), createBlock(_component_TransitionRoot, {
    as: "template",
    show: _ctx.modelValue
  }, {
    default: withCtx(() => [createVNode(_component_Dialog, {
      as: "div",
      static: "",
      class: "fixed z-10 inset-0 overflow-y-auto",
      onClose: _cache[4] || (_cache[4] = $event => _ctx.updateModelValue(false)),
      open: _ctx.modelValue
    }, {
      default: withCtx(() => [createVNode("div", _hoisted_1$6, [createVNode(_component_TransitionChild, {
        as: "template",
        enter: "ease-out duration-300",
        "enter-from": "opacity-0",
        "enter-to": "opacity-100",
        leave: "ease-in duration-200",
        "leave-from": "opacity-100",
        "leave-to": "opacity-0"
      }, {
        default: withCtx(() => [createVNode(_component_DialogOverlay, {
          class: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        })]),
        _: 1
      }), _hoisted_2$6, createVNode(_component_TransitionChild, {
        as: "template",
        enter: "ease-out duration-300",
        "enter-from": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        "enter-to": "opacity-100 translate-y-0 sm:scale-100",
        leave: "ease-in duration-200",
        "leave-from": "opacity-100 translate-y-0 sm:scale-100",
        "leave-to": "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      }, {
        default: withCtx(() => [createVNode("div", _hoisted_3$5, [createVNode("div", _hoisted_4$4, [createVNode("button", {
          type: "button",
          class: "bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          onClick: _cache[1] || (_cache[1] = $event => _ctx.updateModelValue(false))
        }, [_hoisted_5$3, createVNode(_component_XIcon, {
          class: "h-6 w-6",
          "aria-hidden": "true"
        })])]), createVNode("div", _hoisted_6$3, [createVNode("div", _hoisted_7$3, [createVNode(_component_DialogTitle, {
          as: "h3",
          class: "text-center text-lg leading-6 font-medium text-gray-900",
          textContent: toDisplayString(_ctx.title)
        }, null, 8, ["textContent"]), createVNode("div", _hoisted_8$3, [renderSlot(_ctx.$slots, "default")])])]), _ctx.submitText ? (openBlock(), createBlock("div", _hoisted_9$3, [createVNode("button", {
          type: "button",
          class: ["xy-btn w-full sm:ml-3 sm:w-auto sm:text-sm", [_ctx.destructive ? 'xy-btn-red' : 'xy-btn']],
          onClick: _cache[2] || (_cache[2] = $event => _ctx.submit()),
          textContent: toDisplayString(_ctx.submitText),
          disabled: _ctx.disabled
        }, null, 10, ["textContent", "disabled"]), createVNode("button", {
          type: "button",
          class: "xy-btn-white mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
          onClick: _cache[3] || (_cache[3] = $event => _ctx.updateModelValue(false)),
          ref: "cancelButtonRef"
        }, " Cancel ", 512)])) : createCommentVNode("", true), renderSlot(_ctx.$slots, "buttons")])]),
        _: 3
      })])]),
      _: 1
    }, 8, ["open"])]),
    _: 1
  }, 8, ["show"]);
}

Modal.render = render$7;

var _dec$6, _class$6;
let Spinner = (_dec$6 = Options({
  name: "Spinner"
}), _dec$6(_class$6 = class Spinner extends Vue {
  constructor(...args) {
    super(...args);

    _defineProperty$1(this, "idx", 0);

    _defineProperty$1(this, "loading", false);

    _defineProperty$1(this, "maxIdx", 0);

    _defineProperty$1(this, "messages", []);

    _defineProperty$1(this, "msg", "");

    _defineProperty$1(this, "showMsg", false);
  }

  mounted() {
    window.VueBus.on("Spinner-show", messages => {
      if (messages) {
        this.messages = messages;
        this.maxIdx = this.messages.length - 1;
        this.msg = this.messages[this.idx];
        this.showMsg = true;
      }

      this.loading = true;
    });
    window.VueBus.on("Spinner-hide", () => {
      this.idx = 0;
      this.maxIdx = 0;
      this.messages = [];
      this.msg = "";
      this.loading = false;
    });
  }

  fadeIn() {
    this.idx++;

    if (this.idx > this.maxIdx) {
      this.idx = 0;
    }

    if (this.messages) {
      this.msg = this.messages[this.idx];
    }

    this.showMsg = true;
  }

  fadeOut() {
    window.setTimeout(() => {
      this.showMsg = false;
    }, 2500);
  }

}) || _class$6);

const _hoisted_1$5 = {
  key: 0,
  class: "fixed top-0 left-0 flex items-center justify-center w-full h-full cursor-not-allowed z-50 bg-gray-50 bg-opacity-50"
};

const _hoisted_2$5 = /*#__PURE__*/createVNode("div", {
  class: "flex justify-center"
}, [/*#__PURE__*/createVNode("div", {
  class: "animate-spin-gear"
}, [/*#__PURE__*/createVNode("svg", {
  width: "129px",
  height: "129px",
  viewBox: "0 0 129 129",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink"
}, [/*#__PURE__*/createVNode("title", null, "Group 6 Copy 3"), /*#__PURE__*/createVNode("defs", null, [/*#__PURE__*/createVNode("polygon", {
  id: "path-1",
  points: "0.000248076923 0.48676924 128.472837 0.48676924 128.472837 128.800648 0.000248076923 128.800648"
})]), /*#__PURE__*/createVNode("g", {
  id: "Page-1",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, [/*#__PURE__*/createVNode("g", {
  id: "Group-6-Copy-3"
}, [/*#__PURE__*/createVNode("g", {
  id: "Group-3"
}, [/*#__PURE__*/createVNode("mask", {
  id: "mask-2",
  fill: "white"
}, [/*#__PURE__*/createVNode("use", {
  "xlink:href": "#path-1"
})]), /*#__PURE__*/createVNode("g", {
  id: "Clip-2"
}), /*#__PURE__*/createVNode("path", {
  d: "M86.3955173,100.279324 C86.3955173,100.279324 79.4778923,106.213874 64.2360462,106.755809 C48.9954404,106.213874 42.0778154,100.279324 42.0778154,100.279324 C11.8756904,81.4963011 25.2309115,49.088357 25.2309115,49.088357 C36.5680269,24.1350542 59.1839596,22.5554236 63.8105942,22.4983139 L63.8105942,22.5043894 C63.8105942,22.5043894 63.9681231,22.4983139 64.2360462,22.4958837 C64.5052096,22.4983139 64.6627385,22.5043894 64.6627385,22.5043894 L64.6627385,22.4983139 C69.2881327,22.5554236 91.9053058,24.1350542 103.241181,49.088357 C103.241181,49.088357 116.596402,81.4963011 86.3955173,100.279324 L86.3955173,100.279324 Z M128.473085,68.8191581 L128.473085,60.4677727 L117.036738,58.80187 L115.10794,49.3726905 L124.970238,43.4186983 L121.675777,35.7307578 L110.49619,38.6214817 L106.161046,32.1486416 L113.220075,23.080347 L107.361738,17.0716753 L97.9645846,23.7437918 L89.14545,17.842049 L91.8693346,6.72144964 L84.04995,3.59378109 L78.2114596,13.4628269 L69.5907865,11.8127205 L67.908825,0.48676924 L64.6627385,0.48676924 L63.8105942,0.48676924 L60.5645077,0.48676924 L58.8813058,11.8127205 L50.2618731,13.4628269 L44.4233827,3.59378109 L36.6039981,6.72144964 L39.3278827,17.842049 L30.5087481,23.7437918 L21.1103538,17.0716753 L15.2520173,23.080347 L22.3122865,32.1486416 L17.9771423,38.6214817 L6.79755577,35.7307578 L3.50185385,43.4186983 L13.3641519,49.3726905 L11.4365942,58.80187 L0.000248076923,60.4677727 L0.000248076923,68.8191581 L11.4365942,70.4850608 L13.1036712,79.0223566 L3.13718077,84.8050196 L6.29644038,92.5488548 L17.5244019,89.8513318 L23.4832096,98.5854738 L16.7466808,107.893143 L22.8134019,113.695248 L31.9699212,106.70356 L38.5067481,110.99651 L35.5881231,122.068505 L43.35045,125.332265 L49.3625942,115.565287 L58.8813058,117.47421 L60.5645077,128.801377 L63.6927577,128.801377 L64.780575,128.801377 L67.908825,128.801377 L69.5907865,117.47421 L79.1107385,115.565287 L85.1228827,125.332265 L92.8852096,122.068505 L89.9665846,110.99651 L96.5034115,106.70356 L105.659931,113.695248 L111.725412,107.893143 L104.988883,98.5854738 L110.94769,89.8513318 L122.175652,92.5488548 L125.334912,84.8050196 L115.369662,79.0223566 L117.035498,70.4850608 L128.473085,68.8191581 Z",
  id: "Fill-1",
  fill: "#51A749",
  mask: "url(#mask-2)"
})])])])])]), /*#__PURE__*/createVNode("div", {
  class: "absolute"
}, [/*#__PURE__*/createVNode("svg", {
  class: "mt-8",
  width: "70px",
  height: "70px",
  viewBox: "0 0 53 32",
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink"
}, [/*#__PURE__*/createVNode("title", null, "Group 3 Copy"), /*#__PURE__*/createVNode("g", {
  id: "Page-1",
  stroke: "none",
  "stroke-width": "1",
  fill: "none",
  "fill-rule": "evenodd"
}, [/*#__PURE__*/createVNode("g", {
  id: "Group-3-Copy"
}, [/*#__PURE__*/createVNode("polygon", {
  id: "Fill-1",
  fill: "#1F6DF4",
  points: "0.7994 0.3999 11.2214 16.0009 0.7994 31.5999 11.2214 31.5999 16.4004 24.0149 21.1934 31.5999 31.9994 31.5999 21.4254 15.7449 26.0064 9.1719 20.6194 1.3729 16.1554 7.9149 11.2214 0.3999"
}), /*#__PURE__*/createVNode("polygon", {
  id: "Fill-2",
  fill: "#51A749",
  points: "41.978 0.3999 36.799 7.6269 32.006 0.3999 21.2 0.3999 31.775 15.5069 27.194 21.7689 32.27 29.1999 52.4 0.3999"
})])])])])], -1);

function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.loading ? (openBlock(), createBlock("div", _hoisted_1$5, [createVNode("div", null, [_hoisted_2$5, withDirectives(createVNode("div", null, [createVNode(Transition, {
    appear: "",
    "enter-active-class": "ease-out duration-1000",
    "enter-from-class": "opacity-0",
    "enter-to-class": "opacity-100",
    "leave-active-class": "ease-in duration-500",
    "leave-from-class": "opacity-100",
    "leave-to-class": "opacity-0",
    onAfterEnter: _ctx.fadeOut,
    onAfterLeave: _ctx.fadeIn
  }, {
    default: withCtx(() => [withDirectives(createVNode("div", {
      class: "transition-opacity"
    }, toDisplayString(_ctx.msg), 513), [[vShow, _ctx.showMsg]])]),
    _: 1
  }, 8, ["onAfterEnter", "onAfterLeave"])], 512), [[vShow, _ctx.messages]])])])) : createCommentVNode("", true);
}

Spinner.render = render$6;

var _dec$5, _dec2$5, _dec3$5, _dec4$5, _dec5$3, _class$5, _class2$5, _descriptor$5, _descriptor2$4, _descriptor3$3, _descriptor4$3;
let SidebarLayout = (_dec$5 = Options({
  components: {
    Flash,
    Spinner,
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    CogIcon: render$l,
    MenuAlt2Icon: render$b,
    UserCircleIcon: render$9,
    XIcon: render$8
  },
  name: "SidebarLayout"
}), _dec2$5 = Prop({
  type: String,
  required: false
}), _dec3$5 = Prop({
  type: String,
  required: true
}), _dec4$5 = Prop({
  type: Array,
  required: true
}), _dec5$3 = Prop({
  type: Array,
  required: true
}), _dec$5(_class$5 = (_class2$5 = class SidebarLayout extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "activeURL", _descriptor$5, this);

    _initializerDefineProperty(this, "iconURL", _descriptor2$4, this);

    _initializerDefineProperty(this, "navigation", _descriptor3$3, this);

    _initializerDefineProperty(this, "userNavigation", _descriptor4$3, this);

    _defineProperty$1(this, "sidebarOpen", false);
  }

  isActive(url) {
    return this.activeURL === url;
  }

}, (_descriptor$5 = _applyDecoratedDescriptor(_class2$5.prototype, "activeURL", [_dec2$5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$4 = _applyDecoratedDescriptor(_class2$5.prototype, "iconURL", [_dec3$5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$3 = _applyDecoratedDescriptor(_class2$5.prototype, "navigation", [_dec4$5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4$3 = _applyDecoratedDescriptor(_class2$5.prototype, "userNavigation", [_dec5$3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2$5)) || _class$5);

const _hoisted_1$4 = {
  class: "h-screen flex overflow-hidden bg-gray-100"
};
const _hoisted_2$4 = {
  class: "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
};
const _hoisted_3$4 = {
  class: "absolute top-0 right-0 -mr-12 pt-2"
};

const _hoisted_4$3 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Close sidebar", -1);

const _hoisted_5$2 = {
  class: "flex-shrink-0 flex items-center px-4"
};
const _hoisted_6$2 = {
  class: "mt-5 flex-1 h-0 overflow-y-auto"
};
const _hoisted_7$2 = {
  class: "px-2 space-y-1"
};

const _hoisted_8$2 = /*#__PURE__*/createVNode("div", {
  class: "flex-shrink-0 w-14",
  "aria-hidden": "true"
}, null, -1);

const _hoisted_9$2 = {
  class: "hidden md:flex md:flex-shrink-0"
};
const _hoisted_10$2 = {
  class: "flex flex-col w-64"
};
const _hoisted_11$2 = {
  class: "flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto"
};
const _hoisted_12$2 = {
  class: "flex items-center flex-shrink-0 px-4"
};
const _hoisted_13$2 = {
  class: "mt-5 flex-grow flex flex-col"
};
const _hoisted_14$2 = {
  class: "flex-1 px-2 bg-white space-y-1"
};
const _hoisted_15$2 = {
  class: "flex flex-col w-0 flex-1 overflow-hidden"
};
const _hoisted_16$1 = {
  class: "relative z-10 flex-shrink-0 flex h-16 bg-xy-blue shadow"
};

const _hoisted_17$1 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Open sidebar", -1);

const _hoisted_18$1 = {
  class: "flex-1 px-4 flex justify-between"
};
const _hoisted_19 = {
  class: "flex-1 flex"
};
const _hoisted_20 = {
  class: "flex items-center text-2xl text-white"
};
const _hoisted_21 = {
  class: "ml-4 flex items-center md:ml-6"
};

const _hoisted_22 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Open user menu", -1);

const _hoisted_23 = {
  class: "flex-1 relative overflow-y-auto focus:outline-none"
};
const _hoisted_24 = {
  class: "py-6"
};
const _hoisted_25 = {
  class: "mx-auto px-4 sm:px-6 md:px-8"
};
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogOverlay = resolveComponent("DialogOverlay");

  const _component_TransitionChild = resolveComponent("TransitionChild");

  const _component_XIcon = resolveComponent("XIcon");

  const _component_Dialog = resolveComponent("Dialog");

  const _component_TransitionRoot = resolveComponent("TransitionRoot");

  const _component_MenuAlt2Icon = resolveComponent("MenuAlt2Icon");

  const _component_CogIcon = resolveComponent("CogIcon");

  const _component_MenuButton = resolveComponent("MenuButton");

  const _component_MenuItem = resolveComponent("MenuItem");

  const _component_MenuItems = resolveComponent("MenuItems");

  const _component_Menu = resolveComponent("Menu");

  const _component_Flash = resolveComponent("Flash");

  const _component_Spinner = resolveComponent("Spinner");

  return openBlock(), createBlock(Fragment, null, [createVNode("div", _hoisted_1$4, [createVNode(_component_TransitionRoot, {
    as: "template",
    show: _ctx.sidebarOpen
  }, {
    default: withCtx(() => [createVNode(_component_Dialog, {
      as: "div",
      static: "",
      class: "fixed inset-0 flex z-40 md:hidden",
      onClose: _cache[2] || (_cache[2] = $event => _ctx.sidebarOpen = false),
      open: _ctx.sidebarOpen
    }, {
      default: withCtx(() => [createVNode(_component_TransitionChild, {
        as: "template",
        enter: "transition-opacity ease-linear duration-300",
        "enter-from": "opacity-0",
        "enter-to": "opacity-100",
        leave: "transition-opacity ease-linear duration-300",
        "leave-from": "opacity-100",
        "leave-to": "opacity-0"
      }, {
        default: withCtx(() => [createVNode(_component_DialogOverlay, {
          class: "fixed inset-0 bg-gray-600 bg-opacity-75"
        })]),
        _: 1
      }), createVNode(_component_TransitionChild, {
        as: "template",
        enter: "transition ease-in-out duration-300 transform",
        "enter-from": "-translate-x-full",
        "enter-to": "translate-x-0",
        leave: "transition ease-in-out duration-300 transform",
        "leave-from": "translate-x-0",
        "leave-to": "-translate-x-full"
      }, {
        default: withCtx(() => [createVNode("div", _hoisted_2$4, [createVNode(_component_TransitionChild, {
          as: "template",
          enter: "ease-in-out duration-300",
          "enter-from": "opacity-0",
          "enter-to": "opacity-100",
          leave: "ease-in-out duration-300",
          "leave-from": "opacity-100",
          "leave-to": "opacity-0"
        }, {
          default: withCtx(() => [createVNode("div", _hoisted_3$4, [createVNode("button", {
            class: "ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",
            onClick: _cache[1] || (_cache[1] = $event => _ctx.sidebarOpen = false)
          }, [_hoisted_4$3, createVNode(_component_XIcon, {
            class: "h-6 w-6 text-white",
            "aria-hidden": "true"
          })])])]),
          _: 1
        }), createVNode("div", _hoisted_5$2, [createVNode("img", {
          class: "h-8 w-auto",
          src: _ctx.iconURL,
          alt: "Workflow"
        }, null, 8, ["src"])]), createVNode("div", _hoisted_6$2, [createVNode("nav", _hoisted_7$2, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.navigation, item => {
          return openBlock(), createBlock("a", {
            key: item.name,
            href: item.url,
            class: [_ctx.isActive(item.url) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-base font-medium rounded-md']
          }, [(openBlock(), createBlock(resolveDynamicComponent(item.icon), {
            class: [_ctx.isActive(item.url) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-4 h-6 w-6'],
            "aria-hidden": "true"
          }, null, 8, ["class"])), createTextVNode(" " + toDisplayString(item.name), 1)], 10, ["href"]);
        }), 128))])])])]),
        _: 1
      }), _hoisted_8$2]),
      _: 1
    }, 8, ["open"])]),
    _: 1
  }, 8, ["show"]), createVNode("div", _hoisted_9$2, [createVNode("div", _hoisted_10$2, [createVNode("div", _hoisted_11$2, [createVNode("div", _hoisted_12$2, [createVNode("img", {
    class: "h-8 w-auto",
    src: _ctx.iconURL,
    alt: "Workflow"
  }, null, 8, ["src"])]), createVNode("div", _hoisted_13$2, [createVNode("nav", _hoisted_14$2, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.navigation, item => {
    return openBlock(), createBlock("a", {
      key: item.name,
      href: item.url,
      class: [_ctx.isActive(item.url) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md']
    }, [(openBlock(), createBlock(resolveDynamicComponent(item.icon), {
      class: [_ctx.isActive(item.url) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 h-6 w-6'],
      "aria-hidden": "true"
    }, null, 8, ["class"])), createTextVNode(" " + toDisplayString(item.name), 1)], 10, ["href"]);
  }), 128))])])])])]), createVNode("div", _hoisted_15$2, [createVNode("div", _hoisted_16$1, [createVNode("button", {
    class: "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden",
    onClick: _cache[3] || (_cache[3] = $event => _ctx.sidebarOpen = true)
  }, [_hoisted_17$1, createVNode(_component_MenuAlt2Icon, {
    class: "h-6 w-6",
    "aria-hidden": "true"
  })]), createVNode("div", _hoisted_18$1, [createVNode("div", _hoisted_19, [createVNode("h1", _hoisted_20, [renderSlot(_ctx.$slots, "header")])]), createVNode("div", _hoisted_21, [createVNode(_component_Menu, {
    as: "div",
    class: "ml-3 relative"
  }, {
    default: withCtx(() => [createVNode("div", null, [createVNode(_component_MenuButton, {
      class: "max-w-xs flex items-center text-sm text-white rounded-full hover:bg-blue-500 hover:text-gray-200 focus:outline-none focus:ring focus:text-white"
    }, {
      default: withCtx(() => [_hoisted_22, createVNode(_component_CogIcon, {
        class: "h-8 w-8",
        fill: "currentColor"
      })]),
      _: 1
    })]), createVNode(Transition, {
      "enter-active-class": "transition ease-out duration-100",
      "enter-from-class": "transform opacity-0 scale-95",
      "enter-to-class": "transform opacity-100 scale-100",
      "leave-active-class": "transition ease-in duration-75",
      "leave-from-class": "transform opacity-100 scale-100",
      "leave-to-class": "transform opacity-0 scale-95"
    }, {
      default: withCtx(() => [createVNode(_component_MenuItems, {
        class: "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      }, {
        default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.userNavigation, item => {
          return openBlock(), createBlock(_component_MenuItem, {
            key: item.name
          }, {
            default: withCtx(({
              active
            }) => [createVNode("a", {
              href: item.url,
              class: [active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']
            }, toDisplayString(item.name), 11, ["href"])]),
            _: 2
          }, 1024);
        }), 128))]),
        _: 1
      })]),
      _: 1
    })]),
    _: 1
  })])])]), createVNode("main", _hoisted_23, [createVNode("div", _hoisted_24, [createVNode("div", _hoisted_25, [renderSlot(_ctx.$slots, "default")])])])])]), createVNode(_component_Flash), createVNode(_component_Spinner)], 64);
}

SidebarLayout.render = render$5;

var _dec$4, _dec2$4, _dec3$4, _dec4$4, _dec5$2, _dec6$1, _class$4, _class2$4, _descriptor$4, _descriptor2$3, _descriptor3$2, _descriptor4$2, _descriptor5$1;
let StackedLayout = (_dec$4 = Options({
  components: {
    Flash,
    Spinner,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BellIcon: render$d,
    MenuIcon: render$a,
    UserCircleIcon: render$9,
    XIcon: render$8
  },
  name: "StackedLayout"
}), _dec2$4 = Prop({
  type: String,
  required: false
}), _dec3$4 = Prop({
  type: Object,
  required: true
}), _dec4$4 = Prop({
  type: String,
  required: true
}), _dec5$2 = Prop({
  type: Array,
  required: true
}), _dec6$1 = Prop({
  type: Array,
  required: true
}), _dec$4(_class$4 = (_class2$4 = class StackedLayout extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "activeURL", _descriptor$4, this);

    _initializerDefineProperty(this, "currentUser", _descriptor2$3, this);

    _initializerDefineProperty(this, "iconURL", _descriptor3$2, this);

    _initializerDefineProperty(this, "navigation", _descriptor4$2, this);

    _initializerDefineProperty(this, "userNavigation", _descriptor5$1, this);

    _defineProperty$1(this, "sidebarOpen", false);
  }

  isActive(url) {
    return this.activeURL === url;
  }

}, (_descriptor$4 = _applyDecoratedDescriptor(_class2$4.prototype, "activeURL", [_dec2$4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$3 = _applyDecoratedDescriptor(_class2$4.prototype, "currentUser", [_dec3$4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$2 = _applyDecoratedDescriptor(_class2$4.prototype, "iconURL", [_dec4$4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4$2 = _applyDecoratedDescriptor(_class2$4.prototype, "navigation", [_dec5$2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5$1 = _applyDecoratedDescriptor(_class2$4.prototype, "userNavigation", [_dec6$1], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2$4)) || _class$4);

const _hoisted_1$3 = {
  class: "min-h-screen bg-gray-100"
};
const _hoisted_2$3 = {
  class: "mx-auto px-4 sm:px-6 lg:px-8"
};
const _hoisted_3$3 = {
  class: "flex justify-between h-16"
};
const _hoisted_4$2 = {
  class: "flex"
};
const _hoisted_5$1 = {
  class: "flex-shrink-0 flex items-center"
};
const _hoisted_6$1 = {
  class: "hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8"
};
const _hoisted_7$1 = {
  class: "hidden sm:ml-6 sm:flex sm:items-center"
};

const _hoisted_8$1 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Open user menu", -1);

const _hoisted_9$1 = {
  class: "-mr-2 flex items-center sm:hidden"
};

const _hoisted_10$1 = /*#__PURE__*/createVNode("span", {
  class: "sr-only"
}, "Open main menu", -1);

const _hoisted_11$1 = {
  class: "pt-2 pb-3 space-y-1"
};
const _hoisted_12$1 = {
  class: "pt-4 pb-3 border-t border-gray-200"
};
const _hoisted_13$1 = {
  class: "flex items-center px-4"
};
const _hoisted_14$1 = {
  class: "flex-shrink-0"
};
const _hoisted_15$1 = {
  class: "ml-3"
};
const _hoisted_16 = {
  class: "mt-3 space-y-1"
};
const _hoisted_17 = {
  class: "mx-auto sm:px-6 lg:px-8"
};
const _hoisted_18 = {
  class: "px-4 py-8 sm:px-0"
};
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_UserCircleIcon = resolveComponent("UserCircleIcon");

  const _component_MenuButton = resolveComponent("MenuButton");

  const _component_MenuItem = resolveComponent("MenuItem");

  const _component_MenuItems = resolveComponent("MenuItems");

  const _component_Menu = resolveComponent("Menu");

  const _component_MenuIcon = resolveComponent("MenuIcon");

  const _component_XIcon = resolveComponent("XIcon");

  const _component_DisclosureButton = resolveComponent("DisclosureButton");

  const _component_DisclosurePanel = resolveComponent("DisclosurePanel");

  const _component_Disclosure = resolveComponent("Disclosure");

  const _component_Flash = resolveComponent("Flash");

  const _component_Spinner = resolveComponent("Spinner");

  return openBlock(), createBlock(Fragment, null, [createVNode("div", _hoisted_1$3, [createVNode(_component_Disclosure, {
    as: "nav",
    class: "bg-white shadow-sm"
  }, {
    default: withCtx(({
      open
    }) => [createVNode("div", _hoisted_2$3, [createVNode("div", _hoisted_3$3, [createVNode("div", _hoisted_4$2, [createVNode("div", _hoisted_5$1, [createVNode("img", {
      class: "block h-8 w-auto",
      src: _ctx.iconURL,
      alt: "XY Trees"
    }, null, 8, ["src"])]), createVNode("div", _hoisted_6$1, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.navigation, item => {
      return openBlock(), createBlock("a", {
        key: item.name,
        href: item.url,
        class: [_ctx.isActive(item.url) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'],
        "aria-current": _ctx.isActive(item.url) ? 'page' : undefined
      }, toDisplayString(item.name), 11, ["href", "aria-current"]);
    }), 128))])]), createVNode("div", _hoisted_7$1, [createVNode(_component_Menu, {
      as: "div",
      class: "ml-3 relative"
    }, {
      default: withCtx(() => [createVNode("div", null, [createVNode(_component_MenuButton, {
        class: "bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      }, {
        default: withCtx(() => [_hoisted_8$1, createVNode(_component_UserCircleIcon, {
          class: "text-gray-500 h-8 w-8 rounded-full"
        })]),
        _: 1
      })]), createVNode(Transition, {
        "enter-active-class": "transition ease-out duration-200",
        "enter-from-class": "transform opacity-0 scale-95",
        "enter-to-class": "transform opacity-100 scale-100",
        "leave-active-class": "transition ease-in duration-75",
        "leave-from-class": "transform opacity-100 scale-100",
        "leave-to-class": "transform opacity-0 scale-95"
      }, {
        default: withCtx(() => [createVNode(_component_MenuItems, {
          class: "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        }, {
          default: withCtx(() => [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.userNavigation, item => {
            return openBlock(), createBlock(_component_MenuItem, {
              key: item.name
            }, {
              default: withCtx(({
                active
              }) => [createVNode("a", {
                href: item.url,
                class: [active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']
              }, toDisplayString(item.name), 11, ["href"])]),
              _: 2
            }, 1024);
          }), 128))]),
          _: 1
        })]),
        _: 1
      })]),
      _: 1
    })]), createVNode("div", _hoisted_9$1, [createVNode(_component_DisclosureButton, {
      class: "bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    }, {
      default: withCtx(() => [_hoisted_10$1, !open ? (openBlock(), createBlock(_component_MenuIcon, {
        key: 0,
        class: "block h-6 w-6",
        "aria-hidden": "true"
      })) : (openBlock(), createBlock(_component_XIcon, {
        key: 1,
        class: "block h-6 w-6",
        "aria-hidden": "true"
      }))]),
      _: 2
    }, 1024)])])]), createVNode(_component_DisclosurePanel, {
      class: "sm:hidden"
    }, {
      default: withCtx(() => [createVNode("div", _hoisted_11$1, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.navigation, item => {
        return openBlock(), createBlock("a", {
          key: item.name,
          href: item.url,
          class: [_ctx.isActive(item.url) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800', 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'],
          "aria-current": _ctx.isActive(item.url) ? 'page' : undefined
        }, toDisplayString(item.name), 11, ["href", "aria-current"]);
      }), 128))]), createVNode("div", _hoisted_12$1, [createVNode("div", _hoisted_13$1, [createVNode("div", _hoisted_14$1, [createVNode(_component_UserCircleIcon, {
        class: "text-gray-500 h-10 w-10 rounded-full"
      })]), createVNode("div", _hoisted_15$1, [createVNode("div", {
        class: "text-base font-medium text-gray-800",
        textContent: toDisplayString(_ctx.currentUser.name)
      }, null, 8, ["textContent"]), createVNode("div", {
        class: "text-sm font-medium text-gray-500",
        textContent: toDisplayString(_ctx.currentUser.email)
      }, null, 8, ["textContent"])])]), createVNode("div", _hoisted_16, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.userNavigation, item => {
        return openBlock(), createBlock("a", {
          key: item.name,
          href: item.url,
          class: "block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        }, toDisplayString(item.name), 9, ["href"]);
      }), 128))])])]),
      _: 1
    })]),
    _: 1
  }), renderSlot(_ctx.$slots, "header"), createVNode("main", null, [createVNode("div", _hoisted_17, [createVNode("div", _hoisted_18, [renderSlot(_ctx.$slots, "default")])])])]), createVNode(_component_Flash), createVNode(_component_Spinner)], 64);
}

StackedLayout.render = render$4;

var _dec$3, _dec2$3, _dec3$3, _dec4$3, _class$3, _class2$3, _descriptor$3;
let Table = (_dec$3 = Options({
  components: {
    Paginator
  },
  name: "Table"
}), _dec2$3 = Prop({
  type: Object,
  required: true
}), _dec3$3 = Watch("tableData.refreshTrigger"), _dec4$3 = Watch("tableData.reloadTrigger"), _dec$3(_class$3 = (_class2$3 = class Table extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "tableData", _descriptor$3, this);

    _defineProperty$1(this, "currentSort", "");

    _defineProperty$1(this, "currentSortDirection", "");

    _defineProperty$1(this, "hasContent", true);

    _defineProperty$1(this, "items", []);

    _defineProperty$1(this, "pagination", {
      page: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 0
    });

    _defineProperty$1(this, "query", "");
  }

  onRefreshTrigger() {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.loadAndRender(false);
  }

  onReloadTrigger() {
    // This lets parent components trigger a reload of page 1 depending on external actions.
    this.reloadTable();
  }

  created() {
    if (this.tableData.defaultSort) {
      this.currentSort = this.tableData.defaultSort;
      this.currentSortDirection = this.tableData.defaultSortDirection ? this.tableData.defaultSortDirection : "desc";
    }

    this.loadAndRender(true);
  }

  cellValue(item, col) {
    if (col.key) {
      return item[col.key];
    }

    if (col.presenter) {
      return col.presenter(item, this);
    }

    return "";
  }

  handleSort(selectedSort) {
    if (this.currentSort == selectedSort) {
      this.currentSortDirection = this.currentSortDirection === "desc" ? "asc" : "desc";
    } else {
      this.currentSort = selectedSort;
      this.currentSortDirection = "desc";
    }

    this.loadAndRender(false);
  }

  loadAndRender(checkForContent) {
    const params = {
      page: this.pagination.page,
      perPage: this.pagination.perPage,
      sort: this.currentSort,
      sortDir: this.currentSortDirection,
      q: this.query
    };
    const wait = window.setTimeout(() => {
      window.VueBus.emit("Spinner-show");
    }, 200);
    BaseAPI.get(this.tableData.url, {}, params).then(success => {
      window.clearTimeout(wait);
      window.VueBus.emit("Spinner-hide");
      this.pagination = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages
      };
      this.items = success.data.items;
      if (checkForContent) this.hasContent = this.items.length != 0;
    }, () => {
      window.clearTimeout(wait);
      window.VueBus.emit("Spinner-hide");
      window.VueBus.emit("Flash-show-generic-error", "archive@xyplanningnetwork.com");
    });
  }

  reloadTable() {
    this.pagination.page = 1;
    this.loadAndRender(false);
  }

}, (_descriptor$3 = _applyDecoratedDescriptor(_class2$3.prototype, "tableData", [_dec2$3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$3.prototype, "onRefreshTrigger", [_dec3$3], Object.getOwnPropertyDescriptor(_class2$3.prototype, "onRefreshTrigger"), _class2$3.prototype), _applyDecoratedDescriptor(_class2$3.prototype, "onReloadTrigger", [_dec4$3], Object.getOwnPropertyDescriptor(_class2$3.prototype, "onReloadTrigger"), _class2$3.prototype)), _class2$3)) || _class$3);

const _hoisted_1$2 = {
  key: 0,
  class: "w-full max-w-lg mb-4 lg:max-w-xs"
};

const _hoisted_2$2 = /*#__PURE__*/createVNode("label", {
  for: "search",
  class: "sr-only"
}, "Search", -1);

const _hoisted_3$2 = {
  class: "relative"
};

const _hoisted_4$1 = /*#__PURE__*/createVNode("div", {
  class: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
}, [/*#__PURE__*/createVNode("svg", {
  class: "w-5 h-5 text-gray-400",
  fill: "currentColor",
  viewBox: "0 0 20 20"
}, [/*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",
  "clip-rule": "evenodd"
})])], -1);

const _hoisted_5 = {
  class: "relative z-0 min-w-full align-middle border-b border-gray-200 shadow sm:rounded-lg overflow-x-auto"
};
const _hoisted_6 = {
  class: "min-w-full"
};
const _hoisted_7 = {
  key: 0
};
const _hoisted_8 = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  class: "h-5 inline"
};

const _hoisted_9 = /*#__PURE__*/createVNode("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  d: "M8 9l4-4 4 4m0 6l-4 4-4-4"
}, null, -1);

const _hoisted_10 = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  class: "h-5 inline"
};

const _hoisted_11 = /*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
  "clip-rule": "evenodd"
}, null, -1);

const _hoisted_12 = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  class: "h-5 inline"
};

const _hoisted_13 = /*#__PURE__*/createVNode("path", {
  "fill-rule": "evenodd",
  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
}, null, -1);

const _hoisted_14 = {
  class: "bg-white"
};
const _hoisted_15 = {
  key: 0
};
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Paginator = resolveComponent("Paginator");

  return openBlock(), createBlock("div", null, [_ctx.tableData.search ? (openBlock(), createBlock("div", _hoisted_1$2, [_hoisted_2$2, createVNode("div", _hoisted_3$2, [_hoisted_4$1, withDirectives(createVNode("input", {
    class: "pl-10",
    type: "search",
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.query = $event),
    placeholder: "Search",
    onChange: _cache[2] || (_cache[2] = $event => _ctx.reloadTable())
  }, null, 544), [[vModelText, _ctx.query, void 0, {
    trim: true
  }]])])])) : createCommentVNode("", true), createVNode("div", _hoisted_5, [createVNode("table", _hoisted_6, [createVNode("thead", null, [createVNode("tr", null, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.tableData.columns, (col, idx) => {
    return openBlock(), createBlock("th", {
      class: "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50 leading-4",
      key: idx
    }, [!!col.display.length ? (openBlock(), createBlock("span", _hoisted_7, toDisplayString(col.display), 1)) : createCommentVNode("", true), col.sort ? (openBlock(), createBlock("span", {
      key: 1,
      class: "cursor-pointer",
      onClick: withModifiers($event => _ctx.handleSort(col.sort), ["prevent"])
    }, [_ctx.currentSort !== col.sort ? (openBlock(), createBlock("svg", _hoisted_8, [_hoisted_9])) : _ctx.currentSortDirection == 'desc' ? (openBlock(), createBlock("svg", _hoisted_10, [_hoisted_11])) : (openBlock(), createBlock("svg", _hoisted_12, [_hoisted_13]))], 8, ["onClick"])) : createCommentVNode("", true)]);
  }), 128))])]), createVNode("tbody", _hoisted_14, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.items, (item, rowIdx) => {
    return openBlock(), createBlock("tr", {
      key: item.id ? item.id : rowIdx
    }, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.tableData.columns, (col, colIdx) => {
      return openBlock(), createBlock("td", {
        class: ["px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-b border-gray-200 leading-5", col.class],
        key: rowIdx + '-' + colIdx
      }, [col.component ? (openBlock(), createBlock(resolveDynamicComponent(col.component), {
        key: 0,
        "props-data": item,
        "current-user": _ctx.tableData.currentUser,
        attribute: col.key,
        items: col.items
      }, null, 8, ["props-data", "current-user", "attribute", "items"])) : (openBlock(), createBlock("div", {
        key: 1,
        textContent: toDisplayString(_ctx.cellValue(item, col))
      }, null, 8, ["textContent"]))], 2);
    }), 128))]);
  }), 128)), _ctx.items.length == 0 ? (openBlock(), createBlock("tr", _hoisted_15, [createVNode("td", {
    colspan: _ctx.tableData.columns.length,
    class: "px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-b border-gray-200 leading-5"
  }, " No items were found! ", 8, ["colspan"])])) : createCommentVNode("", true)])])]), _ctx.hasContent ? (openBlock(), createBlock(_component_Paginator, {
    key: 1,
    modelValue: _ctx.pagination,
    "onUpdate:modelValue": [_cache[3] || (_cache[3] = $event => _ctx.pagination = $event), _cache[4] || (_cache[4] = $event => _ctx.loadAndRender(false))]
  }, null, 8, ["modelValue"])) : createCommentVNode("", true)]);
}

Table.render = render$3;

var _dec$2, _dec2$2, _dec3$2, _dec4$2, _class$2, _class2$2, _descriptor$2, _descriptor2$2;
let Tabs = (_dec$2 = Options({
  name: "Tabs"
}), _dec2$2 = Prop({
  type: Array,
  required: true
}), _dec3$2 = Prop({
  type: String,
  required: true
}), _dec4$2 = Emit("update:modelValue"), _dec$2(_class$2 = (_class2$2 = class Tabs extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "tabs", _descriptor$2, this);

    _initializerDefineProperty(this, "modelValue", _descriptor2$2, this);
  }

  updateModelValue(modelValue) {
    return modelValue;
  }

}, (_descriptor$2 = _applyDecoratedDescriptor(_class2$2.prototype, "tabs", [_dec2$2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$2 = _applyDecoratedDescriptor(_class2$2.prototype, "modelValue", [_dec3$2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _applyDecoratedDescriptor(_class2$2.prototype, "updateModelValue", [_dec4$2], Object.getOwnPropertyDescriptor(_class2$2.prototype, "updateModelValue"), _class2$2.prototype)), _class2$2)) || _class$2);

const _hoisted_1$1 = {
  class: "sm:hidden mb-4"
};

const _hoisted_2$1 = /*#__PURE__*/createVNode("label", {
  for: "tabs",
  class: "sr-only"
}, "Select a tab", -1);

const _hoisted_3$1 = {
  class: "hidden sm:block"
};
const _hoisted_4 = {
  class: "flex ml-8"
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Select = resolveComponent("Select");

  return openBlock(), createBlock("div", null, [createVNode("div", _hoisted_1$1, [_hoisted_2$1, createVNode(_component_Select, {
    name: "tabs",
    modelValue: _ctx.modelValue,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => _ctx.updateModelValue($event)),
    options: _ctx.tabs
  }, null, 8, ["modelValue", "options"])]), createVNode("div", _hoisted_3$1, [createVNode("nav", _hoisted_4, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.tabs, (tab, idx) => {
    return openBlock(), createBlock("a", {
      href: "#",
      class: ["px-12 py-2 font-medium text-md leading-5 rounded-t-md focus:outline-none", {
        'focus:bg-white text-gray-700 bg-white border-b-2 border-blue-500': tab.value === _ctx.modelValue,
        'text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100 border border-gray-200': tab.value != _ctx.modelValue
      }],
      key: idx,
      textContent: toDisplayString(tab.label),
      onClick: withModifiers($event => _ctx.updateModelValue(tab.value), ["prevent"])
    }, null, 10, ["textContent", "onClick"]);
  }), 128))])])]);
}

Tabs.render = render$2;

var _dec$1, _dec2$1, _dec3$1, _dec4$1, _dec5$1, _dec6, _class$1, _class2$1, _descriptor$1, _descriptor2$1, _descriptor3$1, _descriptor4$1, _descriptor5;
let Checkbox = (_dec$1 = Options({
  name: "Checkbox"
}), _dec2$1 = Prop({
  type: Boolean,
  required: false
}), _dec3$1 = Prop({
  type: Boolean,
  required: false
}), _dec4$1 = Prop({
  type: String,
  required: false
}), _dec5$1 = Prop({
  type: Boolean,
  required: false
}), _dec6 = Prop({
  type: Boolean,
  required: true
}), _dec$1(_class$1 = (_class2$1 = class Checkbox extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "disabled", _descriptor$1, this);

    _initializerDefineProperty(this, "emphasis", _descriptor2$1, this);

    _initializerDefineProperty(this, "label", _descriptor3$1, this);

    _initializerDefineProperty(this, "required", _descriptor4$1, this);

    _initializerDefineProperty(this, "modelValue", _descriptor5, this);
  }

}, (_descriptor$1 = _applyDecoratedDescriptor(_class2$1.prototype, "disabled", [_dec2$1], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2$1 = _applyDecoratedDescriptor(_class2$1.prototype, "emphasis", [_dec3$1], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3$1 = _applyDecoratedDescriptor(_class2$1.prototype, "label", [_dec4$1], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4$1 = _applyDecoratedDescriptor(_class2$1.prototype, "required", [_dec5$1], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2$1.prototype, "modelValue", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2$1)) || _class$1);

const _hoisted_1 = {
  class: "relative flex items-start"
};
const _hoisted_2 = {
  class: "h-5 flex items-center"
};
const _hoisted_3 = {
  class: "ml-3 text-sm leading-5"
};
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1, [createVNode("div", _hoisted_2, [createVNode("input", {
    type: "checkbox",
    class: "focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed",
    checked: _ctx.modelValue,
    disabled: _ctx.disabled,
    onChange: _cache[1] || (_cache[1] = $event => _ctx.$emit('update:modelValue', $event.target.checked)),
    required: _ctx.required
  }, null, 40, ["checked", "disabled", "required"])]), createVNode("div", _hoisted_3, [createVNode("label", {
    class: ["text-gray-500", {
      'font-medium': _ctx.emphasis
    }],
    textContent: toDisplayString(_ctx.label)
  }, null, 10, ["textContent"])])]);
}

Checkbox.render = render$1;

var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;
let Select = (_dec = Options({
  name: "Select"
}), _dec2 = Prop({
  type: String,
  required: false
}), _dec3 = Prop({
  type: Array,
  required: true
}), _dec4 = Prop({
  type: String,
  required: false
}), _dec5 = Prop({
  type: String,
  required: true
}), _dec(_class = (_class2 = class Select extends Vue {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "design", _descriptor, this);

    _initializerDefineProperty(this, "options", _descriptor2, this);

    _initializerDefineProperty(this, "placeholder", _descriptor3, this);

    _initializerDefineProperty(this, "modelValue", _descriptor4, this);
  }

  get classes() {
    const design = this.design ? this.design : "undefined";
    return {
      undefined: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      standard: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      compressed: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
    }[design];
  }

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "design", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "options", [_dec3], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "placeholder", [_dec4], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "modelValue", [_dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("select", {
    class: _ctx.classes,
    value: _ctx.modelValue,
    onChange: _cache[1] || (_cache[1] = $event => _ctx.$emit('update:modelValue', $event.target.value))
  }, [_ctx.placeholder ? (openBlock(), createBlock("option", {
    key: 0,
    value: "",
    disabled: "",
    selected: "",
    hidden: "",
    textContent: toDisplayString(_ctx.placeholder)
  }, null, 8, ["textContent"])) : createCommentVNode("", true), (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, option => {
    return openBlock(), createBlock("option", {
      value: option.value,
      textContent: toDisplayString(option.label),
      key: option.value
    }, null, 8, ["value", "textContent"]);
  }), 128))], 42, ["value"]);
}

Select.render = render;

// TODO: rearrange so that these are default installed by app.use(Trees);

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ActionsDropdown: ActionsDropdown,
  DateFilter: DateFilter,
  DetailList: DetailList,
  Flash: Flash,
  Modal: Modal,
  SidebarLayout: SidebarLayout,
  StackedLayout: StackedLayout,
  Paginator: Paginator,
  Spinner: Spinner,
  Table: Table,
  Tabs: Tabs,
  Checkbox: Checkbox,
  DateRangePicker: DateRangePicker,
  Select: Select
});

const install = function installTrees(app) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });
}; // Create module definition for Vue.use()

export default install;
export { ActionsDropdown, BaseAPI, Checkbox, DateFilter, DateRangePicker, DetailList, Flash, Modal, Paginator, Select, SidebarLayout, Spinner, StackedLayout, Table, Tabs };
