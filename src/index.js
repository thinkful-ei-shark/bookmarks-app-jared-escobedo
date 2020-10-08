/* eslint-disable indent */
import $ from 'jquery';
import api from './api';
import './index.css';
import STORE from './store.js';
import bookmarks from './bookmarks.js';



const main = function() {
    api.getBookmarks()
    .then(response => response.json())
    .then(response => {
        response.forEach(bookmark => STORE.addBookmark(bookmark));
        bookmarks.render();
    });
    bookmarks.bindEventListeners();
};

$(main);