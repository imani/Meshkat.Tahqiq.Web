var app = app || {};

(function ($) {
    'use strict';
    app.WorkspaceGraphsView = Backbone.View.extend({
        el: '#mainDiv',
        initialize: function (workspace) {
            this.model = workspace;
            this.workspaceGraphsTpl = _.templateFromUrl("/site/scripts/templates/WorkspaceGraphs.html", { Model: this.model, isAdmin: true, person: this.model.getPersons().models[0] });
            this.render();
        },
        render: function () {
            this.$el.html(this.workspaceGraphsTpl);
            app.workspaceToolbarView = new app.WorkspaceToolbarView(this.model);
            return this;
        }
    });
})(jQuery);
