var app = app || {};

(function ($) {
    'use strict';
    app.PageView = Backbone.View.extend({
        tagName: "div",
        paragraphViews: [],
        commentIndices: [],
        graphElementIndices: [],
        tagIndices:[],
        // Model: BookPage
        initialize: function () {
            $(document).bind('keypress', this.keyPressed);
            this.render();
        },
        render: function () {
            var that = this;
            $(this.el).addClass("volumePage");
            $(this.el).html("");
            this.paragraphViews = [];
            var paragraphs = this.model.getParagraphs().models;
            this.commentIndices = [];
            this.tagIndices = [];
            for (var i = 0; i < paragraphs.length; i++) {
                this.commentIndices = this.commentIndices.concat(paragraphs[i].getCommentIndices());
                this.tagIndices = this.tagIndices.concat(paragraphs[i].getBookParagraphTagIndices());
                this.graphElementIndices = this.graphElementIndices.concat(paragraphs[i].getGraphElementIndices());

                var paragraphView = new app.ParagraphView({ model: paragraphs[i] });
                paragraphView.on("paragraphClicked", function (view) {
                    that.trigger("paragraphClicked",view);
                });
                
                this.paragraphViews.push(paragraphView);
                $(this.el).append(paragraphView.render().el);
            }
            this.commentIndices = _.uniq(this.commentIndices, false);
            this.graphElementIndices = _.uniq(this.graphElementIndices, false);
            this.tagIndices = _.uniq(this.tagIndices, false);
            return this;
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
        isCurrentPage: function (baseHeight, top, bottom) {
            var first = $(this.paragraphViews).first()[0];
            if (first.isShowing(baseHeight, top, bottom))
                return true;
            return false;
        },
        getParagraph: function (paragraphId) {
            var first = $(this.paragraphViews).first()[0];
            var last = $(this.paragraphViews).last()[0];
            if (paragraphId >= first.model.getParagraphId() && paragraphId <= last.model.getParagraphId())
            {
                for (var i = 0; i < this.paragraphViews.length; i++) {
                    if (this.paragraphViews[i].model.getParagraphId() === paragraphId)
                        return this.paragraphViews[i];
                }
            }
            return null;
        },
        getPageNumber: function () {
            var first = $(this.paragraphViews).first()[0];
            return first.model.getParagraphPageNumber();
        },
        boldPage: function () {
            this.$el.addClass("volumePage-selected");
        }
    });
})(jQuery);
