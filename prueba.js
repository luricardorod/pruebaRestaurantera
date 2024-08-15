/* global localStorage fabric */
const ZONE_TYPE = {
  area: 'AREA',
  floor: 'PISO',
  table: 'TABLE'
}
const loadJSON = function () {
  const map = localStorage.getItem('map')

  canvas.loadFromJSON(map, function () {
    console.log(canvas.getObjects())
    const objects = canvas.getObjects()
    const textIndexes = {}
    objects.forEach((object, index) => {
      console.log(object.relationID)
      if (object.type === 'textbox') {
        textIndexes[object.relationID] = index
        object.on('mouseup', selectTableForText)
        console.log(object)
      }
      if (object.zoneType !== ZONE_TYPE.table) {
        object.set('selectable', false)
      } else {
        object.set({
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true
        })
      }
    })
    objects.forEach((object, index) => {
      if (object.type !== 'textbox') {
        object.set('textObject', objects[textIndexes[object.relationID]])
      }
    })
    canvas.renderAll()
  })
}

const canvas = new fabric.Canvas('c1')

const observe = eventName => {
  canvas.on(eventName, function (opt) {
    if (
      eventName === 'selection:updated' ||
      eventName === 'selection:created'
    ) {
      console.log('ocultar')
    }
  })
}
observe('selection:created')
observe('selection:updated')

const selectTableForText = opt => {
  const objects = canvas.getObjects()
  console.log(opt)
  const object = objects.find(item => {
    return item.relationID === opt.target.relationID
  })
  console.log(object)
  if (object) {
    canvas.setActiveObject(object)

    // Renderizar el canvas para mostrar la selección
    canvas.renderAll()

    // Opcional: Mostrar controles de selección automáticamente
  }
}
