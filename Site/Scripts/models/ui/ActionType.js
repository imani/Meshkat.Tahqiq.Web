var app = app || {};

(function () {
    'use strict';

    app.Notification = Backbone.AssociatedModel.extend({
        defaults: {
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Getters
        getTypeId: function () {
        	return this.get('TypeId');
        },

        getTypeName: function () {
        	return this.get('TypeName');
        },

        getTypeDescription: function () {
        	return this.get('TypeDescription');
        },

        getObjectDataType: function () {
        	return this.get('ObjectDataType');
        }

        //Setters
        setTypeId: function (value) {
        	this.set('TypeId', value);
        },
        
        setTypeName: function (value) {
        	this.set('TypeName', value);
        },
        
        setTypeDescription: function (value) {
        	this.set('TypeDescription', value);
        },
        
        setObjectDataType: function (value) {
        	this.set('ObjectDataType', value);
        }
    });
})();
