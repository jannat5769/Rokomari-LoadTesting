/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20185185185185187, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "kids-toys-0"], "isController": false}, {"data": [0.0, 500, 1500, "kids-toys-1"], "isController": false}, {"data": [0.0, 500, 1500, "electronics"], "isController": false}, {"data": [0.0, 500, 1500, "book-1"], "isController": false}, {"data": [0.0, 500, 1500, "book"], "isController": false}, {"data": [0.58, 500, 1500, "book-0"], "isController": false}, {"data": [0.03, 500, 1500, "login"], "isController": false}, {"data": [0.14, 500, 1500, "cart"], "isController": false}, {"data": [0.0, 500, 1500, "offer"], "isController": false}, {"data": [0.51, 500, 1500, "offer-0"], "isController": false}, {"data": [0.09, 500, 1500, "search"], "isController": false}, {"data": [0.0, 500, 1500, "monihari-1"], "isController": false}, {"data": [0.46, 500, 1500, "monihari-0"], "isController": false}, {"data": [0.51, 500, 1500, "electronics-0"], "isController": false}, {"data": [0.0, 500, 1500, "electronics-1"], "isController": false}, {"data": [0.0, 500, 1500, "kids-toys"], "isController": false}, {"data": [0.04, 500, 1500, "login-1"], "isController": false}, {"data": [0.63, 500, 1500, "login-0"], "isController": false}, {"data": [0.0, 500, 1500, "gift-finder-browse"], "isController": false}, {"data": [0.0, 500, 1500, "monihari"], "isController": false}, {"data": [0.01, 500, 1500, "offer-1"], "isController": false}, {"data": [0.0, 500, 1500, "gift-finder-browse-1"], "isController": false}, {"data": [0.16, 500, 1500, "cart-1"], "isController": false}, {"data": [0.31, 500, 1500, "gift-finder-browse-0"], "isController": false}, {"data": [0.17, 500, 1500, "search-1"], "isController": false}, {"data": [0.66, 500, 1500, "search-0"], "isController": false}, {"data": [0.75, 500, 1500, "cart-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1350, 0, 0.0, 6859.8370370370385, 60, 44533, 4366.0, 17732.50000000001, 23069.80000000001, 31893.48, 13.38714635621709, 1816.118654895481, 2.3473989270450106], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["kids-toys-0", 50, 0, 0.0, 868.2600000000002, 478, 2313, 565.0, 1632.8, 1793.7499999999989, 2313.0, 0.8989248858365395, 0.9449947862356621, 0.13431201907518608], "isController": false}, {"data": ["kids-toys-1", 50, 0, 0.0, 12854.94, 3732, 30141, 11918.0, 19563.8, 27936.099999999995, 30141.0, 0.6616732392875103, 167.92068822701347, 0.10144794782044834], "isController": false}, {"data": ["electronics", 50, 0, 0.0, 23432.160000000003, 5923, 44533, 22545.5, 34841.2, 40935.249999999985, 44533.0, 0.9287810677267154, 413.06202864360813, 0.2430794200691013], "isController": false}, {"data": ["book-1", 50, 0, 0.0, 6318.820000000001, 1571, 17852, 5070.5, 11235.8, 13447.549999999987, 17852.0, 2.085853739935756, 242.03725334779526, 0.2485099182345334], "isController": false}, {"data": ["book", 50, 0, 0.0, 6890.24, 2136, 18346, 5774.5, 11723.3, 13957.099999999988, 18346.0, 2.0697077572646743, 242.2692372868201, 0.485087755608908], "isController": false}, {"data": ["book-0", 50, 0, 0.0, 571.0799999999998, 187, 1935, 544.5, 725.1999999999998, 843.3, 1935.0, 3.5901486321533715, 3.652275032311338, 0.41370853378329864], "isController": false}, {"data": ["login", 50, 0, 0.0, 5603.68, 968, 13749, 5505.5, 8289.499999999998, 12783.399999999996, 13749.0, 3.423953982058481, 276.80527973704034, 0.8091766246661645], "isController": false}, {"data": ["cart", 50, 0, 0.0, 4440.02, 350, 13642, 3569.5, 10105.299999999997, 12208.499999999995, 13642.0, 1.099432692730551, 153.76036472992436, 0.2576795373587229], "isController": false}, {"data": ["offer", 50, 0, 0.0, 12022.860000000004, 1678, 26265, 10804.0, 21849.1, 24514.6, 26265.0, 0.8130610120983478, 255.05265014696076, 0.19214918449980486], "isController": false}, {"data": ["offer-0", 50, 0, 0.0, 830.22, 182, 2112, 553.5, 1568.4, 1631.35, 2112.0, 0.8333333333333334, 0.8486002604166667, 0.09684244791666667], "isController": false}, {"data": ["search", 50, 0, 0.0, 3891.7200000000003, 303, 11206, 3705.0, 6579.5, 8554.8, 11206.0, 0.9905109055250698, 86.82909523638543, 0.2824503754036332], "isController": false}, {"data": ["monihari-1", 50, 0, 0.0, 13830.12, 5995, 28786, 13122.0, 21983.399999999998, 24074.299999999996, 28786.0, 0.8247150609464431, 230.12700869662032, 0.10711631162683292], "isController": false}, {"data": ["monihari-0", 50, 0, 0.0, 782.3999999999999, 494, 3890, 562.0, 1765.6999999999994, 2366.9499999999975, 3890.0, 1.0375811907281745, 1.0657093683205712, 0.1307109117225923], "isController": false}, {"data": ["electronics-0", 50, 0, 0.0, 604.0, 486, 1880, 554.0, 586.1, 1302.0999999999983, 1880.0, 2.336885399140026, 2.407904806973266, 0.301239133482894], "isController": false}, {"data": ["electronics-1", 50, 0, 0.0, 22827.8, 5364, 43987, 22014.5, 34222.2, 40369.099999999984, 43987.0, 0.9380335065568542, 416.2103768784121, 0.1245825750895822], "isController": false}, {"data": ["kids-toys", 50, 0, 0.0, 13723.56, 4284, 31605, 12740.5, 20139.399999999998, 29057.199999999997, 31605.0, 0.6570129562954982, 167.4286776505545, 0.19890040669101994], "isController": false}, {"data": ["login-1", 50, 0, 0.0, 4785.8, 620, 13154, 4680.5, 7656.199999999999, 12022.899999999998, 13154.0, 3.5762820971318217, 285.48007116801375, 0.42957294721407624], "isController": false}, {"data": ["login-0", 50, 0, 0.0, 817.22, 285, 2658, 602.0, 1476.1, 2495.7499999999995, 2658.0, 14.297969688304262, 14.55265227337718, 1.661580461824421], "isController": false}, {"data": ["gift-finder-browse", 50, 0, 0.0, 7992.199999999999, 2100, 22549, 6518.0, 14954.3, 18518.799999999985, 22549.0, 0.7616494280012795, 85.82749223593613, 0.24396583240665984], "isController": false}, {"data": ["monihari", 50, 0, 0.0, 14613.0, 6529, 29358, 13679.5, 22914.0, 24951.949999999993, 29358.0, 0.8176882318309675, 229.00611017531236, 0.20921319994112644], "isController": false}, {"data": ["offer-1", 50, 0, 0.0, 11192.44, 1496, 24701, 10126.0, 21010.0, 22944.899999999998, 24701.0, 0.8199140730051491, 256.3674815160621, 0.09848577244104818], "isController": false}, {"data": ["gift-finder-browse-1", 50, 0, 0.0, 6623.460000000002, 1614, 20987, 5435.5, 10834.4, 16942.699999999986, 20987.0, 0.7680963500061447, 85.73997022186462, 0.12451561923927737], "isController": false}, {"data": ["cart-1", 50, 0, 0.0, 3939.0199999999986, 272, 13196, 3082.0, 9674.299999999997, 11649.899999999994, 13196.0, 1.1125945705384956, 154.4698269567757, 0.13255521250556299], "isController": false}, {"data": ["gift-finder-browse-0", 50, 0, 0.0, 1368.3600000000001, 426, 7644, 574.0, 2882.2999999999997, 4746.799999999988, 7644.0, 0.7950642411906882, 0.8425817524806004, 0.1257816475321206], "isController": false}, {"data": ["search-1", 50, 0, 0.0, 3251.0200000000004, 241, 9645, 3104.0, 6031.4, 7433.199999999994, 9645.0, 1.0011413010832348, 86.71868351796049, 0.1446962036721863], "isController": false}, {"data": ["search-0", 50, 0, 0.0, 640.4400000000002, 62, 2238, 507.5, 1617.3999999999999, 2121.45, 2238.0, 0.9966711184643292, 1.0376280722387226, 0.14015687603404628], "isController": false}, {"data": ["cart-0", 50, 0, 0.0, 500.76000000000016, 60, 2223, 499.0, 560.9, 1053.9999999999955, 2223.0, 1.1077386622947913, 1.1263452101380242, 0.12764957241287636], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1350, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
