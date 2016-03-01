var app = app || {};

(function () {
    'use strict';

    app.HomeData = Backbone.AssociatedModel.extend({
        defaults: {
            Volumes: [],
            Categories:[]
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Volumes',
                relatedModel: app.BookVolume
            },
            {
                type: Backbone.Many,
                key: 'Categories',
                relatedModel: app.BookCategory
            }
        ],

        //Getters
        getVolumes: function () {
            return this.get("Volumes");
        },
        getCategories: function () {
            return this.get("Categories");
        },

        //Setters
        setVolumes: function (val) {
            this.set("Volumes", val);
        },
        setCategories: function (val) {
            this.set("Categories", val);
        }
    });
})();
