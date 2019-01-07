import React, { Component } from 'react'
import {faArrowDown, faArrowUp, faKey} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import  reverse from 'lodash/reverse'

import Elevator from './elevator'
import './style.css'

class Body extends Component { 
  constructor(props){
    super (props)
    this.state = {
        targetFloor : null,
        lastFloor : null,
        waytoGo: null
    }
  }

  checkFloor = (targetFloor) => {
    const { lastFloor } = this.state
    this.setState({ targetFloor })
    if ((lastFloor > targetFloor) || (lastFloor < targetFloor) || (lastFloor == null) ) {
      if (lastFloor > targetFloor) {
        this.setState({ waytoGo: 1 })
      } else if (lastFloor < targetFloor) {
        this.setState({ waytoGo: 2 })
      }
      this.setState({ lastFloor: targetFloor })
    } else {
      this.setState({ waytoGo: 3 })
    }
  }

  render() {
    const { waytoGo, targetFloor } = this.state
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
                    {waytoGo === 2 && <FontAwesomeIcon icon={faArrowUp} />}
                    {waytoGo === 1 && <FontAwesomeIcon icon={faArrowDown} />}
                  </span>
                </div>
                <div className="ElevatorRange">
                  30m
                </div>
                </div>
            </div>
            <div className="keyboard">
              <ol className="keys">
                {reverse(numbers.map((number) =>
                  <li className="key" onClick={this.checkFloor.bind(this,number)} key={number.toString()}>
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
