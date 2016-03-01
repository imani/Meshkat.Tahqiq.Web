var app = app || {};

(function ($) {
    'use strict';
    // navbar view


    app.NavbarView = Backbone.View.extend({
        el: '#contentNavbar',
        events: {
            "click li.dropdown.mega-dropdown a": "hoverLogin",
            "click #loginButton":"clickLogin"
        },
        initialize: function () {
        },
        render:function() {
            if (readCookie("token") == null)
                $(this.el).html(_.templateFromUrl("/site/scripts/templates/navbarGuest.html"));
            else
                $(this.el).html(_.templateFromUrl("/site/scripts/templates/navbarUser.html", { person: app.person, hasUnreadNotifications: null }));
        },
        hoverLogin:function() {
            $("li.dropdown.mega-dropdown a").parent().toggleClass("open");
        },
        clickLogin: function () {
            $("#loginError").hide();
            var l = Ladda.create(document.querySelector('#loginButton'));
            l.start();
            $.ajax({
                type: "POST",
                url: SSOServer + "/token",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                data: { grant_type: 'password', client_id: 'MsktLib', UserName: $("#username").val(), Password: $("#password").val() },
                success:
                    function (data) {
                        createCookie("token", "Bearer " + data.access_token, 1);
                        createCookie("username", $("#username").val(), 1);

                        $.ajax({
                            type: "GET",
                            url: "/Home/GetIdentity",
                            dataType: "json",
                            contentType: "application/json",
                            headers: { Authorization: readCookie("token") },
                            success:
                                function (data) {
                                    l.stop();
                                    location.reload();
                                },
                            error: function (xhr, status, error) {
                                showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                                $("#loginError").show();
                            }
                        });
                    },
                error: function (xhr, status, error) {
                    showMessage(error, messageList.ERROR_TITLE, "error", xhr.status);
                    $("#loginError").show();
                }
            });
        }
    });
})(jQuery);
