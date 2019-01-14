import React, { Component } from 'react'
import Header from './components/header'
import Body from './components/body'
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor() {
    super()
    this.state = {
      response: false,
      endpoint: 'http://192.168.1.140:3000'
    }
  }

  componentDidMount() {
    const { endpoint } = this.state
    const socket = socketIOClient(endpoint)
    socket.on('new_elevator_state', data => this.setState({ response: data }))
  }

  render() {
    const { response } = this.state
    console.log('response', response)
    return (
      <div className="App">
        <Header />
        <Body response={response} />
      </div>
    )
  }
}

export default App
