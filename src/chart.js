import { Chart } from 'chart.js'

function getColor(isActive, alpha = 1) {
  return isActive
    ? `rgba(54, 162, 235, ${alpha})`
    : `rgba(255, 99, 132, ${alpha})`
}

function getLabel(el, i, data) {
  const x = new Date()
  x.setHours(x.getHours() - data.length + i + 1)
  x.setMinutes(0)
  x.setSeconds(0)
  x.setMilliseconds(0)
  return x.getHours().toString()
}

export default function createChart(container, data, isActive) {
  const ctx = container.getContext('2d')

  const borderColor = getColor(isActive)
  const backgroundColor = getColor(isActive, 0.5)

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(getLabel),
      datasets: [
        {
          data,
          borderWidth: 1,
          borderColor,
          backgroundColor,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{ ticks: { callback: label => (`${label}:00`) } }],
        yAxes: [{ ticks: { beginAtZero: true, max: Math.max.apply(null, data) } }],
      },
    },
  })

  return chart
}
