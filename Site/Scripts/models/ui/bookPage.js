var app = app || {};

(function () {
    'use strict';

    app.BookPage = Backbone.AssociatedModel.extend({
        defaults: {
            PageNumber: 0,
            Paragraphs: 0
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Paragraphs',
                relatedModel: app.BookParagraph
            }
        ],
        //Getters
        getPageNumber: function () {
            return this.get("PageNumber");
        },
        getParagraphs: function () {
            return this.get("Paragraphs");
        },

        //Setters
        setPageNumber: function (val) {
            this.set("PageNumber", val);
        },
        setParagraphs: function (val) {
            this.set("Paragraphs", val);
        }
    });
})();
