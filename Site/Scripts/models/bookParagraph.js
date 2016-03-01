var app = app || {};

(function () {
    'use strict';

    app.BookParagraph = Backbone.AssociatedModel.extend({
        defaults: {
            VolumeInfo:null,
            ParagraphId: 0,
            ParagraphText: "",
            TableOfContentNode: null,
            TableOfContentId: 0,
            ParagraphPageNumber: 1,
            Styles: [],
            HighlightSections: [],
            CommentSections: [],
            CommentIndices: [],
            GraphElementSections: [],
            GraphElementIndices: [],
            Footnotes: [],
            BookParagraphTags: [],
            BookParagraphTagIndices: [],
            BookParagraphTagSections: []
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'VolumeInfo',
                relatedModel: app.BookVolume
            },
            {
                type: Backbone.One,
                key: "TableOfContentNode",
                relatedModel: app.BookTableOfContent
            },
            {
                type: Backbone.Many,
                key: "Styles",
                relatedModel: app.BookSectionStyle
            },
            ,
            {
                type: Backbone.Many,
                key: "HighlightSections",
                relatedModel: app.Section
            },
            {
                type: Backbone.Many,
                key: "CommentSections",
                relatedModel: app.Section
            },
            {
                type: Backbone.Many,
                key: "GraphElementSections",
                relatedModel: app.Section
            },
            {
                type: Backbone.Many,
                key: "Footnotes",
                relatedModel: app.Footnote
            },
            {
                type: Backbone.Many,
                key: "BookParagraphTagSections",
                relatedModel: app.Section
            }
        ],
        //Getters
        getVolumeInfo: function () {
            return this.get("VolumeInfo");
        },
        getParagraphId: function () {
            return this.get("ParagraphId");
        },
        getParagraphText: function () {
            return this.get("ParagraphText");
        },
        getTableOfContentNode: function () {
            return this.get("TableOfContentNode");
        },
        getTableOfContentId: function () {
            return this.get("TableOfContentId");
        },
        getParagraphPageNumber: function () {
            return this.get("ParagraphPageNumber");
        },
        getStyles: function () {
            return this.get("Styles");
        },
        getHighlightSections: function () {
            return this.get("HighlightSections");
        },
        getCommentSections: function () {
            return this.get("CommentSections");
        },
        getCommentIndices: function () {
            return this.get("CommentIndices");
        },
        getGraphElementSections: function () {
            return this.get("GraphElementSections");
        },
        getGraphElementIndices: function () {
            return this.get("GraphElementIndices");
        },
        getFootnotes: function () {
            return this.get("Footnotes");
        },
        getBookParagraphTags: function () {
            return this.get("BookParagraphTags");
        },
        getBookParagraphTagIndices: function () {
            return this.get("BookParagraphTagIndices");
        },
        getBookParagraphTagSections: function() {
            return this.get("BookParagraphTagSections");
        },
        //Setters
        setVolumeInfo: function (val) {
            this.set("VolumeInfo",val);
        },
        setParagraphId: function (val) {
            this.set("ParagraphId",val);
        },
        setParagraphText: function (val) {
            this.set("ParagraphText",val);
        },
        setTableOfContentNode: function (val) {
            this.set("TableOfContentNode",val);
        },
        setTableOfContentId: function (val) {
            this.set("TableOfContentId", val);
        },
        setParagraphPageNumber: function (val) {
            this.set("ParagraphPageNumber",val);
        },
        setStyles: function (val) {
            this.set("Styles",val);
        },
        setHighlightSections: function (val) {
            this.set("HighlightSections",val);
        },
        setCommentSections: function (val) {
            this.set("CommentSections", val);
        },
        setCommentIndices: function (val) {
            this.set("CommentIndices", val);
        },
        setGraphElementSections: function (val) {
            this.set("GraphElementSections", val);
        },
        setGraphElementIndices: function (val) {
            this.set("GraphElementIndices", val);
        },
        setFootnotes: function (val) {
            this.set("Footnotes", val);
        },
        setBookParagraphTags: function (val) {
            this.set("BookParagraphTags", val);
        },
        setBookParagraphTagIndices: function (val) {
            this.set("BookParagraphTagIdices", val);
        },
        setBookParagraphTagSections: function(val) {
            this.set("BookParagraphTagSections", val);
        }
    });
})();