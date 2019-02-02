import Tile from './Tile';

export default class EmptyTile extends Tile {
    constructor(key: number) { super(key, 0); }
}