
var app = app || {};

(function () {
    'use strict';

    app.SearchResultItems = Backbone.AssociatedModel.extend({
        defaults: {
            Items: [],
            TotalHits: 0
        },
        constructor: function (attributes, options) {
            for (var i = 0; i < attributes.Items.length; i++) {
                attributes.Items[i].Styles = [];
                attributes.Items[i].HighlightSections = [];
                attributes.Items[i].CommentSections = [];
            }
            
            Backbone.Model.apply(this, arguments);
        },
       
        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Items',
                relatedModel: app.BookParagraph
            }
        ],

        //Getters
        getItems: function () {
            return this.get('Items');
        },
        getTotalHits: function () {
            return this.get('TotalHits');
        },

        //Setters
        setItems: function (t) {
            this.set('Items', t);
        },
        setTotalHits: function (t) {
            this.set('TotalHits', t);
        }
    });
})();