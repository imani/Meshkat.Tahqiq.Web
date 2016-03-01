var app = app || {};

(function ($) {
    'use strict';
    // Top bar view
    app.TimeoutView = Backbone.View.extend({
        el: '#pnlTimeout',
        events: {
            "click .btn-default": "gotoLogin"
        },
        initialize: function () {
            this.$el.dialog({
                autoOpen: false,
                height: 80,
                width: 290,
                modal: true,
                buttons: {
                },
                close: function () {
                },
                dialogClass: 'noTitleStuff'
            });
        },
        gotoLogin: function () {
            window.location = "/Security/Views/Account/Index.html";
        },
        show: function () {
            this.$el.dialog("open");
        },
        isShowing: function () {
            return this.$el.dialog("isOpen");
        }
    });
})(jQuery);
