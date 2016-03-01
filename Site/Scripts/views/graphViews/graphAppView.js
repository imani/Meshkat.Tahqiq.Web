var app = app || {};

(function ($) {
    'use strict';
    // The Booklet Application View
    app.GraphAppView = Backbone.View.extend({
        el: 'body',        
        events: {
            "click #btnRelationPanel": "toggleRelationPanel",
            "click #btnTableOfContentPanel": "toggleTOCPanel"          
        },

        initialize: function () {
            //graph page layout
            $("body").layout({
                spacing_closed: 0,
                spacing_open: 0,
                fxName: "slide",
                fxSpeed: "medium",
                
                east__size: 35     
            });

            app.appContainerLayout = $("#graphAppContainer").layout({
                resizable: true,
                slidable: true,
                fxName: "slide",
                fxSpeed: "medium",
                east__size: "4%",
                east__initClosed: false,
                east__fxName_close: "none"
            });

            app.linkPanelLayout = $("#linkPanel").layout({
                fxName: "slide",
                fxSpeed: "medium",
                east__size: "40%",
                east__initClosed: false,
                east__resizable: true,
                east__slidable: true
            });

            app.diagramContainerLayout = $("#diagramContainer").layout({
                pacing_closed: 0,
                spacing_open: 0,
                fxName: "slide",
                fxSpeed: "medium",
                north__size: 35
            });
            // Initialize UI Views 
            app.topBarView = new app.GraphTopBarView();
            app.graphBookView = new app.GraphBookView();

            app.graphView = new app.GraphView(app.graph);
            app.graphView.makeGraphDiagram(app.graph.getGraphId());

            app.addRelationPopupView = new app.AddRelationPopupView();
            app.tableOfContentView = new app.GraphTocView();

            /*this.$el.click(function(e) {
                $(".Meshkat-highlighted").removeClass("Meshkat-highlighted");
            });*/
            app.appContainerLayout.sizePane("east", "40%");
        },
        toggleRelationPanel: function() {
            if (app.appContainerLayout.state.east.isClosed) {
                if (app.appContainerLayout.east.options.size === "4%")
                    app.appContainerLayout.sizePane("east", "40%");
                app.appContainerLayout.toggle("east");
                $("#btnRelationPanel").addClass("toolBarButtonSelected");
                $("#btnTableOfContentPanel").removeClass("buttonDisabled");
            } else {
                app.appContainerLayout.toggle("east");
                $("#btnRelationPanel").removeClass("toolBarButtonSelected");
                $("#btnTableOfContentPanel").addClass("buttonDisabled");
            }
        },
        toggleTOCPanel: function () {
            app.linkPanelLayout.toggle("east");
        }
    });
})(jQuery);
