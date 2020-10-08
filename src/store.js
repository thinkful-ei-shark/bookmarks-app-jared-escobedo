/* eslint-disable indent */
let bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let filteredBookmarks = [];

const addBookmark = function(bookmark) {
    for (let i = 0; i < bookmarks.length; i++)
    if (bookmarks[i]) {
        bookmarks[i].expand = false;
    }
    bookmarks.push(bookmark);
    this.adding = false;
    if (this.filter > 0) {
        this.filterBookmarks(this.filter);
    }
};

const setAdding = function(param) {
    this.adding = param;
};

const expandBookmark = function(id) {
    let expandedBookmark = bookmarks.find(bookmark => bookmark.id === id);
    if (expandedBookmark.expand) {
        expandedBookmark.expand = false;
    } else {
        expandedBookmark.expand = true;
    }
};

const deleteBookmark = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
};

const filterBookmarks = function(filterNumber) {
    this.filter = filterNumber;
    this.filteredBookmarks = [];
    this.bookmarks.forEach(bookmark => {
        if (bookmark.rating >= filterNumber) {
            this.filteredBookmarks.push(bookmark);
        }
    });
};

const findById = function (id) {
    return this.bookmarks.find(currentItem => currentItem.id === id);
};

const setFiltering = function(param) {
    this.filter = param;
};

const setError = function(errorMessage) {
    this.error = errorMessage;
};

export default {
    findById,
    bookmarks,
    adding,
    error,
    filter,
    addBookmark,
    expandBookmark,
    deleteBookmark,
    setAdding,
    setFiltering,
    setError,
    filterBookmarks,
    filteredBookmarks
};