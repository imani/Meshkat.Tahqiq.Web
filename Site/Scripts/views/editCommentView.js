(function($) {
    "use strict";
    app.EditCommentView = Backbone.View.extend({
        el: "#editCommentArea",
        events: {
            "click #btnEditComment": "editComment",
            "click #btnCancelEditComment": "hideEditPanel"
        },
        initialize: function() {
            $(this.el).layout({
                defaults: {
                    spacing_closed: 0,
                    spacing_open: 0
                },
                north: {
                    size: "25"
                },
                south: {
                    size: '30'
                }
            });
            //tinymce.init(app.tinymceOptions);
        },
        render: function() {
        },
        loadComment: function(commentModel) {
            if (app.bookletView.commentMode)
                $("#btnCommentMode").click();
            this.model = commentModel;
            tinymce.get("txtCommentEdit").setContent(this.model.getText());
            $("#cboEditCommentType").val(this.model.getType().getBookCommentTypeId());
            $("#editCommentArea").finish();
            $("#editCommentArea").slideDown(200);
            tinymce.get("txtCommentEdit").focus();
        },
        hideEditPanel: function() {
            //$("#editCommentArea")
            $("#editCommentArea").slideUp(200);
        },
        editComment: function() {
            if ($("#cboEditCommentType").val() != null) {
                this.model.getType().setBookCommentTypeId(($("#cboEditCommentType").val() ? $("#cboEditCommentType").val() : 30005));
                this.model.getType().setBookCommentTypeTitle($("#cboEditCommentType option:selected").text());
                this.model.getType().setBookCommentTypeColor($("#cboEditCommentType option:selected").data("typeColor"));
            }
            var that = this;
            showLoading();

            var isReply = false;
            if (that.model.getIsReply() != undefined)
                isReply = that.model.getIsReply() === 1 ? true : false;
            if (that.model.getPrivacyTypeId() === 1 || isReply===true) {
                var newComment = new app.BookComment();
                newComment.setId(0);
                newComment.setParentId(that.model.getParentId());
                newComment.setPersonId(app.currentPerson.getPersonId());
                newComment.setType(that.model.getType());
                newComment.setPersonName(app.currentPerson.getPersonName() + ' ' + app.currentPerson.getPersonLastName());
                newComment.setText(tinymce.get("txtCommentEdit").getContent());
                newComment.setSections(that.model.getSections());
                newComment.setWorkspaceId(app.currentWorkspace.getWorkspaceId());
                newComment.setPrivacyTypeId(isReply === true ? 1 : 2);

                $.ajax({
                    type: "POST",
                    url: '/BookComment/AddComment',
                    dataType: "json",
                    data: JSON.stringify({ comment: newComment }),
                    success: function(data) {
                        hideLoading();
                        if (!checkResponse(data)) {
                            return;
                        }
                        that.$el.hide(200);
                        that.hideEditPanel();

                        newComment.setId(data.ReturnValue);
                        var block = app.currentVolumeView.currentBlockView.model.toJSON();
                        block.Comments.push(newComment.toJSON());
                        app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                        app.currentVolumeView.currentBlockView.render();
                        app.currentVolumeView.updatePage(true);
                        showMessage(messageList.SUCCESSFUL, messageList.COMMENT_SAVED_TITLE, "success");
                    },
                    error: function(xhr, status, error) {
                        hideLoading();
                        showMessage(error, messageList.ERROR, "error", xhr.status);
                    },
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
            } else {
                that.model.setText(tinymce.get("txtCommentEdit").getContent());
                $.ajax({
                    type: "POST",
                    url: "/BookComment/EditComment",
                    dataType: "json",
                    data: JSON.stringify({ comment: that.model }),
                    success:
                        function(data) {
                            hideLoading();
                            if (!checkResponse(data)) {
                                return;
                            }
                            that.$el.hide(200);
                            that.hideEditPanel();

                            var block = app.currentVolumeView.currentBlockView.model.toJSON();
                            app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                            app.currentVolumeView.currentBlockView.render();
                            app.currentVolumeView.updatePage(true);
                            showMessage(messageList.SUCCESSFUL, messageList.COMMENT_EDITED_TITLE, "success");
                        },
                    error: function(xhr, status, error) {
                        showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                        hideLoading();
                    },
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
            }
        }
    });
})(jQuery);
