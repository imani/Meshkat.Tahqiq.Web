var app = app || {};

(function ($) {
    "use strict";
    app.VolumeView = Backbone.View.extend({
        tagName: "div",
        events: {
            /*"mousewheel": "mouseWheel",*/
            "keypress .txtPageNumber": "pageNumberPressed",
            "keydown .txtPageNumber": "pageNumberDown",
            "click .volumePage": "pageClicked",
            "click .Meshkat-highlighted": "showRemoveButton"
        },
        paragraphId: 1,             // Current paragraph id: always is the topmost paragraph that the user is viewing.
        firstCachedId: 1,           // Id of the first paragraph in the loaded block.
        lastCachedId: 1,            // Id of the last paragraph in the loaded block.
        cacheSize: 1,              // Size of the block that should be filled from the server side.
        scrollStep: 30,             // Number of pixels that the block moves at each step when the user is scrolling volume.
        pageNumber: 1,              // Current page Number.
        currentBlockView: null,     // The view of current loaded block
        currentPageView: null,
        selectedParagraphId: -1,
        playAudio: false,
        autoPlay: false,
        currentAudio : null,
        lastPlayedTatbiq : null,
        lastPlayedTozih : null,
        lastPlayedPorsesh: null,
        playingAudioType : null,
        countParagraphGap : null,
        lastTagIds : null,
        waitingForResponse: false,
        reloadThreshold: 2000,
        isLastBlock: false,
        isFirstBlock: true,
        blockViews: [],
        initialize: function (args) {
            this.paragraphId = args.paragraphId;
            $(this.el).addClass("volume");
            this.tplVolume = $("#tplVolume");
            this.render();
            this.loadBlock(true);
            var that = this;
            var lastScrollTop = 0;
            $(this.$el.children()[0]).scroll(function (e) {
                var d = $(this).scrollTop() - lastScrollTop;
                lastScrollTop = $(this).scrollTop();
                that.mouseWheel(e, d);
            });
        },
        render: function () {
            
            $(this.el).html(_.template(this.tplVolume.html(), {}));
            $(this.el).layout({
                defaults: {
                    spacing_closed: 0,
                    spacing_open: 0
                },
                south: {
                    size:"30"
                },
            });
            this.content = $(this.el).find(".ui-layout-center");
        },
        updateBlock: function (block, top) {
            var that = this;
            var currentBlockView = new app.BlockView({ model: block });
            if (top == true) {
                this.blockViews.unshift(currentBlockView);
                $(this.content).prepend(currentBlockView.render().el);
                this.$el.children().scrollTop(this.$el.children().scrollTop() + this.blockViews[0].$el.height());
            } else {
                //this.currentBlockView = currentBlockView;
                this.blockViews.push(currentBlockView);
                $(this.content).append(currentBlockView.render().el);
            }
            //this.currentBlockView.$el.css("top", (this.currentBlockView.$el.position().top - (newPos - oldPos)) + "px");
            this.currentBlockView.on("paragraphClicked", function (view) {
                that.paragraphClicked(view);
            });
        },
        updateBlockSpecific: function (block) {         
            var that = this;
            this.currentBlockView = new app.BlockView({ model: block });
            this.blockViews = [this.currentBlockView];
            $(this.content).html(this.currentBlockView.render().el);

            // if the paragraph is hidden=> skip it and go to next paragraph
            var paragraphView = this.currentBlockView.getParagraphView(this.paragraphId);
            if (paragraphView != null) {
                if (paragraphView.$el.css("display") === "none") {
                    this.paragraphId++;
                    paragraphView = this.currentBlockView.getParagraphView(this.paragraphId);
                }
                ///////////////////////////////////

                /*var a = this.content.offset().top;
                var b = paragraphView.$el.offset().top;
                this.currentBlockView.$el.css("top", (a - b) + "px");*/
                //initialize scrollbar
                this.$el.layout().show("south");
                this.$el.find("#scrollContainer").scrollTop(paragraphView.$el.position().top);
                this.currentBlockView.on("paragraphClicked", function(view) {
                    that.paragraphClicked(view);
                });
            }      
        },
        loadBlock: function (isSpecific, top) {
            if (this.waitingForResponse)
                return;
            this.waitingForResponse = true;
            
            // Specific loading means load block and move it so that the current paragraph be at the top of view.
            // Non-specific loading happens when the user scrolls the volume.
            var that = this;
            if (top == true) {
                if (isSpecific) {
                    var paragraphId = parseInt(this.paragraphId);
                    $(".paragraphBlock").remove();
                } else {
                    var paragraphId = this.blockViews[0].model.getParagraphs().first().getParagraphId();
                }
                this.lastCachedId = paragraphId - 1;
                //this.firstCachedId = this.paragraphId - this.cacheSize;

                var start = this.model.getStartParagraphId();
                var end = this.model.getEndParagraphId();
                /*if (this.firstCachedId < start) {
                    this.lastCachedId = (start + that.cacheSize);
                    this.firstCachedId = start;
                }*/
                if (this.lastCachedId > end) {
                    //this.firstCachedId = end - that.cacheSize;
                    this.lastCachedId = end;
                }
                /*if (this.paragraphId < this.firstCachedId)
                    this.paragraphId = this.firstCachedId;
                else*/ /*if (this.paragraphId > this.lastCachedId)
                    this.paragraphId = this.lastCachedId;*/

                if (this.lastCachedId < start) {
                    this.waitingForResponse = false;
                    return;
                }

                /*if (this.model.getStartParagraphId() >= this.firstCachedId && this.model.getStartParagraphId() <= this.lastCachedId)
                    this.isFirstBlock = true;
                else
                    this.isFirstBlock = false;  */             
            } else {
                if (isSpecific) {
                    this.paragraphId = parseInt(this.paragraphId);
                    $(".paragraphBlock").remove();
                } else {
                    this.paragraphId = this.blockViews[this.blockViews.length - 1].model.getParagraphs().last().getParagraphId();
                }
                this.firstCachedId = this.paragraphId + 1;
                //this.lastCachedId = this.paragraphId + this.cacheSize;

                var start = this.model.getStartParagraphId();
                var end = this.model.getEndParagraphId();
                if (this.firstCachedId < start) {
                    //this.lastCachedId = (start + that.cacheSize);
                    this.firstCachedId = start;
                }
                if (this.firstCachedId > end) {
                    that.waitingForResponse = false;
                    return;
                }
                /*if (this.lastCachedId > end) {
                    this.firstCachedId = end - that.cacheSize;
                    this.lastCachedId = end;
                }*/
                /*if (this.paragraphId < this.firstCachedId)
                    this.paragraphId = this.firstCachedId;
                else if (this.paragraphId > this.lastCachedId)
                    this.paragraphId = this.lastCachedId;*/

                /*if (this.model.getEndParagraphId() >= this.firstCachedId && this.model.getEndParagraphId() <= this.lastCachedId)
                    this.isLastBlock = true;
                else
                    this.isLastBlock = false;*/

                /*if (this.model.getStartParagraphId() >= this.firstCachedId && this.model.getStartParagraphId() <= this.lastCachedId)
                    this.isFirstBlock = true;
                else
                    this.isFirstBlock = false;  */         
            }
            this.$el.find(".imgLazyLoading").show();
            $.ajax({
                type: "GET",
                url: "/BookParagraph/GetParagraphsBlock",
                data: { paragraphId: (top == true ? this.lastCachedId: this.firstCachedId), volumeId: this.model.getVolumeId() , workspaceId : app.userWorkspaceId},
                dataType: "json",
                success: function (data) {
                    app.loadParagraphId = undefined;
                    that.$el.find(".imgLazyLoading").hide();
                    that.waitingForResponse = false;
                    if (!CheckServiceResultIsSuccess(data)) {
                        return;
                    }
                    var currentBlock = new app.BookParagraphsBlock(data);
                    if (!isSpecific)
                        that.updateBlock(currentBlock, top);
                    else {
                        that.updateBlockSpecific(currentBlock);
                        that.updatePage(true);
                        that.paragraphClicked(that.currentBlockView.getParagraphView(that.paragraphId));
                    }                       
                    /*if (isSpecific) {
                        that.paragraphClicked(that.currentBlockView.getParagraphView(that.paragraphId));
                        that.loadBlock(false);
                    }*/
                        
                    
                },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        },
        mouseWheel: function (event, delta) {            
            if (delta > 0)
                this.goDown();
            else
                this.goUp();
        },
        goUp: function (scrollValue) {
            /*if (this.currentBlockView.$el.position().top < 0) {
                this.currentBlockView.$el.css("top", this.currentBlockView.$el.position().top + scrollValue + "px");
            }*/
            this.updateParagraph();
            
            // Check top expiration
            if (this.blockViews[0].$el.position().top > -this.reloadThreshold && this.paragraphId > this.model.getStartParagraphId()) {
                this.loadBlock(false, true);
            }
        },
        goDown: function (scrollValue) {
            var volumeBottom = this.$el.position().top + this.$el.height();
            var blockBottom = this.blockViews[this.blockViews.length - 1].$el.position().top + this.blockViews[this.blockViews.length - 1].$el.height();
            this.currentBlockView.hide_popup();
            
            this.updateParagraph();
        
            // Check bottom expiration
            if (blockBottom - volumeBottom < this.reloadThreshold && this.paragraphId < this.model.getEndParagraphId()) {
                    this.loadBlock(false);
            }
        },
        updateParagraph: function () {
            var volumeTop = this.$el.position().top;
            var volumeBottom = volumeTop + this.$el.height();
            if (!this.currentBlockView.isShowing(this.$el.position().top, volumeTop, volumeBottom )) {
                for (var i = 0; i < this.blockViews.length; i++) {
                    if (this.blockViews[i].isShowing(this.$el.position().top, volumeTop, volumeBottom)) {
                        this.currentBlockView = this.blockViews[i];
                    }
                }
            }
            var topParagraph = this.currentBlockView.getTopParagraph(volumeTop, volumeBottom);
            if (topParagraph === null)
                return;
            this.paragraphId = topParagraph.model.getParagraphId();
            this.updatePage(false);
            
        },
        updatePage: function (forceUpdate) {
            var volumeTop = this.$el.position().top;
            var volumeBottom = volumeTop + this.$el.height();
            var prevPageView = this.currentPageView;
            this.currentPageView = this.currentBlockView.getCurrentPageView(volumeTop, volumeBottom);
            if (this.currentPageView === null)
                return;
            var pn = this.currentPageView.getPageNumber();
            if (forceUpdate || pn != this.pageNumber) {

                this.trigger("pageChanged", this.getPageComments(this.currentPageView), this.getPageGraphElements(this.currentPageView), this.getPageTags(this.currentPageView));
                this.pageNumber = pn;
                if (prevPageView !== null) {
                    prevPageView.$el.removeClass("volumePage-selected");
                    prevPageView.$el.find(".paragraph-bold").removeClass("paragraph-bold");
                }
                
                if (this.currentBlockView.getParagraphView(this.paragraphId) != null) {
                    var tocId = this.currentBlockView.getParagraphView(this.paragraphId).model.getTableOfContentNode().getKey();
                }
                if (app.userMode == "workspace") {
                    app.app_router.navigate('workspace/' + app.userWorkspaceId + '/toc/' + tocId + '/pg/' + this.paragraphId, { trigger: false, replace: true });
                }
                else if (app.userMode == "volume") {
                    app.app_router.navigate('volume/' + app.userVolumeId + '/toc/' + tocId + '/pg/' + this.paragraphId, { trigger: false, replace: true });
                }
                var tocNode = $("#tableOfContentTree").fancytree("getTree").getNodeByKey('' + tocId);
                if(tocNode !== null)
                    tocNode.setActive(true, { noEvents: true });
                this.currentPageView.boldPage(); 

                $(this.el).find(".volumeFooter").find(".txtPageNumber").val(pn);
                $(this.el).find(".volumeFooter").find(".lblPageCount").html(this.model.getPages());
                $(this.el).layout().show("south");
            }
        },
        gotoParagraph: function (paragraphId) {
            this.paragraphId = paragraphId;
            this.loadBlock(true);
        },
        gotoPage: function (pageNumber) {
            var that = this;
            var fetchSizeBefore = 0;
            var fetchSizeAfter = this.cacheSize;
            this.pageNumber = pageNumber;
            this.$el.find(".imgLazyLoading").show();
            $.ajax({
                type: "GET",                
                url: "/BookParagraph/GetParagraphsByPageNumber",
                data: { volumeId: this.model.getVolumeId(), pageNumber: pageNumber, fetchSizeBefore: fetchSizeBefore, fetchSizeAfter: fetchSizeAfter, workspaceId: app.userWorkspaceId },
                dataType: "json",
                success: function (data) {
                    that.$el.find(".imgLazyLoading").hide();
                    if (!CheckServiceResultIsSuccess(data)) {
                        return;
                    }
                    var currentBlock = new app.BookParagraphsBlock(data.ReturnValue);
                    var paragraphs = currentBlock.getParagraphs().models;
                    for (var i = 0; i < paragraphs.length; i++) {
                        if (paragraphs[i].getParagraphPageNumber()=== that.pageNumber) {
                            that.paragraphId = paragraphs[i].getParagraphId();
                            break;
                        }
                    }
                    that.updateBlockSpecific(currentBlock);
                    that.updatePage(true);
                },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        },
        pageNumberPressed: function (e) {
            e.which = e.which || e.keyCode || e.charCode || e.metaKey;

            if (e.which == 13) {
                var pageNumber =parseInt(this.$el.find(".txtPageNumber").val());
                if (pageNumber < 1)
                    pageNumber = 1;
                if (pageNumber > this.model.getPages())
                    pageNumber = this.model.getPages();
                this.gotoPage(pageNumber);
            }
        },
        pageNumberDown: function (e) {
            e.which = e.which || e.keyCode || e.charCode || e.metaKey;
            // Allow: backspace, delete, tab, escape, enter, ctrl+A and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190,116,123]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)) {
                // let it happen, don't do anything
                return;
            }
            e.preventDefault();
        },
        getParagraphComments: function (paragraphView) {
            if (this.currentBlockView.model.getComments() == null) {
                return;
            }
            var comments = this.currentBlockView.model.getComments().models;
            var commentIndices = paragraphView.model.getCommentIndices();
            var result = [];
            for (var i = 0; i < commentIndices.length; i++) {
                var ind = commentIndices[i];
                result.push(comments[ind]);
            }
            return result;
        },
        getParagraphGraphElements: function (paragraphView) {
            if (this.currentBlockView.model.getGraphElements() == null) {
                return;
            }
            var graphElements = this.currentBlockView.model.getGraphElements().models;
            var graphElementIndices = paragraphView.model.getGraphElementIndices();
            var result = [];
            for (var i = 0; i < graphElementIndices.length; i++) {
                var ind = graphElementIndices[i];
                result.push(graphElements[ind]);
            }
            return result;
        },
        getParageaphTags: function (paragraphView) {
            if (this.currentBlockView.model.getBookParagraphTags() == null) {
                return;
            }
            var tags = this.currentBlockView.model.getBookParagraphTags().models;
            var tagIndices = paragraphView.model.getBookParagraphTagIndices();
            var result = [];
            for (var i = 0; i < tagIndices.length; i++) {
                var ind = tagIndices[i];
                result.push(tags[ind]);
            }
            return result;
        },
        getPageComments: function (pageView) {
            if (this.currentBlockView.model.getComments() == null) {
                return;
            }
            var comments = this.currentBlockView.model.getComments().models;
            var indices = pageView.commentIndices;
            var result = [];
            for (var i = 0; i < indices.length; i++) {
                result.push(comments[indices[i]]);
            }
            return result;
        },
        getPageGraphElements: function (pageView) {
            if (this.currentBlockView.model.getGraphElements() == null) {
                return;
            }
            var graphElements = this.currentBlockView.model.getGraphElements().models;
            var indices = pageView.graphElementIndices;
            var result = [];
            for (var i = 0; i < indices.length; i++) {
                result.push(graphElements[indices[i]]);
            }
            return result;
        },
        getPageTags: function (pageView) {
            if ( this.currentBlockView.model.getBookParagraphTags() == null) {
                return;
            }
            var tags = this.currentBlockView.model.getBookParagraphTags().models;
            var tagIndices = pageView.tagIndices;
            var result = [];
            for (var i = 0; i < tagIndices.length; i++) {
                result.push(tags[tagIndices[i]]);
            }
            return result;
        },
        getCommentedSections: function () {
            return this.currentBlockView.getCommentedSections();
        },
        getTagGroup: function (paragraphId, tagTypeId) {
            if (paragraphId == 0) {
                return [];
            }
            var res = $.grep(this.currentBlockView.model.attributes.BookParagraphTags, function (tg) {
                return (tg.ParentParagraphId == paragraphId && tg.TagTypeId == tagTypeId);
            });
            return res;
        },
        keyPressed: function (code) {
            /*var current=this.$el.find(".paragraph-bold");
            if (current === undefined)
                return;
            var volumeTop = this.$el.position().top;
            var volumeBottom = volumeTop + this.$el.height();
            var id = current.data().id;
            var topParagraph = this.currentBlockView.getTopParagraph(volumeTop, volumeBottom);
            var top = topParagraph.$el.position().top;
            var bottom = top + Math.round(this.$el.height() * 0.7);
            if (code === 40) { // Arrow down
                var next = this.$el.find(".paragraph[data-id='" + (id + 1) + "']");
                if (next !== undefined) {
                    next.click();
                    if (next.position().top > bottom || next.position().top == 0) {
                        var d = next.position().top - bottom;
                        if (d > 0)
                            this.goDown(d);
                        else {
                            this.goDown();
                        }                  
                    }
                        
                }
            }
            else if (code === 38) { // Arrow up
                var prev = this.$el.find(".paragraph[data-id='" + (id - 1) + "']");
                if (prev !== undefined) {
                    prev.click();
                    if (top > Math.round(prev.position().top * 0.7) || prev.position().top == 0) {
                        var d = top - prev.position().top;
                    }
                    if (d > 0)
                        this.goUp(d);
                    else
                        this.goUp();
                }
            }*/
            var scrollContainer = this.$el.find("#scrollContainer");
            var lastScrollTop = scrollContainer.scrollTop();
            var scrollStep = 100;
            if (code === 40) {
                scrollContainer.scrollTop(lastScrollTop + 100);
                this.goDown();
            }
            else if (code === 38) {
                scrollContainer.scrollTop(lastScrollTop - 100);
                this.goUp();
            }
            else if (code === 33) {
                scrollContainer.scrollTop(lastScrollTop - this.currentPageView.$el.height());
                this.goUp();
            }
            else if (code === 34) {
                scrollContainer.scrollTop(lastScrollTop + this.currentPageView.$el.height());
                this.goDown();
            } else {
                return;
            }
        },
       paragraphClicked: function (paragraphView) {   
            //var that = this;      
            /*myPlaylist.pause();
            if (that.currentAudio != null && myPlaylist.playlist[that.currentAudio] != null) {
                $(".paragraphBlock span").removeClass('audio-paragraph-on');
            }
            that.selectedParagraphId = paragraphView.model.attributes.ParagraphId;
            var playList = [];
            var hasAudio = false;
            var tags = paragraphView.model.attributes.BookParagraphTags;            
            var index_0 = 0, index_1 = 0, index_2 = 0;
            var lastPlayedAudio = 0;
            if (that.playingAudioType == "TOZIH") {
                lastPlayedAudio = that.lastPlayedTozih;
            }
            else if (that.playingAudioType == "TATBIGH") {
                lastPlayedAudio = that.lastPlayedTatbiq;
            }
            else if (that.playingAudioType == "PORSESHPASOKH") {
                lastPlayedAudio = that.lastPlayedPorsesh;
            }
            if (that.playAudio == true) {
                tags.forEach(function (tag, index) {
                    if (tag.TagType === that.playingAudioType && (tag.ParentParagraphId == tag.ParagraphId || tag.ParentParagraphId != lastPlayedAudio)) {
                        
                        hasAudio = true;
                        playList.push({
                            title: "#" + that.playingAudioType,
                            artist: that.selectedParagraphId,
                            poster: '{ "TagTypeId" : "' + tag.TagTypeId + '", "ParentParagraphId" : "' + tag.ParentParagraphId + '"}',
                            mp3: "http://localhost:8980/Files/Audios/" + that.selectedParagraphId + "_" + tag.TagTypeId + "_" + index_0 + ".mp3"
                        });
                        index_0++;
                    }
                });
            }
            myPlaylist.setPlaylist(playList);      
            */
           this.$el.find(".paragraph-bold").removeClass("paragraph-bold");
           if (paragraphView != null) {
               paragraphView.$el.addClass("paragraph-bold");
               this.trigger("pageChanged", this.getParagraphComments(paragraphView), this.getParagraphGraphElements(paragraphView), this.getParageaphTags(paragraphView));
           }
           /*if (that.playAudio == true && hasAudio == true) {
               setTimeout(function () {
                   myPlaylist.play();
               },1000);
                               
               that.countParagraphGap = 0;
           }
           else if (that.playAudio == true && that.autoPlay == true && that.countParagraphGap < 10) {
               that.countParagraphGap++;
               var next = this.$el.find(".paragraph[data-id='" + (that.selectedParagraphId + 1) + "']");
               setTimeout(function () {
                   that.goDown();                    
                   next.click();                    
               }, 1000);                            
           }
           else if (that.playAudio == true) {
               that.countParagraphGap = 0;
           }
           if (that.autoPlay == false) {
               that.playAudio = false;
           }*/
       },
        showRemoveButton: function(e) {
            e.stopPropagation();
            if ($(".btn-remove-highlight").length > 0)
                return;
            var btnElement = $('<button type="button" class="btn-remove-highlight btn btn-danger btn-xs fa fa-times" onclick="app.currentVolumeView.currentBlockView.removeHighlight(event)"></button>');
            $(e.target.parentElement).append(btnElement);
            $(".btn-remove-highlight").position({ of: e.target, my: 'right top', at: 'right top', collision: 'none' });
            app.selectedHighlightElement = e.target;
        }       
    });
})(jQuery);
