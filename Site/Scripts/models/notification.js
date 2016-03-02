var app = app || {};

(function () {
    'use strict';

    app.Notification = Backbone.AssociatedModel.extend({
        defaults: {
            Action: null,
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
                key: 'Action',
                relatedModel: app.Action
            },
            {
                type: Backbone.One,
                key: 'Reciever',
                relatedModel: app.Person
            }
        ],

        //Getters
        getAction: function(){
        	return this.get("Action");
        },
        getReciever: function(){
        	return this.get("Reciever");
        },
        isRead: function(){
        	return this.get("isREad");
        },

        //Setters
        setAction: function(val){
        	this.set("Action", val);
        },
        setReciever: function(val){
        	this.set("Reciever", val);
        },
        setRead: function(val){
        	this.set("isREad", val);
        },
    });
})();
