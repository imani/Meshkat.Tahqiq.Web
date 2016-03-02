var app = app || {};

(function ($) {
    'use strict';
    app.WorkspacePersonsView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;
            this.workspacePersonsTpl = _.templateFromUrl("/site/scripts/templates/WorkspacePersons.html", { Model: this.model });
            this.render();
        },
        render: function () {
            this.$el.html(this.workspacePersonsTpl);
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
