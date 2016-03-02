var app = app || {};

(function ($) {
    'use strict';
    app.CommentGroupsView = Backbone.View.extend({
        el: '.commentGroups-container',
        initialize: function (commentGroups) {
            this.collection = commentGroup;
            this.render();
        },
        render: function () {
            for(var i = 0 ; i < this.collection.length; i++){
                var commentGroup = this.collection.models[i];
                var commentGroupTpl = _.templateFromUrl("/site/scripts/templates/commentGroupsContainer.html", { commentGroup: commentGroup });
                this.$el.append(commentGroupTpl);
            }            
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
