import React,{Component} from 'react'
import {faArrowDown, faArrowUp, faAtom, faKey} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  reverse from 'lodash/reverse'
import './style.css'

class Keypad extends Component{

    constructor(props){
        super (props);
        this.state = {
            floor : null,
            lastFloor : 0,
            waytoGo: null,
            currentHeight: 0
        };
    }


    checkFloor = (floor) => {
        this.setState({
            floor
        });
        
        if ((this.state.lastFloor > floor) || (this.state.lastFloor < floor) || (this.state.lastFloor == null) ){

            if (this.state.lastFloor > floor) {
                this.state.waytoGo = 1;
            }else if (this.state.lastFloor < floor){
                this.state.waytoGo = 2;
            }
            this.checkHeight(floor,this.state.lastFloor);
            this.state.lastFloor = floor;
        }else {

            this.state.waytoGo = 3;
        }

    };

    /*
    * Tableau avec chaque étage ainsi que sa hauteur en mètres (1,33 m par seconde de vitesse de montée)
    * En fonction de l'étage selectionné et de l'étage de départ faire le calcul correspondant
    * variable :
    * - L'hauteur au départ
    * - L'hauteur cible
    * - Temps nécéssaire pour parcourir le chemin : 3 sec/étages
    * -
    * */

    decrementer = (timeTravel, startTravel ) => {
        console.log('time travel :'+ timeTravel + 'start travel : ' +startTravel)
        // setTimeout( function () {
        //     for (let i = 0; timeTravel > i; i++)
        //     {
        //         if (startTravel < timeTravel) {
        //             startTravel++;
        //             console.log(startTravel);
        //
        //         }
        //     }
        // }, 10000);
            if ( startTravel < timeTravel ) {
                startTravel++ ;
                const id = setInterval(this.decrementer(timeTravel,startTravel), 1000);
                return () => clearInterval(id);
            }


    }
    checkHeight = (floor, lastFloor) => {
        const heightStart = 4 * lastFloor;
        const heightEnd = 4 * floor;
        let travelingHeight = 0;
        let floorVisited = 0;
        if(floor > lastFloor){
            //Monter
            console.log('Etage cible :'+ floor);
            console.log('Etage de départ : ' + lastFloor);
            console.log('Hauteur de départ ' + heightStart);
            console.log("Hauteur de d'arrivé " + heightEnd);
            floorVisited = floor - lastFloor;
            console.log("nombre d'étage à parcourir :"+ floorVisited);
            travelingHeight = heightEnd - heightStart;
            console.log("Distance à parcourir " + travelingHeight);
            let timeTravel = travelingHeight * (3/4);
            console.log('time travel '+ timeTravel)
            setTimeout(this.decrementer(timeTravel,0), 1000);
        }else{
            //Descendre
            console.log('Etage cible :'+ floor);
            console.log('Etage de départ : ' + lastFloor);
            console.log('Hauteur de départ ' + heightStart);
            console.log("Hauteur de d'arrivé " + heightEnd);
            console.log("nombre d'étage à parcourir :"+ floorVisited);
            travelingHeight = heightStart- heightEnd;
            console.log("Distance à parcourir " + travelingHeight);
            let timeTravel = travelingHeight * (3/4);
            let startTravel = 0;
            setTimeout(this.decrementer(timeTravel,startTravel), 1000);
        }

    }



    render() {
        const {waytoGo,floor} = this.state
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <div className="keypad-container">
                <div className="keypad">
                    <div className="screen">
                        <div className="numberEmp">{floor}</div>
                        <div className="arrow">
                            <span>
                                {waytoGo === 3 && <FontAwesomeIcon icon={faAtom} />}
                                {waytoGo === 2 && <FontAwesomeIcon icon={faArrowUp} />}
                                {waytoGo === 1 && <FontAwesomeIcon icon={faArrowDown} />}
                            </span>
                        </div>
                        <div className="ElevatorRange">
                            {} Mètre
                        </div>

                    </div>
                    <div id="keyboard">
                        <ol className="keys">
                            { reverse(numbers.map((number) =>
                                <li onClick={this.checkFloor.bind(this,number)} key={number.toString()}>
                                    {number}
                                </li>
                            ))
                            }
                            <li><FontAwesomeIcon icon={faKey} /></li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }


}


export default Keypad

    render() {
        const {waytoGo,floor} = this.state
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        return (
            <div className="keypad-container">
                <div className="keypad">
                    <div className="screen">
                        <div className="numberEmp">{floor}</div>
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
                            { reverse(numbers.map((number) =>
                                <li className="key" onClick={this.checkFloor.bind(this,number)} key={number.toString()}>
                                    {number}
                                </li>
                                ))
                            }
                            <li className="key faKey"><FontAwesomeIcon icon={faKey} /></li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}