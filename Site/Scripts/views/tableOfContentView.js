var app = app || {};

(function ($) {
    'use strict';
    // Table of content view

    app.TableOfContentView = Backbone.View.extend({
        el: '#tableOfContentPanel',
        TOCItems:[],
        initialize: function () {
            var that = this;
            this.$el.layout({
                defaults: {
                    spacing_closed: 0,
                    spacing_open: 0
                },
                north: {
                    resizable: false,
                    size:'30'
                },
            });            
            var data = {};
            var url = "";
            if (app.userMode == "workspace") {
                url = "/BookTableOfContent/GetRootsOfWorkspace";
                data={workspaceId:  app.userWorkspaceId}
            }
            else if (app.userMode == "volume") {
                url = "/BookTableOfContent/GetRootsOfVolume";
                data = { volumeId: app.userVolumeId }
            }
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
                    url: url,
                    cache: false,                    
                    data: data,
                    headers: { Authorization: readCookie("token"), client_id: 'MsktLib' }
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
                        processed.push({
                            title: nodes[i].Title,
                            key: nodes[i].Key.toString(),
                            lazy: nodes[i].HasChild,
                            tooltip: nodes[i].Title,
                            TOC: new app.BookTableOfContent(nodes[i]),
                            IsVerified: nodes[i].IsVerified
                        });
                    }
                    data.result = processed;
                },        
                activate: function (event, data) {
                    event.preventDefault();

                    $('title').text(data.node.data.TOC.getTitle());
                    $('meta[name=description]').remove();
                    $('head').append('<meta name="description" content="' + data.node.data.TOC.getTitle() + '"/>');
                    app.userTocId = data.node.data.TOC.getKey();
                    app.bookletView.loadVolume(data.node.data.TOC);
                    data.node.setExpanded(true);
                    
                },
                renderNode: function (type, obj) {
                    var icons = $(obj.node.li).find(".fancytree-icon");
                    icons.css("background-image", "none");
                    icons.addClass("fa fa-circle-o");
                    
                    var titles = $(obj.node.li).find(".fancytree-title");
                    if (obj.node.data.TOC != null) {
                        titles.contents().wrap('<a style="text-decoration:none;color:black" href="/Archive/' + obj.node.data.TOC.getKey() + '/' + obj.node.data.TOC.attributes.BookParagraphPageNumber + '" onClick="(function(e){e.preventDefault();})(event);" dir="RTL" />');
                    }
                }
            });

            $("#tableOfContentTree").find(".fancytree-container").removeAttr("tabindex");

            $.ajax({
                type: "GET",                
                url: "/BookTableOfContent/GetNodesTitleAndId",
                data: { volumeId:(app.userVolumeId == undefined ? -1 : app.userVolumeId), workspaceId: app.userWorkspaceId },
                dataType: "json",
                success:
                    function (data) {
                        if (!CheckServiceResultIsSuccess(data)){
                            return;
                        }
                        var keys = Object.keys(data);
                        keys.forEach(function (key) {
                            var item = { label: data[key], value: key };
                            that.TOCItems.push(item);
                        });
                        $("#txtTOCSearch").autocomplete({
                            source: that.TOCItems,
                            select: function (event, ui) {
                                $(this).val(ui.item.label);
                                event.preventDefault();
                                showLoading();
                                that.selectNode(ui.item.value);
                            },
                            focus: function (event, ui) {
                                $(this).val(ui.item.label);
                                return false;
                            }

                        });
                    },
                error: function (xhr,status,error) {
                    hideLoading();                    
                    showMessage(error, messageList.ERROR_TITLE, "error",xhr.status);
                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
            
            // loading list of tagNameandIds for autocomplete
            if (!app.userWorkspaceId) {
                app.userWorkspaceId = -1;
            }
            $.ajax({
                type: "GET",
                url: "/BookTag/GetTagNames",
                dataType: "json",
                data: { workspaceId: app.userWorkspaceId, volumeId: (app.userVolumeId || -1) },
                success: function (data) {
                    if (!CheckServiceResultIsSuccess(data)) {
                        return;
                    }
                    var keys = Object.keys(data);
                    keys.forEach(function (key) {
                        var item = { label: key, id: data[key] };
                        app.tagNameAndIds.push(item);
                    });
                    // render list of tags
                    app.tagsView.renderTags();
                },
                error: function (xhr, status, error) {
                    showMessage(error, messageList.ERROR, "error", xhr.status);
                },
                contentType: "application/x-www-form-urlencoded",
                cache: false
            });
            
            
            
            
            this.render();                        
        },
        render: function () {
            return this;
        },
        isClosed: function () {
            return $("#mainContent").layout().state.east.isClosed;
        },
        open: function () {
            $('#tagsPanel').hide();
            $('#tableOfContentTree').show();
            $("#mainContent").layout().open("east");
            $('#txtTOCSearch').focus();
            $('#txtTOCSearch').autocomplete("enable");
            $('#txtTOCSearch').val("");
        },
        close: function () {
            $("#mainContent").layout().close("east");           
            $("#mainContent").layout().close("east");           
        },
        selectNode: function (nodeKey, paragraphId) {
            var url = "";
            var data = {};
            app.targetNodeId = nodeKey;
            if (app.userMode == "volume" || app.userMode == "search") {
                url = "/BookTableOfContent/GetVolumeTree";
                data = { id: nodeKey};
            } else if (app.userMode == "workspace") {
                url = "/BookTableOfContent/GetSubTree";
                data = { id: nodeKey, workspaceId: app.userWorkspaceId };
            }
            $.ajax({
                type: "GET",                
                url: url,
                dataType: "json",
                data: data,
                success: function (loadedNode) {
                    hideLoading();
                    
                    if (!CheckServiceResultIsSuccess(loadedNode)){
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
                            treeToc.getNodeByKey(obj.key.toString()).removeChildren();
                        }
                    }
                    treeToc.getNodeByKey(app.targetNodeId).setActive();
                },
                error: function (xhr,status,error) {
                    hideLoading();                    
                    showMessage(error, messageList.ERROR_TITLE, "error",xhr.status);
                }
            });
        }
    });
})(jQuery);
