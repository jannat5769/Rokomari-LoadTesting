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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36, 500, 1500, "kids-toys-0"], "isController": false}, {"data": [0.0, 500, 1500, "kids-toys-1"], "isController": false}, {"data": [0.0, 500, 1500, "electronics"], "isController": false}, {"data": [0.0, 500, 1500, "book-1"], "isController": false}, {"data": [0.0, 500, 1500, "book"], "isController": false}, {"data": [0.48, 500, 1500, "book-0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": false}, {"data": [0.06, 500, 1500, "cart"], "isController": false}, {"data": [0.0, 500, 1500, "offer"], "isController": false}, {"data": [0.305, 500, 1500, "offer-0"], "isController": false}, {"data": [0.04, 500, 1500, "search"], "isController": false}, {"data": [0.0, 500, 1500, "monihari-1"], "isController": false}, {"data": [0.05, 500, 1500, "monihari-0"], "isController": false}, {"data": [0.425, 500, 1500, "electronics-0"], "isController": false}, {"data": [0.0, 500, 1500, "electronics-1"], "isController": false}, {"data": [0.0, 500, 1500, "kids-toys"], "isController": false}, {"data": [0.015, 500, 1500, "login-1"], "isController": false}, {"data": [0.225, 500, 1500, "login-0"], "isController": false}, {"data": [0.0, 500, 1500, "gift-finder-browse"], "isController": false}, {"data": [0.0, 500, 1500, "monihari"], "isController": false}, {"data": [0.0, 500, 1500, "offer-1"], "isController": false}, {"data": [0.0, 500, 1500, "gift-finder-browse-1"], "isController": false}, {"data": [0.08, 500, 1500, "cart-1"], "isController": false}, {"data": [0.245, 500, 1500, "gift-finder-browse-0"], "isController": false}, {"data": [0.045, 500, 1500, "search-1"], "isController": false}, {"data": [0.43, 500, 1500, "search-0"], "isController": false}, {"data": [0.57, 500, 1500, "cart-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 0, 0.0, 15359.401851851837, 67, 84413, 9536.5, 38349.8, 46098.95, 57691.27999999996, 12.076700466518465, 1792.3988108084234, 2.1176158804138283], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["kids-toys-0", 100, 0, 0.0, 1078.38, 523, 6681, 570.0, 2289.9, 3228.45, 6650.549999999985, 0.9237875288683602, 0.9705542725173211, 0.13802684757505773], "isController": false}, {"data": ["kids-toys-1", 100, 0, 0.0, 24827.969999999998, 7555, 45095, 25021.0, 35262.8, 40398.04999999996, 45079.77999999999, 0.7749354866207389, 196.66476242415317, 0.11881335097603124], "isController": false}, {"data": ["electronics", 100, 0, 0.0, 46130.49000000001, 8786, 70805, 46151.5, 58346.4, 64917.14999999999, 70791.18999999999, 0.819685568615879, 364.54397401750435, 0.21452708241118706], "isController": false}, {"data": ["book-1", 100, 0, 0.0, 31907.469999999998, 13161, 83849, 31371.0, 45148.3, 48843.44999999999, 83570.87999999986, 1.0972491962649638, 316.83744536041894, 0.13072695502375545], "isController": false}, {"data": ["book", 100, 0, 0.0, 32594.56, 13957, 84413, 31933.5, 45723.6, 49394.049999999996, 84134.96999999986, 1.089573867660358, 315.7283839610641, 0.2553688752328964], "isController": false}, {"data": ["book-0", 100, 0, 0.0, 686.7400000000002, 479, 4068, 561.5, 918.4000000000008, 1554.95, 4050.9799999999914, 3.675659780930677, 3.735245671910608, 0.4235623575681835], "isController": false}, {"data": ["login", 100, 0, 0.0, 11566.54, 1880, 28715, 11717.5, 17606.9, 20401.499999999996, 28698.09999999999, 3.4825004353125544, 281.79124994558595, 0.8230127981890998], "isController": false}, {"data": ["cart", 100, 0, 0.0, 8501.730000000001, 365, 34054, 7160.5, 17418.800000000003, 20219.05, 34042.619999999995, 1.2490320001998452, 174.77266885741676, 0.2927418750468387], "isController": false}, {"data": ["offer", 100, 0, 0.0, 28689.910000000003, 6333, 57521, 28471.0, 39221.100000000006, 44691.59999999999, 57433.349999999955, 0.8421478137842754, 264.1746471137489, 0.19902321380448695], "isController": false}, {"data": ["offer-0", 100, 0, 0.0, 1294.8499999999995, 502, 8039, 568.0, 3049.200000000002, 3563.7, 8026.1199999999935, 0.9286689388100036, 0.9444490555436893, 0.10792148800624066], "isController": false}, {"data": ["search", 100, 0, 0.0, 7466.230000000002, 351, 24283, 6732.5, 13960.5, 15109.599999999999, 24262.21999999999, 1.091190816538088, 95.65685595190031, 0.31115988127843913], "isController": false}, {"data": ["monihari-1", 100, 0, 0.0, 30886.08, 12805, 80704, 29245.5, 41212.200000000004, 46801.649999999994, 80454.11999999988, 0.7372456502506635, 205.24434365554043, 0.09575553855794752], "isController": false}, {"data": ["monihari-0", 100, 0, 0.0, 2282.859999999999, 381, 6855, 1690.5, 3568.3, 4484.149999999991, 6854.93, 1.0832593106137747, 1.1120545434603637, 0.1364652842472431], "isController": false}, {"data": ["electronics-0", 100, 0, 0.0, 868.13, 535, 6484, 566.5, 1853.000000000001, 2633.3499999999954, 6458.569999999987, 1.257829991698322, 1.29509811860079, 0.16214214736736185], "isController": false}, {"data": ["electronics-1", 100, 0, 0.0, 45262.25000000001, 8210, 70251, 45394.0, 57196.5, 64319.04999999998, 70237.09999999999, 0.8235197232973729, 365.40124229237006, 0.10937371325043234], "isController": false}, {"data": ["kids-toys", 100, 0, 0.0, 25906.6, 9846, 45663, 25799.5, 36587.4, 41058.34999999998, 45647.80999999999, 0.7593475685690855, 193.50661723946783, 0.2298806115785317], "isController": false}, {"data": ["login-1", 100, 0, 0.0, 9356.01, 968, 25651, 8585.0, 16007.400000000005, 18902.79999999999, 25638.619999999995, 3.6213514883754616, 289.34276572798217, 0.43498655573259937], "isController": false}, {"data": ["login-0", 100, 0, 0.0, 2209.6399999999994, 462, 9349, 2071.0, 3737.9, 5091.799999999988, 9324.129999999986, 10.66894270777766, 10.852940293929372, 1.2398478342046304], "isController": false}, {"data": ["gift-finder-browse", 100, 0, 0.0, 13328.070000000002, 2819, 36251, 12536.0, 20844.300000000003, 23053.749999999993, 36222.76999999998, 0.8864069494304835, 99.8832695535833, 0.28392722598945175], "isController": false}, {"data": ["monihari", 100, 0, 0.0, 33169.12000000001, 14475, 82378, 31648.5, 44674.100000000006, 50116.65, 82128.15999999987, 0.735180597113681, 205.42416962500278, 0.18810284808963323], "isController": false}, {"data": ["offer-1", 100, 0, 0.0, 27394.83999999999, 5808, 55847, 27049.5, 37691.3, 42470.19999999998, 55750.99999999995, 0.8461668641056016, 264.574844120198, 0.10163918387205956], "isController": false}, {"data": ["gift-finder-browse-1", 100, 0, 0.0, 11842.819999999998, 2263, 35673, 10800.5, 19184.600000000002, 21647.85, 35633.83999999998, 0.890805109658109, 99.43525913799017, 0.1444078595734825], "isController": false}, {"data": ["cart-1", 100, 0, 0.0, 7879.129999999998, 298, 33495, 6344.0, 16886.300000000003, 19462.75, 33483.49999999999, 1.2753475322025252, 177.15898651718533, 0.1519457020788165], "isController": false}, {"data": ["gift-finder-browse-0", 100, 0, 0.0, 1485.0600000000004, 529, 6581, 1611.0, 3403.900000000001, 3652.6999999999994, 6560.22999999999, 0.9227901482923768, 0.9774906971218175, 0.14598828517906742], "isController": false}, {"data": ["search-1", 100, 0, 0.0, 6346.489999999999, 279, 23715, 5422.0, 12792.500000000004, 13890.5, 23664.699999999975, 1.0978635575170717, 95.09773473009025, 0.15867559229738928], "isController": false}, {"data": ["search-0", 100, 0, 0.0, 1119.5199999999993, 72, 6690, 570.0, 2600.700000000002, 3536.75, 6684.599999999997, 1.0945230068736045, 1.1405913092136946, 0.15391729784160063], "isController": false}, {"data": ["cart-0", 100, 0, 0.0, 622.36, 67, 3204, 561.5, 1359.7000000000012, 1809.2999999999993, 3194.7399999999952, 1.2536984103104158, 1.2739240916955017, 0.1444691527506143], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
