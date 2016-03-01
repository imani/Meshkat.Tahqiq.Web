var app = app || {};

(function() {
    'use strict';
    app.GraphElement = Backbone.AssociatedModel.extend({
        defaults: {
            GraphElementId: null,

            GraphElementTitle: null,

            GraphElementName: null,

            GraphElementLevelNumber: null,

            GraphElementIsRoot: false,

            GraphLabel: null,
            GraphElementType: null,

            GraphId: null,

            GraphElementOffsetX: null,
            GraphElementOffsetY: null,

            GraphElementColor: "black",
            GraphElementComment: "",

            GraphElementDirection: "right",
            GraphElementSectionRelation: null,

            PrivacyTypeId: null,
            WorkspaceId: null,
            PersonId:null,

            Sections:[]

        },
        constructor: function (attributes, options) {
            if (arguments[0].Sections == null)
                arguments[0].Sections = [];
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'GraphLabel',
                relatedModel: app.GraphLabel
            },
            {
                type: Backbone.Many,
                key: 'Sections',
                relatedModel: app.Section
            },
            {
                type: Backbone.One,
                key: 'GraphElementSectionRelation',
                relatedModel: app.GraphSectionRelation
            }
        ],

        //Getters
        getGraphElementId: function() {
            return this.get("GraphElementId");
        },
        getGraphElementTitle: function() {
            return this.get("GraphElementTitle");
        },
        getGraphElementName: function () {
            return this.get("GraphElementName");
        },
        getGraphElementLevelNumber: function() {
            return this.get("GraphElementLevelNumber");
        },
        getGraphElementIsRoot: function() {
            return this.get("GraphElementIsRoot");
        },
        getGraphLabel: function() {
            return this.get("GraphLabel");
        },
        getGraphElementType: function () {
            return this.get("GraphElementType");
        },
        getGraphId: function() {
            return this.get("GraphId");
        },
        getGraphElementDirection: function() {
            return this.get("GraphElementDirection");
        },
        getGraphElementOffsetX: function () {
            return this.get("GraphElementOffsetX");
        },
        getGraphElementOffsetY: function () {
            return this.get("GraphElementOffsetY");
        },
        getGraphElementColor: function () {
            return this.get("GraphElementColor");
        },
        getGraphElementComment: function () {
            return this.get("GraphElementComment");
        },
        getGraphElementSectionRelation: function () {
            return this.get("GraphElementSectionRelation");
        },
        getSections: function () {
            return this.get("Sections");
        },
        getPrivacyTypeId: function () {
            return this.get("PrivacyTypeId");
        },
        getWorkspaceId: function () {
            return this.get("WorkspaceId");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },

        //Setters
        setGraphElementId: function(val) {
            this.set("GraphElementId", val);
        },
        setGraphId: function(val) {
            this.set("GraphId", val);
        },
        setGraphElementTitle: function(val) {
            this.set("GraphElementTitle", val);
        },
        setGraphElementName: function (val) {
            this.set("GraphElementName", val);
        },
        setGraphElementLevelNumber: function(val) {
            this.set("GraphElementLevelNumber", val);
        },
        setGraphElementIsRoot: function(val) {
            this.set("GraphElementIsRoot", val);
        },
        setGraphLabel: function(val) {
            this.set("GraphLabel", val);
        },
        setGraphElementType: function (val) {
            this.set("GraphElementType", val);
        },
        setGraphElementDirection: function(val) {
            this.set("GraphElementDirection", val);
        },
        setGraphElementOffsetX: function (val) {
            this.set("GraphElementOffsetX", val);
        },
        setGraphElementOffsetY: function (val) {
            this.set("GraphElementOffsetY", val);
        },
        setGraphElementColor: function (val) {
            this.set("GraphElementColor", val);
        },
        setGraphElementComment: function (val) {
            this.set("GraphElementComment", val);
        },
        setGraphElementSectionRelation: function (val) {
            this.set("GraphElementSectionRelation", val);
        },
        setSections: function (val) {
            this.set("Sections", val);
        },
        setPrivacyTypeId: function (val) {
            this.set("PrivacyTypeId", val);
        },
        setWorkspaceId: function (val) {
            this.set("WorkspaceId", val);
        },
        setPersonId: function (val) {
            this.set("PersonId", val);
        }
    });
})();