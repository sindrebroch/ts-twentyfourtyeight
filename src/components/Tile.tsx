import * as React from 'react';

export default class Tile {
  value: number;
  key: number;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
  }

  renderTile = () => {
    return this.value === 0 
      ? <p key={this.key} className={this.getTileClasses()}></p>
      : <p key={this.key} className={this.getTileClasses()}>{this.value}</p>;    
  };

  equals = (tile:Tile):boolean => {
    return (this.key === tile.key && this.value === tile.value);
  }

  getTileClasses = ():string => {
    let defaultClasses = 'tile-container';

    switch(this.value) {
      case 0: return `${defaultClasses} tile-empty`;
      case 2: return `${defaultClasses} tile-two`; 
      case 4: return `${defaultClasses} tile-four`; 
      default: return `${defaultClasses}`;
    }
  }
}