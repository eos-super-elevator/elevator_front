import React, { Component, createRef } from 'react'
import ReactDOM from 'react-dom'
import socketIOClient from 'socket.io-client'
import reverse from 'lodash/reverse' // Reverse the order in an array
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import './style.css'

const ENDPOINT = 'http://192.168.1.144:3000'

class Elevator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      elevatorPosition: 0
    }
    this.doors = createRef()
    this.leftDoor = createRef()
    this.rightDoor = createRef()
  }

  componentDidUpdate(prevProps) {
    let prevFloor = prevProps.elevatorPosition
    let targetFloor = this.getCurrentFloor()

    console.log('componentDidUpdate')


    if(prevFloor === undefined){
      prevFloor = 0
    }

    if (prevFloor < targetFloor ) {
      this.displayArrow('up')
      // setTimeout(() => {
      //   openDoors()
      //   allFloors
      // }, 3000) // This class is removed after 3s (to light off)
      // setTimeout(() => {
      //   closeDoors()
      // }, 6000) // Close doors after 6s
    } else if (prevFloor > targetFloor) {
      this.displayArrow('down')
      // setTimeout(() => {
      //   openDoors()
      //   allFloors.forEach(floor => {
      //     floor.classList.remove('active')
      //   })
      //   }, 3000)
      //   setTimeout(() => {
      //     closeDoors()
      //   }, 6000)
    } else {
      console.log(`Argument error: Asked ${targetFloor} but was on ${prevFloor}`)
    }
  }

  componentWillUnmount() {
    this.clearTimeout()
  }

  componentDidMount() {
    this.connectSocket()
  }

  // connect on `new_elevator_state` socket and listen changes
  connectSocket() {
    const socket = socketIOClient(ENDPOINT)
    const thus = this
    // update floor when receive some data
    socket.on('new_elevator_state', (data) => {
      console.log('Receive data from `new_elevator_state` socket')
      thus.setFloor(data.elevator.floor)
    })
  }

  // - display arrow on the current floor
  displayArrow(direction){
    this.turnOffArrows()

    console.log(`.arrow-${direction}-${this.getCurrentFloor()}`)

    const arrow = ReactDOM.findDOMNode(this).querySelector(`.arrow-${direction}-${this.getCurrentFloor()}`)

    if(arrow !== null){
      arrow.classList.add('active')
    }
  }

  getNode() {
    return ReactDOM.findDOMNode(this)
  }

  turnOffArrows(){
    document.querySelectorAll('.arrow')
            .forEach(f => f.classList.remove('active'))
  }

  // get state of `elevatorPosition` and prevent datashit
  getCurrentFloor(){
    return Math.round(this.state.elevatorPosition)
  }

  // set floor of the elevator and
  setFloor(floor) {
    // prevent fucking float
    const floorInt = Math.round(floor)
    // render only if needed
    if (floorInt !== this.getCurrentFloor()) {
      // console.log("Change elevator position:" + floorInt)
      this.setState({ elevatorPosition: floorInt })
    }
  }

  render() {
    const floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const { elevatorPosition } = this.state
    const { doorsAreOpening } = this.props
    return (
      <div className="elevator-container">
        <div className="elevator">
          <div className="left">
            {reverse(floors.map((floor, index) =>
              <div ref={this.leftDoor} className={`floor left-floor-${floor}`} key={index}>
                <FaArrowDown className={`arrow arrow-down-${floor}`} />
              </div>
            ))}
          </div>
          <div className="center">
              <div className="stages">
                {reverse(floors.map((floor, index) =>
                  <div className={`stage stage-${floor}`} key={index}>
                    <span className="stage-number">{floor}</span>
                  </div>
                ))}
              </div>
              <div ref={this.doors} className="doors isMoving" style={{ bottom: elevatorPosition}}>
                  <div className={`door left-door ${doorsAreOpening ? 'isOpened' : 'isClosed'}`}></div>
                  <div className={`door right-door ${doorsAreOpening ? 'isOpened' : 'isClosed'}`}></div>
              </div>
          </div>
          <div className="right">
          {reverse(floors.map((floor, index) =>
              <div ref={this.rightDoor} className={`floor right-floor-${floor}`} key={index}>
                <FaArrowUp className={`arrow arrow-up-${floor}`} />
              </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Elevator
