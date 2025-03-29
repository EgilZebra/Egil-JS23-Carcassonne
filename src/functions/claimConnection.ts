import { Connection } from "../data/classes/connection.js";
import { TileCordinates } from "../data/types/tileCordinates.js";
import { Tile } from "../data/classes/tile.js";

/*
*
*
*
*   Check if a connection is already taken by another player.
*   If not, claim it. 
*   if there is no connection made, make a new one.
*
*
*/
export const claimConnection = (
    type: string, 
    direction:  'top' | 'left' | 'bottom' | 'right' | 'centre', 
    tile: TileCordinates, 
    gameMap: Tile [][], 
    connectedTiles: Connection[],
    user: { name: string, color: string },
    backsidePath: string
): { Claimed: boolean; connectedTiles: Connection[]; } => {
    let newConnected = connectedTiles;
    let Claimed = false;
    const directions = {
        top: { col: tile.col ,row: tile.row -1 }, 
        left: { col: tile.col - 1 ,row: tile.row }, 
        bottom: { col: tile.col ,row: tile.row + 1 }, 
        right: { col: tile.col + 1 ,row: tile.row }
    };
    console.log('claimconnection', type, direction)
    if ( direction == 'centre' && gameMap[tile.col][tile.row].monastery == true ) {                  
        const newConnection = new Connection({type: 'M', user: [user.name] });
        newConnection.span.push({col: tile.col, row: tile.row})
        newConnected.push(newConnection);
        Claimed = true;
    };
    if (
        direction == 'centre'
        && gameMap[tile.col][tile.row].cityConnect == true
        && !gameMap[tile.col][tile.row].connect.some(c => c == 'C')
    ) {
        const newConnection = new Connection({type: 'C', user: [user.name] });
        newConnection.span.push({col: tile.col, row: tile.row})
        newConnected.push(newConnection);
        Claimed = true;
    }
    connectedTiles.forEach((connection) => {
        if ( 
            direction == 'top' 
            && connection.span.some(c => c.col == tile.col && c.row == tile.row) 
            && connection.span.some(c => c.col == (tile.col) && c.row == (tile.row - 1))
            && connection.user.some(u => u == 'no player')
            && connection.type == type
        ) {
            connection.user = [ user.name ];
            Claimed = true;
        }       
        if ( 
            direction == 'left' 
            && connection.span.some(c => c.col == tile.col && c.row == tile.row) 
            && connection.span.some(c => c.col == (tile.col - 1) && c.row == (tile.row))
            && connection.user.some(u => u == 'no player')
            && connection.type == type
        ){
            connection.user = [ user.name ];
            Claimed = true;
        }
        if ( 
            direction == 'bottom' 
            && connection.span.some(c => c.col == tile.col && c.row == tile.row) 
            && connection.span.some(c => c.col == (tile.col) && c.row == (tile.row + 1))
            && connection.user.some(u => u == 'no player')
            && connection.type == type
        ){
            connection.user = [ user.name ];
            Claimed = true;
        }
        if ( 
            direction == 'right' 
            && connection.span.some(c => c.col == tile.col && c.row == tile.row) 
            && connection.span.some(c => c.col == (tile.col + 1) && c.row == (tile.row))
            && connection.user.some(u => u == 'no player')
            && connection.type == type
        ){
            connection.user = [ user.name ];
            Claimed = true;
        }
            
        if ( 
            direction == 'centre'
            && gameMap[tile.col][tile.row].cityConnect == true
            && connection.span.some(c => c.col == tile.col && c.row == tile.row)
            && connection.user.some(u => u == 'no player')
            && connection.type == 'C'
        ) {
            connection.user = [ user.name ];
            Claimed = true;
        }
        if (
            direction == 'centre'
            && gameMap[tile.col][tile.row].roadConnect == true
            && connection.span.some(c => c.col == tile.col && c.row == tile.row)
            && connection.user.some(u => u == 'no player')
            && connection.type == 'R'
        ) {
            connection.user = [ user.name ];
            Claimed = true;
        }
        if (   
            direction !== 'centre'
            && gameMap[directions[direction].col][directions[direction].row].image == backsidePath
        ) {
            console.log('check empty side!')
            if ( 
                (connection.type == type && !connection.span.some(c => c.col == tile.col && c.row == tile.row))
                || (connection.type == type && gameMap[tile.col][tile.row].roadConnect == false )
                || (connection.type == type && gameMap[tile.col][tile.row].cityConnect == false )
                || (connection.type !== type) 
            ) {
                console.log('new sigle connection with meeple')
                const newConnection = new Connection({type: type, user: [user.name] });
                newConnection.span.push({col: tile.col, row: tile.row})
                newConnected.push(newConnection);
                Claimed = true;
            }    
        }   
    })
    connectedTiles = newConnected;
    console.log('Claimed', Claimed);
    return {Claimed, connectedTiles};
}