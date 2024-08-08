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
const TABLES_OPTIONS = [
  {
    id: 'table1',
    color: 'rgba(0, 128, 0, 0.6)',
    name: 'Alta',
    src: './mesas/android.svg'
  },
  {
    id: 'table2',
    color: 'rgba(128, 128, 0, 0.6)',
    name: 'Sala',
    src: './mesas/android.svg'
  },
  {
    id: 'table3',
    color: 'rgba(0, 128, 128, 0.6)',
    name: 'Barra',
    src: './mesas/android.svg'
  }
]

const updateGroup = () => {
  const activeObj = canvas.getActiveObject()
  const textObject = activeObj.textObject

  if (textObject) {
    textObject.set('text', document.getElementById('myText').value)
    canvas.renderAll()
  }
}

const saveJSON = () => {
  canvas.includeDefaultValues = false
  console.log(JSON.stringify(canvas.toJSON(), null, '  '))
}

function loadAndChangeSVGColor (url, color, id) {
  fetch(url)
    .then(response => {
      console.log(response)
      return response.text()
    })
    .then(svgText => {
      console.log(svgText)

      // Crear un contenedor temporal para el SVG
      const tempContainer = document.createElement('div')

      tempContainer.innerHTML = svgText

      // Obtener el elemento SVG
      const svgElement = tempContainer.querySelector('svg')
      svgElement.setAttribute("height", RECTANGLE_SIZE_CONTROLS)

      // Cambiar el color de todos los elementos de tipo path en el SVG
      const paths = svgElement.querySelectorAll('path')
      paths.forEach(path => {
        path.setAttribute('fill', color) // Cambiar 'fill' por el color deseado
      })
      tempContainer.addEventListener('dragstart', dragElement)
      tempContainer.id = id
      tempContainer.draggable = true

      // Insertar el SVG en la sección "controles"
      document.getElementById('controls').appendChild(tempContainer)
    })
    .catch(error => console.error('Error al cargar el SVG:', error))
}

const createControls = () => {
  const controls = document.getElementById('controls')
  TABLES_OPTIONS.forEach(option => {
    loadAndChangeSVGColor(option.src, option.color, option.id)
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
      eventName === 'selection:updated' ||
      eventName === 'selection:created'
    ) {
      showSelection(opt)
    }
  })
}

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

function getRectBounds (rect) {
  const coords = rect.getCoords()
  const topMost = Math.min(coords[0].y, coords[1].y, coords[2].y, coords[3].y)
  const centerX = rect.getCenterPoint().x
  return { topMost, centerX }
}

observe('drop:before')
observe('drop')
observe('dragenter')
observe('dragleave')
observe('selection:created')
observe('selection:updated')

function dragElement (e) {
  e.dataTransfer.setData('id', e.target.id)
}

const udpateText = rectangle => {
  const textObject = rectangle.textObject
  const { topMost, centerX } = getRectBounds(rectangle)

  textObject.set({
    left: centerX - textObject.width * 0.5,
    top: topMost - textObject.fontSize
  })

  canvas.renderAll()
}
const centerTextInSVG = svg => {
  const textObject = svg.textObject
  textObject.set({
    left: svg.getCenterPoint().x - textObject.width * 0.5,
    top: svg.getCenterPoint().y - textObject.height * 0.5
  })
  textObject.bringToFront()

  canvas.renderAll()
}
const createSVG = ({ svgURL, color, x, y }) => {
  fabric.loadSVGFromURL(svgURL, function (objects) {
    const svg = fabric.util.groupSVGElements(objects, {
    })
    console.log(svg.width)
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
    const text = new fabric.Textbox(counter.toString(), {
      fontSize: FONT_SIZE_TABLES,
      textAlign: 'center',
      selectable: false,
      fill: 'white'
    })
    text.set({
      left: x - text.width * 0.5,
      top: y - text.height * 0.5
    })
    text.bringToFront()
    counter++
    svg.set('textObject', text)
    svg.on('scaling', function () {
      centerTextInSVG(svg)
    })
    svg.on('moving', function () {
      centerTextInSVG(svg)
    })
    svg.on('rotating', function () {
      centerTextInSVG(svg)
    })
    canvas.add(svg, text)
  })
}

const createRectangle = ({ e, color, zoneType, fontSize }) => {
  const rectangle = new fabric.Rect({
    width: RECTANGLE_SIZE_CONTROLS,
    height: RECTANGLE_SIZE_CONTROLS,
    left: e.layerX - RECTANGLE_SIZE_CONTROLS / 2,
    top: e.layerY - RECTANGLE_SIZE_CONTROLS / 2,
    fill: color
  })

  const text = new fabric.Textbox(zoneType + counter.toString(), {
    fontSize,
    left: e.layerX - RECTANGLE_SIZE_CONTROLS / 2,
    width: RECTANGLE_SIZE_CONTROLS,
    top: e.layerY - fontSize - RECTANGLE_SIZE_CONTROLS / 2,
    textAlign: 'center',
    selectable: false
  })
  counter++
  rectangle.set('textObject', text)
  rectangle.set('zoneType', zoneType)

  rectangle.on('scaling', function () {
    udpateText(rectangle)
  })
  rectangle.on('moving', function () {
    udpateText(rectangle)
  })
  rectangle.on('rotating', function () {
    udpateText(rectangle)
  })
  canvas.add(rectangle, text)
}

// dropElement function called on ondrop event.
function dropElement (e) {
  e.preventDefault()
  const id = e.dataTransfer.getData('id')
  console.log(id)
  if (id === 'area') {
    createRectangle({
      e,
      color: 'rgba(0, 128, 0, 0.1)',
      zoneType: ZONE_TYPE.area,
      fontSize: FONT_SIZE_AREA
    })
    return
  }
  if (id === 'floor') {
    createRectangle({
      e,
      color: 'rgba(0, 0, 255, 0.1)',
      zoneType: ZONE_TYPE.floor,
      fontSize: FONT_SIZE_FLOOR
    })
    return
  }

  const data = TABLES_OPTIONS.find((table)=> table.id === id)
  console.log(data)
  createSVG({svgURL: data.src, color: data.color,x:e.layerX, y:e.layerY})
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
