import { Tile } from "../data/classes/tile.js";
import { TileCordinates } from "../data/types/tileCordinates.js";
import { updatePlayableTiles } from "./updatePlayableTiles.js";

/*
*
*
*
*   Check the gameMap for which tiles are played so far.
*   
*
*
*
*/

export const updateUsedTiles = (
    gameMap: Tile[][],
    backsidePath: string,
    usedTiles: TileCordinates[],
    playableTiles: TileCordinates[]
): TileCordinates[] => {
    gameMap.forEach((row, colIndex) => {
        row.forEach((tile, rowIndex) => {
            const tileCordinates = {col: colIndex, row: rowIndex};           
            if (tile.image !== backsidePath && !usedTiles.some(t => t.col == colIndex && t.row == rowIndex)){
                usedTiles.push(tileCordinates);
            }
        });
    });
    // playableTiles = updatePlayableTiles( playableTiles, usedTiles, gameMap, backsidePath )
    return usedTiles;
}