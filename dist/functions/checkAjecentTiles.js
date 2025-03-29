/*
*
*
*
*   Check if the tiles sourrunding a tile have the same conection type.
*   Or is empty.
*   Gives a boolean as answer.
*
*
*/
export const checkAjecentTiles = (col, row, tile, gameMap) => {
    if (col < 0 || row < 0 || col >= gameMap.length || row >= gameMap[0].length) {
        return false;
    }
    const top = tile.connect[0];
    const right = tile.connect[1];
    const bottom = tile.connect[2];
    const left = tile.connect[3];
    const checkRight = (col + 1 < gameMap.length) ? gameMap[col + 1][row].connect[3] : '';
    const checkBottom = (row + 1 < gameMap[0].length) ? gameMap[col][row + 1].connect[0] : '';
    const checkLeft = (col - 1 >= 0) ? gameMap[col - 1][row].connect[1] : '';
    const checkTop = (row - 1 >= 0) ? gameMap[col][row - 1].connect[2] : '';
    if ((checkTop == top || checkTop == '') &&
        (checkRight == right || checkRight == '') &&
        (checkBottom == bottom || checkBottom == '') &&
        (checkLeft == left || checkLeft == '')) {
        return true;
    }
    else {
        return false;
    }
    ;
};
