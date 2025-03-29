import { Tile } from "../data/classes/tile.js";
import { TileCordinates } from "../data/types/tileCordinates.js";

/*
*
*
*
*   update the number of tiles not yet played, or played.
*   
*
*
*
*/
export const updatePlayableTiles = (
    playableTiles: TileCordinates[],
    usedTiles: TileCordinates[],
    gameMap: Tile[][],
    backsidePath: string,
): TileCordinates[] => {
    playableTiles = [];
    usedTiles.forEach((tileCordinate) => {
        const col = tileCordinate.col;
        const row = tileCordinate.row;
        
        const checkAndAddPlayableTile = (colCheck: number, rowCheck: number ) => {
            if (colCheck >= 0 && colCheck < gameMap.length && rowCheck >= 0 && rowCheck < gameMap[colCheck].length) {
                if (gameMap[colCheck][rowCheck].image === backsidePath &&
                    !playableTiles.some(t => t.col === colCheck && t.row === rowCheck) &&
                    !usedTiles.some(t => t.col === colCheck && t.row === rowCheck)) {
                        if (playableTiles.length == 0) {
                            playableTiles[0] = {col: colCheck, row: rowCheck};
                        } else {
                            playableTiles.push({col: colCheck, row: rowCheck});
                        }
                }
            }
        };
        checkAndAddPlayableTile(col - 1, row);
        checkAndAddPlayableTile(col + 1, row);
        checkAndAddPlayableTile(col, row + 1);
        checkAndAddPlayableTile(col, row - 1);
    });
    return playableTiles;
}