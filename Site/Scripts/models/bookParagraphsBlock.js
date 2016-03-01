var app = app || {};

(function () {
    'use strict';

    app.BookParagraphsBlock = Backbone.AssociatedModel.extend({
        defaults: {
            Id: null,
            Paragraphs: [],
            Comments: [],
            GraphElements: [],
            Highlights: [],
            Styles: [],
            Pages: [],
            BookParagraphTags: []
        },
        constructor: function (attributes, options) {
            this.fillExtraData(attributes);
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Paragraphs',
                relatedModel: app.BookParagraph
            },
            {
                type: Backbone.Many,
                key: 'Comments',
                relatedModel: app.BookComment
            },
            {
                type: Backbone.Many,
                key: 'GraphElements',
                relatedModel: app.GraphElement
            },
            {
                type: Backbone.Many,
                key: 'Highlights',
                relatedModel: app.BookHighlight
            },
            {
                type: Backbone.Many,
                key: 'Styles',
                relatedModel: app.BookSectionStyle
            },
            {
                type: Backbone.Many,
                key: 'Pages',
                relatedModel: app.BookPage
            },
            {
                type: Backbone.Many,
                key: 'BookParagraphTags',
                relatedModel: app.BookParagraphTag
            }
        ],

        //Getters
        getParagraphs: function () {
            return this.get("Paragraphs");
        },
        getComments: function () {
            return this.get("Comments");
        },
        getGraphElements: function () {
            return this.get("GraphElements");
        },
        getHighlights: function () {
            return this.get("Highlights");
        },
        getStyles: function () {
            return this.get("Styles");
        },
        getPages: function () {
            return this.get("Pages");
        },  
        getBookParagraphTags: function () {
            return this.get("BookParagraphTags");
        },

        //Setters
        setParagraphs: function (val) {
            this.set("Paragraphs", val);
        },
        setComments: function (val) {
            this.set("Comments", val);
        },
        setGraphElements: function (val) {
            this.set("GraphElements", val);
        },
        setHighlights: function (val) {
            this.set("Highlights", val);
        },
        setStyles: function (val) {
            this.set("Styles", val);
        },
        setPages: function (val) {
            this.set("Pages", val);
        },
        setBookParagraphTags: function (val) {
            this.set("BookParagraphTags", val);
        }



        ,
        fillExtraData: function (block) {
            var prevPageNumber = -1;
            var pageParagraphs = [];
            block.Pages = [];
            for (var i = 0; i < block.Paragraphs.length; i++) {
                // Add Styles,Highlight sections and Comment sections to the paragraph. it is needed to make each paragraph self renderable.
                block = this.fillSections(i, block);
                if (block.Paragraphs[i].ParagraphPageNumber !== prevPageNumber && prevPageNumber !== -1) {
                    // new page visited
                    // build a page with accumulated paragraphs
                    block.Pages.push({ PageNumber: prevPageNumber, Paragraphs: pageParagraphs });
                    // now start to accumulate new page paragraphs
                    pageParagraphs = [block.Paragraphs[i]];
                }
                else {
                    pageParagraphs.push(block.Paragraphs[i]);
                }
                prevPageNumber = block.Paragraphs[i].ParagraphPageNumber;
            }
            block.Pages.push({ PageNumber: prevPageNumber, Paragraphs: pageParagraphs });
          
            return block;
        },
        fillSections: function (index, block) {            
            block.Paragraphs[index].Styles = [];
            block.Paragraphs[index].HighlightSections = [];
            block.Paragraphs[index].CommentSections = [];
            block.Paragraphs[index].CommentIndices = [];
            block.Paragraphs[index].GraphElementSections = [];
            block.Paragraphs[index].GraphElementIndices = [];
            block.Paragraphs[index].BookParagraphTags = [];
            block.Paragraphs[index].BookParagraphTagIds = [];
            block.Paragraphs[index].BookParagraphTagSections = [];
            block.Paragraphs[index].BookParagraphTagIndices = [];
            if (block.Styles !== null) {
                for (var i = 0; i < block.Styles.length; i++) {
                    if (block.Styles[i].Section.ParagraphId === block.Paragraphs[index].ParagraphId)
                        block.Paragraphs[index].Styles.push(block.Styles[i]);
                }
            }
            if (block.Paragraphs[index].Styles.length === 0) {
                block.Paragraphs[index].Styles.push({ Style: "default", Section: { ParagraphId: block.Paragraphs[index].ParagraphId, StartOffset: 0, EndOffset: block.Paragraphs[index].ParagraphText.length - 1 } });
            }
            if (block.BookParagraphTags !== null) {
              
                for (var i = 0; i < block.BookParagraphTags.length; i++) {
                    if (block.BookParagraphTags[i].ParagraphId === block.Paragraphs[index].ParagraphId)
                        block.Paragraphs[index].BookParagraphTags.push(block.BookParagraphTags[i]);
                }
            }            
            if (block.Highlights !== null) {
                for (var i = 0; i < block.Highlights.length; i++) {
                    if (block.Highlights[i].HighlightSection.ParagraphId === block.Paragraphs[index].ParagraphId) {
                        block.Paragraphs[index].HighlightSections.push(block.Highlights[i].HighlightSection);
                    }
                }
            }

            if (block.Comments !== null) {
                for (var i = 0; i < block.Comments.length; i++) {
                    for (var j = 0; j < block.Comments[i].Sections.length; j++) {
                        if (block.Comments[i].Sections[j].ParagraphId === block.Paragraphs[index].ParagraphId) {
                            block.Paragraphs[index].CommentSections.push(block.Comments[i].Sections[j]);
                            if (!_.contains(block.Paragraphs[index].CommentIndices, i))
                                block.Paragraphs[index].CommentIndices.push(i);
                        }
                    }

                }
            }

            if (block.GraphElements !== null) {
                for (var i = 0; i < block.GraphElements.length; i++) {
                    if (block.GraphElements[i].Sections != null)
                        for (var j = 0; j < block.GraphElements[i].Sections.length; j++) {
                            if (block.GraphElements[i].Sections[j].ParagraphId === block.Paragraphs[index].ParagraphId) {
                                block.Paragraphs[index].GraphElementSections.push(block.GraphElements[i].Sections[j]);
                                if (!_.contains(block.Paragraphs[index].GraphElementIndices, i))
                                    block.Paragraphs[index].GraphElementIndices.push(i);
                            }
                        }
                }
            }

            //insert index of related tags into each paragraph of block
            if (block.BookParagraphTags !== null) {
                for (var i = 0; i < block.BookParagraphTags.length; i++) {
                    for (var j = 0; j < block.BookParagraphTags[i].Sections.length; j++) {
                        if (block.BookParagraphTags[i].Sections[j].ParagraphId == block.Paragraphs[index].ParagraphId) {
                            block.Paragraphs[index].BookParagraphTagSections.push(block.BookParagraphTags[i].Sections[j]);
                            if (!_.contains(block.Paragraphs[index].BookParagraphTagIndices, i)) {
                                block.Paragraphs[index].BookParagraphTagIndices.push(i);
                            }
                        }
                    }
                }
            }
            
            return block;
        }
    });
})();
