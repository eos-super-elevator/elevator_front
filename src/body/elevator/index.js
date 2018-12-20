import React, { Component, createRef } from 'react'
import ReactDOM from "react-dom"
import reverse from 'lodash/reverse'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import './style.css'

class Elevator extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      currentFloor: 0,
      elevatorPosition: 0,
      doorsIsOpened: true
    }
    this.stages = createRef()
    this.doors = createRef()
    this.leftDoor = createRef()
    this.rightDoor = createRef()
  }

  moveElevator = (e) => {
    const { currentFloor } = this.state
    const targetFloor = e.target.value
    const doorsPosition = this.doors.current.offsetTop
    const totalHeight = this.stages.current.clientHeight
    const margin = (totalHeight - (55 * 10)) / 10 //Get the margin between two stages
    const stageHeight = margin + 55
    
    const node = ReactDOM.findDOMNode(this)
    const allFloors = document.querySelectorAll('.floor')
    const rightFloorNode = node.querySelector(`.right-floor-${targetFloor}`)
    const leftFloorNode = node.querySelector(`.left-floor-${targetFloor}`)
    
    allFloors.forEach(floor => {
      floor.classList.remove('active')
    })

    if (currentFloor < targetFloor ) {
      const doorsTopPosition = doorsPosition - (targetFloor * stageHeight)
      const newDoorsPosition = doorsPosition - doorsTopPosition
      this.setState({ 
        currentFloor: targetFloor, 
        elevatorPosition: newDoorsPosition,
        doorsIsOpened: false
      })
      rightFloorNode.classList.add('active')
      setTimeout(() => {
        this.setState({ 
          doorsIsOpened: true
        })
        allFloors.forEach(floor => {
          floor.classList.remove('active')
        })
      }, 3000) //Change the state when the animation is ended
    } else if (currentFloor > targetFloor) {
      const doorsTopPosition = doorsPosition + (targetFloor * stageHeight)
      const newDoorsPosition = doorsTopPosition - doorsPosition
      this.setState({ 
        currentFloor: targetFloor, 
        elevatorPosition: newDoorsPosition,
        doorsIsOpened: false
      })
      leftFloorNode.classList.add('active')
      setTimeout(() => {
        this.setState({ 
          doorsIsOpened: true
        })
        allFloors.forEach(floor => {
          floor.classList.remove('active')
        })
      }, 3000)
    } else {
      this.setState({ currentFloor: targetFloor })
    }
  }

  render() {
    const floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const { elevatorPosition, doorsIsOpened } = this.state
    return (
      <div className="elevator-container">
        <div>
          {floors.map((floor, index) =>
            <input type="submit" key={index} onClick={this.moveElevator} value={floor} />
          )}
        </div>
        <div className="elevator">
          <div className="left">
            {reverse(floors.map((floor, index) => 
              <div ref={this.leftDoor} className={`floor left-floor-${floor}`} key={index}>
                <FaArrowDown className="arrow-down" />
              </div>
            ))}
          </div>
          <div className="center">
              <div className="stages" ref={this.stages}>
                {reverse(floors.map((floor, index) => 
                  <div className={`stage stage-${floor}`} key={index}>
                    <span className="stage-number">{floor}</span>
                  </div>
                ))}
              </div>
              <div ref={this.doors} className="doors isMoving" style={{ bottom: elevatorPosition}}>
                  <div className={`door left-door ${doorsIsOpened ? 'isOpening' : ''}`}></div>
                  <div className={`door right-door ${doorsIsOpened ? 'isOpening' : ''}`}></div>
              </div>
          </div>
          <div className="right">
          {reverse(floors.map((floor, index) => 
              <div ref={this.rightDoor} className={`floor right-floor-${floor}`} key={index}>
                <FaArrowUp className="arrow-up" />
              </div>
          ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Elevator
