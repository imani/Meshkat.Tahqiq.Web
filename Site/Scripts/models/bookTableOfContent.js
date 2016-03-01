var app = app || {};

(function () {
    'use strict';

    app.BookTableOfContent = Backbone.AssociatedModel.extend({
        defaults: {
            BookParagraphId: null,
            VolumeId: null,
            ParentKey: null,
            Title: null,
            Key: null,
            IsLazy: null,
            HasChild: null,
            Path:null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getBookParagraphId: function () {
            return this.get("BookParagraphId");
        },
        getVolumeId: function () {
            return this.get("VolumeId");
        },
        getParentKey: function () {
            return this.get("ParentKey");
        },
        getTitle: function () {
            return this.get("Title");
        },
        getKey: function () {
            return this.get("Key");
        },
        getIsLazy: function () {
            return this.get("IsLazy");
        },
        getHasChild: function () {
            return this.get("HasChild");
        },
        getPath: function () {
            return this.get("Path");
        },

        //Setters
        setBookParagraphId: function (val) {
            this.set("BookParagraphId", val);
        },
        setVolumeId: function (val) {
            this.set("VolumeId", val);
        },
        setParentKey: function (val) {
            this.set("ParentKey", val);
        },
        setTitle: function (val) {
            this.set("Title", val);
        },
        setKey: function (val) {
            this.set("Key", val);
        },
        setIsLazy: function (val) {
            this.set("IsLazy", val);
        },
        setHasChild: function (val) {
            this.set("HasChild", val);
        },
        setPath: function (val) {
            this.set("Path", val);
        }
    });
})();
