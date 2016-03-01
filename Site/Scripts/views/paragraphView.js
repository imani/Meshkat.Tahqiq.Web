var app = app || {};

(function ($) {
    'use strict';
    app.ParagraphView = Backbone.View.extend({
        tagName: "div",        
        // Model: BookParagraph
        initialize: function () {
            this.render();
        },
        events: {
            "click":"paragraphClicked"
        },
        render: function () {            
            $(this.el).addClass("paragraph");
            $(this.el).html("");
            var carets = this.getCarets();
            var styles = [];
            for (var i = 0; i < carets.length - 1; i++) {
                for (var j = 0; j < carets[i].endStyles.length; j++) {
                    if (carets[i].endStyles[j] === 'Meshkat-highlighted' && _.contains(styles, 'Meshkat-commentedhighlighted')) {
                        styles = _.without(styles, 'Meshkat-commentedhighlighted');
                        styles.push('Meshkat-commented');
                    }
                    else if (carets[i].endStyles[j] === 'Meshkat-commented' && _.contains(styles, 'Meshkat-commentedhighlighted')) {
                        styles = _.without(styles, 'Meshkat-commentedhighlighted');
                        styles.push('Meshkat-highlighted');
                    }
                    styles = _.without(styles, carets[i].endStyles[j]);
                }

                for (var j = 0; j < carets[i].startStyles.length; j++) {
                    if (!_.contains(styles, carets[i].startStyles[j])) {
                        if (carets[i].startStyles[j] === 'Meshkat-highlighted' && _.contains(styles, 'Meshkat-commented')) {
                            styles = _.without(styles, 'Meshkat-commented');
                            styles.push('Meshkat-commentedhighlighted');
                        }
                        else if (carets[i].startStyles[j] === 'Meshkat-commented' && _.contains(styles, 'Meshkat-highlighted')) {
                            styles = _.without(styles, 'Meshkat-highlighted');
                            styles.push('Meshkat-commentedhighlighted');
                        }
                        else if ((carets[i].startStyles[j] === 'Meshkat-commented' || carets[i].startStyles[j] === 'Meshkat-highlighted') && _.contains(styles, 'Meshkat-commentedhighlighted')) {

                        }
                        else
                            styles.push(carets[i].startStyles[j]);
                    }
                }
                
                var part = this.model.getParagraphText().substring(carets[i].position, carets[i + 1].position);
                var span = $("<span>" + part + "</span>");
                for (var j = 0; j < styles.length; j++) {
                    $(span).addClass(styles[j]);
                    /*if (styles[j] === "Meshkat-footnoteRef") {
                        $(span).tooltip({
                            position: { my: "middle bottom", at: "left top" },
                            show: { effect: "slide", duration: 200, direction: "down" },
                            tooltipClass: "footnoteTooltip"
                        });
                    }*/
                    if (styles[j] === "Meshkat-page") {
                        $(this.el).addClass("Meshkat-pageHeader");                        
                    }
                } 
                $(this.el).attr("data-id", this.model.getParagraphId());
                $(this.el).append(span);
            }
            
                        
            //var audioDiv = "<div class='audio-paragraph'>";
            //var pId = this.model.getParagraphId();            
            //var tags = this.model.getBookParagraphTags();
            //var res = $.grep(tags,function(e) {
            //    return e.TagType == "TATBIGH";
            //});                   
            //if (res.length > 0) {
            //    if (res[0].ParagraphId === res[0].ParentParagraphId || res[0].ParentParagraphId == 0) {
            //        audioDiv += "<span class='pointer' id='TATBIGH" + pId + "' onClick='audioClicked(\"TATBIGH\")' onmouseover='audioOver(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")' onmouseout='audioOut(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")' >تطبیق</span>";
            //    } else {
            //        audioDiv += "<span display='none' style='background-color: grey;display:none' id='TATBIGH" + pId + "' onClick='audioClicked(\"OFF\")'>تطبیق</span>";
            //    }
            //}
            //res = $.grep(tags, function (e) {
            //    return e.TagType == "TOZIH";
            //});
            //if (res.length > 0) {
            //    if (res[0].ParagraphId === res[0].ParentParagraphId || res[0].ParentParagraphId == 0) {
            //        audioDiv += "<span class='pointer' id='TOZIH" + pId + "' onClick='audioClicked(\"TOZIH\")'  onmouseover='audioOver(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")' onmouseout='audioOut(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")'>توضیح</span>";
            //    } else {
            //        audioDiv += "<span display='none' style='background-color: grey;display:none' id='TOZIH" + pId + "' onClick='audioClicked(\"OFF\")'>توضیح</span>";
            //    }
            //}
            //res = $.grep(tags, function (e) {
            //    return e.TagType == "PORSESHPASOKH";
            //});
            //if (res.length > 0) {
            //    if (res[0].ParagraphId === res[0].ParentParagraphId || res[0].ParentParagraphId == 0) {
            //        audioDiv += "<span class='pointer' id='PORSESHPASOKH" + pId + "' onClick='audioClicked(\"PORSESHPASOKH\")' onmouseover='audioOver(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")' onmouseout='audioOut(" + pId + "," + res[0].ParentParagraphId + "," + res[0].TagTypeId + ")'>پرسش و پاسخ</span>";
            //    } else {
            //        audioDiv += "<span  style='background-color: grey;display:none' id='PORSESHPASOKH" + pId + "' onClick='audioClicked(\"OFF\")'>پرسش و پاسخ</span>";
            //    }
            //} 
            //audioDiv += "</div>";
            //$(this.el).append(audioDiv);
            
            var footnoteElems = this.$el.find(".Meshkat-footnoteRef");
            var footnotes = this.model.getFootnotes().models;
            for (var i = 0; i < footnoteElems.length; i++) {
                if (footnotes[i] != undefined)
                    $(footnoteElems[i]).attr("title", footnotes[i].getText());
            }

            return this;
        },
        getCarets: function () {            
            var styles = this.model.getStyles().models;
            var carets = [];
            for (var i = 0; i < styles.length; i++) {
                carets = this.addCaret(carets, styles[i].getSection().getStartOffset(), 'Meshkat-' + styles[i].getStyle(), true);
                carets = this.addCaret(carets, styles[i].getSection().getEndOffset() + 1, 'Meshkat-' + styles[i].getStyle(), false);
            }
            var footnoteSections = this.model.getFootnotes().models;
            for (var i = 0; i < footnoteSections.length; i++) {
                carets = this.addCaret(carets, footnoteSections[i].getSection().getStartOffset(), 'Meshkat-footnoteRef', true);
                carets = this.addCaret(carets, footnoteSections[i].getSection().getEndOffset() + 1, 'Meshkat-footnoteRef', false);
            }
            var highlightSections = this.model.getHighlightSections().models;
            for (var i = 0; i < highlightSections.length; i++) {
                carets = this.addCaret(carets, highlightSections[i].getStartOffset(), 'Meshkat-highlighted', true);
                carets = this.addCaret(carets, highlightSections[i].getEndOffset() + 1, 'Meshkat-highlighted', false);
            }
            var commentSections = this.model.getCommentSections().models;
            for (var i = 0; i < commentSections.length; i++) {
                if (this.sectionIsSelectd(commentSections[i])) {
                    carets = this.addCaret(carets, commentSections[i].getStartOffset(), 'Meshkat-commented', true);
                    carets = this.addCaret(carets, commentSections[i].getEndOffset() + 1, 'Meshkat-commented', false);
                }
            }
            var graphSections = this.model.getGraphElementSections().models;
            for (var i = 0; i < graphSections.length; i++) {
                if (this.GraphsectionIsSelectd(graphSections[i])) {
                    carets = this.addCaret(carets, graphSections[i].getStartOffset(), 'Meshkat-commentedGraph', true);
                    carets = this.addCaret(carets, graphSections[i].getEndOffset() + 1, 'Meshkat-commentedGraph', false);
                }
            }
            var tagSections = this.model.getBookParagraphTagSections().models;
            for (var i = 0; i < tagSections.length; i++) {
                if (this.sectionIsSelectd(tagSections[i])) {
                    carets = this.addCaret(carets, tagSections[i].getStartOffset(), 'Meshkat-commented', true);
                    carets = this.addCaret(carets, tagSections[i].getEndOffset() + 1, 'Meshkat-commented', false);
                }
            }
            carets = _.sortBy(carets, function (item) { return item.position; });
            return carets;
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
        },
        isShowing: function (baseHeight,top,bottom) {
            var start = baseHeight + $(this.el).position().top;
            var end = start + $(this.el).height();
            if (end >= top && start <= bottom)
                return true;
            return false;
        },
        sectionIsSelectd: function (section) {
            if(app.commentsView.selectedComment===null)
                return false;
            var sections=app.commentsView.selectedComment.getSections().models;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].getParagraphId() === section.getParagraphId() && sections[i].getStartOffset()===section.getStartOffset() && sections[i].getEndOffset()===section.getEndOffset()) {
                    return true;
                }
            }
            return false;
        },
        GraphsectionIsSelectd: function (section) {
            if (app.commentsView.selectedGraph === null)
                return false;
            var sections = app.commentsView.selectedGraph.getSections().models;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].getParagraphId() === section.getParagraphId() && sections[i].getStartOffset() === section.getStartOffset() && sections[i].getEndOffset() === section.getEndOffset()) {
                    return true;
                }
            }
            return false;
        },
        paragraphClicked: function (e) {
            if (app.bookletView.commentMode || app.bookletView.highlightMode)
                return;
            //app.tableOfContentView.selectNode(this.model.getTableOfContentNode().getKey());
            this.trigger("paragraphClicked",this);
        }     
    });
})(jQuery);
