var app = app || {};

(function ($) {
    'use strict';
    app.TagGroupsView = Backbone.View.extend({
        el: '.tagGroups-container',
        initialize: function (tagGroups) {
            this.collection = tagGroup;
            this.render();
        },
        render: function () {
            for(var i = 0 ; i < this.collection.length; i++){
                var tagGroup = this.collection.models[i];
                var tagGroupsTpl = _.templateFromUrl("/site/scripts/templates/tagGroupsContainer.html", { tagGroup: tagGroup });
                this.$el.append(tagGroupsTpl);
            }            
            app.workspaceToolbarView = new app.WorkspaceToolbarView(app.workspace);
            return this;
        }
    });
})(jQuery);
