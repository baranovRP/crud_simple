/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import clone, { log, httpHeaders, extend, initRequest } from './util';

import Collection from './collection';
import Photo from './photo';

export default function Album(obj) {
  Collection.call(this, clone(obj));
}

extend(Album, Collection);

Album.URL = 'http://jsonplaceholder.typicode.com/albums';

Album.list = Collection.list;

Album.get = Collection.get;

Album.prototype.save = function save(...args) {
  if (!this.userId || !this.title) {
    log('one of userId, title or all of them don\'t set properly');
    throw new Error();
  }

  return Collection.prototype.save.apply(this, args);
};

Album.prototype.getPhotos = function getPhotos() {
  return fetch(`${Photo.URL}?albumId=${this.id}`, initRequest(httpHeaders, 'GET'))
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json().then(result => result.map(o => new Photo(o)));
    }).catch(error => log(`User.list.fetch: ${error}`));
};
