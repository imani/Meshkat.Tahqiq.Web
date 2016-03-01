var app = app || {};

(function ($) {
    'use strict';
    // Recent Books view

    app.CategoryView = Backbone.View.extend({
        el: '#categories',
        initialize: function () {
            
        },
        render: function () {
            if (app.homeData != undefined) {
                var categories = app.homeData.getCategories().models;
                for (var i = 0; i < categories.length; i++) {
                    $("#categories").append(_.templateFromUrl("/site/scripts/templates/categoryItem.html", { category: categories[i] }));
                }
                $("#categories").owlCarousel({
                    autoPlay: 3000,
                    items: 4,
                    itemsDesktop: [1199, 3],
                    itemsDesktopSmall: [979, 3],
                    rtl: true
                });
            }
        }
    });
})(jQuery);
