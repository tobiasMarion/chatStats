// Timeline
const timelineChart = {
  datasets: [],
  canvas: document.querySelector('#timeline-canvas')
}

const timelineDataDivs = document.querySelectorAll('#timeline .data-container div')

timelineDataDivs.forEach((element, index) => {
  const name = element.dataset.name
  timelineChart.datasets.push({ label: name, data: [] })

  const rawData = JSON.parse(element.innerHTML)
  const weeks = Object.keys(rawData)


  weeks.forEach(week => {
    timelineChart.datasets[index].data.push({ x: week, y: rawData[week] })
  })
})

new Chart(timelineChart.canvas, {
  type: 'line',
  data: {
    datasets: timelineChart.datasets
  },
  aspectRatio: 16 / 9
})

// First Message
const firstMessage = {
  data: { labels: [], datasets: [{ data: [] }] },
  canvas: document.querySelector('#first-message-canvas')
}

const firstMessageDataDivs = document.querySelectorAll('#first-message .data-container div')

firstMessageDataDivs.forEach(element => {
  const name = element.dataset.name
  const value = element.innerHTML

  firstMessage.data.labels.push(name)
  firstMessage.data.datasets[0].data.push(value)
})

new Chart(firstMessage.canvas, {
  type: 'doughnut',
  data: firstMessage.data
})