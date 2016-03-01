var app = app || {};

(function () {
    'use strict';

    app.Section = Backbone.AssociatedModel.extend({
        defaults: {
            ParagraphId: null,
            StartOffset: null,
            EndOffset: null,
            Text:null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getParagraphId: function () {
            return this.get("ParagraphId");
        },
        getStartOffset: function () {
            return this.get("StartOffset");
        },
        getEndOffset: function () {
            return this.get("EndOffset");
        },
        getText: function () {
            return this.get("Text");
        },
        //Setters
        setParagraphId: function (val) {
            this.set("ParagraphId", val);
        },
        setStartOffset: function (val) {
            this.set("StartOffset", val);
        },
        setEndOffset: function (val) {
            this.set("EndOffset", val);
        },
        setText: function (val) {
            this.set("Text", val);
        }
    });
})();
