var app = app || {};

(function () {
    'use strict';
    app.GraphElementRelation = Backbone.AssociatedModel.extend({
        defaults: {
            GraphElementParent: null,
            GraphElementChild: null,
            GraphId: null,
            IsTreeRelation: true
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Getters
        getGraphElementParent: function () {
            return this.get("GraphElementParent");
        },
        getGraphElementChild: function () {
            return this.get("GraphElementChild");
        },
        getGraphId: function () {
            return this.get("GraphId");
        },
        getIsTreeRelation: function () {
            return this.get("IsTreeRelation");
        },

        //Setters
        setGraphId: function (val) {
            this.set("GraphId", val);
        },
        setGraphElementParent: function (val) {
            this.set("GraphElementParent", val);
        },
        setGraphElementChild: function (val) {
            this.set("GraphElementChild", val);
        },
        setIsTreeRelation: function (val) {
            this.set("IsTreeRelation", val);
        }
    });
})();