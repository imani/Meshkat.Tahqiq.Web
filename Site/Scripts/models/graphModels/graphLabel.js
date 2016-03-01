var app = app || {};

(function () {
    'use strict';

    app.GraphLabel = Backbone.AssociatedModel.extend({
        defaults: {
            GraphLabelId: null,
            GraphLabelTitle: null
        },

        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Getters
        getGraphLabelId: function () {
            return this.get("GraphLabelId");
        },
        getGraphLabelTitle: function () {
            return this.get("GraphLabelTitle");
        },

        //Setters
        setGraphLabelId: function (val) {
            this.set("GraphLabelId", val);
        },
        setGraphLabelTitle: function (val) {
            this.set("GraphLabelTitle", val);
        }
    });

})();