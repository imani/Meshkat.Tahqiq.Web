ajaxPath = {
    GET: "/Dynamic/Get",
    POST: "/Dynamic/Post",
    LOG_IN: "/Account/Login",
    LOG_INWITHGUEST: "/Account/LogInWithGuest",
    LOG_OUT: "/Account/LogOut",
    HAS_VOULUME: "/NewBook/HasVolume",
    ADD_BOOK: "/NewBook/AddBook",
    ADD_BOOKVOLUME_FILE: "/NewBook/AddBookVolumeFile",
    GET_BOOKS: "/NewBook/GetBooks",
    ADD_CONFIRMEDBOOK: "/NewBook/AddConfirmedBook",
    GET_NOTVERIFIED_BOOKVOLUME: "/NewBook/GetNotVerifiedBookVolume",
    CONFIRM_AND_CREATE_VOLUMEFILE: "/NewBook/ConfirmVolumFile",
    DOWNLOAD_BOOKVOLUME_FILE: "/NewBook/DownloadBookVolumeFile"
};

path = {
    HOME: "/",
    ACCOUNT: "/Site/Htmls/Account.html"
};
messageList = {
    ERROR_TITLE: "خطا",    
    SUCCESSFUL: "با موفقیت انجام شد",
    FILL_ALL_INPUTS: "لطفا تمام قسمت ها را تکمیل کنید",
    //CONNECTION_FAILED: "ارتباط با سرور برقرار نشد.",
    //COMMENT_SAVED: "توضیح با موفقیت ثبت شد.",
    COMMENT_SAVED_TITLE: "ثبت توضیح",
    //COMMENT_REMOVED: "توضیح حذف شد",
    COMMENT_REMOVED_TITLE: "حذف توضیح",
    GRAPH_REMOVED_TITLE: "حذف نمودار",
    GRAPH_CLONE_TITLE: "نسخه برداری از نمودار",
    VERIFICATION_FAILED: "TokenVerificationFailed",
    //COMMENT_EDITED: "توضیح با موفقیت ویرایش شد",
    COMMENT_EDITED_TITLE: "ویرایش توضیح",
    //SECURITY_ERR_NUMBER_103: "لطفا دوباره وارد شويد"
    EXCEPTION: "خطای ناشناخته، اطلاعات جهت بررسی ذخیره شده است. لطفا به مدیر سیستم اطلاع دهید.",
    GUESTUSERLIMIT: "محدودیت در استفاده از کاربر میهمان، لطفا به مدیر سیستم اطلاع دهید.",
    SECURITY_ERR_NUMBER_101: "نام کاربری (ایمیل) و یا رمز عبور صحیح وارد نشده است",
    SECURITY_ERR_NUMBER_103: "کاربر جاری می بایست مجدداً وارد سیستم شود",
    LOGINREQUIRED: "برای استفاده از این قابلیت لازم است تا ابتدا وارد شوید.",
    WORKSPACEACCESS: "شما در این فضا مجاز به استفاده از این قابلیت نیستید.",
    REGIONACCESS: "شما به این فضا دسترسی ندارید",
    ERRORCHANGEPASSWORD: "مشکل در تغییر رمز ورود",
    WRONGEMAIL:"ایمیل وارد شده صحیح نمی باشد"
};

statusCodeList = {
    0: "ارتباط با سرور برقرار نشد",
    401: "لطفا دوباره وارد شويد"
};



function GetMessage(msg) {
    if (messageList[msg] != null)
        return messageList[msg];
    return msg;
}

function GetStatusCode(code) {
    if (statusCodeList[code] != null)
        return statusCodeList[code];
    return "پیغام ناشناخته";
}

function checkResponse(data) {
    /*var serviceResponse = data;
    if (serviceResponse !== undefined && serviceResponse.response !== undefined && serviceResponse.response.Message !== undefined) {
        var messageText = serviceResponse.Response.Message;
        showMessage(GetMessage(messageText), '', 'default');
    }
    return serviceResponse.Successful || (serviceResponse.response !== undefined && serviceResponse.response.Successful);*/
    return true;
}

function showMessage(messageText, title, type, statusCode) {
    var msg = "";
    if (messageText != null && messageText != "") {
        msg = GetMessage(messageText);
    } else if(statusCode != null){
        msg = GetStatusCode(statusCode);
    } 
    $.ambiance({
        message: msg,
        title: title,
        type: type,
        timeout: 5,
        fade: true
    });
}

function showLoading(el) {
    var options = {
        message: "<div><img src='../Site/Styles/images/ajax-loader.gif' /> لطفاً منتظر بمانید...</div>",
        css: { 'color': '#066f77', 'font-size': 'medium', 'width': '20%', 'left': '40%', 'border': 'solid 1px #066f77', 'padding': '10px', 'background-color': '#FFFFFF' },
        overlayCSS: {
            backgroundColor: '#a3a3a3',
            opacity: 0.5,
            cursor: 'wait'
        }
    };
    $.blockUI(options);
}

function CheckServiceResultIsSuccess(result) {

    try {
        // serviceResult should not be null.
        var serviceResult = result;

        if (typeof serviceResult != 'object') {
            serviceResult = JSON.parse(result);
        }
        var serviceResponse = serviceResult.Response;        
        if (serviceResult.Successful != null && serviceResult.Successful == false) {
            if (serviceResponse.Message == "LOGINREQUIRED") {
                showMessage(serviceResponse.Message, messageList.error, "error");
            }
            showMessage(serviceResponse.Message,messageList.error,"error");
            return false;
        }
    } catch(ex) {
        // do nothing. data is not service response.
    }
    return true;
}

function hideLoading(el) {
    if (el !== undefined)
        $(el).unblock();
    else
        $.unblockUI();
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    var fixedName = '';
    name = fixedName + name;

    document.cookie = name + "=" + value + expires + "; path=/";
    console.log(document.cookie);
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

//go js utility functions
function spotConverter(dir, from) {
    if (dir === "left") {
        return (from ? go.Spot.Left : go.Spot.Right);
    } else {
        return (from ? go.Spot.Right : go.Spot.Left);
    }
}

function changeTextSize(obj, factor) {
    var adorn = obj.part;
    adorn.diagram.startTransaction("Change Text Size");
    var node = adorn.adornedPart;
    var tb = node.findObject("TEXT");
    tb.scale *= factor;
    adorn.diagram.commitTransaction("Change Text Size");
}

function toggleTextWeight(obj) {
    var adorn = obj.part;
    adorn.diagram.startTransaction("Change Text Weight");
    var node = adorn.adornedPart;
    var tb = node.findObject("TEXT");
    // assume "bold" is at the start of the font specifier
    var idx = tb.font.indexOf("bold");
    if (idx < 0) {
        tb.font = "bold " + tb.font;
    } else {
        tb.font = tb.font.substr(idx + 5);
    }
    adorn.diagram.commitTransaction("Change Text Weight");
}

function addNodeAndLink(e, obj) {
    var adorn = obj.part;
    var diagram = adorn.diagram;
    diagram.startTransaction("Add Node");
    var oldnode = adorn.adornedPart;
    var olddata = oldnode.data;
    // copy the brush and direction to the new node data
    var newdata = {
        GraphElementTitle: "شاخه جدید",
        brush: olddata.brush,
        GraphElementDirection: olddata.GraphElementDirection,
        GraphId: olddata.GraphId
    };
    if (newdata.GraphElementDirection === undefined)
        newdata.GraphElementDirection = "left";
    diagram.model.addNodeData(newdata);
    var newkey = diagram.model.getKeyForNodeData(newdata);
    var newlink = { from: olddata.key, to: newkey };
    diagram.model.addLinkData(newlink);
    layoutTree(diagram, oldnode);
    diagram.commitTransaction("Add Node");
}

function layoutTree(diagram, node) {
    if (node.data.key === 0) {  // adding to the root?
        layoutAll(diagram);  // lay out everything
    } else {  // otherwise lay out only the subtree starting at this parent node
        var parts = node.findTreeParts();
        layoutAngle(parts, node.data.GraphElementDirection === "left" ? 180 : 0);
    }
}

function layoutAngle(parts, angle) {
    var layout = go.GraphObject.make(go.TreeLayout,
        {
            angle: angle,
            arrangement: go.TreeLayout.ArrangementFixedRoots,
            nodeSpacing: 5,
            layerSpacing: 20
        });
    layout.doLayout(parts);
}

function layoutAll(myDiagram) {
    var root = myDiagram.findNodeForKey(0);
    if (root === null) return;
    myDiagram.startTransaction("Layout");
    // split the nodes and links into two collections
    var rightward = new go.Set(go.Part);
    var leftward = new go.Set(go.Part);
    root.findLinksConnected().each(function (link) {
        var child = link.toNode;
        if (child.data.GraphElementDirection === "left") {
            leftward.add(root);  // the root node is in both collections
            leftward.add(link);
            leftward.addAll(child.findTreeParts());
        } else {
            rightward.add(root);  // the root node is in both collections
            rightward.add(link);
            rightward.addAll(child.findTreeParts());
        }
    });
    // do one layout and then the other without moving the shared root node
    layoutAngle(rightward, 0);
    layoutAngle(leftward, 180);
    myDiagram.commitTransaction("Layout");
}

// Make all ports on a node visible when the mouse is over the node
function showPorts(node, show) {
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function (port) {
        if (port.portId !== "L") {
            return;
        }
        port.stroke = (show ? "black" : null);
    });
}