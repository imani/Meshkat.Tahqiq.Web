var app = app || {};

(function($) {
    'use strict';
    // Top bar view
    app.TopBarView = Backbone.View.extend({
        el: '#topBar',
        pinned: true,
        btnSearchClicked: false,
        events: {
            "click #btnTableOfContent": "showHideTableOfContent",
            "click #btnComments": "showHideComments",
            "click #btnHighlight": "toggleHighlightMode",
            "click #btnSearch": "showHideSearch",
            "click #btnLogout": "logOut",
            "keydown #txtSearch": "txtSearchKeyDown",
            "click #btnShowConfirmBookVolumeFileDialog": "ShowConfirmBookVolumeFileDialog",
            "click #btnTags": "showHideTags",
            "click #btnGraphs": "showHideGraph",
            "submit #loginForm": "login"
        },
        initialize: function() {

            $(this.el).tooltip({
                position: { my: "middle top", at: "left bottom" },
                show: { effect: "slide", duration: 200, direction: "up" },
                tooltipClass: "topBarTooltip"
            });
            $('#btnLogout').click(function () {
                showLoading();
                $.ajax({
                    type: "GET",
                    url: "/Home/Logout",
                    success:
                        function(data) {
                            //hideLoading();
                            eraseCookie("token")
                            location.replace("/home");
                        },
                    error: function(xhr, status, error) {
                        hideLoading();
                        showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                    },
                    contentType: "application/x-www-form-urlencoded",
                    cache: false
                });
            });
            //app.confirmBookVolumeFileDialogView = new app.ConfirmBookVolumeFileDialogView();
        },
        render: function () {
            return this;
        },
        showHideTableOfContent: function() {
            if (app.tableOfContentView.isClosed()) {
                app.tableOfContentView.open();
                $('#btnTableOfContent').addClass('toolBarButtonSelected');
            } else {
                if ($('#btnTags').hasClass('toolBarButtonSelected')) {
                    $('#btnTags').removeClass('toolBarButtonSelected');
                    app.tableOfContentView.open();
                    $('#btnTableOfContent').addClass('toolBarButtonSelected');
                } else if ($('#btnGraphs').hasClass('toolBarButtonSelected')) {
                    $('#btnGraphs').removeClass('toolBarButtonSelected');
                    $('#btn-add-graph').hide();
                    $('#txtTOCSearch').show();
                    app.tableOfContentView.open();
                    $('#btnTableOfContent').addClass('toolBarButtonSelected');
                } else {
                    app.tagsView.close();
                    $('#btnTableOfContent').removeClass('toolBarButtonSelected');
                }
            }
        },
        showHideComments: function() {
            if (app.commentsView.isClosed()) {
                app.commentsView.open();
                $('#btnComments').addClass('toolBarButtonSelected');
            } else {
                app.commentsView.close();
                $('#btnComments').removeClass('toolBarButtonSelected');
            }
        },
        showHideSearch: function() {
            this.btnSearchClicked = !this.btnSearchClicked;
            if (this.btnSearchClicked) {
                $("#btnSearch").addClass("toolBarButtonSelected");
                $("#txtSearch").show();
                $("#txtSearch").animate({ width: "300" }, 200);
                $("#txtSearch").val('');
                $("#txtSearch").focus();
            } else {
                $('#btnSearch').removeClass("toolBarButtonSelected");
                $("#txtSearch").animate({ width: "0" }, 200, function() {
                    $("#txtSearch").hide();
                });
            }
        },
        logOut: function() {
        },
        txtSearchKeyDown: function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var tab = $("#bookletPanel").meshkatTab("getTabById", "111");
                if (tab === null) {
                    $("#bookletPanel").meshkatTab("addTab", "نتایج جستجو", app.searchView, "111");
                } else {
                    $("#bookletPanel").meshkatTab("selectTab", tab);
                    $(tab).data().view = app.searchView;
                }

                app.searchView.loadResult($("#txtSearch").val(), 0, 20);
                if (app.loadResult != undefined)
                    app.loadResult.allowLoadMore = true;
            }
        },
        toggleHighlightMode: function() {
            app.bookletView.highlightMode = !app.bookletView.highlightMode;
            if (app.bookletView.highlightMode) {
                if (app.bookletView.commentMode) {
                    $("#btnCommentMode").click();
                }
                $("#btnHighlight").addClass("toolBarButtonSelected");
            } else {
                $("#btnHighlight").removeClass("toolBarButtonSelected");
            }
        },
        ShowConfirmBookVolumeFileDialog: function() {
            app.confirmBookVolumeFileDialogView.ShowConfirmBookVolumeFileDialog();
        },
        showHideTags: function() {
            // show list of tags in the table of contents panel (East panel)
            if (app.tagsView.isClosed()) {
                app.tagsView.open();
                $('#btnTags').addClass('toolBarButtonSelected');
            } else {
                if ($('#btnTableOfContent').hasClass('toolBarButtonSelected')) {
                    $('#btnTableOfContent').removeClass('toolBarButtonSelected');
                    app.tagsView.open();
                    $('#btnTags').addClass('toolBarButtonSelected');
                } else if ($('#btnGraphs').hasClass('toolBarButtonSelected')) {
                    $('#btnGraphs').removeClass('toolBarButtonSelected');
                    $('#btn-add-graph').hide();
                    app.tagsView.open();
                    $('#txtTOCSearch').show();
                    $('#btnTags').addClass('toolBarButtonSelected');
                }else {
                    app.tagsView.close();
                    $('#btnTags').removeClass('toolBarButtonSelected');
                }
            }
        },
        showHideGraph: function () {
            // show list of tags in the table of contents panel (East panel)
            $('#btn-add-graph').show();
            if (app.graphsListView.isClosed()) {
                app.graphsListView.open();
                $('#btnGraphs').addClass('toolBarButtonSelected');
            } else {
                if ($('#btnTableOfContent').hasClass('toolBarButtonSelected')) {
                    $('#btnTableOfContent').removeClass('toolBarButtonSelected');
                    app.graphsListView.open();
                    $('#btnGraphs').addClass('toolBarButtonSelected');
                } else if ($('#btnTags').hasClass('toolBarButtonSelected')) {
                    $('#btnTags').removeClass('toolBarButtonSelected');
                    app.graphsListView.open();
                    $('#btnGraphs').addClass('toolBarButtonSelected');
                }else {
                    app.graphsListView.close();
                    $('#btnGraphs').removeClass('toolBarButtonSelected');
                }
            }
            /*if (app.graphView.isClosed()) {
                app.graphView.open();
                $('#btnGraphs').addClass('toolBarButtonSelected');
            } else {
                app.graphView.close();
                $('#btnGraphs').removeClass('toolBarButtonSelected');
            }*/
        },
        login: function (e) {
            e.preventDefault();
            $("#loginError").hide();
            showLoading();
            $.ajax({
                type: "POST",
                url: SSOServer+ "/token" ,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                data: { grant_type: 'password', client_id: 'MsktLib', UserName: $("#username").val(), Password: $("#password").val() },
                success:
                    function (data) {
                        hideLoading();
                        createCookie("token", "Bearer " + data.access_token, 1);
                        createCookie("username", $("#username").val(), 1);

                        $.ajax({
                            type: "GET",
                            url: "/Home/GetIdentity",
                            dataType: "json",
                            contentType: "application/json",
                            headers: { Authorization: readCookie("token") },
                            success:
                                function (data) {
                                    location.reload();
                                },
                            error: function (xhr, status, error) {
                                showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                                //$("#loginError").show();
                            }
                        });
                    },
                error: function (xhr, status, error) {
                    showMessage("خطا در برقراری اتصال. لطفا دوباره تلاش کنید.", messageList.ERROR_TITLE, "error", xhr.status);
                },
                cache: false
            });
        }
    });
})(jQuery);