/* eslint-disable indent */
import $ from 'jquery';
import api from './api';
import STORE from './store';

// Render the page

const render = function() {
    $('#main').html(generateBookmarkHeader());
    if (STORE.adding) {
        $('.js-bookmarks-container').html(generateBookmarkAddHTML());
        renderError();  
        bindEventListeners();
    } else if (STORE.filter) {
        let filteredBookmarksArray = [...STORE.filteredBookmarks];
        const filteredBookmarkHTML = generateBookmarkListHTML(filteredBookmarksArray);
        $('.js-bookmarks-container').html(filteredBookmarkHTML);
        renderError();
        bindEventListeners();
    } else {
        const bookmarkHTML = generateBookmarkListHTML(STORE.bookmarks);
        $('.js-bookmarks-container').html(bookmarkHTML);
        renderError();
        bindEventListeners();
    }
};

// Generate header and starting view of page

const generateBookmarkHeader = function() {
    return `
    <header>
        <h1>Bookmark App</h1>
    </header>
    <div class="flex-container">
        <div class="controls">
            <form class="flex-form">
                <button class="new-button" id="js-new-bookmark">NEW</button>
                <select class="filter-control" name="filter" id="js-ratings-filter">
                    <option value="" disabled selected hidden>FILTER</option>
                    <option value="5">5+ stars</option>
                    <option value="4">4+ stars</option>
                    <option value="3">3+ stars</option>
                    <option value="2">2+ stars</option>
                    <option value="1">1+ stars</option>
                </select>
            </form>
        </div>
    <section class="js-bookmarks-container">
    </section>
    </div>
    `;
};

// If a bookmark exists, display all here

const generateBookmarkHTML = function(bookmark) {
    let expandBookmark = !bookmark.expand ? 'hidden' : '';
    let ratingBookmark = generateStarRating(bookmark);
    console.log(bookmark);
    return `
        <div class="bookmark-hidden-container js-bookmark-hidden-container" data-item-id="${bookmark.id}">
        <fieldset>
        <legend class="form" align="left">${ratingBookmark}</legend>
        <div class="title-and-button">
            <h2 class="bookmark-title js-bookmark-title">${bookmark.title}</h2><button class="expand-button js-expand-button">&#11206;</button>
            </div>
                <div class="bookmark-expand js-bookmark-expand-container ${expandBookmark} ${!bookmark.expand ? 'hidden' : null}">
                    <p>${bookmark.desc}</p>
                <div class="actions">
                    <a class="bookmark-url js-bookmark-url" href="${bookmark.url}" target="_blank"><button class="js-visit-button">VISIT</button></a>
                    <button class="js-delete-button">DELETE</button>
                </div>
            </div>
        </fieldset>
        </div>
    `;
};

// List all bookmarks

const generateBookmarkListHTML = function(bookmarks) {
    const bookmarkListHTML = bookmarks.map(bookmark => generateBookmarkHTML(bookmark));
    return bookmarkListHTML.join('');
};

// Add a bookmark entry

const generateBookmarkAddHTML = function() {
    return `
    <section class="row">
            <div id="js-form-container" class="form-container">
                <form id="js-new-item-form">
                    <fieldset>
                        <legend class="form">Create Entry</legend>
                        <div class="form">
                            <label for="js-form-title">Bookmark Name</label>
                        </div>
                        <div class="form">
                            <input type="text" id="js-form-title" name="title" placeholder="E.g. Thinkful" required>
                        </div>
                        <hr>
                        <div class="form">
                        <label for="js-form-rating" id="rating-label">Rating</label>
                        </div>
                        <div class="js-ratings" aria-labelledby="rating">
                            <input type="radio" id="js-ratings" name="stars" value="1">
                                <label for="js-ratings">1</label>
                            <input type="radio" id="js-ratings" name="stars" value="2">
                                <label for="js-ratings">2</label>
                            <input type="radio" id="js-ratings" name="stars" value="3">
                                <label for="js-ratings">3</label>
                            <input type="radio" id="js-ratings" name="stars" value="4">
                                <label for="js-ratings">4</label>
                            <input type="radio" id="js-ratings" name="stars" value="5">
                                <label for="js-ratings">5</label>
                        </div>
                        <hr>
                        <div class="form">
                        <label for="js-form-description">Bookmark Description</label>
                        <div>
                            <textarea id="js-form-description" name="description" type="text" placeholder="We learn code and build cool stuff!"></textarea>
                            </div>
                        </div>
                        <hr>
                        <div class="form">
                        <label for="js-form-url">URL</label>
                            <input type="url" id="js-form-url" name="url" placeholder="https://...">
                        </div>
                        <hr>
                        <div class="add-btn-container">
                            <button type="submit" id="js-add-bookmark" class="add-button">CREATE BOOKMARK</button>
                            <button type="reset" value"cancel" id="js-cancel-bookmark" class="cancel-button">CANCEL</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </section>
    `;
};

// Attach ranking 1-5 to bookmark entries

const generateStarRating = function(bookmark) {
    let rating;
    let ratingChecked = bookmark.rating;
    const ratingCheckedHTML = `<span class="star-rating checked">&#9733;</span>`;
    rating = ratingCheckedHTML.repeat(ratingChecked);
    return rating;
};

// Add new bookmark entry

const handleBookmarkAdd = function(e) {
        e.preventDefault();
        if (!STORE.adding) {
            STORE.adding = true;
        }

    render();
};

// Confirm new bookmark entry by user

const handleBookmarkSubmit = function(event) {
        event.preventDefault();
        let formInputs = {};
        formInputs.title = $('#js-form-title').val();
        formInputs.rating = $('#js-ratings:checked').val();
        formInputs.desc = $('#js-form-description').val();
        formInputs.url = $('#js-form-url').val();
        let jsonObject = JSON.stringify(formInputs);
        console.log(jsonObject);
        api.createBookmark(jsonObject)
        .then(addNewBookmark => {
            STORE.addBookmark(addNewBookmark);
            render();
        }).catch((error) => {
            STORE.setError(error.message);
            renderError();
        });
};

// Stop submission of new bookmark entry in progress

const handleBookmarkCancel = function(event) {
    console.log('cancel');
    event.preventDefault();
    event = STORE.setAdding(false);
    render();
};

// Remove a bookmark entry

const handleBookmarkDelete = function(event) {
    event.preventDefault();
    const id = getBookmarkID(event.currentTarget);
    api.deleteBookmark(id)
        .then(() => {
            STORE.deleteBookmark(id);
            render();
        }).catch((error) => {
            STORE.setError(error.message);
            renderError();
    });
};

// Added view/user functionality -- expand view/options for bookmark

const getBookmarkID = function(target) {
    return $(target).closest('.js-bookmark-hidden-container').data('item-id');
};

const handleBookmarkExpand = function(event) {
        const id = getBookmarkID(event.currentTarget);
        STORE.expandBookmark(id);
        render();
};



// Sort/filter through existing entries

const handleBookmarkFilter = function() {
        let filterParam = $('#js-ratings-filter').val();
        console.log(filterParam);
        STORE.filterBookmarks(filterParam);
        render();
};



// Handle errors

const generateError = function(errorMessage) {
    return `
    <div class="js-error-container">
        <h2>ERROR</h2>
        <p>${errorMessage}</p>
    </div>
    `;
};

const renderError = function() {
    if (STORE.error) {
        if (STORE.adding) {
            const errorMessage = generateError(STORE.error);
            $('.flex-container').after(errorMessage);
        } else if (!STORE.adding) {
            const errorMessage = generateError(STORE.error);
            $('.js-error-container').empty();
        }
    }
};


// Event listeners

const bindEventListeners = function() {
    $('#js-new-bookmark').on('click', handleBookmarkAdd),
    $('.js-delete-button').on('click', handleBookmarkDelete),
    $('#js-cancel-bookmark').on('click', handleBookmarkCancel),
    $('#js-new-item-form').on('submit', handleBookmarkSubmit),
    $('#js-ratings-filter').on('change', handleBookmarkFilter),
    $('.js-expand-button').on('click', handleBookmarkExpand);
};

export default {
    bindEventListeners,
    render
};