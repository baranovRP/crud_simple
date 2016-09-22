/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import clone, { log, extend } from './util';
import Collection from './collection';

export default function Photo(obj) {
  Collection.call(this, clone(obj));
}

extend(Photo, Collection);

Photo.URL = 'http://jsonplaceholder.typicode.com/photos';

Photo.list = Collection.list;

Photo.get = Collection.get;

Photo.prototype.save = function save(...args) {
  if (!this.albumId || !this.title) {
    log('one of albumId, title or all of them don\'t set properly');
    throw new Error();
  }

  return Collection.prototype.save.apply(this, args);
};
