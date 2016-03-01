var app = app || {};

(function () {
    'use strict';

    app.Person = Backbone.AssociatedModel.extend({
        defaults: {
            PersonId: null,
            PersonName: null,
            PersonLastName: null,
            PersonNationalCode: null,
            PersonIdentity: null,
            PersonAddress: null,
            PersonImagePath: null,
            WorkspaceThatAccess: null,
            UserIsMaster:null
        },
        constructor: function (attributes, options) {
            Backbone.Model.apply(this, arguments);
        },

        //Relations

        //Getters
        getPersonId: function () {
            return this.get("PersonId");
        },
        getPersonName: function () {
            return this.get("PersonName");
        },
        getPersonLastName: function () {
            return this.get("PersonLastName");
        },
        getPersonNationalCode: function () {
            return this.get("PersonNationalCode");
        },
        getPersonIdentity: function () {
            return this.get("PersonIdentity");
        },
        getPersonAddress: function () {
            return this.get("PersonAddress");
        },
        getPersonImagePath: function () {
            return this.get("PersonImagePath");
        },
        getWorkspaceThatAccess: function () {
            return this.get("WorkspaceThatAccess");
        },
        getUserIsMaster:function(){
            return this.get("UserIsMaster");
        },
        //Setters
        setPersonId: function (val) {
            this.set("PersonId", val);
        },
        setPersonName: function (val) {
            this.set("PersonName", val);
        },
        setPersonLastName: function (val) {
            this.set("PersonLastName", val);
        },
        
        setPersonNationalCode: function (val) {
            this.set("PersonImagePath", val);
        },
        setPersonIdentity: function (val) {
            this.set("PersonIdentity", val);
        },
        setPersonAddress: function (val) {
            this.set("PersonAddress", val);
        },
        setPersonImagePath: function (val) {
            this.set("PersonNationalCode", val);
        },
        setWorkspaceThatAccess: function (val) {
            this.set("WorkspaceThatAccess", val);
        },
        setUserIsMaster: function (val) {
            this.set("UserIsMaster", val);
        }
    });
})();
