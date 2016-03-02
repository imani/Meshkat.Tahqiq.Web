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
	      getActionId: function() {
	      	return this.get("ActionId");
	      	 },
	     getType: function() {
	     	return this.get("ActionType");
	     	 },
	     getActionDoer: function() {
	     	return this.get("ActionDoer");
	     	 },
	     getActionObject: function() {
	     	return this.get("ActionObject");
	     	 },
	     getWorkspace: function() {
	     	return this.get("Workspace");
	     	 },
	     getDate: function() {
	     	return this.get("Date");
	     	 },
        //Setters
        setActionId: function(val) {
	      	 this.set("ActionId", val);
	      	 },
	    setType: function(val) {
	     	 this.set("ActionType", val);
	     	 },
	    setActionDoer: function(val) {
	     	 this.set("ActionDoer", val);
	     	 },
	    setActionObject: function(val) {
	     	 this.set("ActionObject", val);
	     	 },
	    setWorkspace: function(val) {
	     	 this.set("Workspace", val);
	     	 },
	    setDate: function(val) {
	     	 this.set("Date", val);
	     	 }
    });
})();
