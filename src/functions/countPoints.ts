import { Connection } from "../data/classes/connection.js";
import { Tile } from "../data/classes/tile.js";

/*
*
*
*
*   score the points given by the finished connections.
*   
*
*
*
*/

export const countPoints = ( finishedConnections: Connection[], allPlayersStats: {name: string, remainingMeeples: number, color: string, points: number}[], gameMap: Tile[][], placedMeeples: {col: number, row: number, color: string}[] ) => {
    allPlayersStats.forEach(p => p.points = 0);
    finishedConnections.forEach((connection) => {
        if ( connection.type == 'R' ){
            let points = connection.span.length;
            connection.user.forEach((user) => {
                const player = allPlayersStats.find(p => p.name === user);
                if (player) {
                    player.points += points;
                }
                console.log(player);
            })
        } else if ( connection.type == 'C') {
            let points = connection.span.length*2;
            connection.span.forEach((cordinates) => {
                if (gameMap[cordinates.col][cordinates.row].cityBadge == true){
                    points++
                }
            })
            connection.user.forEach((user) => {
                const player = allPlayersStats.find(p => p.name === user);
                if (player) {
                    player.points += points;
                }
                console.log(player);
            })
        } else if ( connection.type == 'M' ) {
            let points = 9;
            connection.user.forEach((user) => {
                const player = allPlayersStats.find(p => p.name === user);
                if (player) {
                    player.points += points;
                }
                console.log(player);
            })
        }

        // Remove the meeple, and return it to the player if the connection is closed.
        placedMeeples.forEach((meeple, index) => {
            if (
                connection.span.some(t => t.col == Math.floor(meeple.col / 145) && t.row == Math.floor(meeple.row / 145))
            ) {
                placedMeeples.splice(index, 1);
                const playerIndex = allPlayersStats.findIndex(p => p.color == meeple.color);
                allPlayersStats[playerIndex].remainingMeeples += 1;
            }
        })
    })
    return allPlayersStats;
}