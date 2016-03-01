var app = app || {};

(function($) {
    'use strict';
    app.BlockView = Backbone.View.extend({
        tagName: "div",
        events: {
            "mouseup": "rangeSelected",
            "mousedown": "hide_popup",
            "click .btn-remove-highlight": "removeHighlight",
            "click .Meshkat-commented,.Meshkat-commentedhighlighted": "removeCommentHighlight"
        },
        pageViews: [],
        // Model: BookPragraphsBlock
        initialize: function() {
            this.render();          
        },
        render: function() {
            var that = this;
            $(this.el).addClass("paragraphBlock");
            $(this.el).html("");
            this.pageViews = [];
            var pages = this.model.getPages().models;
            for (var i = 0; i < pages.length; i++) {
                var pageView = new app.PageView({ model: pages[i] });
                pageView.on("paragraphClicked", function(view) {
                    that.trigger("paragraphClicked", view);
                });
                this.pageViews.push(pageView);
                $(this.el).append(pageView.render().el);                
            }
            return this;
        },
        getTopParagraph: function(top, bottom) {
            var showingParagraphs = [];
            for (var i = 0; i < this.pageViews.length; i++) {
                if (this.pageViews[i].isShowing(this.$el.position().top, top, bottom)) {
                    for (var j = 0; j < this.pageViews[i].paragraphViews.length; j++) {
                        if (this.pageViews[i].paragraphViews[j].isShowing(this.$el.position().top, top, bottom))
                            return this.pageViews[i].paragraphViews[j];
                    }
                }
            }
            return null;
        },
        getCurrentPageView: function(top, bottom) {
            for (var i = 0; i < this.pageViews.length; i++) {
                if (this.pageViews[i].isShowing(this.$el.position().top, top, bottom))
                    return this.pageViews[i];
            }
            return null;
        },
        getParagraphView: function(paragraphId) {
            for (var i = 0; i < this.pageViews.length; i++) {
                var paragraph = this.pageViews[i].getParagraph(paragraphId);
                if (paragraph !== null)
                    return paragraph;
            }
            return null;
        },
        rangeSelected: function() {
            var that = this;
            var range = getCurrentRange();
            if (app.bookletView.highlightMode) {
                var sections = doHighlight('Meshkat-highlighted', this.$el, range);
                if (sections === undefined)
                    return;
                this.saveHighlightSections(sections);
            } else if (app.bookletView.commentMode) {
                doHighlight('Meshkat-commented', this.$el, range);
            } else if (!window.getSelection().isCollapsed) {
                if (app.addPopupView === undefined) {
                    var workspaceIsEditable = false;
                    if (app.currentPerson != undefined && app.currentWorkspace != undefined) {
                        if (app.currentPerson.getPersonId() === app.currentWorkspace.getWorkspaceOwner()) {
                            workspaceIsEditable = true;
                        } else {
                            var workspacePersons = app.currentWorkspace.getPersons().models;
                            for (var i = 0; i < workspacePersons.length; i++) {
                                if (app.currentPerson.getPersonId() === workspacePersons[i].getPersonId()) {
                                    workspaceIsEditable = true;
                                    break;
                                }
                            }
                        }

                        if (workspaceIsEditable) {
                            app.addPopupView = new app.AddPopupView();
                            app.addPopupView.showButtons();
                        }
                    }
                } else {
                    app.addPopupView.showButtons();
                }                
            }
        },
        getCommentedSections: function() {
            return getClassSections(this.$el.find(".paragraph"), "Meshkat-commented");
        },
        removeHighlight: function(e) {
            var paragraph = $(app.selectedHighlightElement).closest(".paragraph");
            $(app.selectedHighlightElement).removeClass("Meshkat-highlighted");
            if ($(app.selectedHighlightElement).hasClass("Meshkat-commentedhighlighted")) {
                $(app.selectedHighlightElement).removeClass("Meshkat-commentedhighlighted");
                $(app.selectedHighlightElement).addClass("Meshkat-commented");
            }
            var sections = getClassSections(paragraph, "Meshkat-highlighted");
            var highlights = [];
            for (var i = 0; i < sections.length; i++) {
                highlights.push({ HighlightId: -1, HighlightSection: { ParagraphId: sections[i].getParagraphId(), StartOffset: sections[i].getStartOffset(), EndOffset: sections[i].getEndOffset() }, Color: "yellow", PersonId: -1 });
            }
            $.ajax({
                type: "POST",
                url: "/BookHighlight/RemoveParagraphHighlights",
                dataType: "json",
                data: { paragraphId: Number(paragraph.attr("data-id")), workspaceId: app.userWorkspaceId, hl: JSON.stringify(highlights) },
                success:
                    function(data) {
                        CheckServiceResultIsSuccess(data);
                        hideLoading();
                    },
                error: function(xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                },
                contentType: "application/x-www-form-urlencoded",
                cache: false
            });
            //this.saveHighlightSections(sections);
            app.selectedHighlightElement = null;
            $(".btn-remove-highlight").remove();

        },
        removeCommentHighlight: function(e) {
            if (app.bookletView.commentMode) {
                $(e.target).removeClass("Meshkat-commented");
                if ($(e.target).hasClass("Meshkat-commentedhighlighted")) {
                    $(e.target).removeClass("Meshkat-commentedhighlighted");
                    $(e.target).addClass("Meshkat-highlighted");
                }
            }
        },
        saveHighlightSections: function(sections) {
            var highlights = [];            
            for (var i = 0; i < sections.length; i++) {
                highlights.push({ HighlightId: -1, HighlightSection: { ParagraphId: sections[i].getParagraphId(), StartOffset: sections[i].getStartOffset(), EndOffset: sections[i].getEndOffset() }, Color: "yellow", WorkspaceId : app.userWorkspaceId});
            }
            
            var block = app.currentVolumeView.currentBlockView.model.toJSON();
            block.Highlights.push(highlights[0]);
            app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
            app.currentVolumeView.currentBlockView.render();
            app.currentVolumeView.updatePage(true);
            
            showLoading();
            $.ajax({
                type: "POST",
                url: "/BookHighlight/AddHighlight",
                dataType: "json",
                data: JSON.stringify({ hl: highlights }),
                success:
                    function (data) {
                        CheckServiceResultIsSuccess(data);
                        hideLoading();
                    },
                error: function(xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                },
                //contentType: "application/x-www-form-urlencoded",
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        },
        removeComment: function(commentId) {
            var comments = [];
            for (var i = 0; i < this.model.getComments().count; i++) {
                if (this.model.getComments()[i].getId() != commentId)
                    comments.push(this.model.getComments()[i]);
            }
            this.model.setComments(comments);
        },
        hide_popup: function (e) {
            if (app.addPopupView != undefined) {
                app.addPopupView.hide();
            }
            if (e != undefined && $(e.target).hasClass("btn-remove-highlight"))
                return;
            if ($(".btn-remove-highlight").length > 0)
                $(".btn-remove-highlight").remove();
        },
        isShowing: function (baseHeight, top, bottom) {
            var t = baseHeight + this.$el.position().top;
            var b = t + this.$el.height();
            var lb = Math.max(t, top);
            var ub = Math.min(b, bottom);
            if (lb >= ub || top === bottom)
                return false;
            var ratio = (ub - lb) / (bottom - top);
            if (ratio >= .45)
                return true;
            return false;
        },
    });
})(jQuery);