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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5259259259259259, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.95, 500, 1500, "kids-toys-0"], "isController": false}, {"data": [0.15, 500, 1500, "kids-toys-1"], "isController": false}, {"data": [0.0, 500, 1500, "electronics"], "isController": false}, {"data": [0.35, 500, 1500, "book-1"], "isController": false}, {"data": [0.25, 500, 1500, "book"], "isController": false}, {"data": [1.0, 500, 1500, "book-0"], "isController": false}, {"data": [0.3, 500, 1500, "login"], "isController": false}, {"data": [0.6, 500, 1500, "cart"], "isController": false}, {"data": [0.05, 500, 1500, "offer"], "isController": false}, {"data": [1.0, 500, 1500, "offer-0"], "isController": false}, {"data": [0.6, 500, 1500, "search"], "isController": false}, {"data": [0.05, 500, 1500, "monihari-1"], "isController": false}, {"data": [0.95, 500, 1500, "monihari-0"], "isController": false}, {"data": [1.0, 500, 1500, "electronics-0"], "isController": false}, {"data": [0.05, 500, 1500, "electronics-1"], "isController": false}, {"data": [0.1, 500, 1500, "kids-toys"], "isController": false}, {"data": [0.55, 500, 1500, "login-1"], "isController": false}, {"data": [0.8, 500, 1500, "login-0"], "isController": false}, {"data": [0.35, 500, 1500, "gift-finder-browse"], "isController": false}, {"data": [0.0, 500, 1500, "monihari"], "isController": false}, {"data": [0.25, 500, 1500, "offer-1"], "isController": false}, {"data": [0.45, 500, 1500, "gift-finder-browse-1"], "isController": false}, {"data": [0.65, 500, 1500, "cart-1"], "isController": false}, {"data": [1.0, 500, 1500, "gift-finder-browse-0"], "isController": false}, {"data": [0.75, 500, 1500, "search-1"], "isController": false}, {"data": [1.0, 500, 1500, "search-0"], "isController": false}, {"data": [1.0, 500, 1500, "cart-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 270, 0, 0.0, 1361.9074074074072, 68, 9259, 875.5, 3235.8, 4601.599999999999, 7362.470000000039, 13.12208398133748, 1778.7030399494556, 2.3009209758942455], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["kids-toys-0", 10, 0, 0.0, 349.2, 276, 517, 331.0, 505.6, 517.0, 517.0, 1.188212927756654, 1.2457669914448668, 0.17753572065114068], "isController": false}, {"data": ["kids-toys-1", 10, 0, 0.0, 2998.5, 871, 8742, 2315.0, 8518.7, 8742.0, 8742.0, 1.00999899000101, 256.3173266904858, 0.15485336077163922], "isController": false}, {"data": ["electronics", 10, 0, 0.0, 4128.7, 1676, 6325, 4444.0, 6206.0, 6325.0, 6325.0, 1.1892020454275183, 528.8769380277083, 0.3112364728267332], "isController": false}, {"data": ["book-1", 10, 0, 0.0, 1466.4, 360, 2732, 1515.5, 2667.2000000000003, 2732.0, 2732.0, 2.70929287455974, 314.37375118531565, 0.322786846383094], "isController": false}, {"data": ["book", 10, 0, 0.0, 1666.2, 526, 2954, 1730.0, 2891.0, 2954.0, 2954.0, 2.5826446280991737, 302.30712890625, 0.6053073347107438], "isController": false}, {"data": ["book-0", 10, 0, 0.0, 199.29999999999998, 165, 239, 195.0, 238.3, 239.0, 239.0, 8.771929824561402, 8.929550438596491, 1.010827850877193], "isController": false}, {"data": ["login", 10, 0, 0.0, 1307.8000000000002, 753, 1975, 1311.5, 1953.3000000000002, 1975.0, 1975.0, 4.653327128897161, 376.17332916472776, 1.0997120753838994], "isController": false}, {"data": ["cart", 10, 0, 0.0, 915.6, 299, 1565, 1041.0, 1537.7, 1565.0, 1565.0, 1.450536698578474, 202.8598237597911, 0.33996953872932983], "isController": false}, {"data": ["offer", 10, 0, 0.0, 1871.5, 1477, 2351, 1841.0, 2339.4, 2351.0, 2351.0, 1.098659635245001, 344.6430901175566, 0.259644171610635], "isController": false}, {"data": ["offer-0", 10, 0, 0.0, 307.9, 166, 402, 303.0, 401.3, 402.0, 402.0, 1.3592496941688188, 1.3826117982873454, 0.15795968125594673], "isController": false}, {"data": ["search", 10, 0, 0.0, 768.3, 320, 1104, 896.0, 1099.6, 1104.0, 1104.0, 1.3299640909695438, 116.5881070039234, 0.37924757281553395], "isController": false}, {"data": ["monihari-1", 10, 0, 0.0, 2362.1, 1329, 3239, 2119.5, 3235.8, 3239.0, 3239.0, 0.9954210631096955, 276.2875732567689, 0.12928808729842725], "isController": false}, {"data": ["monihari-0", 10, 0, 0.0, 402.90000000000003, 259, 510, 404.5, 508.8, 510.0, 510.0, 1.385809312638581, 1.4250558654379157, 0.1745794934866962], "isController": false}, {"data": ["electronics-0", 10, 0, 0.0, 338.0, 220, 487, 303.5, 485.9, 487.0, 487.0, 2.771618625277162, 2.8539010532150777, 0.3572789634146341], "isController": false}, {"data": ["electronics-1", 10, 0, 0.0, 3790.4, 1456, 6051, 4012.0, 5933.700000000001, 6051.0, 6051.0, 1.2211503236048358, 541.8279761723043, 0.16218402735376725], "isController": false}, {"data": ["kids-toys", 10, 0, 0.0, 3348.1, 1228, 9259, 2655.0, 9013.0, 9259.0, 9259.0, 0.959877135726627, 244.60378446558843, 0.2905878047609906], "isController": false}, {"data": ["login-1", 10, 0, 0.0, 856.8, 481, 1400, 829.0, 1368.7, 1400.0, 1400.0, 7.132667617689016, 569.3624063837376, 0.8567559736091299], "isController": false}, {"data": ["login-0", 10, 0, 0.0, 448.30000000000007, 204, 743, 423.0, 743.0, 743.0, 743.0, 10.101010101010102, 10.252919823232324, 1.1738478535353536], "isController": false}, {"data": ["gift-finder-browse", 10, 0, 0.0, 1617.4, 743, 5033, 1138.0, 4749.300000000001, 5033.0, 5033.0, 1.2303149606299213, 138.63282691775345, 0.39408526082677164], "isController": false}, {"data": ["monihari", 10, 0, 0.0, 2765.5, 1840, 3714, 2528.5, 3689.2000000000003, 3714.0, 3714.0, 0.9564801530368245, 266.4627607902917, 0.24472441415590626], "isController": false}, {"data": ["offer-1", 10, 0, 0.0, 1563.1, 1074, 1956, 1542.5, 1946.1000000000001, 1956.0, 1956.0, 1.1349449551696742, 354.8711305470435, 0.13632639598229487], "isController": false}, {"data": ["gift-finder-browse-1", 10, 0, 0.0, 1325.8, 441, 4693, 843.5, 4426.300000000001, 4693.0, 4693.0, 1.287001287001287, 143.65837656853282, 0.20863497425997427], "isController": false}, {"data": ["cart-1", 10, 0, 0.0, 666.0000000000001, 151, 1279, 700.0, 1261.0, 1279.0, 1279.0, 1.49947518368571, 208.18045715249664, 0.17864841055630531], "isController": false}, {"data": ["gift-finder-browse-0", 10, 0, 0.0, 290.9, 153, 438, 306.5, 430.0, 438.0, 438.0, 1.4405070584845865, 1.5243490708729472, 0.22789271823681936], "isController": false}, {"data": ["search-1", 10, 0, 0.0, 507.0999999999999, 165, 813, 517.5, 805.5, 813.0, 813.0, 1.3719303059404582, 118.8363619409384, 0.19828680203045687], "isController": false}, {"data": ["search-0", 10, 0, 0.0, 260.8, 72, 432, 275.0, 428.0, 432.0, 432.0, 1.3753266400770183, 1.4341540881584376, 0.1934053087608307], "isController": false}, {"data": ["cart-0", 10, 0, 0.0, 248.9, 68, 478, 208.5, 476.7, 478.0, 478.0, 1.5008254539997, 1.5248621116614136, 0.17294668317574666], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 270, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
