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
const categories_vis = ["weight", "blood_pressure", "pulse", "pulse_oxygen", "aic", "glucose", "medicine"];
// doctor_visit_1 = [new Date(2017, 11, 20, 17), new Date(2017, 11, 28, 19, 9), new Date(2017, 12, 29, 20, 9), new Date(2018, 3, 4, 15, 4), new Date(2018, 5, 17, 14, 4)]
// visit_data = data.filter(function(d) {return d.doctor_visit = }); //change the data to use!!!!!

var width = 130;
var height = 90;
var margin = 5;
var data_all;
var data_table = {};
var doctor_visit;
var min = {};
var max = {};
// for(i=0; i<5; i++){
//     var x[i] = d3.scaleTime()
//         .range([0, width])
//         // .domain([2017-11-20, 2018-7-25])
//         .domain([doctor_visit[1], doctor_visit[2]]);
// }
// var x = d3.scaleTime()
//     .range([0, width])
//     // .domain([2017-11-20, 2018-7-25])
//      //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
//     .domain([doctor_visit[0], doctor_visit[4]]);
// var y = d3.scaleLinear()
//     .domain([125, 135])
//     .range([0, height]);


function renderVis(data){
    data_all = init_data(data);
    console.log(data_all);
    doctor_visit = data_all.filter(function(d){return d.DoctorVisit == 1;})
        .map(function(d){return d.date_time;});
    console.log(doctor_visit);
    tableCreate(data_all);
}


// load data, tansfer data, and generate visualization
function init_data(data){
    // visit_data = data.filter(function(d) {return d.doctor_visit = }); //change the data to use!!!!!
    // var parseDate = d3.timeParse("%-d-%b-%y"); //Date: "14-May-18"
    var parseDate = d3.timeParse("%-m/%-d/%y %H:%M"); //DateTime: "5/14/18 14:04"

    // console.log(data);
    data.forEach(function(d){
        d.date_time = parseDate(d.DateTime);
        // console.log(d);
        // console.log(d['Weight']);
    });
    // data_all = data;
    console.log("data loaded!");
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
    // tbl.id = "flowsheet_table";

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
        console.log(data_period);
        var x_scale = d3.scaleTime()
            .range([0, width])
            //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
            .domain([doctor_visit[i-1], doctor_visit[i]]);
        // for (var j = 1; j < )

    }

    // add data of csv file into table !!! need to change the data to data of each cell
    // try 1:
    //for(i=0; i<5; i++){
        //data[i] = data
        cell = new CellVis(data, "r1c2");
    //}

    // for(var i =0; i < 8; i++){
    //     console.log(typeof data[i]["Date"]);
    // };
}


// for each of the flow sheet chart in the table cell
class CellVis{
    // chart in each cell
    constructor(cell_data, cell_id){
        this.zoomin = false;
        var thisvis = this;
        this.x_scale = d3.scaleTime()
            .range([margin, width-margin])
            //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
            .domain([doctor_visit[0], doctor_visit[4]]);
        this.y_scale = d3.scaleLinear()
            .domain([125, 135])
            .range([margin, height-margin]);
        // var x = d3.scaleTime()
        //     .range([0, width])
        //     //.domain([new Date(2017, 1, 20, 17), new Date(2019, 11, 28, 19, 9)])
        //     .domain([doctor_visit[0], doctor_visit[4]]);
        // var y = d3.scaleLinear()
        //     .domain([125, 135])
        //     .range([0, height]);
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
                // return x(d.date_time);
                return thisvis.x_scale(d.date_time);
            })
            .attr('cy', function(d) {
                return thisvis.y_scale(d.Weight);
            })
            .attr('r', 4);
    };

    // randerVis(){};


}

// class ZoomInvis{
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