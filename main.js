/* global fabric */
let counter = 0
const FONT_SIZE_AREA = 20
const FONT_SIZE_FLOOR = 25
const RECTANGLE_SIZE_CONTROLS = 50
const ZONE_TYPE = {
  area: 'AREA',
  floor: 'PISO',
  table: 'TABLE'
}
const FONT_SIZE_TABLES = 15
const ZONES_AVAILABLE = [
  {
    name: 'Barra'
  },
  {
    name: 'Planta Alta'
  },
  {
    name: 'Salón'
  },
  {
    name: 'Bar'
  },
  {
    name: 'Terraza'
  },
  {
    name: 'Otro'
  }
]
const TABLES_OPTIONS = [
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table3',
    color: 'rgba(0, 128, 128, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table3',
    color: 'rgba(0, 128, 128, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table3',
    color: 'rgba(0, 128, 128, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table3',
    color: 'rgba(0, 128, 128, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Alta XX',
    src: './mesas/android.svg'
  }
]
const loadJSON = function () {
  const map = localStorage.getItem('map')

  canvas.loadFromJSON(map, function () {
    console.log(canvas.getObjects())
    const objects = canvas.getObjects()
    const textIndexes = {}
    objects.forEach((object, index) => {
      if (object.type === 'textbox') {
        textIndexes[object.relationID] = index
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

const updateGroup = () => {
  const activeObj = canvas.getActiveObject()
  const textObject = activeObj.textObject

  if (textObject) {
    textObject.set('text', document.getElementById('myText').value)
    udpatePositionText(activeObj)
    canvas.renderAll()
  }
}

const saveJSON = () => {
  canvas.includeDefaultValues = false
  console.log(
    canvas.toJSON(['zoneType', 'relationID', 'selectable', 'others...'])
  )
  localStorage.setItem(
    'map',
    JSON.stringify(
      canvas.toJSON(['zoneType', 'relationID', 'selectable', 'others...'])
    )
  )
}

function loadAndChangeSVGColor ({ id, color, name, src }) {
  fetch(src)
    .then(response => {
      return response.text()
    })
    .then(svgText => {
      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = svgText
      const svgElement = tempContainer.querySelector('svg')
      svgElement.setAttribute('height', RECTANGLE_SIZE_CONTROLS)
      const paths = svgElement.querySelectorAll('path')
      paths.forEach(path => {
        path.setAttribute('fill', color)
      })
      tempContainer.addEventListener('dragstart', dragElement)
      tempContainer.id = id
      tempContainer.draggable = true
      tempContainer.classList.add('tableControl')

      const label = document.createElement('label')
      label.setAttribute('for', id)
      label.innerHTML = name
      tempContainer.appendChild(label)
      document.getElementById('controls').appendChild(tempContainer)
    })
    .catch(error => console.error('Error al cargar el SVG:', error))
}
function dragElement (e) {
  e.dataTransfer.setData('id', e.target.id)
}
const createControls = () => {
  TABLES_OPTIONS.forEach(table => {
    loadAndChangeSVGColor(table)
  })

  const blocks = document.getElementsByClassName('rectangleControl')
  Array.from(blocks).forEach(rec => {
    rec.addEventListener('dragstart', dragElement)
  })
}

createControls()
fabric.Object.prototype.transparentCorners = false
const canvas = new fabric.Canvas('c1')

function observe (eventName) {
  canvas.on(eventName, function (opt) {
    if (eventName === 'drop') {
      dropElement(opt.e)
    }
    if (
      eventName === 'object:scaling' ||
      eventName === 'object:moving' ||
      eventName === 'object:rotating'
    ) {
      console.log(opt)
      console.log(opt.target.textObject)

      udpatePositionText(opt.target)
    }
    if (
      eventName === 'selection:updated' ||
      eventName === 'selection:created'
    ) {
      showSelection(opt)
    }
  })
}

observe('drop')
observe('selection:created')
observe('selection:updated')
observe('object:scaling')
observe('object:moving')
observe('object:rotating')

const showSelection = opt => {
  const activeObj = canvas.getActiveObject()
  const textObject = activeObj.textObject
  if (!textObject) return
  const zoneType = activeObj.zoneType
  if (zoneType === ZONE_TYPE.floor) {
    activeObj.sendToBack()
  }
  document.getElementById('myText').value = textObject.text
}

async function dropElement (e) {
  e.preventDefault()
  const id = e.dataTransfer.getData('id')
  console.log(id)
  let newObject
  let label = ''
  let zoneType = ''
  let fontSize = ''

  if (id === 'area') {
    newObject = createRectangle({
      x: e.layerX,
      y: e.layerY,
      color: 'rgba(0, 128, 0, 0.1)'
    })
    zoneType = ZONE_TYPE.area
    label = zoneType + counter.toString()
    fontSize = FONT_SIZE_AREA
  } else if (id === 'floor') {
    newObject = createRectangle({
      x: e.layerX,
      y: e.layerY,
      color: 'rgba(0, 255, 0, 0.1)'
    })
    zoneType = ZONE_TYPE.floor
    label = zoneType + counter.toString()
    fontSize = FONT_SIZE_FLOOR
  } else {
    const data = TABLES_OPTIONS.find(table => table.id === id)
    newObject = await loadSVGAsync({
      svgURL: data.src,
      color: data.color,
      x: e.layerX,
      y: e.layerY
    })
    zoneType = ZONE_TYPE.table
    label = counter.toString()
    fontSize = FONT_SIZE_TABLES
  }
  const relationID = Date.now()
  const text = createText({ label, fontSize })
  text.set('relationID', relationID)
  newObject.set('textObject', text)
  newObject.set('zoneType', zoneType)
  newObject.set('relationID', relationID)
  udpatePositionText(newObject)
  counter++
  canvas.add(newObject, text)
  canvas.renderAll()
}

function getRectBounds (rect) {
  const coords = rect.getCoords()
  const topMost = Math.min(coords[0].y, coords[1].y, coords[2].y, coords[3].y)
  const centerX = rect.getCenterPoint().x
  return { topMost, centerX }
}

const udpatePositionText = object => {
  const textObject = object.textObject
  if (object.zoneType === ZONE_TYPE.table) {
    textObject.set({
      left: object.getCenterPoint().x - textObject.width * 0.5,
      top: object.getCenterPoint().y - textObject.height * 0.5
    })
  } else {
    const { topMost, centerX } = getRectBounds(object)
    textObject.set({
      left: centerX - textObject.width * 0.5,
      top: topMost - textObject.fontSize
    })
  }
}

function loadSVGAsync ({ svgURL, color, x, y }) {
  return new Promise((resolve, reject) => {
    fabric.loadSVGFromURL(svgURL, (objects, options) => {
      if (objects) {
        const svg = fabric.util.groupSVGElements(objects, options)
        svg.set({
          left: x - svg.width * 0.5,
          top: y - svg.height * 0.5
        })
        svg.getObjects().forEach(function (obj) {
          if (obj.type === 'path') {
            obj.set('fill', color)
            obj.set('stroke', color)
          }
        })
        resolve(svg)
      } else {
        reject(new Error('Error al cargar el SVG'))
      }
    })
  })
}

const createText = ({ label, fontSize }) => {
  return new fabric.Textbox(label, {
    fontSize,
    textAlign: 'center',
    selectable: false,
    fontFamily: 'Helvetica, Arial, sans-serif'
  })
}

const createRectangle = ({ x, y, color }) => {
  return new fabric.Rect({
    width: RECTANGLE_SIZE_CONTROLS,
    height: RECTANGLE_SIZE_CONTROLS,
    left: x - RECTANGLE_SIZE_CONTROLS / 2,
    top: y - RECTANGLE_SIZE_CONTROLS / 2,
    fill: color
  })
}

const removeSelected = () => {
  const activeObj = canvas.getActiveObject()
  const textObject = activeObj.textObject
  canvas.discardActiveObject()
  if (textObject) {
    canvas.remove(textObject)
    canvas.remove(activeObj)
  }
  canvas.renderAll()
}
