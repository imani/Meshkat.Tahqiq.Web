var app = app || {};

(function () {
    'use strict';

    app.CommentGroup = Backbone.AssociatedModel.extend({
        defaults: {
            Key: null,
            Comments: []
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Meny,
                key: 'Comments',
                relatedModel: app.BookComment
            }
        ],

        //Getters
        getComments: function(){
        	return this.get("Comments");
        },
        getKey: function(){
        	return this.get("Key");
        },

        //Setters
        setComments: function(val){
        	this.set("Comments", val);
        },
        setKey: function(val){
        	this.set("Key", val);
        }
})();
