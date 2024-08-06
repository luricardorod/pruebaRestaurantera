/* global fabric */
let counter = 0
const updateGroup = () => {
  console.log(document.getElementById('myText').value)
  const activeObj = canvas.getActiveObject()
  const objects = activeObj.getObjects()

  const textObject = objects.find(obj => {
    console.log(obj.type)
    return obj.type === 'textbox'
  })

  if (textObject) {
    textObject.set('text', document.getElementById('myText').value)
    canvas.renderAll() // Renderizar el canvas para aplicar los cambios
  }
}

const saveJSON = () => {
  canvas.includeDefaultValues = false
  console.log(JSON.stringify(canvas.toJSON(), null, '  '))
}

document.querySelector('#app').innerHTML = `
  
`
const tablesOptions = [
  {
    id: 'table1',
    src: './mesas/Mesa-2.png'
  },
  {
    id: 'table2',
    src: './mesas/Mesa-4.png'
  },
  {
    id: 'table3',
    src: './mesas/Mesa-6.png'
  }
]

const controls = document.getElementById('controls')

tablesOptions.forEach(option => {
  const img = document.createElement('img')
  img.className = 'img-table'
  img.id = option.id
  img.draggable = true
  img.src = option.src
  img.addEventListener('dragstart', dragElement)
  controls.appendChild(img)
})

const blocks = document.getElementsByClassName('rectangleControl')
Array.from(blocks).forEach(rec => {
  rec.addEventListener('dragstart', dragElement)
})

fabric.Object.prototype.transparentCorners = false
const canvas = new fabric.Canvas('c1')

function observe (eventName) {
  canvas.on(eventName, function (opt) {
    if (eventName === 'drop') {
      dropElement(opt.e)
    }
    if (
      eventName === 'selection:updated' ||
      eventName === 'selection:created'
    ) {
      showSelection(opt)
    }
    console.log(eventName, opt)
  })
}

const showSelection = opt => {
  const activeObj = canvas.getActiveObject()
  if (activeObj.type !== 'group') return
  const objects = activeObj.getObjects()

  const textObject = objects.find(obj => {
    console.log(obj.type)
    return obj.type === 'textbox'
  })

  document.getElementById('myText').value = textObject.text
}

observe('drop:before')
observe('drop')
observe('dragenter')
observe('dragleave')
observe('selection:created')
observe('selection:updated')

// dragElement function called on ondrag event.
function dragElement (e) {
  console.log(e.target.id)
  e.dataTransfer.setData('id', e.target.id) // transfer the "data" i.e. id of the target dragged.
}
const RECTANGLE_SIZE_CONTROLS = 50

const createRectangle = ({ e, color, type }) => {
  const rectangle = new fabric.Rect({
    width: RECTANGLE_SIZE_CONTROLS,
    height: RECTANGLE_SIZE_CONTROLS,
    left: e.layerX - RECTANGLE_SIZE_CONTROLS / 2,
    top: e.layerY - RECTANGLE_SIZE_CONTROLS / 2,
    fill: color
  })

  const text = new fabric.Textbox(type + counter.toString(), {
    fontSize: 10,
    left: e.layerX - RECTANGLE_SIZE_CONTROLS / 2,
    width: RECTANGLE_SIZE_CONTROLS,
    top: e.layerY - 10 - RECTANGLE_SIZE_CONTROLS / 2,
    textAlign: 'center'
  })
  text.set('lockScalingX', true)
  counter++
  const group = new fabric.Group([rectangle, text])
  // group.on('scaling', function () {
  //   console.log('asdasda')
  //   console.log(group)
  //   const scaleX = group.scaleX
  //   const scaleY = group.scaleY
  //   // Escalar solo el rectángulo
  //   group.item(1).set({
  //     scaleX: 1 / scaleX,
  //     scaleY: 1 / scaleY
  //   })

  //   group.setCoords()
  //   canvas.renderAll()
  // })
  canvas.add(group)
}

// dropElement function called on ondrop event.
function dropElement (e) {
  e.preventDefault()
  const id = e.dataTransfer.getData('id')

  if (id === 'area') {
    createRectangle({ e, color: 'rgba(0, 128, 0, 0.1)', type: 'Area' })
    return
  }
  if (id === 'floor') {
    createRectangle({ e, color: 'rgba(0, 0, 255, 0.1)', type: 'Piso' })
    return
  }
  const imgData = document.getElementById(id)
  const width = imgData.width
  const height = imgData.height

  const img = new fabric.Image(imgData, {
    left: e.layerX - width / 2,
    top: e.layerY - height / 2
  })
  const text = new fabric.Textbox(counter.toString(), {
    fontSize: 10,
    left: e.layerX - width / 2,
    width,
    top: e.layerY - 5,
    textAlign: 'center'
  })
  counter++
  const group = new fabric.Group([img, text])
  canvas.add(group)
}
