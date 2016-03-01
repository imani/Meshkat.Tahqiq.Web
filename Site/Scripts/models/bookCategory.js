var app = app || {};

(function () {
    'use strict';

    app.BookCategory = Backbone.AssociatedModel.extend({
        defaults: {
            CategoryId: 0,
            CategoryTitle: null,
            CategoryImage: null,
            BookVolumes:[]
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
           {
               type: Backbone.Many,
               key: 'BookVolumes',
               relatedModel: app.BookVolume
           }
        ],
        //Getters
        getCategoryId: function () {
            return this.get("CategoryId");
        },
        getCategoryTitle: function () {
            return this.get("CategoryTitle");
        },
        getCategoryImage: function () {
            return this.get("CategoryImage");
        },
        getBookVolumes: function () {
            return this.get("BookVolumes");
        },

        //Setters
        setCategoryId: function (val) {
            this.set("CategoryId", val);
        },
        setCategoryTitle: function (val) {
            this.set("CategoryTitle", val);
        },
        setCategoryImage: function (val) {
            this.set("CategoryImage", val);
        },
        setBookVolumes: function (val) {
            this.set("BookVolumes", val);
        }
    });
})();
