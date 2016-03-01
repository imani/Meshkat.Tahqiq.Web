var app = app || {};

(function ($) {
    'use strict';
    app.GraphView = Backbone.View.extend({
        el: '#graphPanel',
        events: {

        },
        initialize: function (graph) {
            this.model = graph;
            this.fillTypes(this.model.getGraphWorkspace(), $("#cboSelectSetType"));
        },
        render: function (graphId) {
            this.tplGraphDesigner = $("#tplGraphDesigner");
            $(this.el).html(_.template(this.tplGraphDesigner.html(), { graphId: 'diagram_' + graphId }));
            $(this.el).children(".graphToolbar").tooltip({
                position: { my: "middle top", at: "left bottom" },
                show: { effect: "slide", duration: 200, direction: "up" },
                tooltipClass: "topBarTooltip"
            });
            $(this.el).css('height', '100%');
            return this;
        },
        makeGraphDiagram: function (graphId) {
            $("#diagramPanel").append("<div id='diagram_" + app.graph.getGraphId() + "'></div>");
            this.render(graphId);
            var nodes = [];
            for (var i = 0; i < this.model.getGraphElements().length; i++) {
                var current_elem = this.model.getGraphElements().models[i];
                if (current_elem.getGraphElementIsRoot()) {
                    var newElm = {
                        "name": current_elem.getGraphElementName(),
                        constraints: ej.datavisualization.Diagram.NodeConstraints.Default &
                                    ~ej.datavisualization.Diagram.NodeConstraints.Rotate &
                                    ~ej.datavisualization.Diagram.NodeConstraints.Delete,
                        "fillColor": current_elem.getGraphElementColor(),
                        "borderColor": "transparent",
                        "displayCommentIcon": current_elem.getGraphElementComment() != "" ? true : false,
                        "displayRelationIcon": current_elem.getGraphElementSectionRelation() != null ? true : false,
                        "minWidth": 120,
                        "minHeight": 30,
                        "labels": [{
                            "text": current_elem.getGraphElementTitle(),
                            "name": current_elem.getGraphElementName() + "_label",
                            "wrapping": "wrap",
                            "margin": { "left": 5, "top": 5, "right": 5, "bottom": 5 },
                            "fontFamily": "BYekan",
                            "bold": true
                        }],
                        "ports": [{
                            "offset": { "x": 0, "y": 0.5 },
                            "name": current_elem.getGraphElementName() + "_p1",
                            "visibility": 2
                        }, {
                            "offset": { "x": 1, "y": 0.5 },
                            "name": current_elem.getGraphElementName() + "_p2",
                            "visibility": 2
                        }],
                        "branch": "Left",
                        "type": "basic",
                        "shape": "rectangle",
                        "cornerRadius": 5,
                        offsetX: current_elem.getGraphElementOffsetX(),
                        offsetY: current_elem.getGraphElementOffsetY()
                    };
                } else {
                    var newElm = {
                        "name": current_elem.getGraphElementName(),
                        constraints: ej.datavisualization.Diagram.NodeConstraints.Default,
                        "fillColor": current_elem.getGraphElementColor(),
                        "borderColor": "transparent",
                        "minWidth": 50,
                        "minHeight": 30,
                        "comment": current_elem.getGraphElementComment(),
                        "nodeType": current_elem.getGraphElementType() == null ? null : current_elem.getGraphElementType().GraphElementTypeId,
                        "displayCommentIcon": current_elem.getGraphElementComment() != "" ? true : false,
                        "displayRelationIcon": current_elem.getGraphElementSectionRelation() != null ? true : false,
                        "labels": [{
                            "text": current_elem.getGraphElementTitle(),
                            "name": current_elem.getGraphElementName() + "_label",
                            "wrapping": "wrap",
                            "margin": { "left": 5, "top": 5, "right": 5, "bottom": 2 },
                            "fontFamily": "BYekan",
                            "bold": true,
                            "offset": { "x": 0.5, "y": 0.6 }
                        },
                                {
                                    "text": current_elem.getGraphElementType() == null ? null : current_elem.getGraphElementType().GraphElementTypeLabel,
                                    "name": current_elem.getGraphElementName() + "_label2",
                                    "wrapping": "nowrap",
                                    "margin": { "left": 5, "top": 2, "right": 5, "bottom": 5 },
                                    "fontFamily": "Tahoma",
                                    "fontSize": 10,
                                    "fontColor": "green",
                                    "bold": true,
                                    "offset": { "x": 0.5, "y": 1.2 }
                                }],
                        "ports": [{
                            "offset": { "x": 0, "y": 1 },
                            "name": current_elem.getGraphElementName() + "_p1",
                            "visibility": 2
                        }, {
                            "offset": { "x": 1, "y": 1 },
                            "name": current_elem.getGraphElementName() + "_p2",
                            "visibility": 2
                        }],
                        "branch": "subLeft",
                        "type": "native",
                        "templateId": "svgTemplate",
                        offsetX: current_elem.getGraphElementOffsetX(),
                        offsetY: current_elem.getGraphElementOffsetY(),
                        sections: current_elem.getGraphElementSectionRelation() === null ? [] : current_elem.getGraphElementSectionRelation().getSections().models
                    };
                }
                nodes.push(newElm);
            }

            //render graph links
            var connectors = [];
            for (var j = 0; j < this.model.getGraphElementRelations().length; j++) {
                var relation = this.model.getGraphElementRelations().models[j];
                var Conn = {
                    "segments": [{ "type": "straight" }],
                    "name": relation.getGraphElementParent() + "_to_" + relation.getGraphElementChild(),
                    "sourceNode": relation.getGraphElementParent(),
                    "targetNode": relation.getGraphElementChild(),
                    "targetDecorator": { "shape": "arrow" },
                    "sourcePort": relation.getGraphElementParent() + "_p1",
                    "targetPort": relation.getGraphElementChild() + "_p2",
                    "lineColor": "gray",
                    constraints: ej.datavisualization.Diagram.ConnectorConstraints.Default &
                                ~ej.datavisualization.Diagram.ConnectorConstraints.DragSourceEnd
            };
                connectors.push(Conn);
            }
            this.diagram = initGraph(this, 'diagram_' + graphId, graphId, nodes, connectors);
            app.topBarView.updateZoomInput();

            //render icons
            for (var i = 0; i < this.diagram.nodes().length; i++) {
                var n = this.diagram.nodes()[i];
                if (n.displayCommentIcon) {
                    $("div#" + n.name).append("<i class='fa fa-comment' onclick='alert('hi')' style='position: absolute;bottom: -20px;right: 0px;'></i>");
                }
                if (n.displayRelationIcon) {
                    $("div#" + n.name).append("<i class='fa fa-link' onclick='alert('hi')' style='position: absolute;bottom: -20px;left: 0px;'></i>");
                    $("div#" + n.name).click(showRelationsList);
                }
            }
            
            $("#graphPanel").height($(window).height() - $("#GraphTopBar").height());
        },
    
        save: function () {
            var flag = true;
            var runSave = true;

            if (sendEventLogs) {
                runSave = true;
                showServerErrorMessage = true;
            } else {
                runSave = false;
                if (showServerErrorMessage) {
                    showServerErrorMessage = false;
                    //alert('مشکلی در سرور رخ داده. لطفاً بعدا تلاش نمایید');
                    

                    var cookie = readCookie("token");
                    if (cookie == null || cookie == "") {
                        $("#userPanel-modal").modal('show');
                    } 
                }
            }

            if (eventsSend.length > 0 && runSave) {
                var graph = new app.Graph();
                graph.setGraphId(graphId);
                graph.setGraphChangeEvents(eventsSend);

                $.ajax({
                    type: "POST",
                    url: "/Graph/ApplyGraphEvents",
                    data: JSON.stringify({ Graph: graph }),
                    dataType: "json",
                    success: function (data) {
                        $(".error-message").text("تغییرات با موفقیت اعمال شد");
                        eventsSend.length = 0;
                        sendEventLogs = true;
                    },
                    error: function (xhr, status, error) {
                        flag = false;
                        sendEventLogs = false;
                        $(".error-message").text("مشکلی در اطلاعات وجود دارد. لطفا مجدد تلاش کنید.");
                        $("#editProfileError").show();
                    },
                    //contentType: "application/x-www-form-urlencoded",
                    contentType: "application/json; charset=utf-8",
                    cache: false
                });
            }
            if (flag) {
                self = this;
                setTimeout(function () { self.save(); }, 5000);
            }
        },

        fillTypes: function (workspaceId, el) {
            $(el).html("");
            $.ajax({
                type: "GET",
                url: "/Graph/GetWorkspaceGraphType",
                dataType: "json",
                data: { "workspaceId": workspaceId },
                success:
                    function (data) {
                        if (!CheckServiceResultIsSuccess(data)) {
                            return;
                        }
                        var elementTypeList = data;
                        if (elementTypeList !== null) {
                            for (var i = 0; i < elementTypeList.length; i++) {
                                var option = $('<option>', {
                                    value: elementTypeList[i].GraphElementTypeId,
                                    text: elementTypeList[i].GraphElementTypeLabel
                                });


                                //$(option).data('typeColor', elementTypeList[i].BookCommentTypeColor);
                                //$(option).data('commentFields', elementTypeList[i].BookCommentFields);
                                $(el).append(option);
                            }
                        } else {
                            $(el).parent().hide();
                        }


                    },
                error: function (xhr, status, error) {
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                    hideLoading();
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
            return el;
        },
        togglePointer: function(e) {
        
        }
    });
})(jQuery);