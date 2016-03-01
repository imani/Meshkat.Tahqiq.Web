var app = app || {};

(function () {
    'use strict';

    app.BookComment = Backbone.AssociatedModel.extend({
        defaults: {
            Id: null,
            ParentId:null,
            Text: null,
            PersonId: null,
            PersonName:null,
            CreateDate: null,
            ModifyDate:null,
            PrivacyTypeId:null,
            Subjects: [],
            Type: null,
            WorkspaceId: 0,
            Sections: [],
            RelatedParagraphs: [],
            FieldValues: [],
            ChildCount:0,
            isReply: 0
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Subjects',
                relatedModel: app.BookCommentSubject
            },
            {
                type: Backbone.Many,
                key: 'Sections',
                relatedModel: app.Section
            },
            {
                type: Backbone.Many,
                key: 'RelatedParagraphs',
                relatedModel: app.BookParagraph
            },
            {
                type: Backbone.Many,
                key: 'FieldValues',
                relatedModel: app.BookCommentFieldValue
            },
            {
                type: Backbone.One,
                key: 'Type',
                relatedModel: app.BookCommentType
            }
        ],

        //Getters
        getId: function () {
            return this.get("Id");
        },
        getParentId: function () {
            return this.get("ParentId");
        },
        getText: function () {
            return this.get("Text");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },
        getPersonName: function() {
            return this.get("PersonName");
        },
        getCreateDate: function () {
            return this.get("CreateDate");
        },
        getModifyDate: function () {
            return this.get("ModifyDate");
        },
        getPrivacyTypeId: function () {
            return this.get("PrivacyTypeId");
        },
        getSubjects: function () {
            return this.get("Subjects");
        },
        getType: function () {
            return this.get("Type");
        },
        getSections: function () {
            return this.get("Sections");
        },
        getRelatedParagraphs: function () {
            return this.get("RelatedParagraphs");
        },
        getFieldValues: function () {
            return this.get("FieldValues");
        },
        getWorkspaceId: function() {
            return this.get("WorkspaceId");
        },
        getIsReply: function () {
            return this.get("IsReply");
        },
        getChildCount: function () {
            return this.get("ChildCount");
        },

        //Setters
        setId: function (val) {
            this.set("Id",val);
        },
        setText: function (val) {
            this.set("Text", val);
        },
        setParentId: function (val) {
            this.set("ParentId",val);
        },
        setPersonId: function (val) {
            this.set("PersonId",val);
        },
        setPersonName: function(val) {
            this.set("PersonName", val);
        },
        setCreateDate: function (val) {
            this.set("CreateDate",val);
        },
        setModifyDate: function (val) {
            this.set("ModifyDate", val);
        },
        setPrivacyTypeId: function (val) {
            this.set("PrivacyTypeId", val);
        },
        setSubjects: function (val) {
            this.set("Subjects",val);
        },
        setType: function (val) {
            this.set("Type",val);
        },
        setSections: function (val) {
            this.set("Sections",val);
        },
        setRelatedParagraphs: function (val) {
            this.set("RelatedParagraphs",val);
        },
        setFieldValues: function (val) {
            this.set("FieldValues",val);
        },
        setWorkspaceId: function(val) {
            this.set("WorkspaceId", val);
        },
        setIsReply: function (val) {
            this.set("IsReply", val);
        },
        setChildCount: function (val) {
            this.set("ChildCount", val);
        }
    });
})();
