import { Connection } from "../data/classes/connection.js";
import { TileCordinates } from "../data/types/tileCordinates.js";
import { Tile } from "../data/classes/tile.js";
import { checkConnections } from "./checkConnections.js";
import { Direction } from "../data/types/connections.js";

/*
*
*
*
*   Check if an created Connection are closed and ready to score points.
*   
*
*
*
*/

export const closedConnections = ( connectedTiles: Connection[], gameMap: Tile[][], finishedConnections: Connection[], backsidePath: string ) => {
    console.log('closedConnections')
    connectedTiles.forEach((connection) => {
        if (connection.type == 'R') {
            let singelRoadTiles = 0;
            connection.span.forEach((tile) => {
                const connections = gameMap[tile.col][tile.row].connect;
                const roadConnect = gameMap[tile.col][tile.row].roadConnect;
                let surroundTiles = 0;
                let types = 0;
                connections.forEach((type) => {if (type == "R"){types++}});
                
                const directions = [
                    {dx: 0, dy: -1 },
                    {dx: 1, dy: 0 },  
                    {dx: 0, dy: 1 },  
                    {dx: -1, dy: 0 },  
                ];
                directions.forEach(({dx, dy}) => {
                    const newCol = tile.col + dx;
                    const newRow = tile.row + dy;
                    if ( 
                        connection.span.some(c => c.col == newCol && c.row == newRow)
                    ) {
                        surroundTiles++
                    }
                });
                console.log(surroundTiles, types);
                if (
                    types == 1
                    || !roadConnect
                ){
                    singelRoadTiles++
                    console.log(singelRoadTiles);
                } else if (
                    types == surroundTiles
                    && !roadConnect
                ) {
                    singelRoadTiles++
                    console.log(singelRoadTiles);
                }
            })
            if (
                singelRoadTiles == 2 
                && !finishedConnections.some(c => c == connection)

            ) {
                finishedConnections.push(connection);
            } 
        } else if ( connection.type == 'C'){
            let cityLimits = 0;
            connection.span.forEach((tile) => {
                const directions = [
                    {dx: 0, dy: -1, type: 2, direction: 'up'},
                    {dx: 1, dy: 0, type: 3, direction: 'right'},  
                    {dx: 0, dy: 1, type: 0, direction: 'down'},  
                    {dx: -1, dy: 0, type: 1, direction: 'left'},  
                ];
                let tileDirection = 0;
                const connections = gameMap[tile.col][tile.row].connect 
                const cityConnect = gameMap[tile.col][tile.row].cityConnect;
                let types = 0;
                connections.forEach((type) => {if (type == "C"){types++}});
                console.log('types cityconnectionsclosed', types)
                if (
                    types == 1
                    || !cityConnect
                ){
                    cityLimits++
                } else if (
                    types > 1 
                ) {
                    let eachDirectionOK = 0;
                    directions.forEach(({dx, dy, type, direction}) => {
                        const newCol = tile.col + dx;
                        const newRow = tile.row + dy;
                        
                        if (
                            gameMap[tile.col][tile.row].connect[tileDirection] !== 'C'
                            || gameMap[tile.col][tile.row].connect[tileDirection] == gameMap[newCol][newRow].connect[type]
                        ) {
                           eachDirectionOK++
                           console.log('direction OK')
                        } else {
                            console.log('connection direction not ok', gameMap[tile.col][tile.row].connect[tileDirection], gameMap[newCol][newRow].connect[type])
                        }
                        tileDirection++
                    })
                    if ( eachDirectionOK == 4 ) {
                        cityLimits++
                    }

                }
            })
            console.log({cityLimits: cityLimits});
            if (
                connection.span.length > 1
                && cityLimits == connection.span.length 
                && !finishedConnections.some(c => c == connection)
            ) {
                finishedConnections.push(connection);
            }
            if (
                connection.span.length == 1
                && !gameMap[connection.span[0].col][connection.span[0].row].connect.some(c => c == 'C')
                && !finishedConnections.some(c => c == connection)
            ) {
                finishedConnections.push(connection);
            }
        }
        if (connection.type == 'M') {
            let placedTiles: boolean[] = [];
            const directions = [
                { col: 1, row: 0},
                { col: 1, row: 1},
                { col: 1, row: -1},
                { col: -1, row: -1},
                { col: -1, row: 0},
                { col: -1, row: 1},
                { col: 0, row: 1}, 
                { col: 0, row: -1},
            ]
            directions.forEach((d) => {
                const newCol = connection.span[0].col + d.col;
                const newRow = connection.span[0].row + d.row;
                if ( gameMap[newCol][newRow].image !== backsidePath ) {
                    placedTiles.push(true);
                } else {
                    placedTiles.push(false);
                }
            })
            if ( 
                !placedTiles.some(b => b == false)
                && !finishedConnections.some(c => c == connection)
             ) {
                finishedConnections.push(connection);
            }
        }
    })
    return finishedConnections
};