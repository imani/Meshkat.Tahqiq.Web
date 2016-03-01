var app = app || {};

(function ($) {
    'use strict';
    // Table of content view

    app.GraphTocView = Backbone.View.extend({
        el: '#tableOfContentTree',
        TOCItems: [],
        events: {
        },
        initialize: function () {
            var that = this;
            var data = { workspaceId: app.graph.getGraphWorkspace() };
            $("#tableOfContentTree").fancytree({
                imagePath: "~/Views/Styles/fancytree/",
                tabbable: false,
                autoActivate: false,
                autoScroll: false,
                keyboard: false,
                init: function (event, data, flag) {
                    $(this).find(".fancytree-container").attr("DIR", "RTL").addClass("fancytree-rtl");
                },
                source: {
                    url: "/BookTableOfContent/GetRootsOfWorkspace",
                    cache: false,
                    data: data
                },
                lazyLoad: function (event, data) {
                    var node = data.node;
                    data.result = {
                        url: "/BookTableOfContent/GetChildren",
                        cache: true,
                        data: { parentNodeId: node.key }
                    };
                },
                postProcess: function (event, data) {
                    if (!checkResponse(data))
                        return;
                    var nodes = data.response;
                    if (nodes.length == 0) {
                        showMessage("برای اضافه کردن کتاب به این کتابخانه به <a href='Home/Workspaces'>بخش مدیریت کتابخانه‌ها</a> مراجعه کنید. ", "کتابی وجود ندارد", "error");
                    }
                    var processed = [];
                    for (var i = 0; i < nodes.length; i++) {
                        processed.push({ title: nodes[i].Title, key: nodes[i].Key.toString(), lazy: nodes[i].HasChild, tooltip: nodes[i].Title, TOC: new app.BookTableOfContent(nodes[i]), IsVerified: nodes[i].IsVerified });
                    }
                    data.result = processed;
                },
                activate: function (event, data) {
                    event.preventDefault();

                    // open bookText
                    app.graphBookView.loadVolume(data.node.data.TOC);
                    data.node.setExpanded(true);
                    //app.app_router.navigate('toc/' + data.node.data.TOC.getKey(), { trigger: false, replace: true });
                },
                renderNode: function (type, obj) {
                    var icons = $(obj.node.li).find(".fancytree-icon");
                    icons.css("background-image", "none");
                    //icons.css("color", "#84b0e1");
                    icons.addClass("fa fa-circle-o");

                    var titles = $(obj.node.li).find(".fancytree-title");
                    if (obj.node.data.TOC != null) {
                        titles.contents().wrap('<a style="text-decoration:none;color:black" href="/Archive/' + obj.node.data.TOC.getKey() + '" onClick="(function(e){e.preventDefault();})(event);" dir="RTL" />');
                    }
                }
            });
            $("#tableOfContentTree").find(".fancytree-container").removeAttr("tabindex");

            this.render();
        },
        render: function () {
            return this;
        },
        isClosed: function () {
            return $("#mainContent").layout().state.east.isClosed;
        },
        selectNode: function (tocId, paragraphId) {
            app.targetNodeId = tocId;
            $.ajax({
                type: "GET",
                url: "/BookTableOfContent/GetSubTree",
                dataType: "json",
                data: { id: tocId, workspaceId: app.graph.getGraphWorkspace() },
                success: function (loadedNode) {
                    hideLoading();

                    if (!CheckServiceResultIsSuccess(loadedNode)) {
                        return;
                    }
                    var nodes = loadedNode;
                    var obj = {};
                    var rootNode = $("#tableOfContentTree").fancytree("getRootNode");
                    var treeToc = $("#tableOfContentTree").fancytree("getTree");
                    for (var i = 0; i < nodes.length ; i++) {
                        obj = {
                            title: nodes[i].Title,
                            ParentKey: (nodes[i].ParentKey == undefined ? undefined : nodes[i].ParentKey.toString()),
                            key: nodes[i].Key.toString(),
                            lazy: nodes[i].HasChild,
                            tooltip: nodes[i].Title,
                            TOC: new app.BookTableOfContent(nodes[i])
                        };
                        if (obj.ParentKey != null && treeToc.getNodeByKey(obj.key) == null) {
                            treeToc.getNodeByKey(obj.ParentKey).addChildren(obj);
                        } else {
                            if (treeToc.getNodeByKey(obj.key) == null)
                                rootNode.addChildren(obj);
                            treeToc.getNodeByKey(obj.key).removeChildren();
                        }
                    }

                    treeToc.getNodeByKey(app.targetNodeId).setActive();
                    
                },
                error: function (xhr, status, error) {
                    hideLoading();
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                }
            });
        }
    });
})(jQuery);
