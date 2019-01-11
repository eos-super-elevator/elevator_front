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
    let { targetFloor, openDoors, closeDoors } = this.props

    let prevFloor = prevProps.elevatorPosition
    console.log('componentDidUpdate')


    if(prevFloor === undefined){
      prevFloor = 0
    }

    targetFloor = this.getCurrentFloor()

    if (targetFloor !== prevFloor) {
      const doorsPosition = this.doors.current.offsetTop
      const node = ReactDOM.findDOMNode(this)
      const allFloors = document.querySelectorAll('.arrow')
      const arrowUpNode = node.querySelector(`.arrow-up-${targetFloor}`)
      const arrowDownNode = node.querySelector(`.arrow-down-${targetFloor}`)

      // Remove active class for each stage (to light off)
      allFloors.forEach(floor => {
        floor.classList.remove('active')
      })

      if (prevFloor < targetFloor ) {
        // Calc new position of elevator to allow the moving
        // const doorsTopPosition = doorsPosition - (targetFloor * 60)
        // const newDoorsPosition = doorsPosition - doorsTopPosition

        // Check if the doors are well closed before moving
        // this.setState({
        //   elevatorPosition: newDoorsPosition,
        // })

        // Add active class to target stage light
        if(arrowUpNode !== null){
          arrowUpNode.classList.add('active')
        }

        setTimeout(() => {
          openDoors()
          allFloors.forEach(floor => floor.classList.remove('active'))
        }, 3000) // This class is removed after 3s (to light off)
        setTimeout(() => {
          closeDoors()
        }, 6000) // Close doors after 6s

      } else if (prevFloor > targetFloor) {
        // const doorsTopPosition = doorsPosition + (targetFloor * 60)
        // const newDoorsPosition = doorsTopPosition - doorsPosition
        // this.setState({
        //   elevatorPosition: newDoorsPosition,
        // })

        arrowDownNode.classList.add('active')
        setTimeout(() => {
          openDoors()
          allFloors.forEach(floor => {
            floor.classList.remove('active')
          })
          }, 3000)
          setTimeout(() => {
            closeDoors()
          }, 6000)
      } else {
        console.log(`Argument error: Asked ${targetFloor} but was on ${prevFloor}`)
      }
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
