$(document).ready(() => {
    // d3.queue()
    //     .defer(d3.csv, "https://raw.githubusercontent.com/xlulu/ehr_flowsheet_vis/master/data/fakedata.csv")
    //     .await(init_data)

    // d3.csv("https://raw.githubusercontent.com/xlulu/ehr_flowsheet_vis/master/data/fakedata.csv", function(error, data){
    //     // data.forEach(function(d){
    //     //     //d.date_time = parseDate.parse(d.Date)
    //     //     console.log(d);
    //     // })
    // })
    //     .then(init_data);

    d3.csv("https://raw.githubusercontent.com/xlulu/ehr_flowsheet_vis/master/data/fakedata.csv")
        // .then(init_data);
        .then(renderVis);

// var tbl1  = document.createElement('table');
// var thead = tbl1.createTHead();
// var row = thead.insertRow();
// for(var j = 0; j < 10; j++){
//     var td = row.insertCell();
//     // id of each cell r?c?, from r0c0 to r7c10, 8*11
//     td.id = "1r0" +"c" + j;
// }
});

const categories = ["Weight (lb)", "Blood Pressure (mm Hg)", "Pulse (BPM)", "Pulse Oxygen", "AIC", "Glucose (mg/dL)", "Medicine"];
const categories_vis = ["Weight", "BloodPressure(diastolic)", "BloodPressure(systolic)",  "Pulse", "PulseOx", "INR", "Glucose"];
const categories_vis1 = ["DateTime", "Weight", "BloodPressure(diastolic)", "BloodPressure(systolic)",  "Pulse", "PulseOx", "INR", "Glucose", "Med"];
// doctor_visit_1 = [new Date(2017, 11, 20, 17), new Date(2017, 11, 28, 19, 9), new Date(2017, 12, 29, 20, 9), new Date(2018, 3, 4, 15, 4), new Date(2018, 5, 17, 14, 4)]
var width = 130;
var height = 90;
var margin = 5;
var data_all;
var data_table = {}; // each key has a array of all values of that category
var doctor_visit; // date type for doctor visit, used to seperate dataset
var visit_date; // usd to display in the table
var visit_data;
var min = {};
var max = {};

// data load transfer and table chart render
function renderVis(data){
    data_all = init_data(data);
    console.log(data_all);
    tableCreate(data_all);
}

// load data from csv to data, seperate by category to data_table{}, find min, max to each category
function init_data(data){
    // var parseDate = d3.timeParse("%-d-%b-%y"); //Date: "14-May-18"
    // console.log(data);
    var parseDate = d3.timeParse("%-m/%-d/%y %H:%M"); //DateTime: "5/14/18 14:04"

    data.forEach(function(d){
        d.date_time = parseDate(d.DateTime);
    });
    // data_all = data;
    // convert(data);
    console.log("data loaded!");
    visit_data = data.filter(function(d){return d.DoctorVisit == 1;});
    doctor_visit = visit_data.map(function(d){return d.date_time;});
    visit_date = visit_data.map(function(d){return d.DateTime;});
    console.log(visit_data);

   // dataset of each category for scatter plots
    for (var i = 0; i < 7; i++){
        // filter the values === ""
        // data_filter = data.filter(function(d){return d[categories_vis[i]] !== "";});
        data_table[categories_vis[i]] = data
            // filter the values === ""
            .map(function(d){return d[categories_vis[i]];})
            .filter(function(d){return d !== "";});
            // .filter(function(d){return d[categories_vis[i]] !== "";});
        max[categories_vis[i]] = ss.max(data_table[categories_vis[i]]);
        min[categories_vis[i]] = ss.min(data_table[categories_vis[i]]);
    }
    // data_table[categories_vis[0]] = data.map(function(d){return d[categories_vis[0]];});
    // max[categories_vis[0]] = ss.max(data_table[categories_vis[0]]);
    // min[categories_vis[0]] = ss.min(data_table[categories_vis[0]]);
    // weight_data = data.map(function(d){return d.Weight;});
    console.log(data_table);
    // console.log(data_table[categories_vis[0]]);
    // console.log(weight_data);
    console.log(max);
    console.log(min);
    // data.map(function(d){
    //     for (var i = 0; i <8; i ++) {
    //         if (d[categories_vis[i]] === "") {
    //             d[categories_vis[i]] = null;
    //         }
    //     }
    // });


    // tableCreate(data);
    // var date_time = data.map(function(d){return d.date_time;});
    // var weight = data.map(function(d){return d.Weight;});
    // var zipped_weight = d3.zip(weight, date_time);
    // data_table[categories_vis[0]] = zipped_weight;
    // console.log(date_time);
    // console.log(zipped_weight);
    // console.log(data_table);
    return data;
}

// generate the table and all the cells
function tableCreate(data){
    var handler = document.getElementById("flowsheet");
    var tbl  = document.createElement('table');
    $(tbl).addClass("table");
    $(tbl).addClass("table-bordered");
    $(tbl).addClass("table-hover");
    // tbl.classList.add("table");
    // tbl.classList.add("table-bordered");
    // tbl.classList.add("table-hover");
    tbl.id = "flowsheet_table";

    var thead = document.createElement('thead');
    thead.classList.add("bg-dark");
    thead.classList.add("text-white");
    // id of each cell r?c?, from r0c0 to r7c10, 8*11
    var row = thead.insertRow();
    for(var j = 0; j < 10; j++){
        var td = row.insertCell();
        td.classList.add("align-middle");
        td.id = "r0" +"c" + j;
    }
    var tbody = document.createElement('tbody');
    for(var i = 1; i < 8; i++){
        var tr = tbody.insertRow();
        for(var j = 0; j < 10; j++){
            var td = tr.insertCell();
            td.classList.add("align-middle");
            td.id = "r" + i +"c" + j;
        }
    }
    handler.appendChild(tbl);
    tbl.appendChild(thead);
    tbl.appendChild(tbody);

    // add categories in each row
    for(var i = 1; i < 8; i++){
        document.getElementById("r" + i + "c0").innerText = categories[i-1];
    }

    // add values in each line except bp
    for (var i = 0; i < 5; i++) {
        // console.log(visit_data[i]);
        for (var j = 0 ; j < 2; j++){
            // console.log(visit_data[i][categories_vis1[j]]);
            document.getElementById("r" + j + "c" + (i*2+1)).innerText = visit_data[i][categories_vis1[j]];
        }
    }
    for (var i = 0; i < 5; i++) {
        for (var j = 3 ; j < 8; j++){
            document.getElementById("r" + j + "c" + (i*2+1)).innerText = visit_data[i][categories_vis1[j+1]];
        }
    }
    // ad bp values
    for (var i = 0; i < 5; i++) {
        document.getElementById("r2c" + (i*2+1)).innerText = visit_data[i][categories_vis1[2]] + " / " + visit_data[i][categories_vis1[3]];
    }

    // add data to each cell: seperate dataset by date_time, then by each line
    for(var i = 1; i < 5; i++){
        data_period = data.filter(function(d) { return (d.date_time <= doctor_visit[i] && d.date_time >= doctor_visit[i-1]);});
        // console.log(data_period);
        var x_scale = d3.scaleTime()
            .range([margin, width-margin])
            .domain([doctor_visit[i-1], doctor_visit[i]]);
        // for (var j = 1; j < 8; j++){
        //     cell = new CellVis(data_period, "r" + j + "c"+2*i, categories_vis[j], x_scale, min[categories_vis[j]], max[categories_vis[j]]);
        // }
        cell_wt = new CellVis(data_period, "r1c"+2*i, "Weight", x_scale, min.Weight, max.Weight);
        cell_bp = new CellVis2(data_period, "r2c"+2*i, "BloodPressure(diastolic)", "BloodPressure(systolic)", x_scale, min["BloodPressure(diastolic)"], max["BloodPressure(systolic)"]);
        cell_pls = new CellVis(data_period, "r3c"+2*i, "Pulse", x_scale, min.Pulse, max.Pulse, 59, 99);
        cell_pls_ox = new CellVis(data_period, "r4c"+2*i, "PulseOx", x_scale, min.PulseOx, max.PulseOx, 75, 82);
        cell_aic = new CellVis(data_period, "r5c"+2*i, "INR", x_scale, min.INR, max.INR);
        cell_gc = new CellVis(data_period, "r6c"+2*i, "Glucose", x_scale, min.Glucose, max.Glucose, 120, 160);
        // cell_md = new
    }
}


// for each of the flow sheet chart in the table cell
class CellVis{
    // chart in each cell
    constructor(cell_data, cell_id, category, x_scale, y_min, y_max, low = -1, high = 1000){
        this.zoomin = false;
        var thisvis = this;
        this.x_scale = x_scale;
        this.y_scale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height-margin, margin]);
        this.vis_data = cell_data;
        // omit empty values
        this.vis_data_filter = this.vis_data.filter(function(d){return d[category] !== "";});
        this.id = document.getElementById(cell_id);

        // expand the column
        // $("#" + this.id).click(function(){
        //     $("#" + this.id).toggleClass("expend");
        // });
        var click = 0;
        $("td").click(function(){
            if (click % 2 == 0){ $(this).children("svg").addClass("expend");}
            else { $(this).children("svg").removeClass("expend");}
            click += 1;
            width = 200;
            console.log("clicked!")
        });

        this.svg = d3.select(this.id)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // tool tip and hover functions
        var tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d){
            return d[category] + "<br>"+ d.DateTime;
        });
        tool_tip(this.svg);
        function mouseoverHandler(d) {
            tool_tip.show(d);
        };
        function mouseoutHandler(d) {
            tool_tip.hide(d);
        };

        // add low and high horizontal line for outliers
        this.low = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(low))
            .attr("y2", this.y_scale(low));
        this.high = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(high))
            .attr("y2", this.y_scale(high));


        // add scatter plots
        this.circles = this.svg
            .selectAll(".dot").data(this.vis_data_filter).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category]);
            })
            .style('fill', function(d) {
                if (d[category] < low || d[category] > high) {return 'red';}
                else {return 'black';}
            })
            // .attr('r', 3)
            // .attr('r', function(d){
            //     return d[category] === ""? 0: 3;
            // })
            .attr('r', 3)
            .on('mouseover', mouseoverHandler)
            .on('mouseout', mouseoutHandler);
        this.circles.exit().remove();

        // add spline
        this.spline = this.svg.append("path")
            .datum(this.vis_data_filter)
            .attr("class", "line")
            .attr("d", d3.line()
            // .attr("d", line()
            // .curve(d3.curveLinear)
                .curve(d3.curveCatmullRom)
                // .x(function(d){if(d[category] !== ""){return thisvis.x_scale(d.date_time)};})
                // .y(function(d){if(d[category] !== ""){return thisvis.y_scale(d[category])};}));
                .x(function(d){return thisvis.x_scale(d.date_time);})
                .y(function(d){return thisvis.y_scale(d[category]);}));
    };
    // function zoomIn(){};
}

// for each of the flow sheet chart in the table cell, for 2 plots in one cell
// data1 are lower, data2 are higher
class CellVis2{
    // chart in each cell
    constructor(cell_data, cell_id, category1, category2, x_scale, y_min, y_max, low_1 = 0, high_1 = 80, low_2 = 0, high_2 = 120){
        this.zoomin = false;
        var thisvis = this;
        this.x_scale = x_scale;
        this.y_scale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height-margin, margin]);
        this.vis_data = cell_data;
        this.vis_data_filter = this.vis_data.filter(function(d){
            return d[category1] !== "" && d[category2] !== "";});
        this.id = document.getElementById(cell_id);
        this.svg = d3.select(this.id)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // tool tip and hover functions
        var tool_tip_1 = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d){
                return d[category1] + "<br>"+ d.DateTime;
            });
        tool_tip_1(this.svg);
        function mouseoverHandler_1(d) {
            tool_tip_1.show(d);
        };
        function mouseoutHandler_1(d) {
            tool_tip_1.hide(d);
        };
        // tool tip and hover functions
        var tool_tip_2 = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d){
                return d[category2] + "<br>"+ d.DateTime;
            });
        tool_tip_2(this.svg);
        function mouseoverHandler_2(d) {
            tool_tip_2.show(d);
        };
        function mouseoutHandler_2(d) {
            tool_tip_2.hide(d);
        };

        // add low and high horizontal line for outliers
        this.low_1 = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(low_1))
            .attr("y2", this.y_scale(low_1));
        this.high_1 = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(high_1))
            .attr("y2", this.y_scale(high_1));

        // add circles for category 1
        this.circles1 = this.svg
            .selectAll(".dot1").data(this.vis_data_filter).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category1]);
            })
            .attr('r', 3)
            .on('mouseover', mouseoverHandler_1)
            .on('mouseout', mouseoutHandler_1);
        // add spline for category 1
        // add spline
        this.spline1 = this.svg.append("path")
            .datum(this.vis_data_filter)
            .attr("class", "line")
            .attr("d", d3.line()
            // .curve(d3.curveLinear)
                .curve(d3.curveCatmullRom)
                .x(function(d){return thisvis.x_scale(d.date_time);})
                .y(function(d){return thisvis.y_scale(d[category1]);}));


        // add low and high horizontal line for outliers
        this.low_1 = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(low_2))
            .attr("y2", this.y_scale(low_2));
        this.high_1 = this.svg.append("line")
            .attr("class", "line")
            .attr("x1", margin)
            .attr("x2", width - margin)
            .attr("y1", this.y_scale(high_2))
            .attr("y2", this.y_scale(high_2));

        // add circles for category 2
        this.circles2 = this.svg
            .selectAll(".dot2").data(this.vis_data_filter).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category2]);
            })
            .attr('r', 3)
            .attr("fill", "Navy")
            .on('mouseover', mouseoverHandler_2)
            .on('mouseout', mouseoutHandler_2);
        // add spline for category 2
        // add spline
        this.spline2 = this.svg.append("path")
            .datum(this.vis_data_filter)
            .attr("class", "line")
            .attr("d", d3.line()
            // .curve(d3.curveLinear)
                .curve(d3.curveCatmullRom)
                .x(function(d){return thisvis.x_scale(d.date_time);})
                .y(function(d){return thisvis.y_scale(d[category2]);}));
    };
    // function zoomIn(){};
}

// class ZoomInvis{};
// }

// var height = 500;
// var width = 500;
// var margin = 40;

// function tableCreate(){
//     var body = document.body,
//         tbl  = document.createElement('table');
//     tbl.style.width  = '1000px';
// //     tbl.style.border = '1px solid black';
// //
//     for(var i = 0; i < 10; i++){
//         var tr = tbl.insertRow();
//         for(var j = 0; j < 10; j++){
//             if(i == 2 && j == 1){
//                 break;
//             } else {
//                 var td = tr.insertCell();
//                 td.appendChild(document.createTextNode('Cell'));
//                 td.style.border = '1px solid black';
//                 if(i == 1 && j == 1){
//                     td.setAttribute('rowSpan', '2');
//                 }
//             }
//         }
//     }
//     body.appendChild(tbl);
// }

// $(document).ready(() => {
//     d3.queue()
//         .defer(d3.csv, "fakedata.csv")
//         .await(function(error, patient_data) {
//             var gender = 'All';
//             athelete_vis = new AtheleteVis(athelete_data);
//             athelete_vis.calculateData(gender);
//             athelete_vis.show_athelete_default(0);
//             athelete_vis.show_athelete_default(1);
//             athelete_vis.show_athelete_default(2);
//             athelete_vis.prepare_hover();
//         });
// });