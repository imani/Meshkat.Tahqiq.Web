var app = app || {};

(function () {
    'use strict';

    app.StateItem = Backbone.AssociatedModel.extend({
        defaults: {
            ParagraphId: null,
            TableOfContentId: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getParagraphId: function () {
            return this.get("ParagraphId");
        },
        getTableOfContentId: function () {
            return this.get("TableOfContentId");
        },

        //Setters
        setParagraphId: function (val) {
            this.set("ParagraphId", val);
        },
        setTableOfContentId: function (val) {
            this.set("TableOfContentId", val);
        }
    });
})();
