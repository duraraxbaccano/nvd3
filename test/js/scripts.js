$(document).ready(function(){
  //load raw json file
  $.getJSON("./data.json",function(data){

    /*  create a stacked chart from examples */
    createChart(data);

  }).fail(function(){
    console.log("Parsing JSON String Failing");
  });
});
/* ******************** */
/* all global variables */
var leonChart; //access chart out of scope ; Original chart object and new sideBar 
/* -------------------- */

//create group stack chart
function createChart(data){

  nv.addGraph(function() {
    chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        //.showValues(true)
        //.tooltips(false)
        .transitionDuration(250)
        .stacked(true)
        //.showControls(false);

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#chart1 svg')
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    //for accessing out of scope
    leonChart = chart;

    //creating sidebar
    // leonChart.sideBar = createBar(leonChart.gdomain());
    // if(!leonChart.sideBar.hasChildNodes());
    // else{
    //   // javascript native bind event
    //   for(var index=0;index<leonChart.sideBar.childNodes.length;index++){
    //     var li = leonChart.sideBar.childNodes.item(index);
    //     if(li.addEventListener) {
    //       li.addEventListener('click',function(){} ,false);
    //     } else if(li.attachEvent){
    //       li.attachEvent('onclick',function(){});
    //     }
    //   }
    // }

    /*  trigger group show/display event using chart.dispatch.groupClick({ groupIndex : int })  
        For example : leonChart.dispatch.groupClick({groupIndex:1})

        groupIndex -> ["Asus","Samgsung","Acer"][1] == "Samgsung"

        chart group getter function -> chart.gdomain()
        For example : leonChart.gdomain() 
    */


    return chart;
  });

}
//create sidebar of chart group selection ; avoid calling directly and binded by createChart()
function createBar(domain){
  if(domain instanceof Array){
    var list = document.createElement("ul");
    for(var index=0;index<domain.length;index++){
      var li = document.createElement("li");
      li.innerHTML = domain[index];
      list.appendChild(li);
    }
    document.getElementById("select_bar").appendChild(list);
    return list;
  }
  else 
    return null;
}