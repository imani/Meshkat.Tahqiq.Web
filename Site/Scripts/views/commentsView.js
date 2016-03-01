var app = app || {};

(function ($) {
    'use strict';
    // Table of content view

    app.CommentsView = Backbone.View.extend({
        el: '#commentPanel',
        isVisible: false,
        events: {
            "click #btnCommentMode": "changeCommentMode",
            "click #btnCancelSaveComment": "changeCommentMode",
            "click #btnSaveComment": "saveNewComment",
            "click .txtComment": "commentClicked"
        },
        tplCommentItem: null,
        selectedComment: null,
        selectedGraph:null,
        initialize: function () {
            this.tplCommentItem = $("#tplCommentItem");
            $(".lblCommentType").tooltip({
                position: { my: "middle bottom", at: "middle top" },
                show: { effect: "slide", duration: 100, direction: "down" },
                tooltipClass: "commentOptionToolTip"
            });
            tinymce.init({
                selector: '.txtComment',
                directionality: 'rtl',
                elementpath: false,
                menubar: false,
                statusbar: false,
                plugins: 'paste autoresize fullscreen',
                toolbar: 'insertfile undo redo | bold italic underline | bullist numlist outdent indent | fullscreen | styleselect',
                content_css: '/Site/Styles/booklet.css',
                content_style: 'p {text-align: justify; font-size: 14px;}',
                paste_word_valid_elements: "b,strong,i,u,em,h1,h2,h3,ul,li,td,tr,p,br,span",
                paste_retain_style_properties: "",
                autoresize_max_height: $(document).height() - 240,
                language: 'fa_IR'
            });
            this.render();
        },
        render: function () {
            if (app.bookletView.commentMode)
                $('#btnCommentMode').addClass('commentBarButton-selected');
            else
                $('#btnCommentMode').removeClass('commentBarButton-selected');
            return this;
        },
        renderComments:function(comments, parentId) {
            if (comments != undefined) {
                var hasElement = false;
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].getParentId() === parentId) {
                        var commentType = $("#cboCommentType option:selected").val();
                        var flag = app.changeCommentType === true ? (commentType > 0 ? commentType == comments[i].getType().getBookCommentTypeId() : true) : true;

                        if (flag === true) {
                            hasElement = true;
                            var commentItem = new app.CommentItemView({ model: comments[i] });
                            if (parentId == 0)
                                $("#currentCommentsPanel").append(commentItem.el);
                            else {
                                $("#comment_" + parentId).append(commentItem.el);
                                $("#comment_" + parentId).hide();
                            }
                            this.renderComments(comments, comments[i].getId());
                        }
                    }
                }
                if (parentId > 0 && hasElement === false) {
                    $("#commentExpand_" + parentId).remove();
                    $("#comment_" + parentId).hide();
                }
            }
        },
        renderCurrentComments: function (comments, graphElements, tags) {
            $("#currentCommentsPanel").html("");
            $("#currentCommentsPanel").scrollTop();

            this.renderComments(comments, 0);

            if (graphElements != undefined) {
                for (var i = 0; i < graphElements.length; i++) {
                    var graphItem = new app.GraphItemView({ model: graphElements[i] });
                    $("#currentCommentsPanel").append(graphItem.el);
                }
            }
            if (tags != undefined) {
                //render tags of current page
                for (var j = 0; j < tags.length; j++) {
                    var tagItem = new app.TagItemView({ model: tags[j] });
                    $("#currentCommentsPanel").append(tagItem.el);
                }
            }    
        },
        isClosed: function () {
            return $("#mainContent").layout().state.west.isClosed;
        },
        open: function () {
            $("#mainContent").layout().open("west");
        },
        close: function () {
            $("#mainContent").layout().close("west");
        },
        changeCommentMode: function () {
            app.bookletView.commentMode = !app.bookletView.commentMode;
            $("#txtNewComment").text("");
            if (app.bookletView.commentMode) {
                if (app.bookletView.highlightMode) {
                    $("#btnHighlight").click();
                }
                if (!app.bookletView.tabExists()) {
                    showMessage("هیچ کتابی باز نیست.", "", "error");
                    return;
                }
                $("#editCommentArea").hide();
                $("#newCommentArea").finish();                
                $("#newCommentArea").slideDown(200);
                tinymce.get("txtNewComment").setContent("");
                tinymce.get("txtNewComment").focus();
            }
            else {
                $("#newCommentArea").finish();
                $("#newCommentArea").slideUp(200);
            }
            app.bookletView.clearCommentHighlights();
            this.render();
        },
        saveNewComment: function () {
            var that = this;
            var commentedSections = app.currentVolumeView.getCommentedSections();
            if (tinymce.get("txtNewComment").getContent({ format: "text" }).trim().length == 0) {
                showMessage("متن توضیح نمیتواند خالی باشد", "", "error");
            }
            else if (commentedSections.length == 0) {
                showMessage("قسمتی برای توضیح انتخاب نشده است", "", "error");
            }
            else {
                $("#txtNewComment").focus();
                var newComment = new app.BookComment();
                var commentSubject = new app.BookCommentSubject();
                var commentType = new app.BookCommentType();
                if ($("#cboNewCommentType option:selected").length > 0) {
                    commentType.setBookCommentTypeId($("#cboNewCommentType option:selected").val());
                    commentType.setBookCommentTypeTitle($("#cboNewCommentType option:selected").text());
                    commentType.setBookCommentTypeColor($("#cboNewCommentType option:selected").data("typeColor"));
                    commentType.setBookId(app.currentVolumeView.model.getBook().getBookId());
                } else {
                    commentType.setBookCommentTypeId(30005);
                    commentType.setBookCommentTypeTitle("عمومی");
                    commentType.setBookCommentTypeColor("#fb0000");
                }
                commentType.setBookId(app.currentVolumeView.model.getBook().getBookId());
                var commentFieldValue = new app.BookCommentFieldValue();
                var bookParagraph = new app.BookParagraph();
                newComment.setId(0);
                newComment.setPersonId(0);
                newComment.setParentId(0);
                newComment.setType(commentType);
                newComment.setPersonName($("#lblUserFullName").text());
                newComment.setText(tinymce.get("txtNewComment").getContent());
                newComment.setSections(commentedSections);
                newComment.setWorkspaceId(app.userWorkspaceId);
                showLoading();
                $.ajax({
                    type: "POST",
                    url: '/BookComment/AddComment',
                    dataType: "json",
                    data: JSON.stringify({ comment: newComment }),
                    success: function (data) {

                        if (!CheckServiceResultIsSuccess(data)) {
                            hideLoading();
                            return;
                        }

                        //////////////////Update Block ////////////////////
                        newComment.setId(data.ReturnValue);
                        var block = app.currentVolumeView.currentBlockView.model.toJSON();
                        block.Comments.push(newComment.toJSON());
                        app.currentVolumeView.currentBlockView.model = new app.BookParagraphsBlock(block);
                        app.currentVolumeView.currentBlockView.render();
                        app.currentVolumeView.updatePage(true);
                        ///////////////////////////////////////////////////

                        hideLoading();
                        that.changeCommentMode();
                        //showMessage(messageList.SUCCESSFUL, messageList.COMMENT_SAVED_TITLE, "success");
                    },
                    error: function (xhr,status,error) {
                        hideLoading();                       
                        showMessage(error, messageList.ERROR, "error",xhr.status);
                    },
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
            }

        },
        fillTypes: function (bookId, el) {
            $(el).html("");
            $.ajax({
                type: "GET",                
                url: "/BookComment/GetCommentTypes",
                dataType: "json",
                data: { "bookId": bookId },
                success:
                    function (data) {                        
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        var commentTypeList = data;
                        if (commentTypeList !== null) {
                            for (var i = 0; i < commentTypeList.length; i++) {
                                var option = $('<option>', {
                                    value: commentTypeList[i].BookCommentTypeId,
                                    text: commentTypeList[i].BookCommentTypeTitle
                                });


                                $(option).data('typeColor', commentTypeList[i].BookCommentTypeColor);
                                $(option).data('commentFields', commentTypeList[i].BookCommentFields);
                                $(el).append(option);
                            }
                        } else {
                            $(el).parent().hide();
                        }
                        

                    },
                error: function (xhr,status,error) {                    
                    showMessage(error, messageList.ERROR, "error",xhr.status);
                    hideLoading();
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
            return el;
        },
        commentClicked: function(e) {
            e.preventDefault();
        }
    });
})(jQuery);
