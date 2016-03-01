var app = app || {};
$(function () {
    'use strict';
    app.AppRouter = Backbone.Router.extend({
        routes: {
            "toc/:tocId/paragraph/:paragraphId": "paragraphLink",
            "*actions": "defaultRoute" 
        }
    });
    // Initiate the router
    app.app_router = new app.AppRouter;

    app.app_router.on('route:paragraphLink', function (tocId, paragraphId) {
        app.paragraphId = paragraphId;
        if (tocId != null) {
            $("#btnRelationPanel").addClass("toolBarButtonSelected");
            $("#btnTableOfContentPanel").removeClass("buttonDisabled");
            //app.appContainerLayout.toggle("east");
            app.tableOfContentView.selectNode(tocId, paragraphId);
            $("#tableOfContentTree").find(".fancytree-container").attr("DIR", "RTL").addClass("fancytree-rtl");
        } else {
            app.appContainerLayout.toggle("east");
        }
    });

    app.app_router.on('route:defaultRoute', function (graphId) {
        app.appContainerLayout.hide("east");
    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
});

