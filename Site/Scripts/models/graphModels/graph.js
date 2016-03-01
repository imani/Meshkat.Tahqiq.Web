var app = app || {};

(function () {
    'use strict';

    app.Graph = Backbone.AssociatedModel.extend({
        defaults: {
            GraphId :null,
            GraphTitle: null,
            PersonId: 0,
            WorkspaceId: -1,
            GraphElements: [],
            GraphElementRelations: [],
            ChangeEvents:[],
            IsInline:false,
            CreateDate: null,
            ModifyDate: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: "GraphElements",
                relatedModel: app.GraphElement
            },
            {
                type: Backbone.Many,
                key: "GraphElementRelations",
                relatedModel: app.GraphElementRelation
            }
        ],

        
        //Getters
        getGraphId: function () {
            return this.get("GraphId");
        },
        getGraphTitle: function () {
            return this.get("GraphTitle");
        },
        getGraphOwner: function() {
            return this.get("PersonId");
        },
        getGraphWorkspace: function() {
            return this.get("WorkspaceId");
        },
        getGraphElements: function() {
            return this.get("GraphElements");
        },
        getGraphElementRelations: function() {
            return this.get("GraphElementRelations");
        },
        getGraphChangeEvents: function () {
            return this.get("ChangeEvents");
        },
        isGraphInline: function () {
            return this.get("IsInline");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },
        getModifyDate: function () {
            return this.get("ModifyDate");
        },
        
        //Setters
        setGraphId: function (val) {
            this.set("GraphId", val);
        },
        setGraphTitle: function (val) {
            this.set("GraphTitle", val);
        },
        setGraphOwner: function(val) {
            this.set("PersonId", val);
        },
        setGraphWorkspace: function(val) {
            this.set("WorkspaceId", val);
        },
        setGraphElements: function(val) {
            this.set("GraphElements", val);
        },
        setGraphElementRelations: function(val) {
            this.set("GraphElementRelations", val);
        },
        setGraphChangeEvents: function (val) {
            this.set("ChangeEvents", val);
        }
    });

})();