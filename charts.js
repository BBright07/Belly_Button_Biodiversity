function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples1.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}
console.log(optionChanged);

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples1.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
console.log(buildMetadata(sample))

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples1.json").then((data) => {
    //code source help: https://github.com/Wall-E28/plotly_analysis/blob/master/charts.js 
    // 3. Create a variable that holds the samples array. 
    console.log(data);
    var samplesArray = data.samples;
    console.log(samplesArray);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedIdSamples = samplesArray.filter(data => data.id == sample);
    console.log(selectedIdSamples);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedIdSamples[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    var metadataArray = data.metadata
    var filteredMetadata = metadataArray.filter(sampleObj => sampleObj.id == sample);
    var metadataResult = filteredMetadata[0]
    var wash_freq = metadataResult.wfreq;

    console.log(wash_freq)  
    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);
   

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
    }];
    
    // 9. Create the layout for the bar chart. 
     var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     yaxis: {
      tickmode: "array",
      // code source help: https://github.com/cedoula/Belly_Button/blob/main/charts.js
      tickvals: [0,1,2,3,4,5,6,7,8,9],
      ticktext: yticks
    },
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("barh", barData, barLayout,{responsive: true});
     // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
     // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {size: sampleValues,color: otuIds,colorscale: "armyrose"
      }
    }
    
     ];
     console.log(bubbleData);
     // 2. Create the layout for the bubble chart.
     var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      xaxis: {title: "OTU ID", automargin: true, tickvals: [0,500,1000,1500,2000,2500,3000,3500]},
      yaxis: {automargin: true, tickvals:[0,50,100,150,200,250]},
      //margin: { t: 50, r: 50, l: 50, b: 50 },
      hovermode: "closest"
       
    };
    console.log(bubbleLayout);
     // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});
  
 
  console.log(wash_freq);
 //code source help: https://github.com/AndrejaCH/plotly_deploy/blob/master/charts.js 
  // 4. Create the trace for the gauge chart.
  var gaugeData = [ {
    type: "indicator",
    mode: "gauge+number",
    value: wash_freq,
    gauge: {
      axis: { range: [null, 10], tickcolor: "black" },
      bar: { color: "black" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "lavender" },
        { range: [4, 6], color: '#bcbd22' },
        { range: [6, 8], color: '#e377c2' },
        { range: [8, 10],color: '#1f77b4' }
      ],
    }
  }
   
  ];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week"},
    width: 500,
    height: 400,
    plot_bgcolor: 'seashell',
    paper_bgcolor:'seashell',
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge', gaugeData, gaugeLayout)
});
}