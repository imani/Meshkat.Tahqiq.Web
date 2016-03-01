var app = app || {};

(function () {
    'use strict';
    app.GraphSectionRelation = Backbone.AssociatedModel.extend({
        defaults: {
            GraphId: null,
            GraphElement: null,
            GraphElementId: -1,
            Sections: []
        },
        relations: [
            {
                type: Backbone.Many,
                key: "Sections",
                relatedModel: app.Section
            }
        ],
        constructor: function(attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Getters
        getGraphId: function() {
            return this.get("GraphId");
        },
        getGraphElement: function() {
            return this.get("GraphElement");
        },
        getGraphElementId: function() {
            return this.get("GraphElementId");
        },
        getSections: function() {
            return this.get("Sections");
        },
        //Setters
        setGraphId: function(val) {
            this.set("GraphId", val);
        },
        setGraphElement: function (val) {
            this.set("GraphElement", val);
        },
        setGraphElementId: function(val) {
            this.set("GraphElementId", val);
        },
        setSections: function(val) {
            this.set("Sections", val);
        }
    });
})();