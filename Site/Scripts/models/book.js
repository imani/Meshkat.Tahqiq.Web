var app = app || {};

(function () {
    'use strict';

    app.Book = Backbone.AssociatedModel.extend({
        defaults: {
            BookId: 0,
            BookName: 0,
            Image: null,
            Author: null,
            Publisher: null,
            Translator:null,
            Description: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getBookId: function () {
            return this.get("BookId");
        },
        getBookName: function () {
            return this.get("BookName");
        },
        getImage: function () {
            return this.get("Image");
        },
        getAuthor: function () {
            return this.get("Author");
        },
        getPublisher: function () {
            return this.get("Publisher");
        },
        getTranslator:function() {
            return this.get("Translator");
        },
        getDescription:function() {
            return this.get("Description");
        },

        //Setters
        setBookId: function (val) {
            this.set("BookId", val);
        },
        setBookName: function (val) {
            this.set("BookName", val);
        },
        setImage: function (val) {
            this.set("Image", val);
        },
        setAuthor: function (val) {
            this.set("Author", val);
        },
        setPublisher: function (val) {
            this.set("Publisher", val);
        },
        setTranslator:function(val) {
            this.set("Translator", val);
        },
        setDescription:function(val) {
            this.set("Description", val);
        }
    });
})();
