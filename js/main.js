/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-global-assign: "warn" */
/* eslint-env browser */

import User from './user';

const document = window.document;

window.addEventListener('load', () => {
  const userEls = document.querySelector('main');
  let users = [];
  let albums = [];
  let photos = [];

  User.list().then(l => {
    userEls.innerHTML = '';
    users = l.slice();
    let ul = document.createElement('ul');
    ul.innerHTML = '';
    let intStr = '';
    l.forEach(u => {
      intStr += `<li class="user" data-idx="${u.id}">${u.name}</li>`;
    });
    ul.innerHTML = intStr;
    [...ul.children].forEach(i => userEls.appendChild(i));
    ul = undefined;
  });

  userEls.addEventListener('click', (event) => {
    const item = event.target;
    let user;
    let album;
    let photo;
    if (item.classList.contains('user')) {
      user = users.filter(el => el.id === +item.dataset.idx)[0];
      user.getAlbums().then(l => {
        albums = l.slice();
        const ul = document.createElement('ul');
        ul.innerHTML = '';
        let intStr = '';
        l.forEach(a => {
          intStr += `<li class="album" data-idx="${a.id}">${a.title}</li>`;
        });
        ul.innerHTML = intStr;
        const userEl = document.querySelector(`li[data-idx='${user.id}']`);
        userEl.appendChild(ul);
      });
    } else if (item.classList.contains('album')) {
      album = albums.filter(el => el.id === +item.dataset.idx)[0];
      album.getPhotos().then(l => {
        photos = l.slice();
        const ul = document.createElement('ul');
        ul.innerHTML = '';
        let intStr = '';
        l.forEach(ph => {
          intStr += `<li class="photo" data-idx="${ph.id}">${ph.thumbnailUrl}</li>`;
        });
        ul.innerHTML = intStr;
        const photoEl =
          document.querySelector(`li[data-idx='${album.userId}'] li[data-idx='${album.id}']`);
        photoEl.appendChild(ul);
      });
    } else if (item.classList.contains('photo')) {
      photo = photos.filter(el => el.id === +item.dataset.idx)[0];
      const div = document.createElement('div');
      div.innerHTML = '';
      let intStr = '';
      intStr += `<img src="${photo.thumbnailUrl}" style="width:100%;height:100%;" alt="" />`;
      div.innerHTML = intStr;
      userEls.style.display = 'none';
      const picture = document.querySelector('body');
      picture.appendChild(div);
    }
  });
});
