var app = app || {};

$(function () {
    'use strict';
    app.AppRouter = Backbone.Router.extend({
        routes: {
            "workspace/:workspaceId/toc/:tocId": "workspaceLib",
            "workspace/:workspaceId/toc/:tocId/pg/:paragraphId": "workspaceLib",
            "volume/:volumeId/toc/:tocId": "volumeLib",
            "volume/:volumeId/toc/:tocId/pg/:paragraphId": "volume",
            "volume/:volumeId/toc/:tocId/paragraph/:paragraphId": "search",
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        }
    });
    // Initiate the router
    app.app_router = new app.AppRouter;

    app.app_router.on('route:workspaceLib', function (workspaceId, tocId, paragraphId) {
        app.userMode = "workspace";                
        app.userWorkspaceId = workspaceId;
        app.userVolumeId = -1;
        app.userTocId = tocId;
        app.userParagraphId = paragraphId;
        checkWorkspaceAccess();

        if (app.tableOfContentView == null) {
            app.tableOfContentView = new app.TableOfContentView();
        }
        if (tocId != null && tocId > 0) {
            if ($(".fancytree-rtl").length === 0) {
                $("#tableOfContentTree").find(".fancytree-container").attr("DIR", "RTL").addClass("fancytree-rtl");
            }
            app.tableOfContentView.selectNode(tocId);
        }
        
        if (app.currentWorkspace === undefined) {
            // get current workspace info
            $.ajax({
                type: "GET",
                url: "/Workspace/GetWorkspace",
                data: { workspaceId: app.userWorkspaceId },
                dataType: "json",
                success:
                    function (data) {
                        app.currentWorkspace = new app.Workspace(data);
                    },
                error: function (xhr, status, error) {
                    hideLoading();
                    $("#loginForm").show();
                    showMessage(error, "خطا در بازیابی اطلاعات کتابخانه", "error", xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        }
    });
    
    app.app_router.on('route:volumeLib', function (volumeId, tocId) {
        app.userMode = "volume";        
        app.userVolumeId = volumeId;
        app.userWorkspaceId = -1;
        app.userTocId = tocId;
        if (app.tableOfContentView == null) {
            app.tableOfContentView = new app.TableOfContentView();
        }
        if (tocId != null && tocId > 0) {
            app.tableOfContentView.selectNode(tocId);
        }
    });
    
    app.app_router.on('route:search', function (volumeId, tocId, paragraphId) {
        app.userMode = "search";
        app.userVolumeId = volumeId;
        app.userWorkspaceId = -1;
        app.userTocId = tocId;
        app.userParagraphId = paragraphId;
        if (app.tableOfContentView == null) {
            app.tableOfContentView = new app.TableOfContentView();
        }
        if (tocId != null && tocId > 0) {
            app.tableOfContentView.selectNode(tocId);
        }        
    });

    app.app_router.on('route:volume', function (volumeId, tocId, paragraphId) {
        app.userMode = "volume";
        app.userVolumeId = volumeId;
        app.userWorkspaceId = -1;
        app.userTocId = tocId;
        app.userParagraphId = paragraphId;
        if (app.tableOfContentView == null) {
            app.tableOfContentView = new app.TableOfContentView();
        }
        if (tocId != null && tocId > 0) {
            app.tableOfContentView.selectNode(tocId);
        }
    });

    app.app_router.on('route:defaultRoute', function (tocId) {
        if (tocId != null) {            
            app.tableOfContentView.selectNode(tocId);            
        }     
    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
});

function checkWorkspaceAccess() {
    if (app.currentPerson != undefined) {
        if (app.currentPerson.getWorkspaceThatAccess().indexOf(app.userWorkspaceId) === -1) {
            window.location = '/';
        }
    }
}

