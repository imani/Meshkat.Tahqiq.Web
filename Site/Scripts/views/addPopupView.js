var app = app || {};

(function ($) {
    'use strict';
    app.AddPopupView = Backbone.View.extend({
        el: '#add-popup',
        events: {
            "click #btn-add-comment": "addComment",
            "click #btn-add-highlight": "addHighlight",
            "click #btn-add-tag": "addTag",
            "click #btn-add-graph": "addGraph",
            "keydown #graph-input": "graphInputKeyPressed",
            "click #tag-input": "tagInputClick",
            "keydown #tag-input": "tagInputKeyPressed",
            "click .btn-remove-tag": "removeTag"
        },
        tplTag: null,
        initialize: function () {
            this.tplTag = $("#tplTag");
            $(this.el).tooltip({
                position: { my: "middle top", at: "middle bottom" },
                show: { effect: "slide", duration: 200, direction: "up" },
                tooltipClass: "topBarTooltip"
            });
            /*$(this.el).focusout(function() {
                app.bookletView.clearCommentHighlights();
                if ($("#tag-input").length > 0) {
                    $("#tag-input").remove();
                    $(this).children().show();
                }
                if ($(".tag-item").length > 0) {
                    $(".tag-item").remove();
                }
            });*/
        },
        render: function () {
            return this;
        },
        showButtons: function () {
            var markerTextChar = "\ufeff";
            var markerTextCharEntity = "&#xfeff;";
            var markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

            var selectionEl;

            var sel;
            if (document.selection && document.selection.createRange) {
                // Clone the TextRange and collapse
                this.range = getCurrentRange();
                this.range.collapse(false);

                // Create the marker element containing a single invisible character by creating literal HTML and insert it
                this.range.pasteHTML('<span id="' + markerId + '" style="position: relative;">' + markerTextCharEntity + '</span>');
                markerEl = document.getElementById(markerId);
            } else if (window.getSelection) {
                sel = window.getSelection();

                if (sel.getRangeAt) {
                    this.range = sel.getRangeAt(0).cloneRange();
                } else {
                    // Older WebKit doesn't have getRangeAt
                    this.range.setStart(sel.anchorNode, sel.anchorOffset);
                    this.range.setEnd(sel.focusNode, sel.focusOffset);

                    // Handle the case when the selection was selected backwards (from the end to the start in the
                    // document)
                    if (this.range.collapsed !== sel.isCollapsed) {
                        this.range.setStart(sel.focusNode, sel.focusOffset);
                        this.range.setEnd(sel.anchorNode, sel.anchorOffset);
                    }
                }

                this.range.collapse(false);

                // Create the marker element containing a single invisible character using DOM methods and insert it
                markerEl = document.createElement("span");
                markerEl.id = markerId;
                markerEl.appendChild(document.createTextNode(markerTextChar));
                this.range.insertNode(markerEl);
            }
            if (markerEl) {
                // Lazily create element to be placed next to the selection
                selectionEl = this.el;

                // Find markerEl position http://www.quirksmode.org/js/findpos.html
                var obj = markerEl;
                var left = 0, top = 0;
                do {
                    left += obj.offsetLeft;
                    top += obj.offsetTop;
                } while (obj = obj.offsetParent);

                top += app.currentVolumeView.blockViews[0].$el.position().top;
                // Move the button into place.
                // Substitute your jQuery stuff in here
                selectionEl.style.left = left + "px";
                selectionEl.style.top = top + "px";

                markerEl.parentNode.removeChild(markerEl);
            }
            this.$el.show();
            this.range = getCurrentRange();
        },
        hide: function () {
            if (!this.$el.is(":visible")) {
                return;
            }
            app.bookletView.clearCommentHighlights();
            if ($("#tag-input").length > 0) {
                $("#tag-input").remove();
                $(this.el).children().show();
            }
            if ($(".new-tag").length > 0) {
                $(".new-tag").remove();
                app.currentVolumeView.currentBlockView.render();
                app.currentVolumeView.updatePage(true);
            }
            if ($("#graph-input").length > 0) {
                $("#graph-input").remove();
                $(this.el).children().show();
            }
            this.$el.hide();
        },
        addHighlight: function () {
            this.hide();
            var currentBlock = app.currentVolumeView.currentBlockView;
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                showMessage("برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.", "لطفا وارد شوید", "error");
                return;
            }else if (app.userWorkspaceId == -1) {
                showMessage("شما  تنها در یکی از کتابخانه‌های خود مجاز به استفاده از این قابلیت هستید.", "خطا", "error");
                return;
            }
            var sections = doHighlight('Meshkat-highlighted', currentBlock.$el, this.range);
            if (sections != undefined) {
                currentBlock.saveHighlightSections(sections);
            }
        },
        addComment: function(e) {
            this.hide();
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                showMessage("برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.", "لطفا وارد شوید", "error");
                return;
            } else if (app.userWorkspaceId == -1) {
                showMessage("شما تنها در یکی از کتابخانه‌های خود مجاز به استفاده از این قابلیت هستید.", "خطا", "error");
                return;
            }
            if (app.commentsView.isClosed()) {
                
                app.commentsView.open();
                $('#btnComments').addClass('toolBarButtonSelected');
            }
            app.commentsView.changeCommentMode();
            var currentBlock = app.currentVolumeView.currentBlockView;
            doHighlight('Meshkat-commented', currentBlock.$el, this.range);
            $('#txtNewComment').focus();
            e.stopPropagation();

        },
        addTag: function (e) {
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                this.hide();
                showMessage("برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.", "لطفا وارد شوید", "error");
                return;
            } else if (app.userWorkspaceId == -1) {
                this.hide();
                showMessage("شما تنها در یکی از کتابخانه‌های خود مجاز به استفاده از این قابلیت هستید.", "خطا", "error");
                return;
            }
            var currentBlock = app.currentVolumeView.currentBlockView;
            doHighlight('Meshkat-commented', currentBlock.$el, this.range);
            this.$el.children().hide();
            this.$el.append("<textarea id=\"tag-input\" rows=1></textarea>");
            $("#tag-input").focus();
            $("#tag-input").autocomplete({
                source: app.tagNameAndIds,
                minLength: 0
            }).keyup(function (e) {
                if(e.which === 13) 
                    $(".ui-menu-item").hide();
            });

            e.stopPropagation();
        },
        addGraph: function (e) {
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                this.hide();
                showMessage("برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.", "لطفا وارد شوید", "error");
                return;
            } else if (app.userWorkspaceId == -1) {
                this.hide();
                showMessage("شما تنها در یکی از کتابخانه‌های خود مجاز به استفاده از این قابلیت هستید.", "خطا", "error");
                return;
            }
            var currentBlock = app.currentVolumeView.currentBlockView;
            doHighlight('Meshkat-commented', currentBlock.$el, this.range);
            this.$el.children().hide();
            this.$el.append("<input type='text' id=\"graph-input\" />");
            $("#graph-input").focus();
            e.stopPropagation();
        },
        graphInputKeyPressed: function (e) {
            var that = this;
            if (e.which == 13) {
                e.preventDefault();
                var graphTitle = $("#graph-input").val();
                var sections = app.currentVolumeView.getCommentedSections();
                showLoading();
                var _data= {
                    graphTitle: graphTitle,
                    workspaceId: app.userWorkspaceId,
                    paragraphId: sections[0].attributes.ParagraphId,
                    start: sections[0].attributes.StartOffset,
                    end: sections[0].attributes.EndOffset
                };
                $.ajax({
                    type: "POST",
                    url: "/Graph/AddGraphWithSection",
                    dataType: "json",
                    data: JSON.stringify({data: _data}),
                    success: function(data) {
                        if (!CheckServiceResultIsSuccess(data)) {
                            hideLoading();
                            return;
                        }
                        var graphId = data;
                        window.open('/GraphView/' + graphId + '#toc/' + app.userTocId + '/paragraph/' + sections[0].attributes.ParagraphId, "_blank");
                        hideLoading();
                        $("#graph-input").val("");
                    },
                    error: function(xhr, status, error) {
                        hideLoading();
                        showMessage(error, messageList.ERROR, "error", xhr.status);
                    },
                    //contentType: "application/x-www-form-urlencoded",
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
            }
        },
        tagInputKeyPressed: function (e) {
            var that = this;
            if (e.which == 13) {
                e.preventDefault();
                var tagText = $("#tag-input").val().split('[')[0];
                if (tagText.length > 0) {
                    var tag = new app.BookParagraphTag();
                    tag.setTagName(tagText);
                    var tagSections = app.currentVolumeView.getCommentedSections();
                    tag.setSections(tagSections);
                    tag.setId(0);
                    tag.setPersonId(0);
                    tag.setLastModifiedDateTime(new Date());
                    tag.setWorkspaceId(app.userWorkspaceId);
                    showLoading();
                    $.ajax({
                        type: "POST",
                        url: "/BookTag/AddTag",
                        dataType: "json",
                        data: JSON.stringify({ tag: tag }),
                        success: function (data) {
                            if (!CheckServiceResultIsSuccess(data)) {
                                hideLoading();
                                return;
                            }

                            //////////////////Update Block ////////////////////
                            tag.setId(data.ReturnValue);
                            var block = app.currentVolumeView.currentBlockView.model.toJSON();
                            block.BookParagraphTags.push(tag.toJSON());
                            app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                            ///////////////////////////////////////////////////

                            hideLoading();
                            var tagItemElement = $('<div class=tag-item></div>');
                            tagItemElement.html(_.template(that.tplTag.html(), { tag_text: tagText }));
                            tagItemElement.attr('id', tag.getId());
                            that.$el.append(tagItemElement.addClass("new-tag"));
                            $("#tag-input").val("");
                        },
                        error: function (xhr, status, error) {
                            hideLoading();
                            showMessage(error, messageList.ERROR, "error", xhr.status);
                        },
                        //contentType: "application/x-www-form-urlencoded",
                        contentType: "application/json; charset=utf-8",
                        cache: false
                    });
                    //if is new tag add it to autocomplete list
                    var is_newTag = true;
                    for (var i = 0; i < app.tagNameAndIds.length; i++) {
                        if (app.tagNameAndIds[i].id === tag.getId()) {
                            is_newTag = false;
                        }
                    }
                    if (is_newTag) {
                        app.tagNameAndIds.push({ "label": tag.getTagName(), "Id": tag.getId });
                    }
                    
                }
                
                /*
                var tag_labels = [];
                for (var label in tag_text.split("،")) {
                    tag_labels.append(label); //needs stripping
                }
                */

            }
            else if (e.which == 40) {
                e.stopPropagation();
            }
            else if (e.which == 27) {
                this.hide();
            }
        },
        tagInputClick: function(e) {
            e.stopPropagation();
        },
        removeTag: function (e) {
            e.target.parentElement.remove();
        }
    });
})(jQuery);