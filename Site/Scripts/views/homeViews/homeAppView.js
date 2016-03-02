var app = app || {};

(function ($) {
    'use strict';
    // The Home Application View
    app.HomeAppView = Backbone.View.extend({
        el: 'mainDiv',
        initialize: function () {
            app.NavbarView = new app.NavbarView();
            app.RecentBookView = new app.RecentBookView();
            app.CategoryView = new app.CategoryView();
            app.WorkspaceView = new app.WorkspaceView();

            $.ajax({
                type: "GET",
                url: APIServer+ "/Home/GetHomeData",
                data: { count: 20 },
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                success:
                    function (data) {
                        app.homeData = new app.HomeData(data);
                        if (readCookie("token") != null) {
                            $.ajax({
                                type: "GET",
                                url: APIServer + "/Home/GetHomeUserData",
                                dataType: "json",
                                headers: { Authorization: readCookie("token"), client_id: 'MsktLib' },
                                contentType: "application/json",
                                success: function(data) {
                                    app.person = new app.Person(data.Person);
                                    app.homeBlock = new app.HomeUserData(data);

                                    app.NavbarView.render();
                                    Backbone.history.loadUrl(Backbone.history.fragment);
                                },
                                error: function(xhr, status, error) {

                                }
                            });
                        } else {
                            app.NavbarView.render();
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }
                    },
                error: function (xhr, status, error) {

                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });
        },
    });
})(jQuery);
