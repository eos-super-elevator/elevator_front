import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {faArrowDown, faArrowUp, faKey} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  reverse from 'lodash/reverse'

import Elevator from './elevator'
import './style.css'

class Body extends Component { 
  constructor(props){
    super (props)
    this.state = {
        targetFloor : null,
        lastFloor : null,
        isGoingUp : false,
        isGoingDown: false,
        meter: 0
    }
  }

  checkFloor = (targetFloor) => {
    const { lastFloor } = this.state
    const node = ReactDOM.findDOMNode(this)
    const allNumbKeys = document.querySelectorAll('.numbKey')

    allNumbKeys.forEach(numbKey => {
      numbKey.classList.remove('active')
    })
    const targetKey = node.querySelector(`.key-${targetFloor}`)
    targetKey.classList.add('active')

    this.setState({ targetFloor })
    if ((lastFloor > targetFloor) || (lastFloor < targetFloor) || (lastFloor == null) ) {
      if (lastFloor > targetFloor) {
        this.setState({ isGoingDown: true, isGoingUp: false })
        setTimeout(() => {
          this.setState({ isGoingDown : false })
        }, 3500)
      } else if (lastFloor < targetFloor) {
        this.setState({ isGoingUp: true, isGoingDown: false })
        setTimeout(() => {
          this.setState({ isGoingUp: false })
        }, 3500)
      }
      this.setState({ lastFloor: targetFloor })
    } else {
      this.setState({ isGoingUp: false, isGoingDown: false })
    }
  }

  componentWillUnmount() {
    clearTimeout()
  }

  render() {
    const { isGoingUp, isGoingDown, targetFloor, meter } = this.state
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const isMobile = window.innerWidth <= 768 // Check window's width
    return (
      <div className="body">
        {!isMobile && <Elevator targetFloor={targetFloor} />}
        <div className="keypad-container">
          <div className="keypad">
            <div className="screen">
                <div className="numberEmp">{targetFloor}</div>
                <div className="test">
                <div className="arrow">
                  <span>
                    {isGoingUp && <FontAwesomeIcon icon={faArrowUp} />}
                    {isGoingDown && <FontAwesomeIcon icon={faArrowDown} />}
                  </span>
                </div>
                <div className="ElevatorRange">
                  {meter}m
                </div>
                </div>
            </div>
            <div className="keyboard">
              <ol className="keys">
                {reverse(numbers.map((number) =>
                  <li className={`key key-${number} numbKey`} onClick={this.checkFloor.bind(this,number)} key={number}>
                      {number}
                  </li>
                ))}
                <li className="key faKey"><FontAwesomeIcon icon={faKey} /></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Body
