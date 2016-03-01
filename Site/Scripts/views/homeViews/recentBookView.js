var app = app || {};

(function ($) {
    'use strict';
    // Recent Books view

    app.RecentBookView = Backbone.View.extend({
        el: '#books',
        initialize: function () {
            
        },
        render: function () {
            if (app.homeData != undefined) {
                var vols = app.homeData.getVolumes().models;
                for (var i = 0; i < vols.length; i++) {
                    $("#books").append(_.templateFromUrl("/site/scripts/templates/bookItem.html", { volume: vols[i] }));
                    $("#homeContent").append(_.templateFromUrl("/site/scripts/templates/bookModal.html", { volume: vols[i], HasAccess: false, personWorkspaces: null }));
                }

                $("#books").owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 4000,
                    autoplayHoverPause: true,
                    items: 5,
                    itemsDesktop: [1199, 4],
                    itemsDesktopSmall: [979, 3],
                    loop: true,
                    nav: true,
                    dots: false,
                    navText: ["<span class='fa fa-chevron-left'></span>", "<i class='fa fa-chevron-right'></i>"],
                    rtl: true
                });
            }
        }
    });
})(jQuery);
