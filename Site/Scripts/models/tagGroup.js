var app = app || {};

(function () {
    'use strict';

    app.tagGroup = Backbone.AssociatedModel.extend({
        defaults: {
            Key: null,
            Tags: []
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations
        relations: [
            {
                type: Backbone.Many,
                key: 'Tags',
                relatedModel: app.BookParagraphTag
            }
        ],

        //Getters
        getComments: function(){
        	return this.get("Tags");
        },
        getKey: function(){
        	return this.get("Key");
        },

        //Setters
        setComments: function(val){
        	this.set("Tags", val);
        },
        setKey: function(val){
        	this.set("Key", val);
        }
})();
