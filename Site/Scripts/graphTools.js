var sendEventLogs = true;
var showServerErrorMessage = true;
var eventsSend = [];
var root = null;
var diagram;
var deleting = false;
var newNodeAdd = false;
var NodeColorClick = false;
var NodeTypeClick = false;
var NodeCommentClick = false;
var nodes = [];
var connectors = [];
var graphId;
var graphElm = null;
var selNodes = [];
var OffsetHeight = 80;
var OffsetWidth = 100;
var ClipboardNodeConn=null;
var IsFinish;
var LastSelectNode = null;
var PreLastSelectNode = null;

function addEvent(newEvent) {
    eventsSend.push(newEvent);
    //console.log(newEvent);
}

function initGraph(ref, _graphElm, _graphId, _nodes, _connectors) {
    IsFinish = false;
    graphElm = _graphElm;
    nodes = _nodes;
    root = nodes[0];
    connectors = _connectors;
    graphId = _graphId;
    var userHandles = [];
    createUserHandles(userHandles);

    if (!(ej.browserInfo().name === "msie" && Number(ej.browserInfo().version) < 9)) {
        diagram = $("#" + graphElm).ejDiagram({
            connectors: connectors,
            nodes: nodes,
            width: $(graphElm).width(),
            height: $(graphElm).height(),
            selectedItems: {
                userHandles: userHandles,
            },
            drawingTools: {
                textTool: ej.datavisualization.Diagram.TextTool(),
            },
            commandManager: {
                commands: {
                    "copy": {
                        canExecute: copying,
                    }
                }
            },
            nodeCollectionChange: nodecollectionchanged,
            drag: nodeDragging,
            selectionChange: selectionChanged,
            textChange: labelChanged,
            pageSettings: { scrollLimit: "infinity" },
            snapSettings: { "snapConstraints": ej.datavisualization.Diagram.SnapConstraints.None },
            enableContextMenu: false
        });
        diagram = $("#" + graphElm).ejDiagram("instance");
        //updateLeftSideMap(diagram);
        //updateRightSideMap(diagram);
        updateLabels();
        
        $.contextMenu({
            selector: '.ej-d-node',
            trigger: 'right',
            callback: function (key, options) {
                switch(key) {                    
                    case "copy":
                        diagram.copy();
                        break;
                    case "undo":
                        diagram.undo();
                        break;
                    case "redo":
                        diagram.redo();
                        break;
                    case "selectAll":
                        diagram.selectAll();
                        break;
                    case "comment":
                        showCommentBox();
                        break;
                    case "pallete":
                        showPalleteBox();
                        break;
                    case "setType":
                        showSetTypeBox();
                        break;
                }
            },
            items: {
                "copy": { name: "نسخه برداری", icon: "" },
                "undo": { name: "لغو تغییرات", icon: "" },
                "redo": { name: "بازگشت به تغییرات", icon: "" },
                "selectAll": { name: "انتخاب همه", icon: "" },
                "sep1": "---------",
                "setType": { name: "تعیین نوع", icon: "" },
                "comment": { name: "یادداشت", icon: "" },
                "pallete": { name: "رنگ بندی", icon: "" }
            }
        });

        $("#colorpalette").click(function(evt) {
            NodeColorClick = true;
            var color = evt.target.style.backgroundColor;
            var diagram = $("#" + graphElm).ejDiagram("instance");
            applyBackground(color, diagram.selectionList[0]);
        });
        $("#btnSelectSetType").click(function (evt) {
            var diagram = $("#" + graphElm).ejDiagram("instance");
            var target = diagram.selectionList[0];
            if (!target.segments) {
                diagram.updateLabel(target.name, target.labels[1], { "text": $("#cboSelectSetType option:selected").text() });
                getNodeFromDiagram(target.name).nodeType = $("#cboSelectSetType option:selected").val();
                addEvent({ name: "NodeTypeChange", val1: target.name, val2: $("#cboSelectSetType").val() });
                $("#divSetType").slideUp();
            }
        });
        $("#btnSelectComment").click(function (evt) {
            var diagram = $("#" + graphElm).ejDiagram("instance");
            var target = diagram.selectionList[0];
            if (!target.segments) {
                getNodeFromDiagram(target.name).comment = $("#txtSetComment").val();
                addEvent({ name: "NodeCommentChange", val1: target.name, val2: $("#txtSetComment").val() });
                $("#img_" + target.name).show();
                $("#divSetComment").slideUp();
                $("#relationsList").slideUp();
            }
        });
        $("#btnUnSelectComment").click(function (evt) {
            var diagram = $("#" + graphElm).ejDiagram("instance");
            var target = diagram.selectionList[0];
            if (!target.segments) {
                getNodeFromDiagram(target.name).comment = "";
                $("#txtSetComment").val("");
                addEvent({ name: "NodeCommentChange", val1: target.name, val2: "" });
                $("#img_" + target.name).hide();
                $("#divSetComment").slideUp();
                $("#relationsList").slideUp();
            }
        });

        $(ref.el).keydown(function(e) {
            if (diagram.selectionList.length > 0) {
                if (e.keyCode == 9) { //tab key pressed
                    e.preventDefault();
                    e.stopPropagation();
                    if (diagram.selectionList[0].branch == "root")
                        var type = "left";
                    else
                        var type = "subleft";

                    var _node = (diagram.selectionList[0].inEdges != undefined) ?
                            diagram.selectionList[0]:
                            diagram.nameTable[LastSelectNode.name];

                    var node = addNode(_node, type, "Node", "rgb(30, 30, 113)");
                    var conn = connect(_node, node);
                    node = diagram.nameTable[node.name];
                    applyBackground(node.fillColor, node);
                    diagram.activeTool.activeLabel = null;
                    editLabel(node);
                } else if (!e.shiftKey && e.keyCode == 13) { //Enter key pressed
                    if (diagram.selectionList[0].branch !== "root") {
                        var edge = (diagram.selectionList[0].inEdges != undefined) ?
                            diagram.nameTable[diagram.selectionList[0].inEdges[0]] :
                            diagram.nameTable[LastSelectNode.inEdges[0]];
                        var parentNode = diagram.nameTable[edge.sourceNode];
                        if (parentNode.branch == "root")
                            var type = "left";
                        else
                            var type = "subleft";
                        var node = addNode(parentNode, type, "Node", "rgb(30, 30, 113)");
                        var conn = connect(parentNode, node);
                        node = diagram.nameTable[node.name];
                        applyBackground(node.fillColor, node);
                        LastSelectNode = node;
                        diagram.activeTool.activeLabel = null;
                        editLabel(node);
                    }
                } else if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    e = e || window.event; // IE support
                    var c = e.keyCode;
                    var ctrlDown = e.ctrlKey || e.metaKey; // Mac support

                    if (ctrlDown && c == 67) { //ctrl + c
                        if (diagram.selectionList[0].type != "basic") {
                            ClipboardNodeConn = diagram.selectionList[0].inEdges[0];
                        }
                    } else if (ctrlDown && c == 86) { //ctrl + v
                        if (ClipboardNodeConn == null) {
                            //for root node only
                            diagram.selectionList[0].constraints = ej.datavisualization.Diagram.NodeConstraints.Default;
                            diagram.remove(diagram.selectionList[0]);
                        }

                        if (ClipboardNodeConn != null) {
                            diagram.remove(diagram.selectionList[0]);
                            var _conn = getConnFromDiagram(ClipboardNodeConn);
                            addEvent({ name: "changeConnector", val1: _conn.name, val2: _conn.sourceNode + "," + PreLastSelectNode.name, val3: _conn.targetNode + "," + _conn.targetNode });
                            _conn.sourceNode = PreLastSelectNode.name;
                            _conn.sourcePort = PreLastSelectNode.name + "_p1";
                            _conn.sourcePoint.y = PreLastSelectNode.offsetY;
                            _conn.sourcePoint.x = PreLastSelectNode.offsetX;
                            setAllNodesOffset();
                            ClipboardNodeConn = null;
                        } else {
                            var clp = $("#paste-target").val();
                            if (clp != "") {
                                var newNodes = calcNodeBranchesFromClipboard(clp);
                                generateNodes(newNodes[0], diagram.selectionList[0]);
                                setAllNodesOffset();
                            }
                        }
                    } else if (ctrlDown && c == 88) { //ctrl + x

                    }
                } else {
                    if (LastSelectNode != null) {
                        var node = LastSelectNode;
                        if (node.labels.length > 0)
                            if (node.labels[0].mode == "view")
                                editLabel(node);
                    }
                }
            }
        });

        setTimeout(ref.save(), 5000);
        //diagram.fitToPage();
        if (!isGraphOwner)
            diagram.activateTool("panTool");

        return diagram;
    } else {
        alert("Diagram will not be supported in IE Version < 9");
    }
    IsFinish = true;
}

function copying(args) {
    var node = args.model.selectedItems.children[0];
    if (node.branch == "root") {
        return false;
    }
    else {
        return true;
    }
}

function calcNodeBranchesFromClipboard(clp) {
    var txt = clp.split(/\t/);
    var nodeBranches = [];
    var nodeLevels = [];
    var lastNode = null;
    var currentNodeLevel = 0;
    var lastNodeLevel = 0;

    nodeBranches.push({ "text": txt[0], "type": "root","offsetX":"0","offsetY":"0", "branches": [] });
    lastNode = nodeBranches[0];
    nodeLevels[0] = lastNode;
    for (var i = 0; i < 20; i++)
        nodeLevels.push({ "text": "", "type": "", "offsetX": "0", "offsetY": "0", "branches": [] });

    for (var i = 1; i < txt.length; i++) {
        if (txt[i] == "") {
            currentNodeLevel++;
        } else {
            if (currentNodeLevel == lastNodeLevel) {    //add brother
                nodeLevels[currentNodeLevel].branches.push({ "text": txt[i], "type": "childs", "offsetX": "0", "offsetY": "0", "branches": [] });
                var n = nodeLevels[currentNodeLevel].branches.length;
                lastNode = nodeLevels[currentNodeLevel].branches[n - 1];
            } else if (currentNodeLevel == lastNodeLevel + 1) { //add child
                lastNode.branches.push({ "text": txt[i], "type": "childs", "offsetX": "0", "offsetY": "0", "branches": [] });
                var n = lastNode.branches.length;
                lastNode = lastNode.branches[n - 1];
            } else if (currentNodeLevel < lastNodeLevel) {  //add child for last node of currentNodeLevel-1
                nodeLevels[currentNodeLevel].branches.push({ "text": txt[i], "type": "childs", "offsetX": "0", "offsetY": "0", "branches": [] });
                var n = nodeLevels[currentNodeLevel ].branches.length;
                lastNode = nodeLevels[currentNodeLevel ].branches[n - 1];
            }
            nodeLevels[currentNodeLevel + 1] = lastNode;
            lastNodeLevel = currentNodeLevel;
            currentNodeLevel = 0;
        }
    }
    return nodeBranches;
}
function generateNodes(obj, SelectNode) {
    var node = addNode(SelectNode, "", obj.text, obj.fill);
    if (obj.type == "root") {
        connect(SelectNode, node);
    }
    for (var i = 0; i < obj.branches.length; i++) {
        var child = generateNodes(obj.branches[i], obj);
        connect(node, child);
    }
    return node;
}

function nodeDragging(args) {
    if (args.element.children != undefined) {
        selNodes = [];
        for (var i = 0; i < args.element.children.length; i++) {
            if (args.element.children[i].indexOf("_to_") == -1) {
                selNodes.push(getNodeFromDiagram(args.element.children[i]));
            }
        }
    }
}


function setAllNodesOffset() {
    var rootNode = getNodeFromDiagram(root.name);
    setNodesOffset(rootNode.offsetY - getNodeHeight(rootNode) / 2, rootNode.offsetX - rootNode._width - OffsetWidth, rootNode);

    var diagram = $("#" + graphElm).ejDiagram("instance");
    diagram._updateNodes();
    diagram._updateConnectors();
}
function setNodesOffset(baseOffsetY, baseOffsetX, _node) {
    var childNodes = getChildNodes(_node);
    var _baseOffsetY = baseOffsetY;
    var diagram = $("#" + graphElm).ejDiagram("instance");
    for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node != null) {
            if (node.offsetY != _baseOffsetY + getNodeHeight(node) / 2 || node.offsetX != baseOffsetX - node._width / 2) {
                addEvent({ name: "changeNodeLocation", val1: node.name, val2: baseOffsetX - node._width / 2, val3: _baseOffsetY + getNodeHeight(node) / 2 });
            }
            node.offsetY = _baseOffsetY + getNodeHeight(node) / 2;
            node.offsetX = baseOffsetX - node._width / 2;

            var conn = $.grep(diagram.connectors(), function (e) { return e.sourceNode == _node.name && e.targetNode == node.name });
            if (conn.length > 0) {
                conn[0].sourcePoint.y = _node.offsetY + _node._height / 2 - (_node.type == "basic" ? 15 : 0);
                conn[0].sourcePoint.x = _node.offsetX - _node._width / 2;
                conn[0].targetPoint.y = node.offsetY + node._height / 2;
                conn[0].targetPoint.x = node.offsetX + node._width / 2;
            }

            _baseOffsetY = node.offsetY + getNodeHeight(node) / 2;
            setNodesOffset(node.offsetY - getNodeHeight(node) / 2, node.offsetX - node._width - OffsetWidth, node);
        }
    }
}
function getNodeHeight(_node) {
    var th = 0;
    var childNodes = getChildNodes(_node);
    for (var i = 0; i < childNodes.length; i++) {
        if (getChildNodes(childNodes[i]).length > 0) {
            th = th + getNodeHeight(childNodes[i]);
        }
    }
    if (childNodes.length > 0) {
        th = th + (childNodes.length) * OffsetHeight;
    } else {
        th = th + OffsetHeight;
    }
    return th;
}
function getChildNodes(node) {
    var childNodes = [];
    var diagram = $("#" + graphElm).ejDiagram("instance");
    var conn = diagram.connectors();
    if (node!=null)
        for (var i = 0; i < conn.length; i++) {
            if (conn[i].sourceNode == node.name)
                childNodes.push(getNodeFromDiagram(conn[i].targetNode));
        }
    return childNodes;
}


function addNode(node, type, text, fill) {
    setAllNodesOffset();
    var lastChild = getLastChild(node);
    var _offsetY = lastChild == null ? node.offsetY : lastChild.offsetY + OffsetHeight;
    var _offsetX = lastChild == null ? node.offsetX - node._width - OffsetWidth : lastChild.offsetX;
    _offsetY = isNaN(_offsetY) ? 0 : _offsetY;
    _offsetX = isNaN(_offsetX) ? 0 : _offsetX;

    var name = ej.datavisualization.Diagram.Util.randomId();
    var constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.Rotate);
    if (type == "root") {
        constraints = constraints & ~ej.datavisualization.Diagram.NodeConstraints.Delete;
    }

    var margin1 = { "left": 5, "top": 5, "right": 5, "bottom": 2 };
    var margin2 = { "left": 5, "top": 2, "right": 5, "bottom": 5 };
    var node = {
        name: name,
        constraints: constraints,
        fillColor: fill || "white",
        borderColor: "transparent",
        offsetX: _offsetX,
        offsetY: _offsetY,
        "displayCommentIcon": "none",
        "displayRelationIcon": "none",
    };
    node.minWidth = 50;
    node.minHeight = 30;
    node.labels = [
        {
            "text": text,
            "name": name + "_label1",
            "wrapping": "wrap",
            "margin": margin1,
            "fontFamily": "BYekan",
            "bold": true,
            "mode": "view"
        },
        {
            "text": "",
            "name": name + "_label2",
            "wrapping": "nowrap",
            "margin": margin2,
            "fontFamily": "Tahoma",
            "bold": false
        }
    ];
    node.branch = type;
    node.ports = [];
    if (type == "right" || type == "left" || type == "root") {
        node.ports.push(getport(name + "_p1", 0, 0.5));
        node.ports.push(getport(name + "_p2", 1, 0.5));
        node.shape = "rectangle";
        node.cornerRadius = 5;
    }
    else {
        node.ports.push(getport(name + "_p1", 0, 1));
        node.ports.push(getport(name + "_p2", 1, 1));
        node.type = "native";
        node.templateId = "svgTemplate";
    }
    nodes.push(node);
    this.diagram.add(node);
    addEvent({ name: "addNode", val1: text, val2: name, val3: _offsetX+","+_offsetY });
    newNodeAdd = true;
    setAllNodesOffset();

    return node;
}
function connect(tail, head) {
    if (tail != null && head != null) {
        var conn = {};
        conn.segments = [{ "type": "straight" }];
        conn.constraints = ej.datavisualization.Diagram.ConnectorConstraints.Default;
        conn.name = tail.name + "_to_" + head.name;
        conn.targetNode = head.name;
        conn.sourceNode = tail.name;
        conn.targetDecorator = { "shape": "arrow" };
        if (head.branch == "right" || head.branch == "subright") {
            conn.sourcePort = tail.ports[1].name;
            conn.targetPort = head.ports[0].name;
        } else if (head.branch == "left" || head.branch == "subleft") {
            conn.sourcePort = tail.ports[0].name;
            conn.targetPort = head.ports[1].name;
        }
        connectors.push(conn);
        this.diagram.add(conn);
        addEvent({ name: "addConnector", val1: tail.name, val2: head.name });
        return conn;
    }
}
function getport(name, offsetx, offsety) {
    var offset = { x: offsetx, y: offsety };

    var port = { "offset": offset, "name": name, visibility: ej.datavisualization.Diagram.PortVisibility.Hidden };
    return port;
}


function getLastChild(node) {
    lastChildName = null;
    for (var i = 0; i < connectors.length ; i++) {
        if (connectors[i].sourceNode == node.name)
            lastChildName = connectors[i].targetNode;
    }
    return getNodeFromDiagram(lastChildName);
}
function getNode(nodeName) {
    node = null;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name == nodeName)
            node = nodes[i];
    }
    return node;
}
function getNodeFromDiagram(nodeName) {
    var diagram = $("#" + graphElm).ejDiagram("instance");
    var node = $.grep(diagram.nodes(), function (e) { return e.name == nodeName });
    return node[0];
}
function getConn(connName) {
    var conn = null;
    for (var i = 0; i < connectors.length; i++) {
        if (connectors[i].name == connName)
            conn = connectors[i];
    }
    return conn;
}
function getConnFromDiagram(connName) {
    var diagram = $("#" + graphElm).ejDiagram("instance");
    var _conn = $.grep(diagram.connectors(), function (e) { return e.name == connName });
    return _conn[0];
}
function updateConn(connName, sourceNode) {
    var index = 0;
    for (var i = 0; i < connectors.length; i++) {
        if (connectors[i].name == connName)
            index = i;
    }
    connectors[index].sourceNode = sourceNode;
    connectors[index].name = sourceNode.name + "_to_" + connectors[index].targetNode.name;
}

function updateLabels() {
    var diagram = $("#" + graphElm).ejDiagram("instance");
    for (var i = 0; i < diagram.nodes().length; i++) {
        var node = diagram.nodes()[i];
        if (IsFinish)
            labelChanged({ "element": node, "value": node.labels[0].text }, true);
        applyBackground(node.fillColor, node);
    }
}
/*function updateRightSideMap(diagram) {
    if (diagram) {
        if (diagram.model.layout) {
            //right side layout
            for (var i = 0; i < diagram.nodes().length; i++) {
                var node = diagram.nodes()[i];
                if (node.branch == "right" || node.branch == "subright" || node.branch == "root")
                { node.excludeFromLayout = false; }
                else
                { node.excludeFromLayout = true; }
            }
            diagram.model.layout.orientation = "lefttoright";
            diagram.layout();

        }
    }
}
function updateLeftSideMap(diagram) {
    if (diagram) {
        if (diagram.model.layout) {
            //left side layout
            for (var i = 0; i < diagram.nodes().length; i++) {
                var node = diagram.nodes()[i];
                if (node.branch == "left" || node.branch == "subleft" || node.branch == "root")
                { node.excludeFromLayout = false; }
                else
                { node.excludeFromLayout = true; }
            }
            diagram.model.layout.orientation = "righttoleft";
            diagram.layout();

        }
    }
}*/

function nodecollectionchanged(evt) {
    //console.log('nodecollectionchanged');
    if (!evt.element.segments) {
        if (evt.changeType === "remove" && !deleting) {
            var diagram = $("#" + graphElm).ejDiagram("instance");
            deleting = true;
            deleteLayoutChilds(evt.element, diagram, true);
            for (var j = 0; j < evt.element.inEdges.length; j++) {
                var conn = diagram.nameTable[evt.element.inEdges[j]];
                //ej.datavisualization.Diagram.Util.removeItem(conn.sourceNode.outEdges, conn);
                diagram.remove(conn);
                //evt.element.inEdges.remove(conn);
            }
            deleting = false;
            /*if (diagram.nodes().length > 0) {
                if (diagram.model.layout) {
                    var node = evt.element;
                    if (node.branch == "right" || node.branch == "subright")
                        updateRightSideMap(diagram);
                    if (node.branch == "left" || node.branch == "subleft")
                        updateLeftSideMap(diagram);
                }
            }*/
        }
    }
}

/*function drawSelectionArea(selectedNodes) {
    if (selectedNodes.length > 1) {
        var x, y, w, h, i;
        x = selectedNodes[0].offsetX - selectedNodes[0]._width / 2;
        y = selectedNodes[0].offsetY;
        w = selectedNodes[0]._width;
        h = selectedNodes[0]._height;
        for (i = 0; i < selectedNodes.length; i++) {
            x = selectedNodes[i].offsetX - selectedNodes[i]._width / 2 < x ? selectedNodes[i].offsetX - selectedNodes[i]._width / 2 : x;
            y = selectedNodes[i].offsetY < y ? selectedNodes[i].offsetY : y;
        }
        for (i = 0; i < selectedNodes.length; i++) {
            w = selectedNodes[i].offsetX + selectedNodes[i]._width > w ? selectedNodes[i].offsetX + selectedNodes[i]._width : w;
            h = selectedNodes[i].offsetY + selectedNodes[i]._height > h ? selectedNodes[i].offsetY + selectedNodes[i]._height : h;
        }
        var diagram = $("#" + graphElm).ejDiagram("instance");
        w = (w + 100-x) * diagram._getCurrentZoom() ;
        h = (h + 180-y) * diagram._getCurrentZoom() +20;
        x = (x - 80) * diagram._getCurrentZoom() - diagram._hScrollOffset;
        y = (y - 40) * diagram._getCurrentZoom() - diagram._vScrollOffset;
        //console.log(x + '-' + y + '-' + w + '-' + h);
        $("#SelBox-left").css({
            top: (y) + "px",
            left: (x) + "px",
            width: "0px",
            height: (h) + "px"
        });
        $("#SelBox-right").css({
            top: (y) + "px",
            left: (x + w) + "px",
            width: "0px",
            height: (h) + "px"
        });
        $("#SelBox-top").css({
            top: (y) + "px",
            left: (x) + "px",
            width: (w) + "px",
            height: "0px"
        });
        $("#SelBox-bottom").css({
            top: (y + h) + "px",
            left: (x) + "px",
            width: (w) + "px",
            height: "0px"
        });
        $("#SelBox").show();
    }
}*/
function setEventForMovedNodes(movedNodes) {
    var diagram = $("#" + graphElm).ejDiagram("instance");

    for (var i = 0; i < movedNodes.length; i++) {
        if (movedNodes[i]!=undefined && movedNodes[i].name != "") {
            var result = $.grep(nodes, function(e) { return e.name == movedNodes[i].name && e.offsetX == movedNodes[i].offsetX && e.offsetY == movedNodes[i].offsetY });
            var res = $.grep(nodes, function(e) { return e.name == movedNodes[i].name });
            if (result.length == 0 && res.length > 0) {
                addEvent({ name: "changeNodeLocation", val1: movedNodes[i].name, val2: movedNodes[i].offsetX, val3: movedNodes[i].offsetY });
                var node = getNode(movedNodes[i].name);
                nodes.offsetX = movedNodes[i].offsetX;
                nodes.offsetY = movedNodes[i].offsetY;
            }
        }
    }
    movedNodes = [];
}

function selectionChanged(evt) {
    var diagram = $("#" + graphElm).ejDiagram("instance");
    $("#colorpalette").slideUp();
    $("#divSetType").slideUp();
    $("#divSetComment").slideUp();
    $("#relationsList").slideUp();
    $("#SelBox").hide();
    setEventForMovedNodes(selNodes);

    //console.log(diagram.getObjectType(evt.element));
    if (diagram.getObjectType(evt.element) == "connector") {
        for (var i = 0; i < connectors.length; i++) {
            var result = $.grep(diagram.connectors(), function(e) { return e.name == connectors[i].name });
            if (result.length == 0) {
                //console.log('remove connector ' + connectors[i].name);
                addEvent({ name: "removeConnector", val1: connectors[i].name, val2: connectors[i].sourceNode, val3: connectors[i].targetNode });
                connectors[i].name = "";
            } else {
                var result1 = $.grep(diagram.connectors(), function(e) { return e.name == connectors[i].name && e.sourceNode == connectors[i].sourceNode && e.targetNode == connectors[i].targetNode })
                if (result1.length == 0) {
                    //console.log('change connector ' + connectors[i].name);
                    //console.log(result);
                    addEvent({ name: "changeConnector", val1: result.name, val2: connectors[i].sourceNode + "," + result[0].sourceNode, val3: connectors[i].targetNode + "," + result[0].targetNode });
                    connectors[i].sourceNode = result[0].sourceNode;
                    connectors[i].targetNode = result[0].targetNode;
                }
            }
        }
    } else if (diagram.getObjectType(evt.element) == "node") {
        for (var i = 0; i < nodes.length; i++) {
            var result = $.grep(diagram.nodes(), function(e) { return e.name == nodes[i].name && e.offsetX == nodes[i].offsetX && e.offsetY == nodes[i].offsetY });
            var res = $.grep(diagram.nodes(), function(e) { return e.name == nodes[i].name });
            if (result.length == 0 && res.length > 0) {
                //console.log('change node location ' + nodes[i].name);
                addEvent({ name: "changeNodeLocation", val1: nodes[i].name, val2: res[0].offsetX, val3: res[0].offsetY });
                nodes[i].offsetX = res[0].offsetX;
                nodes[i].offsetY = res[0].offsetY;
            }
        }
    }

    if (evt.changeType == "insert") {

        if (evt.element.type == "connector") {
            diagram.model.selectedItems.userHandles[0].visible = false;
        }
        else {
            diagram.model.selectedItems.userHandles[0].visible = true;
        }


        if (!evt.element.segments) {
            var node = evt.element;
            var lefthandle, righthandle, deleteHandle;
            for (var i = 0; i < diagram.model.selectedItems.userHandles.length; i++) {
                var handle = diagram.model.selectedItems.userHandles[i];
                if (handle.name == "leftExtendHandle") {
                    lefthandle = handle;
                } else {
                    /*if (handle.name == "rightExtendHandle") {
                        righthandle = handle;
                    } else */if (handle.name == "deleteHandle") {
                        deleteHandle = handle;
                    }
                }

            }
            if (node.branch == "root") {
                if (deleteHandle)
                    ej.datavisualization.Diagram.Util.removeItem(diagram.model.selectedItems.userHandles, deleteHandle);
                if (!lefthandle) {
                    var leftExtendTool = createUserHandle("leftExtendHandle", "middleleft");
                    diagram.model.selectedItems.userHandles.push(leftExtendTool);
                }
                /*if (!righthandle) {
                    var rightExtendTool = createUserHandle("rightExtendHandle", "middleright");
                    diagram.model.selectedItems.userHandles.push(rightExtendTool);
                }*/
            } else if (node.branch == "left" || node.branch == "subleft") {

                /*if (righthandle) {
                    ej.datavisualization.Diagram.Util.removeItem(diagram.model.selectedItems.userHandles, righthandle);
                }*/

                if (!lefthandle) {
                    var leftExtendTool = createUserHandle("leftExtendHandle", "middleleft");
                    diagram.model.selectedItems.userHandles.push(leftExtendTool);
                }
                /*if (!deleteHandle) {
                    var deleteHandle = createUserHandle("deleteHandle", "middleright");
                    diagram.model.selectedItems.userHandles.push(deleteHandle);
                } else deleteHandle.position = "middleright";*/

            }/* else if (node.branch == "right" || node.branch == "subright") {
                if (!righthandle) {
                    var rightExtendTool = createUserHandle("rightExtendHandle", "middleright");
                    diagram.model.selectedItems.userHandles.push(rightExtendTool);
                }
                if (lefthandle) {
                    ej.datavisualization.Diagram.Util.removeItem(diagram.model.selectedItems.userHandles, lefthandle);
                }
                if (!deleteHandle) {
                    var deleteHandle = createUserHandle("deleteHandle", "middleleft");
                    diagram.model.selectedItems.userHandles.push(deleteHandle);
                } else
                    deleteHandle.position = "middleleft";
            }*/
            diagram.updateNode(evt.element.name, { "borderColor": "#282828" });
            //drawSelectionArea(diagram.model.selectedItems.children);
        }
    } else if (evt.changeType == "remove" && evt.elementType == "node") {
        PreLastSelectNode = LastSelectNode;
        LastSelectNode = evt.element;
        //console.log(lastSelectedNode);
    } else {
        if (evt.element && diagram.getObjectType(evt.element) == "node") {
            diagram.updateNode(evt.element.name, { "borderColor": "none" });
            $("#colorpalette").slideUp();
            $("#divSetType").slideUp();
            $("#divSetComment").slideUp();
            $("#relationsList").slideUp();
        }
    }
    
    // show relations while selecting node
    //showRelationsList(evt);

}

function labelChanged(evt, updated) {
    //if (newNodeAdd == false) {
        addEvent({ name: "labelChanged", val1: evt.element.name, val2: evt.value });
        if (!evt.element.segments) {
            var diagram = $("#" + graphElm).ejDiagram("instance");
            var node = evt.element;
            /*if (!updated) {
                if (node.branch == "root" || node.branch == "left" || node.branch == "subleft") {
                    updateLeftSideMap(diagram);
                }
                if (node.branch == "root" || node.branch == "right" || node.branch == "subright") {
                    updateRightSideMap(diagram);
                }
            }*/

            //change type of label
            node.labels[0].mode = "view";
            node.inEdges.forEach(function(edge) {
                diagram.nameTable[edge].targetPoint.x = node.offsetX + node._width / 2;
            });
            node.outEdges.forEach(function(edge) {
                diagram.nameTable[edge].sourcePoint.x = node.offsetX - node._width / 2;
            });
        }
    //}
    newNodeAdd = false;
    setAllNodesOffset();
}

function deleteLayoutChilds(node, diagram, deleting) {
    //console.log('deleteNode '+node.name);

    if (node.outEdges && node.outEdges.length > 0) {
        for (var i = node.outEdges.length - 1; i >= 0; i--) {
            var child = diagram.nameTable[diagram.nameTable[node.outEdges[i]].targetNode];
            deleteLayoutChilds(child, diagram);

        }
        for (var j = node.outEdges.length - 1; j >= 0; j--) {
            var conn = diagram.nameTable[node.outEdges[j]];
            diagram.remove(conn);
        }
    }
    //if (!deleting && node.type != "basic") {
    if (node.type != "basic") {
        addEvent({ name: "deleteNode", val1: node.name });
        diagram.remove(node);
    }
    setAllNodesOffset();
}

function applyBackground(color, target) {
    var diagram = $("#" + graphElm).ejDiagram("instance");

    if (!target.segments) {
        var fontColor = "black";
        if (target.type != "native") {
            var values = color.split(",");
            if (values.length == 3) {
                values[0] = values[0].replace("rgb(", "");
                values[2] = values[2].replace(")", "");
                var sum = 0;
                for (var i = 0; i < values.length - 1; i++) {
                    sum += parseInt(values[i]);
                }
                if ((sum / 3) < 125) {
                    if (target.labels[0])
                        fontColor = "white";
                }
            }
            $("#colorpalette").slideUp();
        } else {
            if (target.labels[0]) {
                fontColor = color;
            }
        }
        target.labels[0].fontColor = fontColor;
        diagram.updateLabel(target.name, target.labels[0], { "fontColor": fontColor });
        diagram.updateNode(target.name, {
            "fillColor": color,
            "borderColor": "none"
        });
        $("#colorpalette").slideUp();
        if (NodeColorClick) {
            NodeColorClick = false;
            addEvent({ name:"NodeColorChange", val1: target.name, val2: color });
        }
    }
}
function showCommentBox() {
    var ref = this.diagram.selectionList[0];
    var left = ref.offsetX * this.diagram._getCurrentZoom() - $("#divSetComment").width() / 2 + 25 - this.diagram._hScrollOffset;
    var top = ref.offsetY * this.diagram._getCurrentZoom() + 120 - this.diagram._vScrollOffset;
    $("#divSetComment").css({
        left: (left) + "px",
        top: (top) + "px"
    });
    $("#divSetComment").slideDown("fast");
    $("#txtSetComment").val(getNodeFromDiagram(ref.name).comment);
}
function showPalleteBox() {
    var ref = this.diagram.selectionList[0];
    var left = ref.offsetX * this.diagram._getCurrentZoom() + ref.width / 2 + 25 - this.diagram._hScrollOffset;
    var top = ref.offsetY * this.diagram._getCurrentZoom() - ref.height / 2 - 25 - this.diagram._vScrollOffset;
    $("#colorpalette").css(
    {
        left: (left) + "px",
        top: (top) + "px"
    });
    $("#colorpalette").slideDown("fast");
}
function showSetTypeBox() {
    var ref= this.diagram.selectionList[0];
    var left = ref.offsetX * this.diagram._getCurrentZoom() - $("#divSetType").width() / 2 + 25 - this.diagram._hScrollOffset;
    var top = ref.offsetY * this.diagram._getCurrentZoom() + 120 - this.diagram._vScrollOffset;
    $("#divSetType").css({
        left: (left) + "px",
        top: (top) + "px"
    });
    $("#divSetType").slideDown("fast");
    $("#cboSelectSetType").val(getNodeFromDiagram(ref.name).nodeType);
}
//function for showing list of graph element sectionRelations
function showRelationsList(e) {
    // remove highlights of other sections
    $(".Meshkat-highlighted").removeClass("Meshkat-highlighted");
    if (e === undefined) {
        var ref = diagram.selectionList[0];
    }
    else {
        var ref = diagram.nameTable[e.currentTarget.id];
        if (e.selectedIndex === undefined) {
            e.selectedIndex = 0;
        }
    }
    if (ref.sections === undefined || ref.sections.length === 0) {
        return;
    }
    else if (ref.sections.length === 1) {
        selectSectionRelation(e);
        return;
    }
    var left = ref.offsetX * diagram._getCurrentZoom() - $("#relationsList").width() / 2 + 25 - diagram._hScrollOffset;
    var top = ref.offsetY * diagram._getCurrentZoom() + 70 - diagram._vScrollOffset;
    //var relationsListElem = $("#relationsList");
    $("#cboSelectRelation").html("");
    for (var i = 0; i < ref.sections.length; i++) {
        var relation_html = "<option>رابطه</option>";
        $("#cboSelectRelation").append(relation_html);
    }
    $("#relationsList").css({
        left: (left) + "px",
        top: (top) + "px"
    });
    $("#relationsList").slideDown("fast");
}

function selectSectionRelation(e) {
    if (e === undefined) {
        e = { selectedIndex: 0 };
        var ref = this.diagram.selectionList[0];
    } else {
        var ref = diagram.nameTable[e.currentTarget.id];
    }   
    $("#relationsList").slideUp("fast");
    if ($(".paragraph[data-id=" + ref.sections[e.selectedIndex].getParagraphId() + "]").length > 0) {
        app.graphBookView.showCommentHighlights(ref.sections[e.selectedIndex], ref.name);
        $("#textPanel").scrollTop($(".paragraph[data-id=" + ref.sections[e.selectedIndex].getParagraphId() + "]").offset().top);
        if ($("#graphAppContainer").layout().east.state.isClosed) {
            $("#graphAppContainer").layout().toggle("east");
        }
        return;
    }
    showLoading();
    $.ajax({
        type: "GET",
        url: "/Book/tocParagraphsByParagraphId" + "?paragraphId=" + ref.sections[e.selectedIndex].getParagraphId(),
        dataType: "html",
        success:
            function (data) {
                hideLoading();
                if ($("#graphAppContainer").layout().east.state.isClosed) {
                    $("#graphAppContainer").layout().toggle("east");                   
                }
                app.graphBookView.$el.html(data);
                var tocKey = $(".paragraph").first().attr("toc-id");
                var node = $("#tableOfContentTree").fancytree("getTree").getNodeByKey(tocKey);
                if(node !== null)
                    node.setActive(true, { noEvents: true });
                app.graphBookView.showCommentHighlights(ref.sections[e.selectedIndex], ref.name);
                $("#textPanel").scrollTop($(".paragraph[data-id=" + ref.sections[e.selectedIndex].getParagraphId() + "]").offset().top);
            },
        error: function (xhr, status, error) {
            hideLoading();
            showMessage(error, messageList.ERROR, "error", xhr.status);
        },
        contentType: "application/json; charset=utf-8",
        cache: false
    });
}
//user handle initialization
function createUserHandles(userHandles) {
    var LeftExtendTool = (function (base) {
        ej.datavisualization.Diagram.extend(LeftExtendTool, base);
        function LeftExtendTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.clonedNodes = [];
            this.cursor = "pointer";
        }
        LeftExtendTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        LeftExtendTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        LeftExtendTool.prototype.mouseup = function (evt) {
            if (evt.target.id == "leftExtendHandle_shape" || evt.target.id == graphElm+"_canvas_svg") {
                if (this.inAction) {
                    this.inAction = false;
                    var type = diagram.getObjectType(this.selectedObject);
                    if (this.selectedObject && type == "node") {
                        if (this.selectedObject.branch == "root")
                            var type = "left";
                        else
                            var type = "subleft";
                        var node = addNode(this.selectedObject, type, "Node", "rgb(30, 30, 113)");
                        var conn = connect(this.selectedObject, node);
                        //if (this.selectedObject.branch == "root") {
                            //conn.sourcePort = this.selectedObject.ports[0].name;
                            //conn.targetPort = node.ports[1].name;
                        /*} else if (this.selectedObject.branch == "left") {
                            conn.sourcePort = this.selectedObject.ports[0].name;
                            conn.targetPort = node.ports[1].name;
                        } else {
                            conn.sourcePort = this.selectedObject.ports[0].name;
                            conn.targetPort = node.ports[1].name;
                        }*/
                        //this.diagram.add(node);
                        //this.diagram.add(conn);
                        node = this.diagram.nameTable[node.name];
                        applyBackground(node.fillColor, node);
                        //updateLeftSideMap(this.diagram);
                        editLabel(node);
                    }
                }
                base.prototype.mouseup.call(this, evt);
            } else {
                if (this.inAction) {
                    this.inAction = false;
                    var node = getNode(evt.target.id.split('_')[0]);
                    var conn = connect(this.selectedObject, node);
                    //console.log(this.selectedObject);
                    //conn.sourcePort = this.selectedObject.ports[0].name;
                    //conn.targetPort = node.ports[1].name;
                    //this.diagram.add(conn);
                }
            }
        };

        return LeftExtendTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.LeftExtendTool = LeftExtendTool;
    var leftExtendTool = createUserHandle("leftExtendHandle", "middleleft");
    userHandles.push(leftExtendTool);

    /*var RightExtendTool = (function (base) {
        ej.datavisualization.Diagram.extend(RightExtendTool, base);
        function RightExtendTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.clonedNodes = [];
            this.cursor = "pointer";
        }
        RightExtendTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        RightExtendTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        RightExtendTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                var type = diagram.getObjectType(this.selectedObject);
                if (this.selectedObject && type == "node") {
                    if (this.selectedObject.branch == "root")
                        var type = "right";
                    else
                        var type = "subright";
                    var node = addNode(this.selectedObject, type, "Node", "rgb(30, 30, 113)");
                    var conn = connect(this.selectedObject, node, "conn_" + ej.datavisualization.Diagram.Util.randomId());
                    if (this.selectedObject.branch == "root") {
                        conn.sourcePort = this.selectedObject.ports[1].name;
                        conn.targetPort = node.ports[0].name;
                    }
                    else if (this.selectedObject.branch == "right") {
                        conn.sourcePort = this.selectedObject.ports[1].name;
                        conn.targetPort = node.ports[0].name;
                    }
                    else {
                        conn.sourcePort = this.selectedObject.ports[1].name;
                        conn.targetPort = node.ports[0].name;
                    }
                    this.diagram.add(node);
                    this.diagram.add(conn);
                    applyBackground(node.fillColor, this.diagram.nameTable[node.name]);
                    updateRightSideMap(this.diagram);
                    this.diagram.scrollToNode(this.diagram.nameTable[node.name]);
                    editLabel(this.diagram.nameTable[node.name]);
                }
            }
            base.prototype.mouseup.call(this, evt);

        };

        return RightExtendTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.RightExtendTool = RightExtendTool;
    var rightExtendTool = createUserHandle("rightExtendHandle", "middleright");
    userHandles.push(rightExtendTool);


    var FillTool = (function (base) {
        ej.datavisualization.Diagram.extend(FillTool, base);
        function FillTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.cursor = "pointer";
        }
        FillTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        FillTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        FillTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                if (this.selectedObject) {
                    this.selectedObject = this.diagram.selectionList[0];
                    var left = this.selectedObject.offsetX * this.diagram._getCurrentZoom() + this.selectedObject.width / 2 + 25 - this.diagram._hScrollOffset;
                    var top = this.selectedObject.offsetY * this.diagram._getCurrentZoom() - this.selectedObject.height / 2 - 25 - this.diagram._vScrollOffset;
                    $("#colorpalette").css(
                    {
                        left: (left) + "px",
                        top: (top) + "px"
                    });
                    $("#colorpalette").slideDown("fast");
                }
            }

            base.prototype.mouseup.call(this, evt);

        };
        return FillTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.FillTool = FillTool;
    var fillTool = createUserHandle("fillHandle", "topcenter");
    userHandles.push(fillTool);
    

    var DeleteTool = (function (base) {
        ej.datavisualization.Diagram.extend(DeleteTool, base);
        function DeleteTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.cursor = "pointer";
        }
        DeleteTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        DeleteTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        DeleteTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                if (this.selectedObject)
                    this.diagram._remove(this.selectedObject);
            }
            base.prototype.mouseup.call(this, evt);

        };

        return DeleteTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.DeleteTool = DeleteTool;
    var deleteTool = createUserHandle("deleteHandle", "middleright");
    userHandles.push(deleteTool);
    

    var SettingsTool = (function (base) {
        ej.datavisualization.Diagram.extend(SettingsTool, base);
        function SettingsTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.cursor = "pointer";
        }
        SettingsTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        SettingsTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        SettingsTool.prototype.mouseup = function (evt) {
            //if (this.inAction) {
            this.selectedObject = this.diagram.selectionList[0];
                this.inAction = false;
                if (this.selectedObject) {
                    this.selectedObject = this.diagram.selectionList[0];
                    var left = this.selectedObject.offsetX * this.diagram._getCurrentZoom() - $("#divSetType").width() / 2 + 25 - this.diagram._hScrollOffset;
                    var top = this.selectedObject.offsetY * this.diagram._getCurrentZoom() + 120 - this.diagram._vScrollOffset;
                    $("#divSetType").css({
                        left: (left) + "px",
                        top: (top) + "px"
                    });
                    $("#divSetType").slideDown("fast");
                }
            //}
            base.prototype.mouseup.call(this, evt);

        };

        return SettingsTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.SettingsTool = SettingsTool;
    var settingsTool = createUserHandle("settingsHandle", "bottomright");
    userHandles.push(settingsTool);
           
    var commentTool = (function (base) {
        ej.datavisualization.Diagram.extend(commentTool, base);
        function commentTool(name) {
            base.call(this, name);
            this.singleAction = true;
            this.cursor = "pointer";
        }
        commentTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        commentTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
        };
        commentTool.prototype.mouseup = function (evt) {
            //if (this.inAction) {
            this.selectedObject = this.diagram.selectionList[0];
            this.inAction = false;
            if (this.selectedObject) {
                //this.selectedObject = this.diagram.selectionList[0];
                showCommentBox();
            }
            //}
            base.prototype.mouseup.call(this, evt);

        };

        return commentTool;
    })(ej.datavisualization.Diagram.ToolBase);

    ej.datavisualization.Diagram.commentTool = commentTool;
    var commentTool = createUserHandle("commentHandle", "bottomleft");
    userHandles.push(commentTool);
    */
}

function editLabel(node) {
    //console.log('editLabel '+node.name);

    var diagram = $("#" + graphElm).ejDiagram("instance");

    if (typeof node.labels.length == "undefined" || node.labels.length == 0) {
        var label = ej.datavisualization.Diagram.Label();
        debugger 
        label.mode = ej.datavisualization.Diagram.LabelEditMode.Edit;
        node.labels.push(label);
    }
    else if (node.labels.length != "undefined" && node.labels.length > 0) {
        node.labels[0].mode = ej.datavisualization.Diagram.LabelEditMode.Edit;
        diagram.startLabelEdit(node, node.labels[0]);
    }
}

function createUserHandle(name, position) {
    var handle = ej.datavisualization.Diagram.UserHandle();
    handle.name = name;
    handle.position = position;
    handle.enableMultiSelection = false;
    handle.size = 30;
    handle.backgroundColor = "#4D4D4D";
    switch (name) {
        case "leftExtendHandle":
            handle.tool = new ej.datavisualization.Diagram.LeftExtendTool(name);
            handle.pathData = "M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z";
            break;
        /*case "rightExtendHandle":
            handle.tool = new ej.datavisualization.Diagram.RightExtendTool(name);
            handle.pathData = "M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z ";
            break;*/
        /*case "deleteHandle":
            handle.tool = new ej.datavisualization.Diagram.DeleteTool(name);
            handle.pathData = "M33.977998,27.684L33.977998,58.102997 " + "41.373998,58.102997 41.373998,27.684z M14.841999,27.684L14.841999,58.102997 22.237998,58.102997 " + "22.237998,27.684z M4.0319996,22.433001L52.183,22.433001 52.183,63.999001 4.0319996,63.999001z " + "M15.974,0L40.195001,0 40.195001,7.7260003 56.167001,7.7260003 56.167001,16.000999 0,16.000999 " + "0,7.7260003 15.974,7.7260003z";
            break;
        case "fillHandle":
            handle.tool = new ej.datavisualization.Diagram.FillTool(name);
            handle.pathData = "M44.02605,20.846C44.02605,20.846 63.682006,24.103257 63.682006,38.870418 63.682006,42.772187 63.682006,49.664208 63.682006,53.565377 63.682006,66.221799 51.658645,58.015256 51.658645,50.555524 51.658645,40.738351 60.340182,37.173087 56.365394,33.199718z M25.529025,0C34.740886,0,39.964213,12.976948,40.281676,22.477042L40.293128,23.153271 40.635634,23.496004C44.15071,27.013427 48.794879,31.660645 50.360019,33.226604 52.995978,35.863305 51.193019,38.789006 50.089023,39.892009 48.98503,40.995406 28.241208,61.738416 28.241208,61.738416 25.936236,64.043717 17.883273,59.726617 10.261396,52.099114 2.63244,44.474008 -1.684536,36.421304 0.6204343,34.116004L22.599233,12.137394C22.599233,12.137394 24.072108,10.731551 26.071624,10.752226 27.118989,10.763056 28.310851,11.165289 29.511216,12.365994L31.998191,14.858796C33.357127,19.144596 32.48714,22.803398 31.852197,24.675799 30.646153,25.4376 29.839215,26.7741 29.839215,28.308002 29.839215,30.683002 31.76516,32.610805 34.144168,32.610805 36.52415,32.610805 38.450095,30.683002 38.450095,28.308002 38.450095,26.808 37.681121,25.490899 36.519145,24.7214 36.644145,23.702499 36.722144,21.654397 36.354106,19.211597 36.354106,19.211597 36.823226,19.681035 37.592975,20.451304L37.670257,20.528639 37.615382,20.036525C36.595061,11.949274 32.102916,2.4615231 25.529025,2.4615231 17.491012,2.4615231 15.683008,10.664832 15.683008,13.53907L13.222004,13.53907C13.222004,8.3047702,16.56301,0,25.529025,0z";
            break;*/
        /*case "settingsHandle":
            handle.tool = new ej.datavisualization.Diagram.SettingsTool(name);
            handle.pathData = "M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889";
            break;*/
        //case "commentHandle":
        //    handle.tool = new ej.datavisualization.Diagram.commentTool(name);
        //    handle.pathData = "M22.0542,27.332C20.4002,27.332,19.0562,25.987,19.0562,24.333C19.0562,22.678,20.4002,21.333,22.0542,21.333C23.7082,21.333,25.0562,22.678,25.0562,24.333C25.0562,25.987,23.7082,27.332,22.0542,27.332 M30.6282,22.889L28.3522,22.889C28.1912,22.183,27.9142,21.516,27.5272,20.905L29.1392,19.293C29.3062,19.126,29.3062,18.853,29.1392,18.687L27.7032,17.251C27.6232,17.173,27.5152,17.125,27.3982,17.125C27.2862,17.125,27.1782,17.173,27.0952,17.251L25.4872,18.863C24.8732,18.476,24.2082,18.201,23.5002,18.038L23.5002,15.762C23.5002,15.525,23.3092,15.333,23.0732,15.333L21.0422,15.333C20.8062,15.333,20.6122,15.525,20.6122,15.762L20.6122,18.038C19.9072,18.201,19.2412,18.476,18.6292,18.863L17.0192,17.252C16.9342,17.168,16.8242,17.128,16.7162,17.128C16.6052,17.128,16.4972,17.168,16.4112,17.252L14.9752,18.687C14.8952,18.768,14.8492,18.878,14.8492,18.99C14.8492,19.104,14.8952,19.216,14.9752,19.293L16.5872,20.905C16.2002,21.516,15.9242,22.183,15.7642,22.889L13.4852,22.889C13.2502,22.889,13.0572,23.08,13.0572,23.316L13.0572,25.35C13.0572,25.584,13.2502,25.777,13.4852,25.777L15.7612,25.777C15.9242,26.486,16.2002,27.15,16.5872,27.764L14.9752,29.374C14.8092,29.538,14.8092,29.813,14.9752,29.979L16.4112,31.416C16.4912,31.494,16.6022,31.541,16.7162,31.541C16.8272,31.541,16.9382,31.494,17.0192,31.416L18.6252,29.805C19.2412,30.191,19.9072,30.467,20.6122,30.63L20.6122,32.906C20.6122,33.141,20.8062,33.333,21.0422,33.333L23.0732,33.333C23.3092,33.333,23.5002,33.141,23.5002,32.906L23.5002,30.63C24.2082,30.467,24.8732,30.191,25.4872,29.805L27.0952,31.416C27.1812,31.499,27.2892,31.541,27.3982,31.541C27.5102,31.541,27.6202,31.499,27.7032,31.416L29.1392,29.979C29.2202,29.899,29.2662,29.791,29.2662,29.677C29.2662,29.563,29.2202,29.453,29.1392,29.374L27.5312,27.764C27.9142,27.149,28.1912,26.486,28.3522,25.777L30.6282,25.777C30.8652,25.777,31.0552,25.584,31.0552,25.35L31.0552,23.316C31.0552,23.08,30.8652,22.889,30.6282,22.889";
        //    break;
    }
    return handle;
};

// Copyright 2012 © Gavin Kistner, !@phrogz.net
// License: http://phrogz.net/JS/_ReuseLicense.txt

// Removes all transforms applied above an element.
// Apply a translation to the element to have it remain at a local position
function unscale(el) {
    var svg = el.ownerSVGElement;
    var xf = el.scaleIndependentXForm;
    if (!xf) {
        // Keep a single transform matrix in the stack for fighting transformations
        // Be sure to apply this transform after existing transforms (translate)
        xf = el.scaleIndependentXForm = svg.createSVGTransform();
        el.transform.baseVal.appendItem(xf);
    }
    var m = svg.getTransformToElement(el.parentNode);
    m.e = m.f = 0; // Ignore (preserve) any translations done up to this point
    xf.setMatrix(m);
}


