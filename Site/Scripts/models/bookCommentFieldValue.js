var app = app || {};

(function () {
    'use strict';

    app.BookCommentFieldValue = Backbone.AssociatedModel.extend({
        defaults: {
            BookCommentFieldId: null,
            BookCommentFieldTitle: null,
            BookCommentValue:null
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
        getBookCommentValue: function () {
            return this.get("BookCommentValue");
        },

        //Setters
        setBookCommentFieldId: function (val) {
            this.set("BookCommentFieldId", val);
        },
        setBookCommentFieldTitle: function (val) {
            this.set("BookCommentFieldTitle", val);
        },
        setBookCommentValue: function (val) {
            this.set("BookCommentValue", val);
        }
    });
})();
