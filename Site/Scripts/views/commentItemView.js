(function($) {
    "use strict";
    app.CommentItemView = Backbone.View.extend({
        events: {
            "mouseenter .commentItem": "showOptions",
            "mouseleave .commentItem": "hideOptions",
            "click .iconRemoveComment": "removeComment",
            "click .iconEditComment": "showEditPanel",
            "click .iconReplyComment": "showReplyPanel",
            "click .iconViewReplyComment": "showViewReplyPanel",
            "click": "commentClicked",
            "clickoutside": "outsideClicked",
            "click .commentBody-more":"expandBody"
        },
        tplCommentItem:null,
        initialize: function() {
            this.tplCommentItem = $("#tplCommentItem");
            this.render();
            $(this.el).find(".commentTypeColor").css("color",this.model.getType().getBookCommentTypeColor());
            $(this.el).layout({
                defaults: {
                    spacing_closed: 0,
                    spacing_open: 0
                },
                north: {
                    size:"25"
                }
            });
            this.$el.find(".btnCommentHeader").tooltip({
                position: { my: "middle bottom", at: "right top" },
                show: { effect: "slide", duration: 100, direction: "down" },
                tooltipClass: "commentOptionToolTip"
            });

        },
        render: function () {
            //Check access of delete and edit comment item
            var canModify = false;
            var canDelete = false;
            var canReply = false;
            if (app.currentPerson != undefined && app.currentWorkspace != undefined) {
                if ((this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId() && app.currentPerson.getPersonId() === app.currentWorkspace.getWorkspaceOwner()) ||
                    (this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId() && app.currentPerson.getPersonId() === this.model.getPersonId()) ||
                     this.model.getPrivacyTypeId() === 1 ||
                     this.model.getPersonId() === 0) {
                    canModify = true;
                }
                if ((this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId() && app.currentPerson.getPersonId() === app.currentWorkspace.getWorkspaceOwner()) ||
                    (this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId() && app.currentPerson.getPersonId() === this.model.getPersonId()) ||
                     this.model.getPersonId() === 0) {
                    canDelete = true;
                }
                if (this.model.getWorkspaceId() === app.currentWorkspace.getWorkspaceId()) {
                    canReply = true;
                }
            }
            $(this.el).html(_.template(this.tplCommentItem.html(), { commentItem: this.model, canModify: canModify, canDelete: canDelete, canReply: canReply }));
            this.showOptions();
            return this;

        },
        showOptions: function (e) {
            var buttons = this.$el.find(".iconRemoveComment,.iconEditComment,.iconReplyComment,.iconViewReplyComment,.commentType,.iconCommentCount");
            buttons.finish();
            buttons.show(100);
            if (!this.$el.find(".commentItem").hasClass("commentItem-selected")) {
                this.$el.find(".commentItem").addClass("commentItem-hover");
            }
        },
        hideOptions: function () {
            /*var buttons = this.$el.find(".iconRemoveComment,.iconEditComment,.iconReplyComment,.iconViewReplyComment,.commentType");
            buttons.finish();
            buttons.hide(100);*/
            this.$el.find(".commentItem").removeClass("commentItem-hover");
        },
        removeComment: function (e) {
            e.stopPropagation();
            var that = this;
            showLoading();
            $.ajax({
                type: "GET",                
                url: "/BookComment/RemoveComment",
                data: { bookCommentId: that.model.getId() },
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
                        block.Comments = _.without(block.Comments, _.findWhere(block.Comments, { Id: that.model.getId() }));
                        app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                        app.currentVolumeView.currentBlockView.render();
                        app.currentVolumeView.updatePage(true);
                        ///////////////////////////////////////////////////
                        showMessage(messageList.SUCCESSFUL, messageList.COMMENT_REMOVED_TITLE, "success");
                        
                    },
                error: function (xhr,status,error) {
                    hideLoading();                    
                    showMessage(error, messageList.ERROR, "error",xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });

        },
        showEditPanel: function (e) {
            e.stopPropagation();
            app.editCommentView.loadComment(this.model);
        },
        showReplyPanel: function (e) {
            e.stopPropagation();
            
            var replyModel = new app.BookComment();
            replyModel.setId('');
            replyModel.setParentId(this.model.getId());
            replyModel.setText('');
            replyModel.setPersonId(0);
            replyModel.setPersonName(app.currentPerson.getPersonName() + ' ' + app.currentPerson.getPersonLastName());
            replyModel.setPrivacyTypeId(1);
            replyModel.setSubjects(this.model.getSubjects());
            replyModel.setType(this.model.getType());
            replyModel.setWorkspaceId(app.currentWorkspace.getWorkspaceId());
            replyModel.setSections(this.model.getSections());
            replyModel.setIsReply(1);

            app.editCommentView.loadComment(replyModel);
        },
        showViewReplyPanel: function (e) {
            e.stopPropagation();
            if ($("#commentExpand_" + this.model.getId()).hasClass("fa-plus-square")) {
                $("#commentExpand_" + this.model.getId()).removeClass("fa-plus-square");
                $("#commentExpand_" + this.model.getId()).addClass("fa-minus-square");
            } else {
                $("#commentExpand_" + this.model.getId()).removeClass("fa-minus-square");
                $("#commentExpand_" + this.model.getId()).addClass("fa-plus-square");
            }
            $("#comment_" + this.model.getId()).toggle();
        },
        commentClicked: function (e) {
            $(".commentItem").removeClass("commentItem-selected");
            this.$el.find(".commentItem").addClass("commentItem-selected");
            this.$el.find(".commentItem").removeClass("commentItem-hover");
            app.bookletView.clearCommentHighlights();
            app.commentsView.selectedComment = this.model;
            app.bookletView.showCommentHighlights();
            e.stopPropagation();
        },
        outsideClicked: function (e) {
            if (!app.bookletView.commentMode && $(e.target).closest(".commentItem").length === 0) {
                app.bookletView.clearCommentHighlights();
                $(".commentItem").removeClass("commentItem-selected");
            }
        },
        expandBody: function (e) {
            e.stopPropagation();
            this.$el.find(".commentBody").html(this.model.getText());
        }

    });
})(jQuery);