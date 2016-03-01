var app = app || {};

(function ($) {
    'use strict';
    // Table of content view

    app.TagsView = Backbone.View.extend({
        el: '#tagsPanel',
        tplTag: null,
        isVisible: false,
        events: {
            "click .tag-item": "tagItemClicked"
        },
        initialize: function () {
            this.tplTag = $("#tplTag");
            this.$el.hide();
            this.render();
            //instant search tags
            $('#txtTOCSearch').keyup(function (e) {
                if ($(this).autocomplete('option', 'disabled')) {
                    var filter = $(this).val();
                    $('.tagsList').each(function () {
                        if ($(this).text().search(new RegExp(filter, 'i')) < 0) {
                            $(this).fadeOut();
                        } else {
                            $(this).show();
                        }
                    });
                }
            });
        },
        render: function () {
            //Render list of tags to show
            this.renderTags();            
            return this;
        },
        renderTags: function () {
           
            if (app.tagNameAndIds === undefined) {
                return;
            }
            for (var i = 0; i < app.tagNameAndIds.length; i++) {
                var tagItemElement = $('<div class=\"tag-item tagsList\"></div>');
                tagItemElement.attr('id', app.tagNameAndIds[i].id);
                tagItemElement.text( app.tagNameAndIds[i].label );
                this.$el.append(tagItemElement);
            }
        },
        isClosed: function () {
            return $("#mainContent").layout().state.east.isClosed;
        },
        open: function () {
            $('#tableOfContentTree').hide();
            $('#tagsPanel').show();
            $("#mainContent").layout().open("east");
            $('#txtTOCSearch').autocomplete('disable'); // disable autocomplete of tocSearch
            $('#txtTOCSearch').val(""); // reset input to blank
            $('.tagsList').show(); // reset result of tags search to initial state
        },
        close: function () {
            $("#mainContent").layout().close("east");          
        },
        tagItemClicked: function(e) {
            // show list of paragraphs which has that tag
            var tagId = e.target.id;
            var tagName = e.target.textContent.split('[')[0];
            var tag = new app.BookParagraphTag({ Id: tagId, TagName: tagName, PersonId: 0 });
            this.searchTag(tag);
        },
        searchTag: function(tag) {           
            showLoading();
            tag.setWorkspaceId(app.userWorkspaceId);
            var volumeId = -1;
            if (app.userWorkspaceId == -1)
                volumeId = app.userVolumeId;
            $.ajax({
                type: "POST",
                url: "/BookTag/GetTaggedParagraphs",
                dataType: "json",
                data: { tagId: tag.getId(), volumeId: volumeId, workspaceId: app.userWorkspaceId },
                success:
                    function (data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        var results = new app.SearchResultItems({ Items: data, TotalHits: data.length });
                        var searchView = new app.SearchView();
                        searchView.searchResults = results;
                        searchView.render();
                        var tab = $("#bookletPanel").meshkatTab("getTabById", tag.getId());
                        if (tab === null) {
                            $("#bookletPanel").meshkatTab("addTab", tag.getTagName(), searchView, tag.getId());
                        } else {
                            $("#bookletPanel").meshkatTab("selectTab", tab);
                            $(tab).data().view = searchView;
                        }
                        
                       
                        searchView.allowLoadMore = false;
                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/x-www-form-urlencoded",
                cache: false
            });
        }
    });
})(jQuery);
