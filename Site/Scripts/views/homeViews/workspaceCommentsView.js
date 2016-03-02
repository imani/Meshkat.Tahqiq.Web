var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceBooksView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;            
            this.render();
        },
        render: function () {
            this.workspaceCommentsTpl = _.templateFromUrl("/site/scripts/templates/WorkspaceComments.html", { Model: this.model });
            this.$el.html(this.workspaceCommentsTpl);
            $.ajax({
            type: "GET",
            url: APIServer + "/BookComment/GetWorkspaceComments",
            dataType: "json",
            data: { id:this.model.getWorkspaceId(), start: 0, end: 50 },
            contentType: "application/json",
            success: function (data) {
                var commentGroups = new app.CommentGroups(data);
                this.commentGroupsView = new app.CommentGroupsView(commentGroups);
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
