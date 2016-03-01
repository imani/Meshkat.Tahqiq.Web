var app = app || {};

(function () {
    'use strict';

    app.BookCommentField = Backbone.AssociatedModel.extend({
        defaults: {
            BookCommentFieldId: null,
            BookCommentFieldTitle: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getBookCommentFieldId: function () {
            return this.get("BookCommentFieldId");
        },
        getBookCommentFieldTitle: function () {
            return this.get("BookCommentFieldTitle");
        },

        //Setters
        setBookCommentFieldId: function (val) {
            this.set("BookCommentFieldId", val);
        },
        setBookCommentFieldTitle: function (val) {
            this.set("BookCommentFieldTitle", val);
        }
    });
})();
