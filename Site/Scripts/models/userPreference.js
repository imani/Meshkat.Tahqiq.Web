var app = app || {};

(function () {
    'use strict';

    app.UserPreference = Backbone.AssociatedModel.extend({
        defaults: {
            State: [],
            PersonId: null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'State',
                relatedModel: app.StateItem
            },
        ],

        //Getters
        getState: function () {
            return this.get("State");
        },
        getPersonId: function () {
            return this.get("PersonId");
        },

        //Setters
        setState: function (val) {
            this.set("State", val);
        },
        setPersonId: function (val) {
            this.set("PersonId", val);
        }
    });
})();
