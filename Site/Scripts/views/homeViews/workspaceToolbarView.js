var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceToolbarView = Backbone.View.extend({
        el: '#workspaceToolbar',
        initialize: function (workspace) {
            this.model = workspace;
            this.workspaceToolbarTpl = _.templateFromUrl("/site/scripts/templates/workspaceToolbar.html", { Model: this.model });
            this.render();
        },
        render: function () {
            this.$el.html(this.workspaceToolbarTpl);
            return this;
        }
    });
})(jQuery);
