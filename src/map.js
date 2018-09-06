import { loadList, loadDetails } from './api'
import getDetailsContentLayout from './details'
import createFilterControl from './filter'

export default function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: [],
    zoom: 10,
  })

  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',

    // Радиус диаграммы в пикселях.
    clusterIconPieChartRadius: 25,
    // Радиус центральной части макета.
    clusterIconPieChartCoreRadius: 15,
    // Ширина линий-разделителей секторов и внешней обводки диаграммы.
    clusterIconPieChartStrokeWidth: 3,
    // Определяет наличие поля balloon.

    clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps),
  })


  // details
  objectManager.objects.events.add('click', (event) => {
    const objectId = event.get('objectId')
    const obj = objectManager.objects.getById(objectId)

    objectManager.objects.balloon.open(objectId)

    if (!obj.properties.details) {
      loadDetails(objectId).then((data) => {
        obj.properties.details = data
        objectManager.objects.balloon.setData(obj)
      })
    }
  })

  myMap.geoObjects.add(objectManager)

  loadList().then((data) => {
    objectManager.add(data)
  })

  // filters
  const listBoxControl = createFilterControl(ymaps)
  myMap.controls.add(listBoxControl)

  const filterMonitor = new ymaps.Monitor(listBoxControl.state)
  filterMonitor.add('filters', (filters) => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective'],
    )
  })
}
