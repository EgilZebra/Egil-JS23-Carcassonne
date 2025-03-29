import { checkConnections } from "./checkConnections.js";
import { connectRoads } from "./connectRoads.js";
import { connectCity } from "./connectCity.js";
/*
*
*
*
*
*  Check all the surrounding tiles for possible connections
*
*
*
*
*
*/
export const updateConnections = (col, row, gameMap, usedTiles, connectedTiles) => {
    console.log('updateconnect');
    const thisTile = gameMap[col][row];
    const directions = [
        { dx: 1, dy: 0, type: 3, direction: 'right' }, // Check right
        { dx: -1, dy: 0, type: 1, direction: 'left' }, // Check left
        { dx: 0, dy: 1, type: 0, direction: 'down' }, // Check down
        { dx: 0, dy: -1, type: 2, direction: 'up' } // Check up
    ];
    directions.forEach(({ dx, dy, type, direction }) => {
        const newCol = col + dx;
        const newRow = row + dy;
        if (newCol >= 0 && newCol < gameMap.length && newRow >= 0 && newRow < gameMap[newCol].length) {
            const isAdjacentUsed = usedTiles.some(t => t.col === newCol && t.row === newRow);
            const connections = connectedTiles;
            if (isAdjacentUsed) {
                const checkType = gameMap[newCol][newRow].connect[type];
                console.log(direction);
                connectedTiles = checkConnections({ col, row }, { col: newCol, row: newRow }, checkType, connections, gameMap, connectedTiles);
                if (checkType == 'R') {
                    connectedTiles = connectRoads({ col: col, row: row }, gameMap, connectedTiles);
                    connectedTiles = connectRoads({ col: newCol, row: newRow }, gameMap, connectedTiles);
                }
                ;
                if (checkType == 'C') {
                    connectedTiles = connectCity({ col: col, row: row }, gameMap, connectedTiles);
                    connectedTiles = connectCity({ col: newCol, row: newRow }, gameMap, connectedTiles);
                }
                ;
            }
            ;
        }
        ;
    });
    return connectedTiles;
};
