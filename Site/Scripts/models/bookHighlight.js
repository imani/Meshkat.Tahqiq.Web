var app = app || {};

(function () {
    'use strict';

    app.BookHighlight = Backbone.AssociatedModel.extend({
        defaults: {
            HighlightId: null,
            HighlightSection: null,
            Color: null,
            PersonId: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'HighlighSection',
                relatedModel: app.Section
            }
        ],

        //Getters
        getHighlightId: function () {
            return this.get("HighlightId");
        },
        getHighlightSection: function () {
            return this.get("HighlightSection");
        },
        getColor: function () {
            return this.get("Color");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },

        //Setters
        setHighlightId: function (val) {
            this.set("HighlightId", val);
        },
        setHighlightSection: function (val) {
            this.set("HighlightSection", val);
        },
        setColor: function (val) {
            this.set("Color", val);
        },
        setPersonId: function (val) {
            this.set("PersonId", val);
        }        
    });
})();
