/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search('/api/notes')
    .then(response => {
      store.notes = response;
      noteful.render();
    });

});

