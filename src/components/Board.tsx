import * as React from 'react';
import Tile from './Tile';
import EmptyTile from './EmptyTile';
import FirstTile from './FirstTile';
import { getRandomNumberBetween } from '../utils/NumberUtils';
import { getBoardStyles } from '../utils/StyleUtils';

interface BoardProps {
  gridSize: number,
  handleScoreChange: Function,
  handleGameStatusChange: Function,
  resetScore: Function
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

  shouldComponentUpdate(nextProps:BoardProps, nextState:BoardState) {
    return nextProps.gridSize !== this.props.gridSize || nextState !== this.state
  }

  createBoard = () => {
    const { gridSize } = this.props; 
    let newBoard: Tile[] = [];

    this.props.handleGameStatusChange('');
    this.props.resetScore();

    for(let i = 0; i < (gridSize*gridSize);i++) newBoard[i] = new EmptyTile(i);    
    this.setState({board: this.getBoardWithNewTile(newBoard)});
  }

  renderTiles = () => {
    if(this.state.board.length === 0) return []; 
    return this.state.board.map(tile => {
      return tile.renderTile();
    });
  }

  handleKeyEvent = (e: KeyboardEvent) => {
    switch(e.key) {
      case "ArrowUp": this.moveTiles('up'); break;
      case "ArrowDown": this.moveTiles('down'); break;
      case "ArrowRight": this.moveTiles('right'); break;
      case "ArrowLeft": this.moveTiles('left'); break;
      case "Enter": this.createBoard(); break;
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

    if(!this.boardHasFreeTiles(newBoard) && !this.hasMovesAvailable(newBoard)) {
      this.props.handleGameStatusChange('You lost!')
    }
    
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

  hasMovesAvailable = (board: Tile[]):boolean => {
    const { gridSize } = this.props;
    let boardHasFreeTiles:boolean = false; 

    // For all tiles on the map, check if it's empty.
    // For all tiles find neighbours and check if they are empty or match current tile.
    // If none if this is true there are no moves available
    board.map( tile => {
      this.findNeighbours(tile, board, gridSize).map( neighbour => {
        if(this.checkEmptyTile(tile, board) ||
          this.checkEmptyTile(neighbour, board) || 
          this.checkTileMatch(tile,neighbour)) 
            boardHasFreeTiles = true;
      });
    });

    return boardHasFreeTiles;
  }

  findNeighbours = (tile:Tile, board: Tile[], gridSize: number):Tile[] => {
    let key = tile.key;
    let neighbours:Tile[] = [];

    if(key % gridSize) { neighbours.push(board[key-1]); } // Left
    if((key+1) % gridSize) { neighbours.push(board[key+1]); } // Right
    if(key >= gridSize) { neighbours.push(board[key-gridSize]); } // North
    if(key < (gridSize*(gridSize-1))) { neighbours.push(board[key+gridSize]); } // South
    return neighbours;
  }

  slideLeft = (tile:Tile, board:Tile[]):Tile[] => {
    const { gridSize } = this.props;
    let row = Math.floor(tile.key/gridSize);
    let tileToMoveTo:number = tile.key;
    let newValue:number = tile.value;
    let newBoard:Tile[] = board;

    for(let i = gridSize-1; i >= 0; i--) {
      let tileNumber:number = (row*gridSize) + i;
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck, board);

      if(tileToCheck.key >= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        this.props.handleScoreChange(tile.value*2)
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
      let tileIsEmpty = this.checkEmptyTile(tileToCheck, board);

      // Only needs to check tiles below
      if(tileToCheck.key <= tile.key) continue; 
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        this.props.handleScoreChange(tile.value*2)
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
      let tileIsEmpty = this.checkEmptyTile(tileToCheck, board);

      // Only needs to check tiles below
      if(tileToCheck.key <= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        this.props.handleScoreChange(tile.value*2)
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
      let tileNumber:number = (i*gridSize)-(gridSize-column)
      let tileToCheck:Tile = board[tileNumber];
      let tileIsEmpty = this.checkEmptyTile(tileToCheck, board);

      // Only needs to check tiles below
      if(tileToCheck.key >= tile.key) continue;
      else if(tileIsEmpty) { tileToMoveTo = tileNumber; } 
      else if(this.checkTileMatch(board[tileNumber], board[tile.key])) { 
        tileToMoveTo = tileNumber;
        newValue = tile.value*2;
        this.props.handleScoreChange(tile.value*2)
        break;
      } else break;
    }

    if(tile.key !== tileToMoveTo) {
      newBoard[tile.key] = new EmptyTile(tile.key);
      newBoard[tileToMoveTo] = new Tile(tileToMoveTo, newValue);  
    }
    
    return newBoard;
  }

  checkEmptyTile = (tile: Tile, board: Tile[]):boolean => {
    return board[tile.key] instanceof EmptyTile;
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

  /**
   * 
   */
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
      case 1: return `${defaultClass} board-one`; 
      case 2: return `${defaultClass} board-two`; 
      case 3: return `${defaultClass} board-three`; 
      case 4: return `${defaultClass} board-four`; 
      case 5: return `${defaultClass} board-five`; 
      default: return `${defaultClass}`;
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