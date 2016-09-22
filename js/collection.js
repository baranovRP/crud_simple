/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import clone, { log, httpHeaders, diff, request, initRequest } from './util';

const state = Symbol('state');

export default function Collection(obj) {
  this[state] = clone(obj);
  const keys = Object.keys(this[state]);
  for (const prop of keys) {
    this[prop] = this[state][prop];
  }
}

Collection.URL = 'http://jsonplaceholder.typicode.com/todos';

Collection.list = function list() {
  const baseRequest = initRequest(httpHeaders, 'GET');

  return fetch(this.URL, baseRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json()
        .then(result => result.map(o => new this(o)));
    })
    .catch(error => log(`Collection.list.fetch: ${error}`));
};

Collection.get = function get(id) {
  const baseRequest = initRequest(httpHeaders, 'GET');

  return fetch(`${this.URL}/${id}`, baseRequest)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json().then(result => {
        log(`get.response ${JSON.stringify(result)}`);
        return new this(result);
      });
    })
    .catch(error => log(`Collection.get.fetch: ${error}`));
};

Collection.prototype.save = function save() {
  if (!this.id) {
    const baseRequest = request(JSON.stringify(this), httpHeaders, 'POST');

    fetch(this.URL, baseRequest)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        response.json().then(result => {
          this.id = result;
        });

        return null;
      })
      .catch(error => log(`Collection.save.post: ${error}`));
  } else {
    const obj = diff(this[state], this);
    if (obj) {
      const baseRequest = request(JSON.stringify(this), httpHeaders, 'PATCH');

      fetch(`${this.URL}/${this.id}`, baseRequest)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          this[state] = clone(this);

          return null;
        })
        .catch(error => log(`Collection.save.patch: ${error}`));
    }
  }
};
