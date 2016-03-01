var app = app || {};

(function () {
    'use strict';

    app.Workspace = Backbone.AssociatedModel.extend({
        defaults: {
            WorkspaceId: null,
            WorkspaceTitle: null,
            WorkspaceDefault: false,
            WorkspaceOwner: null,
            PrivacyTypeId:null,
            Persons: [],
            BookVolumes: [],
            Graphs: [],
            CommentsNumber: 0,
            TagsNumber: 0,
            WorkspaceDescription:null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Persons',
                relatedModel: app.Person
            },
            {
                type: Backbone.Many,
                key: 'BookVolumes',
                relatedModel: app.BookVolume
            },
            {
                type: Backbone.Many,
                key: 'Graphs',
                relatedModel: app.Graph
            }
        ],

        //Getters
        getWorkspaceId: function() {
            return this.get('WorkspaceId');
        },
        getWorkspaceTitle: function() {
            return this.get('WorkspaceTitle');
        },
        getWorkspaceDefault: function() {
            return this.get('WorkspaceDefault');
        },
        getWorkspaceOwner: function() {
            return this.get('WorkspaceOwner');
        },
        getPrivacyTypeId: function () {
            return this.get('PrivacyTypeId');
        },
        getPersons: function () {
            return this.get('Persons');
        },
        getBookVolumes: function () {
            return this.get('BookVolumes');
        },
        getGraphs: function () {
            return this.get('Graphs');
        },
        getCommentsNumber: function () {
            return this.get('CommentsNumber');
        },
        getTagsNumber: function () {
            return this.get('TagsNumber');
        },
        getWorkspaceDescription: function () {
            return this.get('WorkspaceDescription');
        },
        
        //Setters
        setWorkspaceId: function (val) {
            this.set("WorkspaceId", val);
        },
        setWorkspaceTitle: function (val) {
            this.set("WorkspaceTitle", val);
        },
        setWorkspaceDefault: function (val) {
            this.set("WorkspaceDefault", val);
        },
        setWorkspaceOwner: function (val) {
            this.set("WorkspaceOwner", val);
        },
        setPrivacyTypeId: function (val) {
            this.set("PrivacyTypeId", val);
        },
        setPersons: function (val) {
            this.set('Persons', val);
        },
        setBookVolumes: function (val) {
            this.set('BookVolumes', val);
        },
        setGraphs: function (val) {
            this.set('Graphs', val);
        },
        setCommentsNumber: function (val) {
            this.set('CommentsNumber',val);
        },
        setTagsNumber: function (val) {
            this.set('TagsNumber',val);
        },
        setWorkspaceDescription: function (val) {
            this.set('WorkspaceDescription',val);
        },
    });
})();
