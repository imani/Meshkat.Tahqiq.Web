var app = app || {};
$(function () {
    'use strict';
    app.AppRouter = Backbone.Router.extend({
        routes: {
            "category/:categoryId": "categoryLink",
            "home": "homeLink",
            "workspace": "workspaceLink",
            "workspaceNew": "workspaceNewLink",
            "workspace/:workspaceId": "workspaceOverviewLink",
            "workspace/:workspaceId/Books": "workspaceBooksLink",
            "workspace/:workspaceId/Graphs": "workspaceGraphsLink",
            "workspace/:workspaceId/Comments": "workspaceCommentsLink",
            "profile": "profileLink",
            "allBooks": "allBooksLink",
            "*actions": "homeLink"
        }
    });
    // Initiate the router
    app.app_router = new app.AppRouter;

    app.app_router.on('route:workspaceLink', function () {
        app.WorkspaceView.renderList();
    });

    app.app_router.on('route:homeLink', function () {
        if (readCookie("token") != null) {
            if (app.homeBlock != null) {
                $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/homeUser.html", ));
            }
        } else {
            if (app.homeData != null) {
                $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/homeGuest.html"));
                app.RecentBookView.render();
                app.CategoryView.render();
            }
        }
    });
    app.app_router.on('route:categoryLink', function (categoryId) {
        app.categoryId = categoryId;
        
        $.ajax({
            type: "GET",
            url: APIServer + "/Home/GetCategory",
            dataType: "json",
            data: { id:app.categoryId },
            contentType: "application/json",
            success: function (data) {
                app.category = new app.BookCategory(data);
                $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/categoryGuest.html", { category: app.category }));
                app.CategoryView.render();
            },
            error: function (xhr, status, error) {
                $("#Result").html(error);
            }
        });
    });

    app.app_router.on('route:profileLink', function () {
        $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/profile.html", {person: app.person}));
    });

    app.app_router.on('route:workspaceNewLink', function () {
        app.WorkspaceView.renderFormNew();
    });

    app.app_router.on('route:allBooksLink', function () {
        if (app.homeData != null) {
            $("#mainDiv").html(_.templateFromUrl("site/scripts/templates/allBooks.html"));
        }
    });

    app.app_router.on('route:workspaceOverviewLink', function (workspaceId) {
        if (app.homeData != null) {
            $.ajax({
                type: "GET",
                url: APIServer + "/Workspace/GetWorkspace",
                dataType: "json",
                data: { workspaceId: workspaceId },
                contentType: "application/json",
                success: function (data) {
                    app.workspace = new app.Workspace(data);
                    app.WorkspaceView.render();
                    //app.workspaceView = new app.WorkspaceView(app.workspace);
                },
                error: function (xhr, status, error) {
                    $("#Result").html(error);
                }
            });
        }
    });

    app.app_router.on('route:workspaceGraphsLink', function(workspaceId){
        if (app.homeData != null) {
            if (app.workspace != undefined && app.workspace.getWorkspaceId() === workspaceId) {
                app.workspaceGraphsView = new app.WorkspaceGraphsView(app.workspace);
            } else {
                $.ajax({
                    type: "GET",
                    url: APIServer + "/Workspace/GetWorkspace",
                    dataType: "json",
                    data: { workspaceId: workspaceId },
                    contentType: "application/json",
                    success: function (data) {
                        app.workspace = new app.Workspace(data);
                        app.workspaceGraphsView = new app.WorkspaceGraphsView(app.workspace);
                    },
                    error: function (xhr, status, error) {
                        $("#Result").html(error);
                    }
                });
            }
            
        }
    });

    app.app_router.on('route:workspaceBooksLink', function(workspaceId) {
        if (app.homeData != null) {
            if (app.workspace != undefined && app.workspace.getWorkspaceId() === workspaceId) {
                app.workspaceBooksView = new app.WorkspaceBooksView(app.workspace);
            } else {
                $.ajax({
                    type: "GET",
                    url: APIServer + "/Workspace/GetWorkspace",
                    dataType: "json",
                    data: { workspaceId: workspaceId },
                    contentType: "application/json",
                    success: function (data) {
                        app.workspace = new app.Workspace(data);
                        app.workspaceBooksView = new app.WorkspaceBooksView(app.workspace);
                    },
                    error: function (xhr, status, error) {
                        $("#Result").html(error);
                    }
                });
            }
            
        }
    });

    app.app_router.on('route:workspaceCommentsLink', function(workspaceId) {
        if (app.homeData != null) {
            if (app.workspace != undefined && app.workspace.getWorkspaceId() === workspaceId) {
                app.workspaceBooksView = new app.WorkspaceCommentsView(app.workspace);
            } else {
                $.ajax({
                    type: "GET",
                    url: APIServer + "/Workspace/GetWorkspace",
                    dataType: "json",
                    data: { workspaceId: workspaceId },
                    contentType: "application/json",
                    success: function (data) {
                        app.workspace = new app.Workspace(data);
                        app.workspaceBooksView = new app.WorkspaceCommentsView(app.workspace);
                    },
                    error: function (xhr, status, error) {
                        $("#Result").html(error);
                    }
                });
            }
            
        }
    });



    

    app.app_router.on('route:defaultRoute', function () {
        
    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
});

