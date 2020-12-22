google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

async function request() {
  const response = await fetch("/graph", {
    method: "GET",
  });
  return response.json();
}

async function drawChart() {
  const result = await request();
  let resultArray = [];
  resultArray.push(["Period", "Ratio"]);
  for (let i in result.data) {
    resultArray.push([
      result.data[i].period.substring(5, 10),
      result.data[i].ratio,
    ]);
  }
  console.log(resultArray);
  var data = google.visualization.arrayToDataTable(resultArray);

  var options = {
    title: "코로나 추세",
    curveType: "function",
  };

  var chart = new google.visualization.LineChart(
    document.getElementById("curve_chart")
  );

  chart.draw(data, options);
}
