import { Turn } from "../data/classes/turn.js";
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
export const switchTurns = (oneTurn, gameTurn, user, lastTilePlayed, usedTiles, completedTurns, currentPlayer, players, avaliblePlayers, placedMeeples) => {
    if (oneTurn.turnOver == true) {
        const thisTurn = new Turn(oneTurn.player, gameTurn, true, lastTilePlayed, true, usedTiles[usedTiles.length - 1], true, placedMeeples[-1], oneTurn.turnOver);
        completedTurns.push(thisTurn);
        gameTurn++;
        let Changeplayer = currentPlayer;
        if (currentPlayer == (players - 1)) {
            Changeplayer = 0;
        }
        else {
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
        };
    }
    return { user, oneTurn, currentPlayer, completedTurns };
};
