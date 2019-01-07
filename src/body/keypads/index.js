import React,{Component} from 'react'
import {faArrowDown, faArrowUp, faAtom, faKey} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  reverse from 'lodash/reverse'
import './style.css'



class Keypad extends Component{

    constructor(props){
        super (props);
        this.state = {
            floor : 0,
            lastFloor : 0,
            waytoGo: null,
            currentHeight: 0
        };
    }

    componentWillUnmount() {
        clearTimeout();
    }
    componentDidUpdate(prevState) {
        // if(prevState.currentHeight !== this.state.currentHeight){
        //     if ()
        // }
    }

    checkFloor = (floor) => {



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

    decrementer = (timeTravel, startTravel,current_height,Destination ) => {

        let timerRun = setInterval(() => {
            startTravel++ ;
            console.log('Temps de voyage :'+ timeTravel + ' temps actuel de voyage : ' +startTravel)
        }, 1000);
        let timerRun2 = setInterval(() => {
            console.log('mètre actuel : '+this.state.currentHeight);
            if (current_height < Destination){
                this.setState({
                    currentHeight : current_height++
                })

            } else{
                this.setState({
                    currentHeight : current_height--
                })

            }
        }, 750);

        let timerUpdater = setInterval(() => {

        })

        setTimeout(()=>{
            clearInterval(timerRun);
        },timeTravel*1000);

        setTimeout(()=>{
            clearInterval(timerRun2);
            clearInterval(timerUpdater)
        },timeTravel*1000);
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
            this.decrementer(timeTravel,0,heightStart,heightEnd)

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
            this.decrementer(timeTravel,0,heightStart,heightEnd)
        }
    }



    render() {
        const {currentHeight,waytoGo,floor} = this.state
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        console.log(currentHeight);
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
                            {currentHeight}m
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

export default Keypad