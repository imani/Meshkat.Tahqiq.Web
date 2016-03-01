var app = app || {};

(function () {
    'use strict';

    app.BookCommentSubject = Backbone.AssociatedModel.extend({
        defaults: {
            BookCommentSubjectTitle: null,
            BookCommentSubjectId: null,
            BookCommentSubjectParentId: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getBookCommentSubjectTitle: function () {
            return this.get("BookCommentSubjectTitle");
        },
        getBookCommentSubjectId: function () {
            return this.get("BookCommentSubjectId");
        },
        getBookCommentSubjectParentId: function () {
            return this.get("BookCommentSubjectParentId");
        },

        //Setters
        setBookCommentSubjectTitle: function (val) {
            this.set("BookCommentSubjectTitle", val);
        },
        setBookCommentSubjectId: function (val) {
            this.set("BookCommentSubjectId", val);
        },
        setBookCommentSubjectParentId: function (val) {
            this.set("BookCommentSubjectParentId", val);
        }
    });
})();
