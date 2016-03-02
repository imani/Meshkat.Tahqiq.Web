// The Home Application. Define globals here.
$(function () {
    'use strict';
    new app.HomeAppView();
});

_.mixin({
    templateFromUrl: function (url, data, settings) {
        var templateHtml = "";
        this.cache = this.cache || {};

        if (this.cache[url]) {
            templateHtml = this.cache[url];
        } else {
            $.ajax({
                type: "GET",
                url: url,
                async:false,
                success: function (data) {
                    templateHtml = data;
                },
                error: function (xhr, status, error) {

                },
                contentType: "application/json; charset=utf-8",
                cache: false
            });

            this.cache[url] = templateHtml;
        }
        return _.template(templateHtml, data, settings);
    }
});