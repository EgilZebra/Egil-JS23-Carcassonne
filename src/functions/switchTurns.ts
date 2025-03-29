import { Tile } from "../data/classes/tile.js";
import { Turn } from "../data/classes/turn.js";
import { TileCordinates } from "../data/types/tileCordinates.js";

/*
*
*
*
*   Give the turn over to the next player
*   
*
*
*
*/
export const switchTurns = ( 
    oneTurn: {player: string, turn: number, drawTile: boolean, placeTile: boolean, placeMeeple: boolean, turnOver: boolean } , 
    gameTurn: number, 
    user: { name: string, color: string }, 
    lastTilePlayed: Tile,
    usedTiles:  TileCordinates[],
    completedTurns: Turn[],
    currentPlayer: number,
    players: number,
    avaliblePlayers: { name: string, color: string }[],
    placedMeeples: {col: number, row: number, color: string}[]
) => {
    if (
        oneTurn.turnOver == true
    ) {
        const thisTurn = new Turn(
            oneTurn.player, 
            gameTurn,
            true,
            lastTilePlayed,
            true,
            usedTiles[usedTiles.length -1],
            true,
            placedMeeples[-1],
            oneTurn.turnOver
        );
        completedTurns.push(thisTurn);
        gameTurn++;
        let Changeplayer: number = currentPlayer;
        if ( currentPlayer == (players - 1) ) {
            Changeplayer = 0;
        } else  {
            Changeplayer++;
        }
        currentPlayer = Changeplayer;
        user = avaliblePlayers[currentPlayer];
        console.log(currentPlayer);
        console.log(oneTurn);
        console.log(completedTurns);
        oneTurn = {
            player: avaliblePlayers[currentPlayer].name, 
            turn: gameTurn,
            drawTile: true,
            placeTile: false,
            placeMeeple: false,
            turnOver: false
        }
    }
    return {user, oneTurn, currentPlayer, completedTurns}
}