/* eslint-disable indent */
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Jared-Escobedo';


const apiFetch = function(...args) {
    let error;
    return fetch(...args)
    .then(response => {
        if (!response.ok) {
            error = { code: response.status };
        }
        return response.json();
    })
    .then(data => {
        if (error) {
            error.message = data.message;
            return Promise.reject(error);
        }
        return data;
    });
};

const getBookmarks = function() {
    return fetch(`${BASE_URL}/bookmarks`);
};

const createBookmark = function(object) {
    const newBookmark = object;
    const options = {
        method: 'POST',
        headers: ({
            'Content-type': 'application/json'
        }),
        body: newBookmark,
    };
    return apiFetch(BASE_URL + '/bookmarks', options);
};

const deleteBookmark = function(id) {
    const options = {
        method: 'DELETE',
        headers: ({
            'Content-type': 'application/json'
        })
    };
    return apiFetch(BASE_URL + '/bookmarks/' + id, options);
};


export default {
    getBookmarks,
    createBookmark,
    deleteBookmark
};