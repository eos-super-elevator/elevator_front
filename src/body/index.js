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
        meter: 0,
        isLocked: false,
        doorsIsOpened: true,
        canMoving: false
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

    this.closeDoors()

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

  onLock = () => {
    const { isLocked } = this.state
    this.setState({ isLocked: !isLocked })
  }

  openDoors = () => {
    console.log('Ouverture des portes')
    this.setState({ doorsIsOpened: true, canMoving: false  })
  }

  closeDoors = () => {
    console.log('Fermeture des portes')
    this.setState({ doorsIsOpened: false })
    setTimeout(() => {
      this.setState({ canMoving: true })
    }, 3000)
  }

  render() {
    const { isGoingUp, isGoingDown, targetFloor, meter, isLocked, doorsIsOpened, canMoving } = this.state
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const isMobile = window.innerWidth <= 768 // Check window's width
    return (
      <div className="body">
        {!isMobile && 
          <Elevator 
            targetFloor={targetFloor} 
            isLocked={isLocked} 
            doorsIsOpened={doorsIsOpened}
            canMoving={canMoving}
            openDoors={this.openDoors}
            closeDoors={this.closeDoors}
          />
        }
        <div className="keypad-container">
          <button onClick={this.openDoors}>Ouvrir</button><button onClick={this.closeDoors}>Fermer</button>
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
                <li className={`key faKey ${isLocked ? 'locked' : ''}`}  onClick={this.onLock}><FontAwesomeIcon icon={faKey}/></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Body
