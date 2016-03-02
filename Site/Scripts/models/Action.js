var app = app || {};

(function () {
    'use strict';

    app.Notification = Backbone.AssociatedModel.extend({
        defaults: {
            ActionId: null,
            Reciever: null,
            isRead: false
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.One,
                key: 'ActionType',
                relatedModel: app.ActionType
            },
            {
                type: Backbone.One,
                key: 'ActionDoer',
                relatedModel: app.Person
            },
            {
                type: Backbone.One,
                key: 'Workspace',
                relatedModel: app.Workspace
            }
        ],

        //Getters
        getVolumes: function () {
            return this.get("Volumes");
        },
        getCategories: function () {
            return this.get("Categories");
        },

        //Setters
        setVolumes: function (val) {
            this.set("Volumes", val);
        },
        setCategories: function (val) {
            this.set("Categories", val);
        }
    });
})();
