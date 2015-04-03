function makeData() {
  "use strict";
  var blueSet = makeRandomData(20);
  var redSet = makeRandomData(20);
  return [blueSet, redSet];
}

function run(svg, data, Plottable) {
  "use strict";

  var xScale = new Plottable.Scale.Linear();
  var yScale = new Plottable.Scale.Linear();
  var xAxis = new Plottable.Axis.Numeric(xScale, "bottom");
  var yAxis = new Plottable.Axis.Numeric(yScale, "left");
  var title = new Plottable.Component.TitleLabel("Hover over points");

  var ds1 = new Plottable.Dataset(data[0], { color: "blue", size: 20 });
  var ds2 = new Plottable.Dataset(data[1], { color: "red", size: 30 });

  var plot = new Plottable.Plot.Scatter(xScale, yScale).addDataset(ds1)
                                                       .addDataset(ds2)
                                                       .project("size", function(d, i, u) { return u.size; })
                                                       .project("fill", function(d, i, u) { return u.color; })
                                                       .project("x", function(d, i, u) { return d.x; }, xScale)
                                                       .project("y", "y", yScale);

  var chart = new Plottable.Component.Table([
      [null, title],
      [yAxis, plot],
      [null, xAxis]]);

  chart.renderTo(svg);

  var hoverCircle = plot._foregroundContainer.append("circle")
                                             .attr({
                                               "stroke": "black",
                                               "fill": "none",
                                               "r": 15
                                             })
                                             .style("visibility", "hidden");

  var hover = new Plottable.Interaction.Hover();
  hover.onHoverOver(function(hoverData) {
    var xString = hoverData.data[0].x.toFixed(2);
    var yString = hoverData.data[0].y.toFixed(2);
    title.text("[ " + xString + ", " + yString + " ]");

    hoverCircle.attr({
      "cx": hoverData.pixelPositions[0].x,
      "cy": hoverData.pixelPositions[0].y
    }).style("visibility", "visible");
  });
  hover.onHoverOut(function(hoverData) {
    title.text("Hover over points");
    hoverCircle.style("visibility", "hidden");
  });
  plot.registerInteraction(hover);
}
