import { Connection } from "../data/classes/connection.js";
/*
*
*
*
*   check if two tiles ( newTile and checkTile ) are able to form a connection.
*   create a brand new one, connect to an existing one or do neither.
*
*
*
*/
export const checkConnections = (newTile, checkTile, type, connections, gameMap, connectedTiles) => {
    console.log({ message: 'checkconnections', type: type });
    const newConnections = [];
    let nonAdded = true;
    if (type == 'R' && connections.length > 0) {
        let connectionsChecked = 0;
        console.log('checking connect R');
        let connectionsNotAdded = 0;
        connections.forEach((connection) => {
            console.log('Checking', connection);
            if (nonAdded
                && connection.type == type
                && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                && gameMap[checkTile.col][checkTile.row].roadConnect == true) {
                const compareConnect = gameMap[checkTile.col][checkTile.row].connect;
                const typeNumber = compareConnect.filter((x) => {
                    return x == 'R';
                });
                console.log({ typeNumber: typeNumber });
                if (typeNumber.length == 2
                    && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                    console.log('add connectopn newRoad');
                    connection.add(newTile);
                    nonAdded = false;
                }
                else if (typeNumber.length == 1
                    && connection.span.length == 1
                    && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                    console.log('add connectopn newRoad to a singel-Connection');
                    connection.add(newTile);
                    nonAdded = false;
                }
                else {
                    connectionsNotAdded++;
                }
                connectionsChecked++;
            }
            else if (nonAdded
                && connection.type == type
                && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                && connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                console.log('add connectopn checkRoad');
                connection.add(checkTile);
                nonAdded = false;
            }
            else if (nonAdded
                && connection.type == type
                && connectionsChecked == connectionsNotAdded) {
                console.log('all new connect Road');
                console.log(connection);
                const newConnection = new Connection({ type: type, tile: newTile, user: ['no player'] });
                newConnection.add(newTile);
                newConnection.add(checkTile);
                newConnections.push(newConnection);
                nonAdded = false;
            }
        });
        connectedTiles.push(...newConnections);
    }
    else if (type == "C" && connections.length > 0) {
        console.log('checking connect C');
        let connectionsChecked = 0;
        let connectionsNotAdded = 0;
        connections.forEach((connection) => {
            console.log('checking', connection);
            const compareConnectNewTile = gameMap[newTile.col][newTile.row].connect;
            const typeNumberNewTile = compareConnectNewTile.filter((x) => {
                return x == 'C';
            });
            console.log({ typeNumber: typeNumberNewTile });
            const compareConnectcheckTile = gameMap[checkTile.col][checkTile.row].connect;
            const typeNumberCheckTile = compareConnectcheckTile.filter((x) => {
                return x == 'C';
            });
            console.log({ typeNumber: typeNumberCheckTile });
            if (nonAdded
                && connection.type == 'C'
                && connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                if (typeNumberNewTile.length > 1
                    && gameMap[newTile.col][newTile.row].cityConnect == true
                    && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)) {
                    console.log('add connection Checktile C:connect');
                    connection.add(checkTile);
                    nonAdded = false;
                }
                else if (typeNumberNewTile.length == 1
                    && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)) {
                    console.log('new connection Checktile oneWay');
                    const newConnection = new Connection({ type: type, tile: newTile, user: ['no player'] });
                    newConnection.add(newTile);
                    newConnection.add(checkTile);
                    newConnections.push(newConnection);
                    nonAdded = false;
                }
                else if (typeNumberNewTile.length == 1
                    && connection.span.length == 1
                    && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                    && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                    console.log('add connectopn newRoad to a singel-Connection');
                    connection.add(newTile);
                    nonAdded = false;
                }
                else {
                    connectionsNotAdded++;
                }
                connectionsChecked++;
            }
            else if (nonAdded
                && connection.type == 'C'
                && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                console.log('<-- YES!!');
                if (gameMap[checkTile.col][checkTile.row].cityConnect == true || typeNumberCheckTile.length == 1) {
                    console.log('add connection NewTile C:connect');
                    connection.add(newTile);
                    nonAdded = false;
                }
                else if (gameMap[checkTile.col][checkTile.row].cityConnect == false
                    && connection.span.length > 2) {
                    console.log('new connection new and checktile only');
                    const newConnection = new Connection({ type: type, tile: newTile, user: ['no player'] });
                    newConnection.add(newTile);
                    newConnection.add(checkTile);
                    newConnections.push(newConnection);
                    nonAdded = false;
                }
                else if (gameMap[checkTile.col][checkTile.row].cityConnect == false
                    && connection.span.length == 1) {
                    console.log('add connection newTile to a singel-Connection');
                    connection.add(newTile);
                    nonAdded = false;
                }
            }
            else if (nonAdded
                && connection.type == type
                && connectionsChecked == connectionsNotAdded) {
                console.log('all new connect');
                const newConnection = new Connection({ type: type, tile: newTile, user: ['no player'] });
                newConnection.add(newTile);
                newConnection.add(checkTile);
                newConnections.push(newConnection);
                nonAdded = false;
            }
        });
        connectedTiles.push(...newConnections);
    }
    if (connectedTiles.length < 1 || !connections.some(t => t.type == type)) {
        console.log('newconnection', connectedTiles.length);
        const newConnection = new Connection({ type: type, tile: newTile, user: ['no player'] });
        newConnection.add(checkTile);
        newConnection.add(newTile);
        console.log(newConnection);
        connectedTiles.push(newConnection);
    }
    return connectedTiles;
};
