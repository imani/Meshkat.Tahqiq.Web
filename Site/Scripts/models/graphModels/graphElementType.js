var app = app || {};

(function () {
    'use strict';

    app.GraphElementType = Backbone.AssociatedModel.extend({
        defaults: {
            GraphElementTypeId: null,
            GraphElementTypeLabel: null
        },

        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Getters
        getGraphElementTypeId: function () {
            return this.get("GraphElementTypeId");
        },
        getGraphElementTypeLabel: function () {
            return this.get("GraphElementTypeLabel");
        },

        //Setters
        setGraphElementTypeId: function (val) {
            this.set("GraphElementTypeId", val);
        },
        setGraphElementTypeLabel: function (val) {
            this.set("GraphElementTypeLabel", val);
        }
    });

})();