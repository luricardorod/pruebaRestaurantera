import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <img
        class="img"
        id="ele1"
        draggable="true"
        src="https://webkit.org/wp-content/uploads/STP-300x300.png"
      />
      <canvas id="c1" width="800" height="600"></canvas>
      <div id="drag-stuff" class="log">
        Drag me on the canvas<br /><br />
        <div id="drag-me" draggable="true"></div>
      </div>
  </div>
`

fabric.Object.prototype.transparentCorners = false
const canvas = new fabric.Canvas('c1')
canvas.add(
  new fabric.Rect({
    width: 50,
    height: 50,
    fill: 'green',
    top: 100,
    left: 100
  })
)
canvas.add(
  new fabric.Rect({
    width: 30,
    height: 30,
    fill: 'green',
    top: 50,
    left: 50
  })
)
canvas.add(new fabric.Circle({ radius: 20, fill: 'blue', top: 160, left: 140 }))
canvas.add(new fabric.Textbox('Textbox', { fill: 'black', top: 70, left: 200 }))

function observe (eventName) {
  canvas.on(eventName, function (opt) {
    if (eventName === 'drop') {
      dropElement(opt.e)
    }
    console.log(eventName, opt)
  })
}

observe('drop:before')
observe('drop')
observe('dragenter')
observe('dragleave')
// allowDrop function called on ondragover event.
function allowDrop (e) {
  e.preventDefault()
}
//dragElement function called on ondrag event.
function dragElement (e) {
  console.log('asdasda')
  e.dataTransfer.setData('id', e.target.id) //transfer the "data" i.e. id of the target dragged.
}

//dropElement function called on ondrop event.
function dropElement (e) {
  e.preventDefault()
  var data = e.dataTransfer.getData('id') //receiving the "data" i.e. id of the target dropped.
  var imag = document.getElementById(data) //getting the target image info through its id.
  var img = new fabric.Image(imag, {
    //initializing the fabric image.
    left: e.layerX - 80, //positioning the target on exact position of mouse event drop through event.layerX,Y.
    top: e.layerY - 40
  })
  img.scaleToWidth(imag.width) //scaling the image height and width with target height and width, scaleToWidth, scaleToHeight fabric inbuilt function.
  img.scaleToHeight(imag.height)
  canvas.add(img)
}

document.getElementById('ele1').addEventListener('dragstart', dragElement)
