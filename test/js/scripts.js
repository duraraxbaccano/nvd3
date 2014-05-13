$(document).ready(function(){
  //load raw json file
  $.getJSON("./data.json",function(data){
    if(typeof rawData == "undefined")
        rawData = data;
    var data1 = JSON.parse(JSON.stringify(data)); //, data2 = mergeOption(data);
    /*  create a stacked chart from examples */
    createChart(data,'#chart1 svg');

    /* the chart only shows group axes */
    createChart(long_short_data,'#chart2 svg',function(obj){obj.showXAxis(false);});

  }).fail(function(){
    console.log("Parsing JSON String Failing");
  });
});
/* ******************** */
/* all global variables */
var charts=[],
    rawData; //access chart out of scope ; Original chart object and new sideBar
/* -------------------- */

//create group stack chart
function createChart(data,pos,func){

  nv.addGraph(function() {
    chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 180})
        //.showValues(true)
        //.tooltips(false)
        .transitionDuration(250)
        .stacked(true)
        ;
        //.showControls(false);
    /*  modify attributes by func (not defualt)*/
    if(func)
        func(chart);

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select(pos)
        .datum(data)
        .call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    //accessing out of scope
    charts.push(chart);

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
/*  Trigger Event out of scope */
function sendEvent(obj){
    for(var index=0;index<charts.length;index++){
        charts[index].dispatch.groupClick(obj);
    }
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
//Not finished -> change json format (function only for this case)
function mergeOption(srcData){
    var destData=srcData.map(function(obj){return JSON.parse(JSON.stringify(obj));});
    for(var index=0;index<srcData.length;index++)
        for(var dindex=0;dindex<srcData[index].values.length;dindex++)
            destData[index].values[dindex].label = destData[index].values[dindex].label.split("_")[0];
    return destData;
}