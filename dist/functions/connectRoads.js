import { Connection } from "../data/classes/connection.js";
/*
*
*
*
*   Check if two adjacent Road connections can be folded into one.
*
*
*
*
*/
export const connectRoads = (newTile, gameMap, connectedTiles) => {
    console.log('connectRoads');
    let connectionIndexes = [];
    let connectionNames = [];
    const toBeConnected = [];
    const newConnection = new Connection({ type: 'R', span: [], user: ['no player'] });
    const gameTile = gameMap[newTile.col][newTile.row].connect;
    let tileRoads = 0;
    gameTile.forEach(element => {
        if (element == 'R') {
            tileRoads++;
        }
    });
    console.log({ tileRoads: tileRoads });
    connectedTiles.forEach((connection, index) => {
        console.log('checking connections R', connection);
        if (connection.span.some(t => t.col == newTile.col && t.row == newTile.row)
            && tileRoads == 2
            && connection.type == 'R') {
            console.log('added toBeConnected');
            toBeConnected.push(connection);
            connectionNames = [...connection.user];
            connectionIndexes.push(index);
        }
    });
    console.log({ toBeConnected: toBeConnected });
    console.log({ connectionIndexes: connectionIndexes });
    if (connectionIndexes.length > 1) {
        console.log('connecting roads!', toBeConnected);
        toBeConnected.forEach((tile) => {
            tile.span.forEach(element => {
                if (!newConnection.span.some(t => t.col == element.col && t.row == element.row)) {
                    newConnection.span.push(element);
                }
            });
        });
        connectionIndexes.sort((a, b) => b - a);
        connectionIndexes.forEach((id) => {
            console.log(id);
            connectedTiles.splice(id, 1);
            const tempConnectedTiles = connectedTiles;
            console.log('spliced!', tempConnectedTiles);
        });
        connectionNames.forEach((name) => {
            if (name !== 'no player') {
                newConnection.user.push(name);
            }
        });
        connectedTiles.push(newConnection);
    }
    return connectedTiles;
};
