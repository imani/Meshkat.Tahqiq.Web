var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceBooksView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;
            this.workspaceBooksTpl = _.templateFromUrl("/site/scripts/templates/WorkspaceBooks.html", { Model: this.model });
            this.render();
        },
        render: function () {
            this.$el.html(this.workspaceBooksTpl);
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
