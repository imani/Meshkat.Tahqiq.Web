var app = app || {};

(function ($) {
    'use strict';
    app.AddRelationPopupView = Backbone.View.extend({
        el: '#add-popup',
        events: {
            "click #btn-add-relation": "addRelation"
        },
        tplTag: null,
        initialize: function () {
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
        showButtons: function (e) {
            if (app.graphView.diagram.selectionList.length === 0) {
                return;
            }
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
                var left = 0, top = 20;
                do {
                    left += obj.offsetLeft;
                    top += obj.offsetTop;
                } while (obj = obj.offsetParent);

                top -= app.graphBookView.$el.scrollTop();
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
            this.$el.hide();
        },
        addRelation: function (e) {
            e.stopPropagation();
            this.hide();
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                showMessage("برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.", "لطفا وارد شوید", "error");
                return;
            }
            var sections = doHighlight('Meshkat-highlighted', app.graphBookView.$el, this.range);
            if (sections != undefined) {
                //add toc content as sectionTitle
                var relation = new app.GraphSectionRelation();
                relation.setSections(sections);
                relation.setGraphId(app.graph.getGraphId());
                relation.setGraphElement(app.graphView.diagram.selectionList[0].name);

                var node = app.graphView.diagram.selectionList[0];
                if (node.sections === undefined) {
                    node.sections = relation.getSections().models;
                    $("div#" + node.name).append("<i class='fa fa-link' style='position: absolute;bottom: -20px;left: 0px;'></i>");
                } else {
                    node.sections = node.sections.concat(relation.getSections().models);
                }        
                addEvent({ name: "addSectionRelation", val1: JSON.stringify(relation) });
            }
        }
    });
})(jQuery);