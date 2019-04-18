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
});

const categories = ["Weight", "Blood Pressure", "Pulse", "Pulse Oxygen", "AIC", "Glucose", "Medicine"];
const categories_vis = ["Weight", "BloodPressure(diastolic)", "BloodPressure(systolic)",  "Pulse", "PulseOx", "INR", "Glucose"];
// doctor_visit_1 = [new Date(2017, 11, 20, 17), new Date(2017, 11, 28, 19, 9), new Date(2017, 12, 29, 20, 9), new Date(2018, 3, 4, 15, 4), new Date(2018, 5, 17, 14, 4)]
var width = 130;
var height = 90;
var margin = 5;
var data_all;
var data_table = {};
var doctor_visit;
var visit_data;
var min = {};
var max = {};

// data load transfer and table chart render
function renderVis(data){
    data_all = init_data(data);
    console.log(data_all);
    // console.log(doctor_visit);
    tableCreate(data_all);
}


// load data from csv to data, seperate by category to data_table{}, find min, max to each category
function init_data(data){
    // var parseDate = d3.timeParse("%-d-%b-%y"); //Date: "14-May-18"
    var parseDate = d3.timeParse("%-m/%-d/%y %H:%M"); //DateTime: "5/14/18 14:04"

    // console.log(data);
    data.forEach(function(d){
        d.date_time = parseDate(d.DateTime);
    });
    // data_all = data;
    console.log("data loaded!");

    doctor_visit = data.filter(function(d){return d.DoctorVisit == 1;})
        .map(function(d){return d.date_time;});
   // dataset of each category for scatter plots
    for (var i = 0; i < 7; i++){
        data_table[categories_vis[i]] = data.map(function(d){return d[categories_vis[i]];});
        max[categories_vis[i]] = ss.max(data_table[categories_vis[i]]);
        min[categories_vis[i]] = ss.min(data_table[categories_vis[i]]);
    }
    // data_table[categories_vis[0]] = data.map(function(d){return d[categories_vis[0]];});
    // max[categories_vis[0]] = ss.max(data_table[categories_vis[0]]);
    // min[categories_vis[0]] = ss.min(data_table[categories_vis[0]]);
    weight_data = data.map(function(d){return d.Weight;});
    console.log(data_table);
    // console.log(data_table[categories_vis[0]]);
    // console.log(weight_data);
    // max["Weight"] = ss.max(weight_data);
    // min["Weight"] = ss.min(weight_data);
    console.log(max);
    console.log(min);
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


function tableCreate(data){
    var handler = document.getElementById("flowsheet");
    tbl  = document.createElement('table');
    tbl.id = "flowsheet_table";

    for(var i = 0; i < 8; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < 10; j++){
            var td = tr.insertCell();
            // id of each cell r?c?, from r0c0 to r7c10, 8*11
            td.id = "r" + i +"c" + j;
        }
    }
    handler.appendChild(tbl);

    // add categories of table
    for(var i = 1; i < 8; i++){
        document.getElementById("r" + i + "c0").innerText = categories[i-1];
    }

    // add data to each cell: seperate dataset by date_time, then by each line
    for(var i = 1; i < 5; i++){
        data_period = data.filter(function(d) { return (d.date_time <= doctor_visit[i] && d.date_time >= doctor_visit[i-1]);});
        // console.log(data_period);
        var x_scale = d3.scaleTime()
            .range([margin, width-margin])
            .domain([doctor_visit[i-1], doctor_visit[i]]);
        // date_time_data = data_period.map(function(d){return d.date_time;});
        // var y_scale = d3.scaleLinear()
        //     .domain([125, 135])
        //     .range([margin, height-margin]);

        // for (var j = 1; j < 8; j++){
        //     cell = new CellVis(data_period, "r" + j + "c"+2*i, categories_vis[j], x_scale, min[categories_vis[j]], max[categories_vis[j]]);
        // }
        cell_wt = new CellVis(data_period, "r1c"+2*i, "Weight", x_scale, min.Weight, max.Weight);
        // cell_bp_l = new CellVis(data_period, "r2c"+2*i, "BloodPressure(diastolic)", x_scale, min["BloodPressure(diastolic)"], max["BloodPressure(systolic)"]);
        // cell_bp_h = new CellVis(data_period, "r2c"+2*i, "BloodPressure(systolic)", "BloodPressure(systolic)", "BloodPressure(systolic)",x_scale, min["BloodPressure(diastolic)"], max["BloodPressure(systolic)"]);
        cell_bp = new CellVis2(data_period, "r2c"+2*i, "BloodPressure(diastolic)", "BloodPressure(systolic)", x_scale, min["BloodPressure(diastolic)"], max["BloodPressure(systolic)"]);
        cell_pls = new CellVis(data_period, "r3c"+2*i, "Pulse", x_scale, min.Pulse, max.Pulse);
        cell_pls_ox = new CellVis(data_period, "r4c"+2*i, "PulseOx", x_scale, min.PulseOx, max.PulseOx);
        cell_aic = new CellVis(data_period, "r5c"+2*i, "INR", x_scale, min.INR, max.INR);
        cell_gc = new CellVis(data_period, "r6c"+2*i, "Glucose", x_scale, min.Glucose, max.Glucose);
        // cell_md = new
    }
}


// for each of the flow sheet chart in the table cell
class CellVis{
    // chart in each cell
    constructor(cell_data, cell_id, category, x_scale, y_min, y_max){
        this.zoomin = false;
        var thisvis = this;
        this.x_scale = x_scale;
        // this.x_scale = d3.scaleTime()
        //     .range([margin, width-margin])
        //     //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
        //     .domain([doctor_visit[0], doctor_visit[4]]);
        this.y_scale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([margin, height-margin]);
        this.vis_data = cell_data;
        this.id = document.getElementById(cell_id);
        this.svg = d3.select(this.id)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        this.circles = this.svg
            .selectAll(".dot").data(this.vis_data).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category]);
            })
            .attr('r', 3);
    };
    // function zoomIn(){};
}

// for each of the flow sheet chart in the table cell, for 2 plots in one cell
// data1 are lower, data2 are higher
class CellVis2{
    // chart in each cell
    constructor(cell_data, cell_id, category1, category2, x_scale, y_min, y_max){
        this.zoomin = false;
        var thisvis = this;
        this.x_scale = x_scale;
        // this.x_scale = d3.scaleTime()
        //     .range([margin, width-margin])
        //     //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
        //     .domain([doctor_visit[0], doctor_visit[4]]);
        this.y_scale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([margin, height-margin]);
        this.vis_data = cell_data;
        this.id = document.getElementById(cell_id);
        this.svg = d3.select(this.id)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        // add circles for category 1
       this.svg
            .selectAll(".dot1").data(this.vis_data).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category1]);
            })
            .attr('r', 3);
        // add circles for category 2
        this.svg
            .selectAll(".dot2").data(this.vis_data).enter().append("circle")
            .attr('class', 'dot')
            .attr('cx', function(d) {
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d[category2]);
            })
            .attr('r', 3);
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
//     tbl.style.border = '1px solid black';
//
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

//

//
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