var app = app || {};

(function ($) {
    'use strict';    
    // The Booklet Application View
    app.AppView = Backbone.View.extend({

        el: '#bookletApplication',

        initialize: function () {         
            // Initialize UI Views            
            //app.tableOfContentView = new app.TableOfContentView();            
            app.topBarView = new app.TopBarView();
            app.bookletView = new app.BookletView();
            app.commentsView = new app.CommentsView();
            app.searchView = new app.SearchView();
            app.timeoutView = new app.TimeoutView();
            app.editCommentView = new app.EditCommentView();
            app.tagsView = new app.TagsView();
            app.tagNameAndIds = [];
            
            
            

            
            //layout init
            $(this.el).layout({
                defaults: {
                    fxName: "slide",
                    fxSpeed: "medium",
                    spacing_closed: 0,
                    spacing_open: 0
                },
                north: {
                    resizable: false,
                    initHidden: false,
                },
            });
            $("#mainContent").layout({
                defaults: {
                    fxName: "slide",
                    fxSpeed: "medium",
                    spacing_closed: 0,
                    spacing_open: 0
                },
                east: {
                    size: "22%",
                    spacing_closed: 3,
                    spacing_open: 3,
                    initClosed:false
                },
                west: {
                    size: "22%",
                    spacing_closed: 0,
                    spacing_open: 0,
                    initClosed: false
                },
                south: {
                    size: "50%",
                    spacing_closed: 0,
                    spacing_open: 0,
                    initClosed: true
                }
            });
            
            // keydown event
            $(document).keydown(function (e) {
                e.which = e.which || e.keyCode || e.charCode || e.metaKey;
                if (e.which === 13 && app.timeoutView.isShowing()) {
                    app.timeoutView.gotoLogin();
                }
                app.bookletView.keyPressed(e.which);
            });
            this.loadUserInfo();                        
        },
        loadUserInfo: function () {
            showLoading();
            var cookie = readCookie("token");
            if (cookie == null || cookie == "") {
                hideLoading();
                $("#loginForm").show();
                return;
            }
            $.ajax({
                type: "GET",                
                url: "/Home/GetCurrentPerson",
                dataType: "json",
                success:
                    function (data) {
                        hideLoading();                        
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        $("#pnlUserInfo").show();
                        app.currentPerson = new app.Person(data);
                        $("#lblUserFullName").html(app.currentPerson.getPersonName() + " " + app.currentPerson.getPersonLastName());
                        $("#imgUser").attr("src", app.currentPerson.getPersonImagePath());
                        // if current person is guest User, change replace logout with login                        
                            
                    },               
                error: function (xhr, status, error) {
                    hideLoading();
                    $("#loginForm").show();
                    showMessage(error, messageList.error, "error",xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        }
    });
})(jQuery);
