
(function($) {
    "use strict";
    app.SearchResultItemView = Backbone.View.extend({
        tagName: "div",
        resultNumber:1,
        events: {
            "mousewheel": "mouseWheel",
            "click .resultLink":"loadNode"

        },
        tplSearchResultItem:null,
        initialize: function (args) {
            this.tplSearchResultItem = $("#tplSearchResultItem");
            this.resultNumber = args.resultNumber;
            this.render();
        },
        render: function () {
            $(this.el).html(_.template(this.tplSearchResultItem.html(), { resultItem: this.model, resultNumber: this.resultNumber }));
            this.$el.addClass("resultItem");
            return this;
        },
        loadNode: function () {
            if (app.tableOfContentView.isClosed())
                app.topBarView.showHideTableOfContent();
            var tocKeys = this.model.getTableOfContentNode().getPath().split('/');
            var nodeKey = tocKeys[tocKeys.length-1];
            //var nodeKey = this.model.getTableOfContentId();
            app.tableOfContentView.selectNode(nodeKey);
            app.loadParagraphId = this.model.getParagraphId();
        }
    });
})(jQuery);