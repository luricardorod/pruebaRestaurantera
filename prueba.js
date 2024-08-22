/* global localStorage fabric */
const ZONE_TYPE = {
  area: 'AREA',
  floor: 'PISO',
  table: 'TABLE'
}

const RESERVATIONS = [
  {
    id: 1,
    guestName: 'John Doe',
    reservationTime: '2024-08-20T18:30:00',
    guestCount: 4,
    availableSeats: 10,
    status: 'Confirmed',
    assignedTables: []
  },
  {
    id: 2,
    guestName: 'Jane Smith',
    reservationTime: '2024-08-20T19:00:00',
    guestCount: 2,
    availableSeats: 5,
    status: 'Pending',
    assignedTables: [1724201157051, 1724201157192]
  },
  {
    id: 3,
    guestName: 'Carlos Hernandez',
    reservationTime: '2024-08-20T20:00:00',
    guestCount: 6,
    availableSeats: 8,
    status: 'Confirmed',
    assignedTables: [1724201162923, 1724201172178]
  },
  {
    id: 4,
    guestName: 'Emily Johnson',
    reservationTime: '2024-08-20T18:00:00',
    guestCount: 3,
    availableSeats: 7,
    status: 'Cancelled',
    assignedTables: []
  },
  {
    id: 5,
    guestName: 'Michael Brown',
    reservationTime: '2024-08-20T21:30:00',
    guestCount: 5,
    availableSeats: 10,
    status: 'Confirmed',
    assignedTables: []
  },
  {
    id: 6,
    guestName: 'Sophie Lee',
    reservationTime: '2024-08-20T19:30:00',
    guestCount: 2,
    availableSeats: 4,
    status: 'Pending',
    assignedTables: []
  },
  {
    id: 7,
    guestName: 'David Wilson',
    reservationTime: '2024-08-20T20:30:00',
    guestCount: 8,
    availableSeats: 12,
    status: 'Confirmed',
    assignedTables: []
  },
  {
    id: 8,
    guestName: 'Laura Martinez',
    reservationTime: '2024-08-20T18:45:00',
    guestCount: 3,
    availableSeats: 5,
    status: 'Confirmed',
    assignedTables: []
  },
  {
    id: 9,
    guestName: 'Daniel Evans',
    reservationTime: '2024-08-20T21:00:00',
    guestCount: 4,
    availableSeats: 6,
    status: 'Cancelled',
    assignedTables: []
  },
  {
    id: 10,
    guestName: 'Olivia Taylor',
    reservationTime: '2024-08-20T19:15:00',
    guestCount: 7,
    availableSeats: 10,
    status: 'Pending',
    assignedTables: []
  }
]

const COLORS_TABLE = {
  empty: 'green',
  reserved: 'red'
}

let reservationSelected = {}

let reservationsList = []

const loadJSON = function () {
  const map = localStorage.getItem('map')

  canvas.loadFromJSON(map, function () {
    const objects = canvas.getObjects()
    const textIndexes = {}
    objects.forEach((object, index) => {
      if (object.type === 'textbox') {
        textIndexes[object.relationID] = index
        object.on('mouseup', selectTableForText)
      }
      if (object.zoneType !== ZONE_TYPE.table) {
        object.set('selectable', false)
      }
      if (object.zoneType === ZONE_TYPE.table) {
        tablesByID[object.relationID] = object
        changeColorTable(object, COLORS_TABLE.empty)
      }
    })
    objects.forEach((object, index) => {
      if (object.type !== 'textbox') {
        object.set('textObject', objects[textIndexes[object.relationID]])
      }
    })
    getReservationsList()
    canvas.renderAll()
  })
}

const createReservationCard = reservation => {
  const card = document.createElement('div')
  card.className = 'card'
  card.id = reservation.id

  const ul = document.createElement('ul')
  ul.className = 'fa-ul'

  const nameLi = document.createElement('li')
  nameLi.innerHTML = `<span class="fa-li fa fa-user"></span>${reservation.guestName}`
  ul.appendChild(nameLi)

  const timeLi = document.createElement('li')
  timeLi.innerHTML = `<span class="fa-li fa fa-calendar"></span>${new Date(
    reservation.reservationTime
  ).toLocaleString()}`
  ul.appendChild(timeLi)

  const guestCountLi = document.createElement('li')
  guestCountLi.innerHTML = `<span class="fa-li fa fa-user-plus"></span>${reservation.guestCount}`
  ul.appendChild(guestCountLi)

  const seatsLi = document.createElement('li')
  seatsLi.innerHTML = `<span class="fa-li fa fa-street-view"></span>${reservation.availableSeats}`
  ul.appendChild(seatsLi)

  const statusLi = document.createElement('li')
  statusLi.innerHTML = `<span class="fa-li fa fa-book"></span>${reservation.status}`
  ul.appendChild(statusLi)

  const tablesLi = document.createElement('li')
  const nameTables = reservation.assignedTables.map(id => {
    if (tablesByID[id]) {
      return tablesByID[id].textObject.text
    }
    return null
  })
  tablesLi.innerHTML = `<span class="fa-li fa fa-tasks"></span>${nameTables.join(
    ', '
  )}`
  ul.appendChild(tablesLi)
  card.addEventListener('click', event => {
    selectReservation(reservation)
  })
  card.appendChild(ul)
  return card
}

const selectReservation = reservation => {
  reservationSelected = reservation
  showReservationForm(true)
  loadInfoReservationForm()
  renderReservationList()
}

const loadInfoReservationForm = () => {
  const reservation = reservationSelected
  document.getElementById('guestName').value = reservation.guestName
  document.getElementById('reservationTime').value = reservation.reservationTime
  document.getElementById('guestCount').value = reservation.guestCount
  document.getElementById('availableSeats').value = reservation.availableSeats
  document.getElementById('status').value = reservation.status
  showTablesAssigned()
}

const renderReservationList = () => {
  const container = document.getElementById('reservationsContainer')
  container.innerHTML = ''
  console.log(reservationsList)
  console.log(reservationSelected)
  reservationsList.forEach(reservation => {
    const card = createReservationCard(reservation)
    if (reservation.id === reservationSelected.id) {
      card.classList.add('selected')
      console.log('sisisisisisi')
    }
    if (reservation.assignedTables.length > 0) {
      reservation.assignedTables.forEach(tableID => {
        changeColorTable(tablesByID[tableID], COLORS_TABLE.reserved)
        tablesByID[tableID].reservation = reservation.id
      })
    }
    container.appendChild(card)
  })
}

const getReservationsList = async () => {
  reservationsList = RESERVATIONS
  renderReservationList()
}

const tablesByID = {}

const canvas = new fabric.Canvas('c1')

const observe = eventName => {
  canvas.on(eventName, function (opt) {
    if (
      eventName === 'selection:updated' ||
      eventName === 'selection:created'
    ) {
      const activeObj = canvas.getActiveObject()
      activeObj.lockMovementX = true
      activeObj.lockMovementY = true
      activeObj.lockScalingX = true
      activeObj.lockScalingY = true
      activeObj.lockRotation = true
      activeObj.hasControls = false
      if (activeObj.zoneType === ZONE_TYPE.table) {
        const reservation = reservationsList.find(
          res => res.id === tablesByID[activeObj.relationID].reservation
        )
        if (reservation) {
          selectReservation(reservation)
        }
      }
    }
  })
}
observe('selection:created')
observe('selection:updated')

const selectTableForText = opt => {
  const objects = canvas.getObjects()
  const object = objects.find(item => {
    return item.relationID === opt.target.relationID
  })
  if (object) {
    canvas.setActiveObject(object)
    canvas.renderAll()
  }
}

const assignTables = () => {
  console.log(reservationSelected)
  const activeObj = canvas.getActiveObject()
  const tables = []
  if (activeObj.type === 'activeSelection') {
    activeObj._objects.forEach(function (object) {
      tables.push(object.relationID)
      changeColorTable(object, COLORS_TABLE.reserved)
      tablesByID[object.id].reservation = reservationSelected.id
    })
  } else {
    tables.push(activeObj.relationID)
    changeColorTable(activeObj, COLORS_TABLE.reserved)
    tablesByID[activeObj.relationID].reservation = reservationSelected.id
  }
  reservationSelected.assignedTables = [
    ...reservationSelected.assignedTables,
    ...tables
  ]
  showTablesAssigned()
  renderReservationList()
  canvas.renderAll()
}

const showReservationForm = show => {
  const noReservationContainer = document.getElementById(
    'noReservationContainer'
  )
  const reservationFormContainer = document.getElementById(
    'reservationFormContainer'
  )
  reservationFormContainer.style.display = show ? 'block' : 'none'
  noReservationContainer.style.display = show ? 'none' : 'block'
}
showReservationForm(false)

const changeColorTable = (table, color) => {
  table.getObjects().forEach(function (obj) {
    if (obj.type === 'path') {
      obj.set('fill', color)
    }
  })
}

const removeTableFromReservation = id => {
  const index = reservationSelected.assignedTables.findIndex(table => {
    return table === id
  })
  if (index !== undefined) {
    reservationSelected.assignedTables = [
      ...reservationSelected.assignedTables.slice(0, index),
      ...reservationSelected.assignedTables.slice(
        index + 1,
        reservationSelected.assignedTables.lenght
      )
    ]
    changeColorTable(tablesByID[id], COLORS_TABLE.empty)
    showTablesAssigned()
    renderReservationList()
    canvas.renderAll()
  }
}

const showTablesAssigned = () => {
  const tables = reservationSelected.assignedTables
  const container = document.getElementById('assignedTables')
  const tablesAssigned = tables
    .map((table, index) => {
      const tableName = tablesByID[table].textObject.text
      const id = tablesByID[table].relationID
      return `
        <div class="fa fa-tasks"></div>
        <span>${tableName}</span>
        <button type="button" onclick="removeTableFromReservation(${id})">
        &#10005;
        </button>
        `
    })
    .join('')
  container.innerHTML = tablesAssigned
}
