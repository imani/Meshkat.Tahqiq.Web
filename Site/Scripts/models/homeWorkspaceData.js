var app = app || {};

(function () {
    'use strict';

    app.HomeWorkspaceData = Backbone.AssociatedModel.extend({
        defaults: {
            Person: null,
            Workspaces:[]
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Workspaces',
                relatedModel: app.Workspace
            }
        ],

        //Getters
        getPerson: function () {
            return this.get("Person");
        },
        getWorkspaces: function () {
            return this.get("Workspaces");
        },

        //Setters
        setPerson: function (val) {
            this.set("Person", val);
        },
        setWorkspaces: function (val) {
            this.set("Workspaces", val);
        }
    });
})();
