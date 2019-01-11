import React, { Component, createRef } from 'react'
import ReactDOM from 'react-dom'
import socketIOClient from 'socket.io-client'
import reverse from 'lodash/reverse' // Reverse the order in an array
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import './style.css'
import Door from './door'

import { ENDPOINT } from '../../config'

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

    if(prevFloor === undefined){
      prevFloor = 0
    }

    if (prevFloor < targetFloor ) {
      this.displayArrow('up')
    } else if (prevFloor > targetFloor) {
      this.displayArrow('down')
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
      thus.setFloor(data.elevator.floor)
    })
  }

  // display arrow on the current floor
  displayArrow(direction){
    this.turnOffArrows()
    const arrow = ReactDOM.findDOMNode(this).querySelector(`.arrow-${direction}-${this.getCurrentFloor()}`)

    if(arrow !== null){
      arrow.classList.add('active')
    }
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
      this.setState({ elevatorPosition: floorInt })
    }
  }

  render() {
    const floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const { elevatorPosition } = this.state

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
              <Door elevatorPosition={elevatorPosition} />
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
