import React,{Component} from 'react'
import {faArrowDown, faArrowUp, faAtom, faKey} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Keypad extends Component{

    constructor(props){
        super (props);
        this.state = {
            floor : null,
            lastFloor : null,
            waytoGo: null
        };
    }


    checkFloor = (floor) => {
        this.setState({
            floor
        });
        
        if ((this.state.lastFloor > floor) || (this.state.lastFloor < floor) || (this.state.lastFloor == null) ){

            if (this.state.lastFloor > floor) {
                // this.state.waytoGo = <FontAwesomeIcon icon={faArrowDown} />;
                this.state.waytoGo = 1;
            }else if (this.state.lastFloor < floor){
                // this.state.waytoGo = <FontAwesomeIcon icon={faArrowUp} />;
                this.state.waytoGo = 2;
            }
            this.state.lastFloor = floor;
        }else {
            // this.state.waytoGo = <FontAwesomeIcon icon={faAtom} />;
            this.state.waytoGo = 3;
        }

        // this.setState({ lastFloor = floor });
        // this.checkFloor(floor).bind(this,floor);
    };



    render() {
        return (
            <div className="keypad-container">
                <div className="keypad">
                    <div className="screen">
                        <div className="numberEmp">{this.state.floor}</div>
                        <div className="arrow">
                            <span>
                                {this.state.waytoGo === 3 && <FontAwesomeIcon icon={faAtom} />}
                                {this.state.waytoGo === 2 && <FontAwesomeIcon icon={faArrowUp} />}
                                {this.state.waytoGo === 1 && <FontAwesomeIcon icon={faArrowDown} />}
                            </span>
                        </div>
                        <div className="ElevatorRange">
                            30 Mètre
                        </div>

                    </div>
                    <div id="keyboard">
                        <ol className="keys">
                            <li onClick={this.checkFloor.bind(this,1)}>1</li>
                            <li onClick={this.checkFloor.bind(this,2)}>2</li>
                            <li onClick={this.checkFloor.bind(this,3)}>3</li>
                            <li onClick={this.checkFloor.bind(this,4)}>4</li>
                            <li onClick={this.checkFloor.bind(this,5)}>5</li>
                            <li onClick={this.checkFloor.bind(this,6)}>6</li>
                            <li onClick={this.checkFloor.bind(this,7)}>7</li>
                            <li onClick={this.checkFloor.bind(this,8)}>8</li>
                            <li onClick={this.checkFloor.bind(this,9)}>9</li>
                            <li></li>
                            <li onClick={this.checkFloor.bind(this,0)}>RDC</li>
                            <li><FontAwesomeIcon icon={faKey} /></li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }


}


export default Keypad
