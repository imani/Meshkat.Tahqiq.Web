var app = app || {};

(function ($) {
    'use strict';
    app.BookletView = Backbone.View.extend({
        el: '#bookletPanel',
        commentMode: false,
        highlightMode: false,
        initialize: function () {
            this.render();
        },
        render: function () {

            $('#bookletPanel').meshkatTab({
                select: function (e, data) {
                    var tag = $(data).data().tag;
                    var tree = $('#tableOfContentTree').fancytree("getTree");
                    /*if ($(data).data().toc_node != undefined) {
                        tree.getNodeByKey($(data).data().toc_node.toString()).setActive();
                    }*/
                }
            });

            return this;
        },
        loadVolume: function (TOC) {
            this.TOC = TOC;
            showLoading();
            
            $.ajax({
                type: "GET",
                url: "/BookVolume/GetVolume",
                data: { volumeId: TOC.getVolumeId(), crawler_tocId: TOC.getKey() },
                dataType: "json",
                success:
                    function (data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        if (data.Response != null && data.Response.Message == "CRAWLER") {
                            document.write(data);
                            return;
                        }
                        var volume = new app.BookVolume(data);
                        var title = volume.getBook().getBookName() + " (جلد" + volume.getVolumeNumber() + ")";
                        if (volume.getVolumeNumber() === 0)
                            title = volume.getBook().getBookName();

                        var tab = $("#bookletPanel").meshkatTab("getTabById", "volume" + volume.getVolumeId());

                        var targetParagraphId = (app.loadParagraphId !== undefined ? app.loadParagraphId : app.bookletView.TOC.getBookParagraphId());
                        if (app.userMode == "search") {
                            app.userMode = "volume";
                            targetParagraphId = app.userParagraphId;                            
                        }
                        app.targetParagraphId = targetParagraphId;
                        if (tab === null) {
                            app.currentVolumeView = new app.VolumeView({ model: volume, paragraphId: app.targetParagraphId });
                            $("#bookletPanel").meshkatTab("addTab", title, app.currentVolumeView, "volume" + volume.getVolumeId(), app.bookletView.TOC.getKey());
                        } else {
                            $("#bookletPanel").meshkatTab("selectTab", tab);
                            app.currentVolumeView = $(tab).data().view;
                            app.currentVolumeView.gotoParagraph(app.targetParagraphId);
                        }
                        //fill CommentType Of ComboBox
                        app.commentsView.fillTypes(app.currentVolumeView.model.getBook().getBookId(), $("#cboNewCommentType"));
                        app.commentsView.fillTypes(app.currentVolumeView.model.getBook().getBookId(), $("#cboEditCommentType"));
                        app.currentVolumeView.on("pageChanged", function (comments, graphElements, tags) {
                            app.commentsView.renderCurrentComments(comments, graphElements, tags);
                        });
                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });


        },
        showCommentHighlights: function () {
            var selectedComment = app.commentsView.selectedComment;
            if (selectedComment === null || app.currentVolumeView === null || app.currentVolumeView.currentBlockView === null)
                return;
            var sections = selectedComment.getSections().models;
            var renderedList = [];
            for (var i = 0; i < sections.length; i++) {
                var id = sections[i].getParagraphId();
                if (!_.contains(renderedList, id)) {
                    renderedList.push(id);
                    var view = app.currentVolumeView.currentBlockView.getParagraphView(id);
                    if (view.render != null) {
                        view.render();
                    }
                }
            }
        },
        clearCommentHighlights: function () {
            app.commentsView.selectedComment = null;
            var paragraphs = $(".Meshkat-commented,.Meshkat-commentedhighlighted").closest(".paragraph");
            for (var i = 0; i < paragraphs.length; i++) {
                for (var j = 0; j < app.currentVolumeView.blockViews.length; j++) {
                    var view = app.currentVolumeView.blockViews[j].getParagraphView($(paragraphs[i]).data().id);
                    if (view != null && view.render != null) {
                        view.render();
                        break;
                    }
                }
               
            }
        },
        showGraphHighlights: function () {
            var selectedGraph= app.commentsView.selectedGraph;
            if (selectedGraph=== null || app.currentVolumeView === null || app.currentVolumeView.currentBlockView === null)
                return;
            var sections = selectedGraph.getSections().models;
            var renderedList = [];
            for (var i = 0; i < sections.length; i++) {
                var id = sections[i].getParagraphId();
                if (!_.contains(renderedList, id)) {
                    renderedList.push(id);
                    var view = app.currentVolumeView.currentBlockView.getParagraphView(id);
                    if (view.render != null) {
                        view.render();
                    }
                }
            }
        },
        clearGraphHighlights: function () {
            app.commentsView.selectedGraph = null;
            var paragraphs = $(".Meshkat-commented,.Meshkat-commentedGraph,.Meshkat-commentedhighlighted").closest(".paragraph");
            for (var i = 0; i < paragraphs.length; i++) {
                for (var j = 0; j < app.currentVolumeView.blockViews.length; j++) {
                    var view = app.currentVolumeView.blockViews[j].getParagraphView($(paragraphs[i]).data().id);
                    if (view != null && view.render != null) {
                        view.render();
                        break;
                    }
                }

            }
        },
        keyPressed: function (code) {
            if (app.currentVolumeView !== undefined)
                app.currentVolumeView.keyPressed(code);
        },
        tabExists: function () {
            return $("#bookletPanel").meshkatTab("getTabCount") !== 0;
        }
    });
})(jQuery);
