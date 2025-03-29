import { Tile } from "../data/classes/tile.js";
import { allTiles } from "../data/tiles/tiles.js";
// Draw one new tile.
export const drawRandomTile = (id) => {
    const tile = new Tile(allTiles[id]);
    tile.image = './assets/tiles.png';
    return tile;
};
