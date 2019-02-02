import * as React from 'react';
import Tile from './Tile';
import EmptyTile from './EmptyTile';
import FirstTile from './FirstTile';
import { getRandomNumberBetween } from '../utils/NumberUtils';
import { getBoardStyles } from '../utils/StyleUtils';

interface BoardProps {
  gridSize: number
}

interface BoardState {
  board: Tile[];
}

export default class Board extends React.Component<BoardProps, BoardState> {
  state = {
    board: [ new EmptyTile(0) ]
  }

  public static defaultProps = {
    gridSize: 1
  }

  constructor(props:BoardProps) {
    super(props);
  }

  componentWillMount() { this.createBoard(); }
  componentDidMount() { document.addEventListener("keydown", this.handleKeyEvent); }
  componentWillUnmount() { document.removeEventListener("keydown", this.handleKeyEvent); }
  componentDidUpdate() {
    // Is triggered on component update. For now only happens when changing gridsize.
    // TODO: make better solutin for triggering this
    // this.createBoard();
  }
  shouldComponentUpdate(nextProps:BoardProps, nextState:BoardState) {
    return nextProps.gridSize !== this.props.gridSize || nextState !== this.state
  }

  createBoard = () => {
    const { gridSize } = this.props; 
    let newBoard: Tile[] = [];

    for(let i = 0; i < (gridSize*gridSize);i++) newBoard[i] = new EmptyTile(i);

    this.setState({board: this.getBoardWithNewTile(newBoard)});
  }

  renderTiles = () => {
    if(this.state.board.length === 0) return []; 
    return this.state.board.map(t => {
      return t.renderTile();
    })
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    console.clear();
    switch(e.key) {
      case "ArrowUp": this.moveTiles('up'); break;
      case "ArrowDown": this.moveTiles('down'); break;
      case "ArrowRight": this.moveTiles('right'); break;
      case "ArrowLeft": this.moveTiles('left'); break;
      case "Enter": this.createBoard(); break;
      case "Alt": break;
      // default: console.log(e.key); break;
    }
  }

  moveTiles = (direction:string) => {
    const { board } = this.state;
    const boardBeforeMoving = board.slice();
    let newBoard: Tile[] = board;
    let activeTiles = board.filter(tile => !(tile instanceof EmptyTile));

    switch(direction) {
      case 'up': activeTiles.map( tile => newBoard = this.slideUp(tile, newBoard)); break;
      case 'left': activeTiles.map( tile => newBoard = this.slideLeft(tile, newBoard)); break;
      case 'down': activeTiles.reverse().map( tile => newBoard = this.slideDown(tile, newBoard)); break;
      case 'right': activeTiles.reverse().map( tile => newBoard = this.slideRight(tile, newBoard)); break;
    }

    //If no tiles moved we don't want to generate a new tile, this does not count as a move
    let boardForState = this.boardsAreEqual(newBoard, boardBeforeMoving)
      ? board
      : this.getBoardWithNewTile(newBoard);
  

    console.log('Lose?', this.boardHasFreeTiles(newBoard));

    this.setState({ board: boardForState });
  }

  boardsAreEqual = (board1:Tile[], board2:Tile[]):boolean => {
    if(board1.length !== board1.length) return false;

    for(let i = 0; i < board1.length; i++) {
      if(board1[i].key !== board2[i].key || board1[i].value !== board2[i].value) 
        return false;
    }

    return true;
  }

  // slideDirection = (tile:Tile, board: Tile[]) => {
  //   const { gridSize } = this.props;
    
  //   let row = Math.floor(tile.key/gridSize);
  //   let column = (tile.key % gridSize)+1
  //   let tileHumanReadable = tile.key;

  //   let tileToMoveTo:number = tile.key;
  //   let newValue:number = tile.value;
  //   let newBoard:Tile[] = board;

  //   // for(let i = gridSize-1; i >= 0; i--) {
  //     // let tileNumber:number = (row*gridSize) + i;
  //     let tileToCheck:Tile = board[tileNumber];

  //     // if(tileToCheck.key >= tile.key) continue;

  //     let tileIsEmpty = this.checkEmptyTile(tileToCheck);

  //     if(tileIsEmpty) { 
  //       tileToMoveTo = tileNumber;
  //     } else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
  //       tileToMoveTo = tileNumber;
  //       newValue = tile.value*2;
  //       break;
  //     } else { 
  //       break; 
  //     }
  //   }

  //   if(tile.key !== tileToMoveTo) {
  //     newBoard[tile.key] = new EmptyTile(tile.key);
  //     newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
  //   }

  //   return newBoard;
  // }

  slideLeft = (tile:Tile, board:Tile[]):Tile[] => {
    const { gridSize } = this.props;
    let row = Math.floor(tile.key/gridSize);
    let tileToMoveTo:number = tile.key;
    let newValue:number = tile.value;
    let newBoard:Tile[] = board;

    for(let i = gridSize-1; i >= 0; i--) {
      let tileNumber:number = (row*gridSize) + i;
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck);

      if(tileToCheck.key >= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        break;
      } else break;
    }

    if(tile.key !== tileToMoveTo) {
      newBoard[tile.key] = new EmptyTile(tile.key);
      newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
    }

    return newBoard;
  }

  slideDown = (tile: Tile, board: Tile[]):Tile[] => {
    const { gridSize } = this.props
    let column = tile.key % gridSize
    let tileToMoveTo:number = tile.key;
    let newValue:number = tile.value;
    let newBoard: Tile[] = board;

    for(let i = 0; i < gridSize; i++) {
      let tileNumber:number = column+(i*gridSize);
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck);

      // Only needs to check tiles below
      if(tileToCheck.key <= tile.key) continue; 
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        break;
      } else break;
    }

    if(tile.key !== tileToMoveTo) {
      newBoard[tile.key] = new EmptyTile(tile.key);
      newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
    }
    
    return newBoard;
  }

  slideRight = (tile: Tile, board: Tile[]):Tile[] => {
    const { gridSize } = this.props
    let row = Math.floor(tile.key/gridSize);
    let tileToMoveTo:number = tile.key;
    let newValue:number = tile.value;
    let newBoard: Tile[] = board;

    for(let i = 0; i < gridSize; i++) {
      let tileNumber:number = (row*gridSize) + i;
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck);

      // Only needs to check tiles below
      if(tileToCheck.key <= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        break;
      } else break;
    }

    if(tile.key !== tileToMoveTo) {
      newBoard[tile.key] = new EmptyTile(tile.key);
      newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
    }
    
    return newBoard;
  }

  slideUp = (tile: Tile, board: Tile[]):Tile[] => {
    const { gridSize } = this.props
    let column = tile.key % gridSize
    let tileToMoveTo:number = tile.key;
    let newBoard: Tile[] = board;
    let newValue:number = tile.value;

    for(let i = gridSize; i > 0; i--) {
      let tileNumber:number = (i*gridSize)-(3-column)
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck);

      // Only needs to check tiles below
      if(tileToCheck.key >= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        break;
      } else break;
    }

    if(tile.key !== tileToMoveTo) {
      newBoard[tile.key] = new EmptyTile(tile.key);
      newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
    }
    
    return newBoard;
  }

  checkEmptyTile = (tile: Tile):boolean => {
    return this.state.board[tile.key] instanceof EmptyTile;
  }

  getBoardWithNewTile = (board: Tile[]):Tile[] => {
    if(!this.boardHasFreeTiles(board) || !this.boardIsValid(board)) return this.state.board;

    let newBoard: Tile[] = board;
    let randomTile = this.findRandomEmptyTile(board);
    newBoard[randomTile] = new FirstTile(randomTile);
    return newBoard;
  }

  /**
   * Checks if the board has any free tiles
   * 
   * @returns { boolean }
   */
  boardHasFreeTiles = (board:Tile[]):boolean => {
    return board.some(tile => tile instanceof EmptyTile);
  }

  boardIsValid = (board: Tile[]):boolean => {
    return board.length > 0;
  }

  /**
   * @returns { number } Index to an empty tile
   */
  findRandomEmptyTile = (board: Tile[]):number => {
    const { gridSize } = this.props;

    let randomTile:number = getRandomNumberBetween(0,gridSize*gridSize);
    
    while(!(board[randomTile] instanceof EmptyTile)) {
      randomTile = getRandomNumberBetween(0, gridSize*gridSize);
    }

    return randomTile;
  }

  getBoardStyles = ():string => {
    const defaultClass = "board-container";
    switch(this.props.gridSize) {
      case 1: return `${defaultClass} board-one`; break;
      case 2: return `${defaultClass} board-two`; break;
      case 3: return `${defaultClass} board-three`; break;
      case 4: return `${defaultClass} board-four`; break;
      case 5: return `${defaultClass} board-five`; break;
      default: return `${defaultClass}`; break;
    }
  }

  checkTileMatch = (tileOne: Tile, tileTwo: Tile) => {
    return tileOne.value === tileTwo.value;
  }

  render() {
    return (
      <div className={getBoardStyles(this.props.gridSize)}>
          {this.renderTiles()}
      </div>
    );
  }
}