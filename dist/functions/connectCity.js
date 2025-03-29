import { Connection } from "../data/classes/connection.js";
/*
*
*
*
*   Check if two adjacent City connections can be folded into one.
*
*
*
*
*/
export const connectCity = (newTile, gameMap, connectedTiles) => {
    console.log('connectCity');
    let connectionIndexes = [];
    const toBeConnected = [];
    const newConnection = new Connection({ type: 'C', span: [], user: ['no player'] });
    const gameTile = gameMap[newTile.col][newTile.row].connect;
    const cityConnect = gameMap[newTile.col][newTile.row].cityConnect;
    let tileCity = 0;
    gameTile.forEach(element => {
        if (element == 'C') {
            tileCity++;
        }
    });
    console.log({ tileCity: tileCity });
    connectedTiles.forEach((connection, index) => {
        console.log('checking connections C', connection);
        if (connection.span.some(t => t.col == newTile.col && t.row == newTile.row)
            && tileCity > 1
            && connection.type == 'C'
            && cityConnect) {
            console.log('added toBeConnected');
            toBeConnected.push(connection);
            connectionIndexes.push(index);
        }
    });
    console.log({ toBeConnected: toBeConnected });
    console.log({ connectionIndexes: connectionIndexes });
    if (connectionIndexes.length > 1) {
        console.log('connecting cities!', toBeConnected);
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
        connectedTiles.push(newConnection);
    }
    return connectedTiles;
};
