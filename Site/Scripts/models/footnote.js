var app = app || {};

(function () {
    'use strict';
    app.Footnote = Backbone.AssociatedModel.extend({
        defaults: {
            Id: null,
            Text: null,
            Section: null,
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'Section',
                relatedModel: app.Section
            }
        ],

        //Getters
        getId: function () {
            return this.get("Id");
        },
        getText: function () {
            return this.get("Text");
        },
        getSection: function () {
            return this.get("Section");
        },

        //Setters
        setId: function (val) {
            this.set("Id", val);
        },
        setText: function (val) {
            this.set("Text", val);
        },
        setSection: function (val) {
            this.set("Section", val);
        }
    });
})();
