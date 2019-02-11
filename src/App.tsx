import React, { Component } from 'react';
import './App.css';
import Board from './components/Board';
import BoardSizePicker from './components/BoardSizePicker';

interface AppState {
  gridSize: number,
  score: number,
  gameState: string
}

export default class App extends Component<{}, AppState> {
  state = {
    gridSize: 3,
    score: 0,
    gameState: ''
  }

  resetScore = () => { this.setState({ score: 0 })}
  handleScoreChange = (addScore:number) => { this.setState((state, props) => ({score: state.score + addScore})); }
  handleGridChange = (gridSize: number) => { this.setState({gridSize}) }
  handleGameStatusChange = (gameState:string) => { this.setState({gameState}); }

  render() {
    const { gridSize } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1>2048</h1>

          <p>{this.state.gameState}</p>
          <p>Score: {this.state.score}</p>

          <BoardSizePicker 
               gridOptions={[2,3,4,5]} 
               currentGridSize={gridSize} 
               handleGridChange={this.handleGridChange}/>
          <Board 
              gridSize={gridSize}
              resetScore={this.resetScore}
              handleScoreChange={this.handleScoreChange} 
              handleGameStatusChange={this.handleGameStatusChange}/>
              
        </header>
      </div>
    );
  }
}