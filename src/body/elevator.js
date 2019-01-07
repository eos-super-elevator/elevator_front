import React, { Component, createRef } from 'react'
import ReactDOM from 'react-dom'
import reverse from 'lodash/reverse'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import './style.css'

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
    const { targetFloor, isLocked, openDoors, canMoving } = this.props
    const prevFloor = prevProps.targetFloor
    console.log('canMoving', canMoving)
    if (targetFloor !== prevFloor) {
      const doorsPosition = this.doors.current.offsetTop
      const node = ReactDOM.findDOMNode(this)
      const allFloors = document.querySelectorAll('.arrow')
      const arrowUpNode = node.querySelector(`.arrow-up-${targetFloor}`)
      const arrowDownNode = node.querySelector(`.arrow-down-${targetFloor}`)
      
      allFloors.forEach(floor => {
        floor.classList.remove('active')
      })
    
      if (prevFloor < targetFloor ) {
        const doorsTopPosition = doorsPosition - (targetFloor * 60)
        const newDoorsPosition = doorsPosition - doorsTopPosition
        this.setState({ 
          elevatorPosition: newDoorsPosition,
        })
        arrowUpNode.classList.add('active')
        setTimeout(() => {
          openDoors()
          allFloors.forEach(floor => {
            floor.classList.remove('active')
          })
        }, 3000) //Change the state when the animation is ended
      } else if (prevFloor > targetFloor) {
        const doorsTopPosition = doorsPosition + (targetFloor * 60)
        const newDoorsPosition = doorsTopPosition - doorsPosition
        this.setState({ 
          elevatorPosition: newDoorsPosition,
        })
        arrowDownNode.classList.add('active')
        setTimeout(() => {
          openDoors()
          allFloors.forEach(floor => {
            floor.classList.remove('active')
          })
          }, 3000)
      } else {
        console.log('error')
      }
    }
  }

  componentWillUnmount() {
    clearTimeout()
  }

  render() {
    const floors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const { elevatorPosition } = this.state
    const { doorsIsOpened } = this.props
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
                  <div className={`door left-door ${doorsIsOpened ? 'isOpening' : 'isClosing'}`}></div>
                  <div className={`door right-door ${doorsIsOpened ? 'isOpening' : 'isClosing'}`}></div>
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
