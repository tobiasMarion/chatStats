const charts = {
  timeline() {
    const timelineChart = {
      datasets: [],
      canvas: document.querySelector('#timeline-canvas')
    }
    const timelineCanvasContainer = document.querySelector('#timeline .canvas-container')
    const timelineDataDivs = document.querySelectorAll('#timeline .data-container div')

    timelineDataDivs.forEach((element, index) => {
      const name = element.dataset.name
      timelineChart.datasets.push({ label: name, data: [], tension: 0.2 })

      const rawData = JSON.parse(element.innerHTML)
      const weeks = Object.keys(rawData)


      weeks.forEach(week => {
        timelineChart.datasets[index].data.push({ x: week, y: rawData[week] })
      })
    })

    const aspectRatio = timelineCanvasContainer.clientWidth / timelineCanvasContainer.clientHeight

    new Chart(timelineChart.canvas, {
      type: 'line',
      data: {
        datasets: timelineChart.datasets
      },
      options: {
        aspectRatio
      }
    })
  },

  firstMessage() {
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
  },

  acrossTheDay() {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)

    const chart = {
      datasets: [],
      canvas: document.querySelector('#across-the-day-canvas')
    }

    const dataDivs = document.querySelectorAll('#across-the-day .data-container div')

    dataDivs.forEach(div => {
      const name = div.dataset.name
      const data = div.innerHTML.split(',')

      chart.datasets.push({ label: name, data })
    })

    const canvasContainer = document.querySelector('#across-the-day .canvas-container')
    const aspectRatio = canvasContainer.clientWidth / canvasContainer.clientHeight


    new Chart(chart.canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: chart.datasets
      },
      options: {
        aspectRatio
      }
    })
  },

  acrossTheWeek() {
    const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Fryday', 'Saturday']

    const chart = {
      datasets: [],
      canvas: document.querySelector('#across-the-week-canvas')
    }

    const dataDivs = document.querySelectorAll('#across-the-week .data-container div')

    let max = 0

    dataDivs.forEach(div => {
      const name = div.dataset.name
      const data = div.innerHTML.split(',')

      chart.datasets.push({ label: name, data })
    })


    const canvasContainer = document.querySelector('#across-the-week .canvas-container')
    const aspectRatio = canvasContainer.clientWidth / canvasContainer.clientHeight

    new Chart(chart.canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: chart.datasets
      },
      options: {
        aspectRatio,
        options: { aspectRatio }
      }
    })
  }

}

const chartTypes = Object.keys(charts)
chartTypes.forEach(chart => charts[chart]())