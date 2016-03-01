(function ($) {
    "use strict";
    app.TagItemView = Backbone.View.extend({
        events: {
            "click": "TagItemClicked",
            "clickoutside": "outsideClicked",
            "click .btn-remove-tag": "removeTag"
        },
        tplTag: null,
        initialize: function () {
            this.tplTag = $("#tplTag");
            this.render();
           
        },
        render: function () {
            this.$el.addClass('tag-item');
            this.$el.attr('id', this.model.getId());
            this.$el.html(_.template(this.tplTag.html(), { tag_text: this.model.getTagName(), tag_id: this.model.getId() }));
            return this;

        },
        removeTag: function (e) {
            var that = this;
            that.model.setLastModifiedDateTime(null);
            $.ajax({
                type: "POST",
                url: "/BookTag/RemoveTagSections",
                data: { bookTag: JSON.stringify(that.model) },
                dataType: "json",
                success:
                    function(data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        that.$el.hide();
                    },
                error: function(xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                },
                contentType: "application/x-www-form-urlencoded",
                cache: false
            });
        },
        TagItemClicked: function (e) {
            if (this.$el.hasClass("tagItem-selected")) {
                this.searchTag();
            } else {
                $(".tag-item").removeClass("tagItem-selected");
                this.$el.addClass("tagItem-selected");
                //this.$el.find(".tag-item").removeClass("tagItem-hover");
                app.bookletView.clearCommentHighlights();
                app.commentsView.selectedComment = this.model;
                app.bookletView.showCommentHighlights();
            }
            e.stopPropagation();
        },
        outsideClicked: function (e) {
            if (!app.bookletView.commentMode && $(e.target).closest(".tag-item").length === 0) {
                app.bookletView.clearCommentHighlights();
                $(".tag-item").removeClass("tagItem-selected");
            }
        },
        searchTag: function(e) {
            var that = this;
            that.model.setWorkspaceId(app.userWorkspaceId);
            showLoading();
            $.ajax({
                type: "POST",
                url: "/BookTag/GetTaggedParagraphs",
                dataType: "json",
                data: { tagId: that.model.getId(), volumeId: (app.userVolumeId == undefined ? -1 : app.userVolumeId), workspaceId: app.userWorkspaceId },
                success:
                    function(data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        var results = new app.SearchResultItems({ Items: data, TotalHits: data.length });
                        results.endOfSearch = true;
                        var searchView = new app.SearchView();
                        searchView.searchResults = results;
                        searchView.render();
                        searchView.allowLoadMore = false;
                        var tab = $("#bookletPanel").meshkatTab("getTabById", that.model.getId());
                        if (tab === null) {
                            $("#bookletPanel").meshkatTab("addTab", that.model.getTagName() , searchView, that.model.getId());
                        } else {
                            $("#bookletPanel").meshkatTab("selectTab", tab);
                            $(tab).data().view = searchView;
                        }
                        
                        
                    },
                error: function(xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/x-www-form-urlencoded",
                cache: false
            });
        }
    });
})(jQuery);