var app = app || {};

(function($) {
    "use strict";
    app.SearchView = Backbone.View.extend({
        tagName: "div",
            events: {
                "mousewheel": "mouseWheel"
            },
            searchResults: null,
            searchQuery: null,
            start: null,
            end: null,
            loadCount: null,
            resultsCount: 20,
            scrollOffset: 5000,
            resultNumber: 1,
            allowLoadMore: true,
            endOfSearch:false,
            initialize: function () {
                $("#searchBox").hide();
                $(this.el).addClass("searchPanel");  
            },
            render: function () {
                this.resultNumber = 1;
                this.$el.html("");
                var totalHitsNumber = this.searchResults.getTotalHits();
                var totalHits = "تعداد کل نتایج:  " + totalHitsNumber;
                var allHits = $("<p/>");
                allHits.attr("id", "allHits");
                $(allHits).text(totalHits);
                $(this.el).append(allHits);
                $(this.el).append("<hr/>");
                var resultCount = this.searchResults.getItems().models.length;
                for (var i = 0; i < resultCount; i++) {
                    var resultItem = new app.SearchResultItemView({ model: this.searchResults.getItems().models[i], resultNumber: this.resultNumber });
                    $(this.el).append(resultItem.el);
                    this.resultNumber++;
                }
              //  this.el = $(this.el).highlight(this.searchQuery);
                return this;
            },
            mouseWheel: function (event, delta) {
                if (!this.endOfSearch) {
                    var currentScroll = Math.abs(Math.floor(this.$el.position().top));
                    var divHeight = $(this.el).height();
                    if ((divHeight - currentScroll) < this.scrollOffset+200) {
                        var start = this.loadCount * this.resultsCount;
                        var end = start + this.resultsCount;
                        this.loadMoreResults(this.searchQuery, start, end);
                    }
                }
            },
            loadResult: function (query, start, end) {
                this.searchQuery = query;
                /*his.bookNames = [];
                var children = $('#tableOfContentTree').fancytree("getRootNode").getChildren();
                for (var i = 0 ;i < children.length; i++) {
                    this.bookNames.push(children[i].title);
                }*/
                this.loadCount = 1;
                this.allowLoadMore = false;
                showLoading();
                var that = this;
                $.ajax({
                    type: "POST",                    
                    url: "/Search/LibSearch?query=" + query + "&start=" + start + "&end=" + end + "&workspaceId=" + app.userWorkspaceId+"&volumeId="+app.userVolumeId+"&volumeList=null",
                    data: {  },
                    dataType: "json",
                    success:
                        function (data) {
                            hideLoading();
                            var results = new app.SearchResultItems(data);
                            that.searchResults = results;
                            that.render();
                            that.allowLoadMore = true;                            
                        },
                    error: function (xhr,status,error) {
                        hideLoading();                       
                        showMessage(error, messageList.ERROR_TITLE, "error",xhr.status);
                    },
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
               
            },
            loadMoreResults: function (query, start, end) {
                if (!this.allowLoadMore)
                    return;
                var that = this;
                //    showLoading();
                this.allowLoadMore = false;
                $.ajax({
                    type: "POST",                                       
                    url: "/Search/LibSearch?query=" + query + "&start=" + start + "&end=" + end + "&workspaceId=" + app.userWorkspaceId+"&volumeId="+app.userVolumeId+"&volumeList=null",
                    data: {  },
                    dataType: "json",
                    success:
                        function (data) {
                            hideLoading();
                            if (!CheckServiceResultIsSuccess(data)) {
                                return;
                            }
                            var results = new app.SearchResultItems(data);
                            var totalHits = results.getTotalHits();
                            that.allowLoadMore = true;
                            if (end > totalHits) {
                                end = totalHits;
                                this.endOfSearch = true;
                            }
                            var count = end % that.resultsCount == 0 ? that.resultsCount : totalHits % that.resultsCount;
                            for (var i = 0; i < count; i++) {
                                var resultItem = new app.SearchResultItemView({ model: results.getItems().models[i], resultNumber: that.resultNumber });
                                that.resultNumber++;
                                $(that.el).append(resultItem.el);
                            }                            
                        },
                    error: function (xhr,status,error) {
                        hideLoading();                        
                        showMessage(error, messageList.ERROR_TITLE, "error",xhr.status);
                    },
                    contentType: "application/x-www-form-urlencoded",
                    cache: false
                });
                this.loadCount++;
            },
            gotoSearchResult: function (tocId, paragraphId) {
                $.ajax({
                    type: "GET",                    
                    url: ajaxPath.GET,
                    dataType: "json",
                    data: { service: 'BookTableOfContent', action: 'GetSubTree', nodeId: tocId },
                    success: function (loadedNode) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(loadedNode)){
                            return;
                        }                        
                        var nodes = loadedNode.ReturnValue;
                        var obj = {};
                        var rootNode = $("#tableOfContentTree").fancytree("getRootNode");
                        var treeToc = $("#tableOfContentTree").fancytree("getTree");
                        for (var i = 1; i < nodes.length; i++) {
                            obj = { title: nodes[i].Title, ParentKey: nodes[i].ParentKey, key: nodes[i].Key, lazy: nodes[i].HasChild, tooltip: nodes[i].Title, icon: nodes[i].ParentKey ? 'book-open.png' : 'book-close.png', volumeId: nodes[i].VolumeId };
                            if (obj.ParentKey != null)
                                treeToc.getNodeByKey(obj.ParentKey.toString()).addChildren(obj);
                            else {
                                rootNode.fromDict(obj);
                                treeToc.getNodeByKey(obj.key.toString()).removeChildren();
                            }
                        }
                        treeToc.getNodeByKey(obj.key.toString()).setActive();
                    },
                    error: function (xhr,status,error) {
                        hideLoading();                        
                        showMessage(error, messageList.ERROR_TITLE, "error",xhr.status);
                    }   
                });
            }

    });
})(jQuery);