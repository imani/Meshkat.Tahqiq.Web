var app = app || {};

(function ($) {
    'use strict';
    // Top bar view
    app.GraphTopBarView = Backbone.View.extend({
        el: '#GraphTopBar',
        pinned: true,
        events: {
            "click .btnGraphToolbar": "togglePan",
            "keydown .txt-zoomFactor": "updateZoomInput"
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            return this;
        },
        togglePan: function (e) {
            if ($(e.target).hasClass("toolBarButtonSelected")) {
                return;
            } else {
                $("#SelBox").hide();

                if ($(e.target).hasClass("btnPan")) {
                    //todo: activate pan tool in diagram
                    $(".btnGraphToolbar.toolBarButtonSelected").removeClass("toolBarButtonSelected");
                    $(e.target).addClass("toolBarButtonSelected");
                    app.graphView.diagram.activateTool("panTool");
                } else if ($(e.target).hasClass("btnPointer")) {
                    //todo: deactivate other tool
                    $(".btnGraphToolbar.toolBarButtonSelected").removeClass("toolBarButtonSelected");
                    $(e.target).addClass("toolBarButtonSelected");
                    diagram.deactivateTool();
                } else if ($(e.target).hasClass("btnZoomin")) {
                    //todo: change cursor and go to zoom in with click
                    var zoom = {
                        zoomFactor: 0.2,
                        zoomCommand: ej.datavisualization.Diagram.ZoomCommand.ZoomIn
                    };
                    diagram.zoomTo(zoom);
                    this.updateZoomInput();

                } else if ($(e.target).hasClass("btnZoomout")) {
                    //todo: change cursor and go to zoom out with click
                    var zoom = {
                        zoomFactor: 0.2,
                        zoomCommand: ej.datavisualization.Diagram.ZoomCommand.ZoomOut
                    };
                    diagram.zoomTo(zoom);
                    this.updateZoomInput();
                } else if ($(e.target).hasClass("btnZoomFit")) {
                    //todo: ZoomFit Diagram
                    diagram.fitToPage();
                } else if ($(e.target).hasClass("btnSort")) {
                    setAllNodesOffset();
                } else if ($(e.target).hasClass("btnUndo")) {
                    diagram.undo();
                } else if ($(e.target).hasClass("btnRedo")) {
                    diagram.redo();
                }
            }
        },
        updateZoomInput: function (e) {
            if (e !== undefined) {
                if (e.keyCode === 13) {

                    var zoom = {
                        zoomCommand: ej.datavisualization.Diagram.ZoomCommand.ZoomIn
                    };
                    zoom.zoomFactor = ($(e.target).val().match(/\d+/)[0] / (app.graphView.diagram._getCurrentZoom() * 100)) - 1;
                    app.graphView.zoomTo(zoom);
                } else {
                    return;
                }
            }
            //fill zoomFactor input
            var zoomPercentage = Math.round(app.graphView.diagram._getCurrentZoom() * 100);
            this.$el.find(".txt-zoomFactor").val("%" + zoomPercentage);
        }
    });
})(jQuery);