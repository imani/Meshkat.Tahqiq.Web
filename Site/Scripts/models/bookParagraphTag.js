var app = app || {};

(function () {
    'use strict';

    app.BookParagraphTag = Backbone.AssociatedModel.extend({
        defaults: {
            Id: null,
            TagName: null,
            PersonId: null,
            LastModifiedDateTime: null,
            Sections: [],
            WorkspaceId: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Sections',
                relatedModel: app.Section
            }
        ],

        //Getters
        getId: function () {
            return this.get("Id");
        },
        getTagName: function () {
            return this.get("TagName");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },
        getLastModifiedDateTime: function () {
            return this.get("LastModifiedDateTime");
        },
        getSections: function () {
            return this.get("Sections");
        },
        getWorkspaceId: function () {
            return this.get("WorkspaceId");
        },
        
        //Setters
        setId: function (val) {
            this.set("Id", val);
        },
        setTagName: function (val) {
            this.set("TagName", val);
        },
        setPersonId: function (val) {
            this.set("PersonId", val);
        },
        setLastModifiedDateTime: function (val) {
            this.set("LastModifiedDateTime", val);
        },
        setSections: function (val) {
            this.set("Sections", val);
        },
        setWorkspaceId: function (val) {
            this.set("WorkspaceId",val);
        }
    });
})();
