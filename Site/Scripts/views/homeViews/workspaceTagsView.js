var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceTagsView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;            
            this.render();
        },
        render: function () {
            this.workspaceTagsTpl = _.templateFromUrl("/site/scripts/templates/WorkspaceTags.html", { Model: this.model });
            this.$el.html(this.workspaceTagsTpl);
            $.ajax({
            type: "GET",
            url: APIServer + "/BookComment/GetWorkspaceTags",
            dataType: "json",
            data: { id:this.model.getWorkspaceId(), start: 0, end: 50 },
            contentType: "application/json",
            success: function (data) {
                var tagGroups = new app.TagGroups(data);
                this.tagGroupsView = new app.TagGroupsView(tagGroups);
            },
            error: function (xhr, status, error) {
                $("#Result").html(error);
            }
        });
            
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
