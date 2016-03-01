//////////////////////////////////////////// Highlighter//////////////////////////////////////////////////////////////////////////////

var nodeTypes = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3
};

function doHighlight(css, container, range) {    
    if (!range || range.collapsed) return;
    //var rangeText = range.toString();
    var $wrapper = $('<span></span>').addClass(css);    
    var createdHighlights = highlightRange(range, $wrapper, container);
    removeAllRanges();
    var paragraphs = postProcess(createdHighlights, css);
    mergeSameClasses(paragraphs);
    var sections = getClassSections(paragraphs, css);
    return sections;
}

function postProcess(highlights,css) {

    var paragraphs = [];
    for (var i = 0; i < highlights.length; i++) {
        var parentParagraph = $(highlights[i]).closest(".paragraph");
        var exists = false;
        for (var j = 0; j < paragraphs.length; j++) {
            if ($(paragraphs[j]).data().id === parentParagraph.data().id) {
                exists = true;
                break;
            }
        }
        if (!exists)
            paragraphs.push(parentParagraph);
        
        mergeWithParent(highlights[i]);
    }
    return paragraphs;
}

function mergeSameClasses(paragraphs) {
    for (var i = 0; i < paragraphs.length; i++) {
        var spans = $(paragraphs[i]).children();
        for (var j = 0; j < spans.length; j++) {
            var span = $(spans[j]);
            if ($(span).hasClass('Meshkat-highlighted') && $(span).hasClass('Meshkat-commented')) {
                $(span).removeClass('Meshkat-highlighted');
                $(span).removeClass('Meshkat-commented');
                $(span).addClass('Meshkat-commentedhighlighted');
            }
        }
    }

    for (var i = 0; i < paragraphs.length; i++) {
        var spans = $(paragraphs[i]).children();
        var j = 0;
        while (spans[j] !== undefined) {
            var current = $(spans[j]);
            var next = $(spans[j + 1]);
            if (next != undefined) {
                if (hasSameClass(current, next)) {
                    var newText = $(current).text() + $(next).text();
                    var classes = next.attr('class');
                    current.remove();
                    next.html(newText);
                    next.attr('class', classes);
                }
            }
            j++;
        }
    }
}
function hasSameClass(elem1, elem2) {
    var classes1 = $(elem1).attr("class");
    if (classes1 === undefined)
        classes1 = "";
    classes1 = classes1.split(" ");

    var classes2 = $(elem2).attr("class");
    if (classes2 === undefined)
        classes2 = "";
    classes2 = classes2.split(" ");

    if (classes1.length != classes2.length)
        return false;
    
    classes1 = $(classes1).sort();
    classes2 = $(classes2).sort();
    for (var i = 0; i < classes1.length; i++)
        if (classes1[i] !== classes2[i])
            return false;
    return true;
}

function mergeWithParent(hl) {
    var parent = $(hl).parent();
    var contents = parent.contents();
    var html = "";
    var parentCss = parent.attr("class") === undefined ? "" : parent.attr("class");
    for (var i = 0; i < contents.length; i++) {
        if ($(contents[i]).text().length > 0) {

            var ownCss = $(contents[i]).attr("class") === undefined ? "" : $(contents[i]).attr("class");
            if (parentCss !== "" || ownCss !== "") {
                var ownParts = ownCss.split(" ");
                var parentParts = parentCss.split(" ");
                var temp = $("<span></span>");
                for (var j = 0; j < ownParts.length; j++)
                    temp.addClass(ownParts[j]);
                for (var j = 0; j < parentParts.length; j++)
                    temp.addClass(parentParts[j]);
                html += "<span class='" +temp.attr("class") + "'>" + $(contents[i]).text() + "</span>";
            } else
                html += "<span>" + $(contents[i]).text() + "</span>";
        }
    }
    $(parent).replaceWith($(html));
}
function getCurrentRange() {
    var selection = getCurrentSelection();

    var range;
    if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
    }
    return range;
}
function getCurrentSelection() {
    var currentWindow = getCurrentWindow();
    var selection;

    if (currentWindow.getSelection) {
        selection = currentWindow.getSelection();
    } else if ($('iframe').length) {
        $('iframe', top.document).each(function() {
            if (this.contentWindow === currentWindow) {
                selection = rangy.getIframeSelection(this);
                return false;
            }
        });
    } else {
        selection = rangy.getSelection();
    }

    return selection;
}
function getCurrentWindow() {
    var currentDoc = document;
    if (currentDoc.defaultView) {
        return currentDoc.defaultView; // Non-IE
    } else {
        return currentDoc.parentWindow; // IE
    }
}

/**
 * Wraps given range (highlights it) object in the given wrapper.
 */
function highlightRange(range, $wrapper, container) {
    if (range.collapsed) return;

    // Don't highlight content of these tags
    var ignoreTags = ['SCRIPT', 'STYLE', 'SELECT', 'BUTTON', 'OBJECT', 'APPLET'];
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    var ancestor = range.commonAncestorContainer;
    var goDeeper = true;

    if (range.endOffset == 0) {
        while (!endContainer.previousSibling && endContainer.parentNode != ancestor) {
            endContainer = endContainer.parentNode;
        }
        endContainer = endContainer.previousSibling;
    } else if (endContainer.nodeType == nodeTypes.TEXT_NODE) {
        if (range.endOffset < endContainer.nodeValue.length) {
            endContainer.splitText(range.endOffset);
        }
    } else if (range.endOffset > 0) {
        endContainer = endContainer.childNodes.item(range.endOffset - 1);
    }

    if (startContainer.nodeType == nodeTypes.TEXT_NODE) {
        if (range.startOffset == startContainer.nodeValue.length) {
            goDeeper = false;
        } else if (range.startOffset > 0) {
            startContainer = startContainer.splitText(range.startOffset);
            if (endContainer == startContainer.previousSibling) endContainer = startContainer;
        }
    } else if (range.startOffset < startContainer.childNodes.length) {
        startContainer = startContainer.childNodes.item(range.startOffset);
    } else {
        startContainer = startContainer.nextSibling;
    }

    var done = false;
    var node = startContainer;
    var highlights = [];

    do {
        if (goDeeper && node.nodeType == nodeTypes.TEXT_NODE) {

            //if (/\S/.test(node.nodeValue))
            //{
            var wrapper = $wrapper.clone(true).get(0);
            var nodeParent = node.parentNode;

            // highlight if node is inside the context
            if ($(container).get(0).contains(nodeParent)) {
                var highlight = $(node).wrap(wrapper).parent().get(0);
                highlights.push(highlight);
            }
            //}

            goDeeper = false;
        }
        if (node == endContainer && (!endContainer.hasChildNodes() || !goDeeper)) {
            done = true;
        }

        if ($.inArray(node.tagName, ignoreTags) != -1) {
            goDeeper = false;
        }
        if (goDeeper && node.hasChildNodes()) {
            node = node.firstChild;
        } else if (node.nextSibling != null) {
            node = node.nextSibling;
            goDeeper = true;
        } else {
            node = node.parentNode;
            goDeeper = false;
        }
    } while (!done);

    return highlights;
}
function removeAllRanges() {
    var selection = this.getCurrentSelection();
    selection.removeAllRanges();
}
function getClassSections(paragraphs,css) {
    var sections = [];
    for (var k = 0; k < paragraphs.length; k++) {
        var spans = $(paragraphs[k]).find('span');
        for (var i = 0; i < spans.length; i++) {
            if ($(spans[i]).hasClass(css) || $(spans[i]).hasClass('Meshkat-commentedhighlighted')) {
                var start = i;
                while ($(spans[i]).hasClass(css) || $(spans[i]).hasClass('Meshkat-commentedhighlighted')) {
                    i++;
                }
                var end = i - 1;
                if (end < start)
                    end = start;
                var startOffset = 0;
                var length = 0;
                for (var j = 0; j < start; j++)
                    startOffset += $(spans[j]).text().length;
                for (var j = start; j <= end; j++)
                    length += $(spans[j]).text().length;
                sections.push(new app.Section({ParagraphId:$(paragraphs[k]).data().id, StartOffset: startOffset, EndOffset: startOffset + length - 1,Text:"" }));
            }
        }
    }
    
    return sections;
}