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
      elevatorPosition: null,
      direction: 'up'
    }
    this.doors = createRef()
    this.leftDoor = createRef()
    this.rightDoor = createRef()
  }
  
  // connect on `new_elevator_state` socket and listen changes
  connectSocket() {
    const socket = socketIOClient(ENDPOINT)
    const thus = this
    // update floor when receive some data
    socket.on('new_elevator_state', (data) => {
      thus.setElevator(data.elevator)
    })
    socket.emit('updated_elevator')
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
  setElevator(elevator) {
    // prevent fucking float
    if(elevator.direction === "up"){
      this.setState({ direction: 'up' })
    }else{
      this.setState({ direction: 'down' })
    }
    const floorInt = Math.round(elevator.floor)
    // render only if needed
    if (floorInt !== this.getCurrentFloor()) {
      this.setState({ elevatorPosition: floorInt })
    }

  }

  componentDidMount() {
    this.connectSocket()
  }

  componentDidUpdate(prevProps,prevState) {
    // console.log(prevProps.direction)
    let prevFloor = prevProps.elevatorPosition
    let wayToGo = prevState.direction
    console.log(wayToGo);
    // console.log(prevProps);
    let targetFloor = this.getCurrentFloor()

    // if(prevFloor === undefined){
    //   prevFloor = 0
    // }
    console.log(prevFloor)
    if (wayToGo === "up" ) {
      this.displayArrow('up')
      console.log('up')
    } else if (wayToGo === "down") {
      console.log('down')
      this.displayArrow('down')
    } else {
      console.log(`Argument error: Asked ${targetFloor} but was on ${prevFloor}`)
    }
  }

  componentWillUnmount() {
    this.clearTimeout()
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
              <Door elevatorPosition={elevatorPosition} doorsAreOpening={doorsAreOpening} />
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
