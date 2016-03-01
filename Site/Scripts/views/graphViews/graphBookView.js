var app = app || {};

(function ($) {
    'use strict';
    app.GraphBookView = Backbone.View.extend({
        el: '#textPanel',
        events: {
            "mouseup": "rangeSelected",
            "mousedown": "hidePopup",
            "scroll": "hidePopup"
        },
        commentMode: false,
        highlightMode: false,
        initialize: function () {
            this.render();
        },
        render: function () {
            return this;
        },
        loadVolume: function (TOC) {
            this.TOC = TOC;
            showLoading();
            var that = this;
            $.ajax({
                type: "GET",
                url: "/Book/TocParagraphs" + "?tocId=" + TOC.getKey(),
                dataType: "html",
                success:
                    function (data) {
                        hideLoading();
                        that.$el.html(data);
                        if ($(".paragraph[data-id=" + app.paragraphId + "]").length > 0) {
                            $(".paragraph[data-id=" + app.paragraphId + "]").addClass("paragraph-bold");
                            that.$el.scrollTop($(".paragraph[data-id=" + app.paragraphId + "]").offset().top);                          
                        } else {
                            that.$el.scrollTop(0);
                        }

                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });

        },
        rangeSelected: function (e) {
            if (app.graphView.diagram.selectionList.length === 1 && !window.getSelection().isCollapsed) {
                app.addRelationPopupView.showButtons(e);
            } 
        },
        showCommentHighlights: function (section, elementName) {
            var el = $(".paragraph[data-id=" + section.getParagraphId() +"]");
            
            var carets = [];
            carets = this.addCaret(carets, section.getStartOffset(), 'Meshkat-highlighted', true);
            carets = this.addCaret(carets, section.getEndOffset() + 1, 'Meshkat-highlighted', false);
            var styles = [];
            for (var i = 0; i < carets.length - 1; i++) {
                for (var j = 0; j < carets[i].endStyles.length; j++) {
                    styles.push('Meshkat-commented');
                    styles = _.without(styles, carets[i].endStyles[j]);
                }

                for (var j = 0; j < carets[i].startStyles.length; j++) {
                    if (!_.contains(styles, carets[i].startStyles[j])) {
                            styles.push(carets[i].startStyles[j]);
                    }
                }

                var prefix = $(el).text().substring(0, carets[i].position);
                var part = $(el).text().substring(carets[i].position, carets[i + 1].position);
                var postfix = $(el).text().substring(carets[i + 1].position);
                var span = $('<span class="Meshkat-highlighted">' + part + "</span>");
                
                $(el).attr("data-id", section.getParagraphId());
                $(el).html("");
                $(el).append('<span class=Meshkat-text>' + prefix + '</span>');
                $(el).append(span);
                $(el).append('<span class=Meshkat-text>' + postfix + '</span>');
            }
        },
        clearCommentHighlights: function () {
            app.commentsView.selectedComment = null;
            var paragraphs = $(".Meshkat-commented,.Meshkat-commentedhighlighted").closest(".paragraph");
            for (var i = 0; i < paragraphs.length; i++) {
                var view = app.currentVolumeView.currentBlockView.getParagraphView($(paragraphs[i]).data().id);
                if (view.render != null) {
                    view.render();
                }
            }
        },
        keyPressed: function (code) {
            if (app.currentVolumeView !== undefined)
                app.currentVolumeView.keyPressed(code);
        },
        tabExists: function () {
            return $("#bookletPanel").meshkatTab("getTabCount") !== 0;
        },
        hidePopup: function () {
            app.addRelationPopupView.hide();
        },
        addCaret: function (carets, offset, cls, isStart) {
            var index = -1;
            for (var i = 0; i < carets.length; i++) {
                if (carets[i].position === offset) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                var caret = { position: offset };
                if (isStart) {
                    caret.startStyles = [cls];
                    caret.endStyles = [];
                }
                else {
                    caret.startStyles = [];
                    caret.endStyles = [cls];
                }
                carets.push(caret);
            }
            else {
                if (isStart) {
                    if (!_.contains(carets[index].startStyles, cls))
                        carets[index].startStyles.push(cls);
                }
                else {
                    if (!_.contains(carets[index].endStyles, cls))
                        carets[index].endStyles.push(cls);
                }
            }
            return carets;
        }
    });
})(jQuery);
