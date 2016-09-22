/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import clone, { log, httpHeaders, extend, isEmailValid, initRequest } from './util';

import Collection from './collection';
import Album from './album';

export default function User(obj) {
  Collection.call(this, clone(obj));
}

extend(User, Collection);

User.URL = 'http://jsonplaceholder.typicode.com/users';

User.list = Collection.list;

User.get = Collection.get;

User.prototype.save = function save(...args) {
  if (!this.name || !this.username || !this.email) {
    log('one of name, userName, email or all of them don\'t set properly');
    throw new Error();
  }
  if (!isEmailValid(this.email)) {
    log('email is invalid');
    throw new Error();
  }

  return Collection.prototype.save.apply(this, args);
};

User.prototype.getAlbums = function getAlbums() {
  return fetch(`${Album.URL}?userId=${this.id}`, initRequest(httpHeaders, 'GET'))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json()
        .then(result => result.map(o => new Album(o)));
    })
    .catch(error => log(`User.getAlbums.fetch: ${error}`));
};
