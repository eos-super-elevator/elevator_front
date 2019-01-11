import React, { Component } from 'react'
import Header from './components/header'
import Body from './components/body'


class App extends Component {
  constructor() {
    super()
    this.state = {
    }
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
