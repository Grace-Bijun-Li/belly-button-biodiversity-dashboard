// Write a function that will build the metadata for a single sample. It should do the following:

function buildMetadata(sample) {
    // - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {
      // - extract the metadata from the json
      var metadata = data.metadata;
      // - filter the metadata for the sample id
      var results = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = results[0];
      // - select the id '#sample-metadata'
      var panel = d3.select("#sample-metadata");
      // - clear any existing metadata in the metadata html elements
      panel.html("");
  
      // - append new header tags for each key-value pair in the filtered metadata
      Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
      // - Build the Gauge Chart
      buildGauge(result.wfreq);
    });
}

// Write a function that will build the Gauge Chart. It should do the following:

function buildGauge(wfreq) {
    // Enter the washing frequency between 0 and 180
    var level = parseFloat(wfreq) * 20;
  
    // Trig to calc meter point
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 12, color: "850000" },
        showlegend: false,
        name: "Freq",
        text: level,
        hoverinfo: "text+name"
      },
      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(0, 105, 11, .5)",
            "rgba(10, 120, 22, .5)",
            "rgba(14, 127, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(240, 230, 215, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];
  
    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
  
    var gauge = document.getElementById("gauge");
    Plotly.newPlot(gauge, data, layout);
}
  

// Write a function that will build the charts for a single sample. It should do the following:

function buildCharts(sample) {
    // - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {
      // - extract the samples from the json
      var samples = data.samples;
      // - filter the samples for the sample id
      var results = samples.filter(sampleObj => sampleObj.id == sample);
      var result = results[0];
      // - extract the ids, labels, and values from the filtered result
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // - build a bubble chart and plot with Plotly.newPlot()
      var bubbleLayout = {
        title: "Belly Button Bacteria by each Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // - build a bar chart and plot with Plotly.newPlot()
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [
        {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
        }
        ];

      var barLayout = {
        title: "Top 10 Belly Button Microbial Species Found",
        margin: { t: 30, l: 150 }
        };

      Plotly.newPlot("bar", barData, barLayout);
    });
}


// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:

function init() {
    // - select the dropdown element in the page
    var selector = d3.select("#selDataset");
  
    // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // - extract the first sample from the data
      var firstSample = sampleNames[0];
      // - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
}

// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:

function optionChanged(newSample) {
    // - call your two functions to build the metadata and build the charts on the new sample
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard by calling your init() function
  init();