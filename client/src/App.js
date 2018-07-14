import React, { Component } from 'react';
import './App.css';
import AddNumbers from './components/AddNumbers/AddNumbers';
// ngrok http 8080 -host-header="localhost:8080"

class App extends Component {
  state = {players: []}

  componentDidMount() {
    fetch('/test')
      .then(res => res.json())
      .then(players => this.setState({ players }));
  }

  render() {
    return (
      <div className="App">
        <h1>Test</h1>
        <AddNumbers dbPlayers={this.state.players} />
      </div>
    );
  }
}

export default App;
