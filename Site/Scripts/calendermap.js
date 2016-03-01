var cellSize = 670;
week_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
    format = d3.time.format("%d-%b-%y");
parseDate = d3.time.format("%d-%b-%y").parse;

var color = d3.scale.linear().range(['#eeeeee', '#1e6823'])
    .domain([0, 1])



$(document).ready(function () {
    var data = [{ "key": "Group1", "value": 37, "date": "1-May-12" }, { "key": "Group1", "value": 32, "date": "30-Apr-12" }, { "key": "Group1", "value": 45, "date": "27-Apr-12" }, { "key": "Group1", "value": 24, "date": "26-Apr-12" }];
    //script for drawing calendar view charn in person overview
    var width = $(".calender-map").width() + 60,
        height = 120;
    cellSize = Math.round($(".calender-map").width()/53); // cell size
    var svg = d3.select(".calender-map").selectAll("svg")
        .data(d3.range(2012, 2013))
        .enter().append("svg")
        .attr("width", '100%')
        .attr("data-height", '0.5678')
        .attr("viewBox", '0 0 '+ $('.panel').width() + ' 165')
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-38," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    for (var i = 0; i < 7; i++) {
        svg.append("text")
            .attr("transform", "translate(-5," + cellSize * (i + 1) + ")")
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(function(d) { return week_days[i]; });
    }

    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; })
        .attr("y", function(d) { return day(d) * cellSize; })
        .attr("fill", '#eeeeee')
        .datum(format);

    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (((i + 1) * (4 * cellSize)) + 8) + ",0)"; });

    legend.append("text")
        .attr("class", function(d, i) { return month[i] })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) { return month[i] });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("id", function(d, i) { return month[i] })
        .attr("d", monthPath);



    data.forEach(function(d) {
        d.value = parseInt(d.value);
    });

    var Comparison_Type_Max = d3.max(data, function(d) { return d.value; });

    var data = d3.nest()
        .key(function(d) { return d.date; })
        .rollup(function(d) { return Math.sqrt(d[0].value / Comparison_Type_Max); })
        .map(data);

    rect.filter(function(d) { return d in data; })
        .attr("fill", function(d) { return color(data[d]); })
        .attr("data-title", function(d) { return "value : " + Math.round(data[d] * 100) });
    $("rect").tooltip({ container: 'body', html: true, placement: 'top' });

});

    function numberWithCommas(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x;
    }

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }
