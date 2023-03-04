google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
  const chartDiv = document.getElementById('messagesByWeekChartDiv')
  const array = JSON.parse(chartDiv.innerText)
  const data = google.visualization.arrayToDataTable(array);

  const options = {
    title: 'Mensagens por semana',
    hAxis: { title: 'Semana do dia', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0 }
  };

  const chart = new google.visualization.AreaChart(chartDiv);
  chart.draw(data, options);
}