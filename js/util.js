/**
 * Check that parameter is object (object, array) and not 'null'.
 * @param {Object} obj
 * @method
 */
function isObject(obj) {
  return !(typeof obj !== 'object' || obj === null);
}

/**
 * Clone object.
 * @param {Object} obj
 * @method
 */
export default function clone(obj) {
  let resultObj = {};
  if (!isObject(obj)) {
    throw Error(`Provided argument {${obj} is not an object.`);
  }
  if (Array.isArray(obj)) {
    resultObj = [];
  }

  Object.keys(obj).forEach((key) => {
    if (isObject(obj[key])) {
      resultObj[key] = clone(obj[key]);
    } else {
      resultObj[key] = obj[key];
    }
  });

  return resultObj;
}

/**
 * Extend child class with parent class
 * @param {Object} child
 * @param {Object} parent
 */
export function extend(child, parent) {
  const F = function () {
  };
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.superClass = parent.prototype;
}

/**
 * Check that email is valid
 * @param {String} email
 */
export function isEmailValid(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

/**
 * Check that object is empty
 * @param {Object} obj
 */
function isObjectEmpty(obj) {
  if (obj !== null) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  return false;
}

/**
 * Find differences between objects
 * @param {Object} old
 * @param {Object} current
 */
export function diff(old, current) {
  const resultObj = {};

  Object.keys(old).forEach((key) => {
    if (isObject(old[key])) {
      const temp = diff(old[key], current[key]);
      if (temp !== null) {
        resultObj[key] = temp;
      }
    } else if (old[key] !== current[key]) {
      resultObj[key] = current[key];
    }
  });

  if (isObjectEmpty(resultObj)) {
    return null;
  }

  return resultObj;
}

/**
 * Create request
 * @param {String} baseBody
 * @param {Object} baseHeaders
 * @param {String} baseMethod
 */
export function request(baseBody, baseHeaders, baseMethod) {
  return {
    body: baseBody,
    headers: baseHeaders,
    method: baseMethod,
  };
}

export const httpHeaders = {
  Accept: '*/*',
  'Content-Type': 'application/json; charset=utf-8',
  mode: 'cors',
  cache: 'default',
};

export function initRequest(baseHeaders, type) {
  return {
    headers: baseHeaders,
    method: type,
  };
}

export const log = window.console.log;
