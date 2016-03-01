(function($) {
    "use strict";
    app.GraphItemView = Backbone.View.extend({
        events: {
            "mouseenter .graphItem": "showOptions",
            "mouseleave .graphItem": "hideOptions",
            "click .iconRemoveGraph": "removeGraph",
            "click .iconCloneGraph": "cloneGraph",
            "click": "graphClicked",
            "clickoutside": "outsideClicked",
            "click .graphBody-more":"expandBody"
        },
        tplGraphItem:null,
        initialize: function () {
            this.tplGraphItem = $("#tplGraphItem");
            this.render();
            $(this.el).layout({
                defaults: {
                    spacing_closed: 0,
                    spacing_open: 0
                },
                north: {
                    size:"25"
                }
            });
            this.$el.find(".btnGraphHeader").tooltip({
                position: { my: "middle bottom", at: "right top" },
                show: { effect: "slide", duration: 100, direction: "down" },
                tooltipClass: "graphOptionToolTip"
            });

        },
        render: function () {
            //Check access of delete and edit comment item
            var canDelete = false;
            var canClone = false;
            if (app.currentPerson != undefined && app.currentWorkspace != undefined) {
                if ((this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId() && app.currentPerson.getPersonId() === app.currentWorkspace.getWorkspaceOwner()) ||
                    (this.model.getPersonId() === app.currentPerson.getPersonId() && this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId())) {
                     canDelete = true;
                }
                if (this.model.getPrivacyTypeId() === 1) {
                    canClone = true;
                }
            }
            $(this.el).html(_.template(this.tplGraphItem.html(), { graphItem: this.model, canDelete: canDelete, canClone: canClone }));
            return this;

        },
        showOptions: function (e) {
            var buttons = this.$el.find(".iconRemoveGraph,.iconCloneGraph,.graphType");
            buttons.finish();
            buttons.show(100);
            if (!this.$el.find(".graphItem").hasClass("graphItem-selected")) {
                this.$el.find(".graphItem").addClass("graphItem-hover");
            }
        },
        hideOptions: function () {
            var buttons = this.$el.find(".iconRemoveGraph,.iconCloneGraph,.graphType");
            buttons.finish();
            buttons.hide(100);
            this.$el.find(".graphItem").removeClass("graphItem-hover");
        },

        graphClicked: function (e) {
            $(".graphItem").removeClass("graphItem-selected");
            this.$el.find(".graphItem").addClass("graphItem-selected");
            this.$el.find(".graphItem").removeClass("graphItem-hover");
            app.bookletView.clearGraphHighlights();
            app.commentsView.selectedGraph = this.model;
            app.bookletView.showGraphHighlights();
            e.stopPropagation();
        },
        outsideClicked: function (e) {
            if (!app.bookletView.graphMode && $(e.target).closest(".graphItem").length === 0) {
                app.bookletView.clearGraphHighlights();
                $(".graphItem").removeClass("graphItem-selected");
            }
        },
        removeGraph: function (e) {
            e.stopPropagation();
            var that = this;
            showLoading();
            $.ajax({
                type: "GET",
                url: "/Workspace/RemoveGraph",
                data: { GraphId: that.model.getGraphId(),workspaceId:app.userWorkspaceId },
                dataType: "json",
                success:
                    function (data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        that.$el.hide(200);
                        //////////////////Update Block ////////////////////
                        var block = app.currentVolumeView.currentBlockView.model.toJSON();
                        app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                        app.currentVolumeView.currentBlockView.render();
                        app.currentVolumeView.updatePage(true);
                        ///////////////////////////////////////////////////
                        showMessage(messageList.SUCCESSFUL, messageList.GRAPH_REMOVED_TITLE, "success");

                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });

        },
        cloneGraph:function(e) {
            e.stopPropagation();
            var that = this;
            showLoading();
            $.ajax({
                type: "GET",
                url: "/Graph/CloneGraph",
                data: { GraphId: that.model.getGraphId(), workspaceId: app.userWorkspaceId, personId: app.currentPerson.getPersonId() },
                dataType: "json",
                success:
                    function (data) {
                        hideLoading();
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        that.$el.hide(200);
                        //////////////////Update Block ////////////////////
                        var block = app.currentVolumeView.currentBlockView.model.toJSON();
                        app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                        app.currentVolumeView.currentBlockView.render();
                        app.currentVolumeView.updatePage(true);
                        ///////////////////////////////////////////////////
                        showMessage(messageList.SUCCESSFUL, messageList.GRAPH_CLONE_TITLE, "success");

                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        },
        expandBody: function (e) {
            e.stopPropagation();
            this.$el.find(".graphBody").html(this.model.getText());
        }

    });
})(jQuery);