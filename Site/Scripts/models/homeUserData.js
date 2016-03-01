var app = app || {};

(function () {
    'use strict';

    app.HomeUserData = Backbone.AssociatedModel.extend({
        defaults: {
            Person: null,
            publicWorkspaces: [],
            WorkspaceHasAccess: [],
            WorkspaceHasOwners:[]
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'publicWorkspaces',
                relatedModel: app.Workspace
            },
            {
                type: Backbone.Many,
                key: 'WorkspaceHasAccess',
                relatedModel: app.Workspace
            },
            {
                type: Backbone.Many,
                key: 'WorkspaceHasOwners',
                relatedModel: app.Workspace
            }
        ],

        //Getters
        getPerson: function () {
            return this.get("Person");
        },
        getpublicWorkspaces: function () {
            return this.get("publicWorkspaces");
        },
        getWorkspaceHasAccess: function () {
            return this.get("WorkspaceHasAccess");
        },
        getWorkspaceHasOwners: function () {
            return this.get("WorkspaceHasOwners");
        },

        //Setters
        setPerson: function (val) {
            this.set("Person", val);
        },
        setpublicWorkspaces: function (val) {
            this.set("publicWorkspaces", val);
        },
        setWorkspaceHasAccess: function (val) {
            this.set("WorkspaceHasAccess", val);
        },
        setWorkspaceHasOwners: function (val) {
            this.set("WorkspaceHasOwners", val);
        }
    });
})();
