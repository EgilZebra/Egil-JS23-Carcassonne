import { Tile } from '../data/classes/tile.js';
import { drawRandomTile } from './drawRandomTile.js';
/*
*
*
*
*   Generate the initial gamemap based on number of tiles, and their size
*
*
*
*
*/
export const createGameMap = (gameBoardTiles, backsidePath) => {
    let gameMap = [[]];
    for (let i = 0; i < gameBoardTiles; i++) {
        if (gameMap.length < gameBoardTiles) {
            gameMap.push([]);
        }
        for (let j = 0; j < gameBoardTiles; j++) {
            const empltyTile = new Tile({
                image: backsidePath,
                width: 224,
                height: 224,
                imageStartX: 0,
                imageStartY: 0,
                connections: ['', '', '', ''],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            });
            gameMap[i].push(empltyTile);
        }
    }
    gameMap[10][10] = drawRandomTile(12);
    return gameMap;
};
