var app = app || {};

(function () {
    'use strict';

    app.BookSectionStyle = Backbone.AssociatedModel.extend({
        defaults: {
            Section: null,
            Style: null
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
        getSection: function () {
            return this.get("Section");
        },
        getStyle: function () {
            return this.get("Style");
        },

        //Setters
        setSection: function (val) {
            this.set("Section", val);
        },
        setStyle: function (val) {
            this.set("Style", val);
        }
    });
})();
