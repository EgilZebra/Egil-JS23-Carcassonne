import { allTiles } from "./data/tiles/tiles.js";
import { TileCordinates } from "./data/types/tileCordinates.js";
import { Tile } from "./data/classes/tile.js";
import { Turn } from "./data/classes/turn.js";
import { Connection } from "./data/classes/connection.js";
import { createGameMap } from "./functions/createGameMap.js";
import { mousePlacement } from "./functions/mousePlacement.js";
import { drawRandomTile } from "./functions/drawRandomTile.js";
import { drawMeeples } from "./functions/CTX/drawMeeples.js";
import { drawUI } from "./functions/CTX/drawUI.js";
import { drawGameBoard } from "./functions/CTX/drawGameBoard.js";
import { drawPlayableTiles } from "./functions/CTX/drawPlayableTiles.js";
import { updateUsedTiles } from "./functions/updateUsedTiles.js";
import { updatePlayableTiles } from "./functions/updatePlayableTiles.js";
import { checkAjecentTiles } from "./functions/checkAjecentTiles.js";
import { updateConnections } from "./functions/updateConnections.js";
import { closedConnections } from "./functions/closedConnections.js";
import { claimConnection } from "./functions/claimConnection.js";
import { switchTurns } from "./functions/switchTurns.js";
import { countPoints } from "./functions/countPoints.js";
import { drawStartMenu } from "./functions/CTX/drawStartMenu.js";
import { drawEndMenu } from "./functions/CTX/drawEndMenu.js";
import { checkConnectionRepeat } from "./functions/checkConnectionRepeat.js";
const backsidePath: string = './assets/backside.jpg';
const meeplesPath: string = './assets/meeples.png';

/*-------------------------------------------------------------------------
*
*
*
*
*  Create a webbased version of the classic boardgame Carcassonne.
*  In this file, connect the functions of the game to the correct input.
*  Update the gameState based on the events.
*  And draw the gameBoard based on gameState.
*
*
*
*---------------------------------------------------------------------------
*/


// Create the initial CANVAS and it's contex-element for all drawing to be made.
const canvas = document.getElementById('canvasMain') as HTMLCanvasElement | null;
if (canvas) {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const CANVAS_WIDTH: number = canvas.width = 1808;
    const CANVAS_HEIGHT: number = canvas.height = 980;
    if (ctx){


        /*----------------------------------------------------------------
        *
        *
        *
        *   Initialize all the variables required to start the game.
        *
        *
        *
        *
        *----------------------------------------------------------------
        */


        // GAME STATE & PLAYER INFO
        const players: number = 2;
        let currentPlayer: number = 0;
        let gameTurn: number = 1;
        const maxGameTurns: number = 15;
        let avaliblePlayers: { name: string, color: string }[] = [
            { name: 'Player 1' ,  color: 'rgba(0, 100, 164, 1)'},
            { name: 'Player 2' ,  color: 'rgba(0, 141, 65, 1)'},
            { name: 'Player 3' ,  color: 'rgba(223, 194, 20, 1)'},
            { name: 'Player 4' ,  color: 'rgba(207, 24, 31, 1)'},
            { name: 'Player 5' ,  color: 'rgba(57, 56, 58, 1)'},
        ];
        let user = avaliblePlayers[currentPlayer];
        let allPlayersStats: {name: string, remainingMeeples: number, color: string, points: number}[] = []; 
        for ( let i = 0; i < players; i++) {
            const player = {
                name: avaliblePlayers[i].name,
                remainingMeeples: 7,
                color: avaliblePlayers[i].color,
                points: 0
            }
            allPlayersStats.push(player);
        }; 
        let oneTurn: {player: string, turn: number, drawTile: boolean, placeTile: boolean, placeMeeple: boolean, turnOver: boolean } = {
            player: avaliblePlayers[currentPlayer].name, 
            turn: 1,
            drawTile: true,
            placeTile: false,
            placeMeeple: false,
            turnOver: false
        }
        const playerColors: string[] = [
            'rgba(0, 100, 164, 1)',
            'rgba(0, 141, 65, 1)',
            'rgba(223, 194, 20, 1)',
            'rgba(207, 24, 31, 1)',
            'rgba(57, 56, 58, 1)',
        ]

        // GAMEBOARD INFO STATIC
        const GameBoardSize = {
            x: 320,
            y: 200,
            width: 1445,
            height: 750,
            tileSize: 145,
            meepleSize: 80,
            tilesOnBoard: 20
        };
        let gameMap = createGameMap( GameBoardSize.tilesOnBoard, backsidePath );
        const playableTilesBorderWidth: number = 3;
        const maxDragX = (gameMap[0].length * GameBoardSize.tileSize) - GameBoardSize.width; 
        const maxDragY = (gameMap.length * GameBoardSize.tileSize) - GameBoardSize.height; 
        const minDragX: number = 0;  
        const minDragY: number = 0;
        const meepleImage: HTMLImageElement = new Image()
        const LOGO: HTMLImageElement = new Image();
        LOGO.src = './assets/Carcassonne-logo.png';
        meepleImage.src = meeplesPath;
        const MeepleInfo: { Image: HTMLImageElement, Size: number, colors: string[] } = {
            Image: meepleImage,
            Size: GameBoardSize.meepleSize,
            colors: playerColors
        }

        // GAME INFO ORGANIC
        let dragMap = false;
        let moveMeepleToggle: boolean = false;
        let moveTiletoggle: boolean = false;
        let startMenytoggle: boolean = true;
        let endMenuToggle: boolean = false;
        let dragMapX: number = 0;
        let dragMapY: number = 0;
        let deltaDragX = gameMap[0].length * GameBoardSize.tileSize * 0.3;
        let deltaDragY = gameMap.length * GameBoardSize.tileSize * 0.4;
        let dragMeepleX: number = 0;
        let dragMeepleY: number = 0;
        let deltaDragMeepleX: number = 0;
        let deltaDragMeepleY: number = 0;
        let deltaDragTileX: number = 0;
        let deltaDragTileY: number = 0;
        let dragTileX: number = 0;
        let dragTileY: number = 0;
        
        // GAME STORE EVENTS
        let connectedTiles: Array<Connection> = [];
        let finishedConnections: Array<Connection> = [];
        let playableTiles: TileCordinates[] = [];
        let usedTiles: TileCordinates[] = [];
        let placedMeeples: {col: number, row: number, color: string}[]  = [];
        let completedTurns: Turn[] = [];
        let lastTilePlayed: Tile;
        let drawNewTile: Tile = new Tile({
            image: backsidePath, 
            width: 224, 
            height: 224, 
            imageStartX: 0,
            imageStartY: 0,
            connections: ['', '', '', ''],
            monastery: false,
            badge: false,
            cityConnect: false,
            roadConnect: false
        })
        let clickableElements: { name: string, color: string }[] = [
            { name: "Start Game" , color: 'rgba(0, 204, 156, 1)' },
            { name: "New Game" , color: 'rgba(0, 204, 156, 1)' },
            { name: "Draw Tile" , color: 'rgba(0, 204, 156, 1)' },
            { name: "Rotate" , color: 'rgba(0, 204, 156, 1)' },
            { name: "End Turn" , color: 'rgba(0, 204, 156, 1)' },
        ];

        /*
        *
        *
        *
        *   The functions for handling the mouse-input of the game. 
        *   All the clicking, dragging and also all the buttonhandling of the application.
        *
        *
        *
        */
        const mouseClick = (e: MouseEvent) => {
            // Handle the mouse-clicks under the duration of a game.
            const Mouse = mousePlacement( e, canvas, GameBoardSize.x, deltaDragX, GameBoardSize.y, deltaDragY )

            // click on drawnTile button
            if ( Mouse.scaledX > 50 && Mouse.scaledX < 50+240 && Mouse.scaledY > 350 && Mouse.scaledY < 350+240 ){
                
                console.log(drawNewTile.connect);
                moveTiletoggle = true;
                dragTileX = Mouse.scaledX;
                dragTileY = Mouse.scaledY;
            }
            // click on Rotate button
            if ( Mouse.scaledX > 200 && Mouse.scaledX < 200+100 && Mouse.scaledY > 270 && Mouse.scaledY < 270+50 ){
                drawNewTile.rotate();
            }
            // click on Draw Tile button
            if ( oneTurn.drawTile && Mouse.scaledX > 50 && Mouse.scaledX < 50+150 && Mouse.scaledY > 270 && Mouse.scaledY < 270+50){
                console.log('draw tile');
                const drawTileNumber = Math.floor(Math.random() * allTiles.length);
                drawNewTile = drawRandomTile(drawTileNumber);
                usedTiles = updateUsedTiles( gameMap, backsidePath, usedTiles, playableTiles );
                playableTiles = updatePlayableTiles( playableTiles, usedTiles, gameMap, backsidePath );
                oneTurn.drawTile = false;
                oneTurn.placeTile = true;
            }
            if (Mouse.scaledX >= GameBoardSize.x && Mouse.scaledX <= (GameBoardSize.x + GameBoardSize.width) && Mouse.scaledY >= GameBoardSize.y && Mouse.scaledY <= (GameBoardSize.y + GameBoardSize.height)) {
                // click to drag a generated Tile for placement on the GameBoard
                dragMap = true;
                dragMapX = Mouse.scaledX;
                dragMapY = Mouse.scaledY;                   
                const col = Math.floor(Mouse.adjustedX / GameBoardSize.tileSize);
                const row = Math.floor(Mouse.adjustedY / GameBoardSize.tileSize);
                if (row >= 0 && row < gameMap.length && col >= 0 && col < gameMap[row].length) {
                    const clickedTile = gameMap[col][row];
                    console.log('Clicked tile:', clickedTile, 'col:',  col, 'row:',  row);
                }
                
            }

            // Click to drag a remaining meeple for placement on the GameBoard.
            if ( oneTurn.placeMeeple && Mouse.scaledX > 50 && Mouse.scaledX < 50 + (allPlayersStats[currentPlayer].remainingMeeples * 25) && Mouse.scaledY > 700 && Mouse.scaledY < 700+80){
                console.log('mEEEPLE!');
                moveMeepleToggle = true;
                allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples - 1 >= 0) ? (allPlayersStats[currentPlayer].remainingMeeples - 1) : 0;
                dragMeepleX = Mouse.scaledX;
                dragMeepleY = Mouse.scaledY;
            }
            if (Mouse.scaledX > 50 && Mouse.scaledX < 50 + 160 && Mouse.scaledY > 762 && Mouse.scaledY < 762+50){
                console.log('end turn')
                finishedConnections = closedConnections( connectedTiles, gameMap, finishedConnections, backsidePath );
                connectedTiles = checkConnectionRepeat( connectedTiles )
                oneTurn.turnOver = true;
                allPlayersStats = countPoints( finishedConnections, allPlayersStats, gameMap, placedMeeples );
                const newturn = switchTurns(oneTurn, gameTurn, user, lastTilePlayed, usedTiles, completedTurns, currentPlayer, players, avaliblePlayers, placedMeeples );
                gameTurn++;
                user = newturn.user;
                oneTurn = newturn.oneTurn;
                currentPlayer = newturn.currentPlayer;
                completedTurns = newturn.completedTurns;
                console.log(connectedTiles);
                console.log(finishedConnections);
                endGame();
            }
            // Click the NEW GAME button
            if (Mouse.scaledX > 780 && Mouse.scaledX < 780 + 220 && Mouse.scaledY > 100 && Mouse.scaledY < 100+55){
                // Restart Game
                window.location.reload()
            }
        } 
        const mouseClickStart = (e: MouseEvent) => {
            // Handle the mouse-clicks on the StartMenu

            const Mouse = mousePlacement( e, canvas, GameBoardSize.x, deltaDragX, GameBoardSize.y, deltaDragY )

       
            // Select the color for player 1
            if ( Mouse.scaledX > 704 && Mouse.scaledX < 784 && Mouse.scaledY > 380 && Mouse.scaledY < 455 ) { console.log('blue');  allPlayersStats[0].color = (allPlayersStats[1].color !== playerColors[0]) ? playerColors[0] : allPlayersStats[0].color}
            if ( Mouse.scaledX > 684+100 && Mouse.scaledX < 684+100+80 && Mouse.scaledY > 380 && Mouse.scaledY < 455 ) { console.log('green'); allPlayersStats[0].color = (allPlayersStats[1].color !== playerColors[1]) ? playerColors[1] : allPlayersStats[0].color}
            if ( Mouse.scaledX > 764+100 && Mouse.scaledX < 764+100+80 && Mouse.scaledY > 380 && Mouse.scaledY < 455 ) { console.log('yellow'); allPlayersStats[0].color = (allPlayersStats[1].color !== playerColors[2]) ? playerColors[2] : allPlayersStats[0].color}
            if ( Mouse.scaledX > 844+100 && Mouse.scaledX < 844+100+80 && Mouse.scaledY > 380 && Mouse.scaledY < 455 ) { console.log('red'); allPlayersStats[0].color = (allPlayersStats[1].color !== playerColors[3]) ? playerColors[3] : allPlayersStats[0].color}
            if ( Mouse.scaledX > 924+100 && Mouse.scaledX < 924+100+80 && Mouse.scaledY > 380 && Mouse.scaledY < 455  ) { console.log('black'); allPlayersStats[0].color = (allPlayersStats[1].color !== playerColors[4]) ? playerColors[4] : allPlayersStats[0].color}

            //  Select the color for player 2
            if ( Mouse.scaledX > 704 && Mouse.scaledX < 704+80 && Mouse.scaledY > 90+490 && Mouse.scaledY < 90+490+75 ) { console.log('blue'); allPlayersStats[1].color = (allPlayersStats[0].color !== playerColors[0]) ? playerColors[0] : allPlayersStats[1].color}
            if ( Mouse.scaledX > 684+100 && Mouse.scaledX < 684+100+80 && Mouse.scaledY > 90+490 && Mouse.scaledY < 90+490+75 ) {console.log('green'); allPlayersStats[1].color = (allPlayersStats[0].color !== playerColors[1]) ? playerColors[1] : allPlayersStats[1].color}
            if ( Mouse.scaledX > 764+100 && Mouse.scaledX < 764+100+80 && Mouse.scaledY > 90+490 && Mouse.scaledY < 90+490+75 ) { console.log('yellow'); allPlayersStats[1].color = (allPlayersStats[0].color !== playerColors[2]) ? playerColors[2] : allPlayersStats[1].color}
            if ( Mouse.scaledX > 844+100 && Mouse.scaledX < 844+100+80 && Mouse.scaledY > 90+490 && Mouse.scaledY < 90+490+75 ) { console.log('red'); allPlayersStats[1].color = (allPlayersStats[0].color !== playerColors[3]) ? playerColors[3] : allPlayersStats[1].color}
            if ( Mouse.scaledX > 924+100 && Mouse.scaledX < 924+100+80 && Mouse.scaledY > 90+490 && Mouse.scaledY < 90+490+75 ) { console.log('black'); allPlayersStats[1].color = (allPlayersStats[0].color !== playerColors[4]) ? playerColors[4] : allPlayersStats[1].color}


            // Start The Game.
            if ( Mouse.scaledX > 704 && Mouse.scaledX < 704+400 && Mouse.scaledY > 690 && Mouse.scaledY < 690+100 ) {
                startMenytoggle = false;
                console.log('Statrt the game!')
                updateMouseDown();
            }

        };
        const mouseClickEnd = (e: MouseEvent) => {
            // Handle the mouse-clicks on the endGame scren.
            const Mouse = mousePlacement( e, canvas, GameBoardSize.x, deltaDragX, GameBoardSize.y, deltaDragY )

            // Start a new Game.
            if ( Mouse.scaledX > 704 && Mouse.scaledX < 704+400 && Mouse.scaledY > 690 && Mouse.scaledY < 690+100 ) {
                console.log('Start Over!')
                window.location.reload();
            }
        }
        const mouseRelease = (e: MouseEvent) => {
            const Mouse = mousePlacement( e, canvas, GameBoardSize.x, deltaDragX, GameBoardSize.y, deltaDragY )
            const col = Math.floor(Mouse.adjustedX / GameBoardSize.tileSize);
            const row = Math.floor(Mouse.adjustedY / GameBoardSize.tileSize);
            if ( 
                oneTurn.placeTile &&
                moveTiletoggle && 
                row >= 0 && 
                row < gameMap.length && 
                col >= 0 && 
                col < gameMap[row].length &&
                Mouse.scaledX >= GameBoardSize.x && 
                Mouse.scaledX <= (GameBoardSize.x + GameBoardSize.width) && 
                Mouse.scaledY >= GameBoardSize.y && 
                Mouse.scaledY <= (GameBoardSize.y + GameBoardSize.height) &&
                checkAjecentTiles(col, row, drawNewTile, gameMap) &&
                playableTiles.some(t => t.col == col && t.row == row)
            ) {
                gameMap[col][row] = drawNewTile;
                lastTilePlayed = drawNewTile;
                drawNewTile = new Tile({
                    image: './assets/backside.jpg', 
                    width: 224, 
                    height: 224, 
                    imageStartX: 0,
                    imageStartY: 0,
                    connections: ['', '', '', ''],
                    monastery: false,
                    badge: false,
                    cityConnect: false,
                    roadConnect: false
                });
                connectedTiles = updateConnections( col, row, gameMap , usedTiles, connectedTiles );
                finishedConnections = closedConnections( connectedTiles, gameMap, finishedConnections, backsidePath );
                connectedTiles = checkConnectionRepeat( connectedTiles );
                usedTiles = updateUsedTiles( gameMap, backsidePath, usedTiles, playableTiles );
                playableTiles = updatePlayableTiles( playableTiles, usedTiles, gameMap, backsidePath );
                oneTurn.placeTile = false;
                oneTurn.placeMeeple = true;
            }

            if ( 
                oneTurn.placeMeeple &&
                moveMeepleToggle && 
                row == usedTiles[usedTiles.length - 1].row && 
                col == usedTiles[usedTiles.length - 1].col && 
                Mouse.scaledX >= GameBoardSize.x && 
                Mouse.scaledX <= (GameBoardSize.x + GameBoardSize.width) && 
                Mouse.scaledY >= GameBoardSize.y && 
                Mouse.scaledY <= (GameBoardSize.y + GameBoardSize.height)
            ){ 
                const tile: Tile = lastTilePlayed;
                const TileX = Mouse.adjustedX - (GameBoardSize.tileSize * col);
                const TileY = Mouse.adjustedY - (GameBoardSize.tileSize * row);

                if ( (TileX < GameBoardSize.tileSize * 0.66 ) && (TileX > GameBoardSize.tileSize * 0.33) && (TileY < GameBoardSize.tileSize * 0.66) && (TileY > GameBoardSize.tileSize * 0.33) ){
                    console.log('centre')
                    const claimed = claimConnection( 'centre', 'centre', {col: col, row: row}, gameMap, connectedTiles, user, backsidePath);
                    connectedTiles = claimed.connectedTiles;
                    if (claimed.Claimed) {
                        const newMeeple = {col: Mouse.adjustedX, row: Mouse.adjustedY, color: allPlayersStats[currentPlayer].color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                } else if ( (TileX > TileY) && (TileX < (GameBoardSize.tileSize - TileY))){
                    console.log('top', tile.connect[0]);
                    const claimed = claimConnection( tile.connect[0], 'top', {col: col, row: row}, gameMap, connectedTiles, user, backsidePath);
                    connectedTiles = claimed.connectedTiles;
                    if (claimed.Claimed) {
                        const newMeeple = {col: Mouse.adjustedX, row: Mouse.adjustedY, color: allPlayersStats[currentPlayer].color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                   
                } else if ( (TileX > TileY) && (TileX > (GameBoardSize.tileSize - TileY))){
                    console.log('right', tile.connect[1]);
                    const claimed = claimConnection( tile.connect[1], 'right', {col: col, row: row}, gameMap, connectedTiles, user, backsidePath);
                    connectedTiles = claimed.connectedTiles;
                    if (claimed.Claimed) {
                        const newMeeple = {col: Mouse.adjustedX, row: Mouse.adjustedY, color: allPlayersStats[currentPlayer].color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }

                } else if ( (TileX < TileY) && (TileX > (GameBoardSize.tileSize - TileY))){
                    console.log('bottom', tile.connect[2]);
                    const claimed = claimConnection( tile.connect[2], 'bottom', {col: col, row: row}, gameMap, connectedTiles, user, backsidePath);
                    connectedTiles = claimed.connectedTiles;
                    if (claimed.Claimed) {
                        const newMeeple = {col: Mouse.adjustedX, row: Mouse.adjustedY, color: allPlayersStats[currentPlayer].color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                } else if ( (TileX < TileY) && (TileY < (GameBoardSize.tileSize - TileX))){
                    console.log('left', tile.connect[3])
                    const claimed = claimConnection( tile.connect[3], 'left', {col: col, row: row}, gameMap, connectedTiles, user, backsidePath);
                    connectedTiles = claimed.connectedTiles;
                    if (claimed.Claimed) {
                        const newMeeple = {col: Mouse.adjustedX, row: Mouse.adjustedY, color: allPlayersStats[currentPlayer].color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                }
                connectedTiles = checkConnectionRepeat( connectedTiles );
                console.log(placedMeeples);
            }
            dragMap = false;
            moveTiletoggle = false;
            if ( oneTurn.placeMeeple && moveMeepleToggle ) {
                allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7
            }
            moveMeepleToggle = false;            
        }
        const mouseDrag = (e: MouseEvent) => {
            const Mouse = mousePlacement( e, canvas, GameBoardSize.x, deltaDragX, GameBoardSize.y, deltaDragY )
            clickableElements.forEach((element) => element.color = 'rgba(0, 204, 156, 1)');
            // If the cursor is inside the game board, and dragmap is toggled. Move the game board until you release the mousebutton.
            if (dragMap && Mouse.scaledX >= GameBoardSize.x && Mouse.scaledX <= (GameBoardSize.x + GameBoardSize.width) && Mouse.scaledY >= GameBoardSize.y && Mouse.scaledY <= (GameBoardSize.y + GameBoardSize.height)) {              
                deltaDragX -= Mouse.scaledX - dragMapX;
                deltaDragY -= Mouse.scaledY - dragMapY;
                deltaDragX = Math.max(minDragX, Math.min(deltaDragX, maxDragX));
                deltaDragY = Math.max(minDragY, Math.min(deltaDragY, maxDragY));
                dragMapX = Mouse.scaledX;
                dragMapY = Mouse.scaledY;
            }
            // if movieTiletoggle is enabled, move your new tile for placement
            if ( moveTiletoggle ) {
                deltaDragTileX -= Mouse.scaledX - dragTileX;
                deltaDragTileY -= Mouse.scaledY - dragTileY;
                dragTileX = Mouse.scaledX;
                dragTileY = Mouse.scaledY;
            }
            // if moveMeepleToggle is enabled, move a meeple for placement on your game board
            if ( moveMeepleToggle ) {
                deltaDragMeepleX -= Mouse.scaledX - dragMeepleX;
                deltaDragMeepleY -= Mouse.scaledY - dragMeepleY;
                dragMeepleX = Mouse.scaledX;
                dragMeepleY = Mouse.scaledY;
            }
            if (Mouse.scaledX > 780 && Mouse.scaledX < 780 + 220 && Mouse.scaledY > 100 && Mouse.scaledY < 100+55){
                // Restart Game
                clickableElements[1].color = 'rgba( 71, 107, 171 , 1)';
            }
            if (Mouse.scaledX > 50 && Mouse.scaledX < 50 + 160 && Mouse.scaledY > 762 && Mouse.scaledY < 762+50){
                // End Turn
                clickableElements[4].color = 'rgba( 71, 107, 171 , 1)';
            }
            if ( oneTurn.drawTile && Mouse.scaledX > 50 && Mouse.scaledX < 50+150 && Mouse.scaledY > 270 && Mouse.scaledY < 270+50){
                // Draw Tile
                clickableElements[2].color = 'rgba( 71, 107, 171 , 1)';
            }
            if ( Mouse.scaledX > 200 && Mouse.scaledX < 200+100 && Mouse.scaledY > 270 && Mouse.scaledY < 270+50 ){
                // Rotate
                clickableElements[3].color = 'rgba( 71, 107, 171 , 1)';
            }
            if ( Mouse.scaledX > 704 && Mouse.scaledX < 704+400 && Mouse.scaledY > 690 && Mouse.scaledY < 690+100 ) {
                // Start Game
                clickableElements[0].color = 'rgba( 71, 107, 171 , 1)';
            }


        };

        /*
        *
        *
        *
        *   Connect the event-functions to the corresponding mouse-event.
        *   
        *
        *
        *
        */
        const updateMouseDown = () => {
            if ( startMenytoggle ) {
                canvas.onmousedown = mouseClickStart;
            } else if ( endMenuToggle ) {
                canvas.onmousedown = mouseClickEnd;
            } else {
                canvas.onmousedown = mouseClick;
            } 
        };
        updateMouseDown();
        canvas.onmouseup = mouseRelease      
        canvas.onmousemove = mouseDrag

        // Check if we have reached the maxGameTurns treshold
        const endGame = () => {
            if ( gameTurn >= maxGameTurns ){
                endMenuToggle = true;
                updateMouseDown();
            }

        }

        
        /*
        *
        *
        *
        *   Create the Animation loop for generation the game in canvas.
        *   
        *
        *
        *
        */
        function animate() {
            if (ctx){

                // Check what stage of the game we are and enable that screen to be active.
                if ( startMenytoggle ){
                   drawStartMenu( ctx, allPlayersStats, clickableElements ); 
                } else if (endMenuToggle) {
                    drawEndMenu( ctx, allPlayersStats, clickableElements );
                } else {

                // Generate the UI elements. Layout and text
                drawUI(ctx, LOGO, CANVAS_HEIGHT, CANVAS_WIDTH, gameTurn, allPlayersStats[currentPlayer].points, user.name, clickableElements)

                // Generarte the GameBoard with the map of tiles.
                drawGameBoard( 
                    ctx, 
                    gameMap, 
                    placedMeeples, 
                    GameBoardSize, 
                    GameBoardSize.tileSize, 
                    GameBoardSize.tileSize,
                    deltaDragX,
                    deltaDragY,
                    MeepleInfo
                ); 

                // Generating the remaining meeples for each player.
                drawMeeples( 
                    ctx, 
                    allPlayersStats[currentPlayer].remainingMeeples,
                    playerColors.indexOf(allPlayersStats[currentPlayer].color), 
                    meepleImage, 
                    GameBoardSize.meepleSize 
                );
                // Update the GameBoard to show which tiles are avalible for play this turn.
                drawPlayableTiles( 
                    ctx, 
                    playableTiles, 
                    GameBoardSize, 
                    playableTilesBorderWidth, 
                    drawNewTile, 
                    GameBoardSize.tileSize,
                    GameBoardSize.tileSize, 
                    moveTiletoggle, 
                    checkAjecentTiles, 
                    deltaDragX, 
                    deltaDragY,
                    gameMap
                );

                // Update the graphic to show the dragging of componenets.
                if ( moveTiletoggle ) {
                    const tileX = dragTileX  - GameBoardSize.tileSize/2 ; 
                    const tileY = dragTileY - GameBoardSize.tileSize/2;
                    drawNewTile.draw(ctx, tileX, tileY, GameBoardSize.tileSize*0.9, GameBoardSize.tileSize*0.9 )
                } else {
                    drawNewTile.draw(ctx, 50, 350, 240, 240);
                }
                if (moveMeepleToggle){
                    const dragMeepleSize = GameBoardSize.meepleSize * 0.7;
                    const MeepleX = dragMeepleX - dragMeepleSize/2;
                    const MeepleY = dragMeepleY - dragMeepleSize/2;
                    ctx.drawImage(meepleImage, 0 + (80*playerColors.indexOf(allPlayersStats[currentPlayer].color)), 0, 80, 80, MeepleX, MeepleY, dragMeepleSize, dragMeepleSize)
                }   
                }

                          
            };
            requestAnimationFrame(animate);
        }
        animate();
    }
}
