var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceBooksView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;
            this.workspaceCommentsTpl = _.templateFromUrl("/site/scripts/templates/WorkspaceComments.html", { Model: this.model });
            this.render();
        },
        render: function () {
            this.$el.html(this.workspaceCommentsTpl);
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
