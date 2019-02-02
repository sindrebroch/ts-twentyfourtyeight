import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';
import BoardSizePicker from './components/BoardSizePicker';

interface AppProps {

}

interface AppState {
  gridSize: number,
}

export default class App extends Component<AppProps, AppState> {
  state = {
    gridSize: 3
  }

  // handleGridChange = (gridSize: number) => {
  //   this.setState({gridSize})
  // }

  render() {
    const { gridSize } = this.state
    return (
      <div className="App">
        <header className="App-header">
          {/* <BoardSizePicker 
              gridOptions={[1,2,3,4,5]} 
              currentGridSize={gridSize} 
              handleGridChange={this.handleGridChange}/> */}
          <Board gridSize={gridSize}/>
        </header>
      </div>
    );
  }
}