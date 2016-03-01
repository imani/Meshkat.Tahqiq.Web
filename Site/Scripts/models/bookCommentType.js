var app = app || {};

(function () {
    'use strict';

    app.BookCommentType = Backbone.AssociatedModel.extend({
        defaults: {
            BookCommentTypeId: null,
            BookCommentTypeTitle: null,
            BookCommentTypeColor: null,
            BookId: null,
            SubjectRoot: null,
            BookCommentFields:[]
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'SubjectRoot',
                relatedModel: app.BookCommentSubject
            },
            {
                type: Backbone.Many,
                key: 'BookCommentFields',
                relatedModel: app.BookCommentField
            }
        ],

        //Getters
        getBookCommentTypeId: function () {
            return this.get("BookCommentTypeId");
        },
        getBookCommentTypeTitle: function () {
            return this.get("BookCommentTypeTitle");
        },
        getBookCommentTypeColor: function () {
            return this.get("BookCommentTypeColor");
        },
        getBookId: function () {
            return this.get("BookId");
        },
        getSubjectRoot: function () {
            return this.get("SubjectRoot");
        },
        getBookCommentFields: function () {
            return this.get("BookCommentFields");
        },

        //Setters
        setBookCommentTypeId: function (val) {
            this.set("BookCommentTypeId", val);
        },
        setBookCommentTypeTitle: function (val) {
            this.set("BookCommentTypeTitle", val);
        },
        setBookCommentTypeColor: function (val) {
            this.set("BookCommentTypeColor", val);
        },
        setBookId: function (val) {
            this.set("BookId", val);
        },
        setSubjectRoot: function (val) {
            this.set("SubjectRoot", val);
        },
        setBookCommentFields: function (val) {
            this.set("BookCommentFields", val);
        }
    });
})();
