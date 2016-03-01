var app = app || {};

(function($) {
    'use strict';
    // workspace view
    app.WorkspaceView = Backbone.View.extend({
        el: '#mainDiv',
        events: {
            "click #btnNewWorkspace": "clickNewWorkspace"
        },
        initialize: function (workspace) {
            //this.model = workspace;
            //this.render();
        },
        render: function () {
            this.workspaceOverviewtpl = _.templateFromUrl("/site/scripts/templates/workspaceOverview.html", { Model: app.workspace });
            $("#mainDiv").html(this.workspaceOverviewtpl);
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        },
        renderFormNew: function() {
            $(this.el).html(_.templateFromUrl("/site/scripts/templates/workspaceNew.html"));
        },
        clickNewWorkspace: function() {
            var l = Ladda.create(document.querySelector('#btnNewWorkspace'));
            l.start();
            $.ajax({
                type: "GET",
                url: "/Home/AddWorkspace",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                headers: { Authorization: readCookie("token"), client_id: 'MsktLib' },
                data: { workspaceTitle: $("#WorkspaceTitle").val(), workspaceDescription: $("#WorkspaceDescription").val() },
                success:
                    function(data) {
                        l.stop();
                        app.app_router.navigate("#workspaceOverview", true);
                    },
                error: function(xhr, status, error) {
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                }
            });
        }
    });
})(jQuery);
