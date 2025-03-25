import { allTiles } from "./data/tiles/tiles.js";
import { TileCordinates } from "./data/types/tileCordinates.js";
import { TileOptions } from "./data/types/tileOptions.js";
import { Tile } from "./data/classes/tile.js";
import { Turn } from "./data/classes/turn.js";
import { Connection } from "./data/classes/connection.js";
const tilePath: string = './assets/tiles.png';
const backsidePath: string = './assets/backside.jpg';
const meeplesPath: string = './assets/meeples.png';
const LOGO = new Image;
LOGO.src = './assets/Carcassonne-logo.png'

const canvas = document.getElementById('canvasMain') as HTMLCanvasElement | null;
if (canvas) {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (ctx){
        const CANVAS_WIDTH: number = canvas.width = 1808;
        const CANVAS_HEIGHT: number = canvas.height = 980;
        const avaliblePlayers = [
            { name: 'player1' ,  color: 'blue'},
            { name: 'player2' ,  color: 'green'},
            { name: 'player3' ,  color: 'yellow'},
            { name: 'player4' ,  color: 'red'},
            { name: 'player5' ,  color: 'black'},
        ]
        let completedTurns: Turn[] = [];
        const players = 2;
        let currentPlayer = 0;
        let oneTurn = {
            player: avaliblePlayers[currentPlayer].name, 
            turn: 1,
            drawTile: true,
            placeTile: false,
            placeMeeple: false,
            turnOver: false
        }
        let user = avaliblePlayers[currentPlayer];
        let gamePoints: number = 0;
        let gameTurn: number = 1;
        const allPlayersStats: {name: string, remainingMeeples: number, color: string, points: number}[] = []; 
        for ( let i = 0; i < players; i++) {
            const player = {
                name: user.name,
                remainingMeeples: 7,
                color: user.color,
                points: 0
            }
            allPlayersStats.push(player);
        }
        let zoomFactor = 1; 
        const zoomSpeed = 0.1;
        const maxZoom = 1.2; 
        const minZoom = 0.8;
        let tileHeight = 145;
        let zoomTileHeight = tileHeight;
        let tileWidth = 145;
        let zoomTileWidth = tileWidth;
        let gameBoardX = 320;
        let gameBoardY = 200;
        let gameBoardWidth = 1445;
        let gameBoardHeight = 750;
        const gameBoardTiles = 20;
        const playableTilesBorderWidth = 3;
        let playableTiles: TileCordinates[] = [];
        let usedTiles: TileCordinates[] = [];
        let moveTiletoggle: boolean = false;
        let dragTileX: number = 0;
        let deltaDragTileX: number = 0;
        let dragTileY: number = 0;
        let deltaDragTileY: number = 0;
        let moveMeepleToggle: boolean = false;
        let dragMeepleX: number = 0;
        let deltaDragMeepleX: number = 0;
        let dragMeepleY: number = 0;
        let deltaDragMeepleY: number = 0;
        const meepleSize: number = 80;
        const playerColors: string[] = [
            'blue',
            'green',
            'yellow',
            'red',
            'black',
        ]
        const maxMeeples: number = 7;
        let placedMeeples: {col: number, row: number, color: string}[]  = [];
        const meepleImage: HTMLImageElement = new Image();
        meepleImage.src = meeplesPath;
        let connectedTiles: Array<Connection> = [];
        let finishedConnections: Array<Connection> = [];
    
        
        

        const firstTile = new Tile({
            image: tilePath, 
            width: 200, 
            height: 200, 
            imageStartX: 120 + (200 + 18),
            imageStartY: 128 + (200 + 65),
            connections: ['', '', '', ''],
            monastery: false,
            badge: false,
            cityConnect: false,
            roadConnect: true
        });
        
        let gameMap: Array<Tile[]> = [[]];

        for ( let i = 0; i < gameBoardTiles; i++ ){
            if (gameMap.length < gameBoardTiles) {
                gameMap.push([]) 
            }
            for (let j = 0; j < gameBoardTiles; j++){
                const empltyTile = new Tile({
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
                gameMap[i].push(empltyTile);
            }
        }

        let dragMapX = 0;
        let dragMapY = 0;
        let deltaDragX = gameMap[0].length * tileWidth * 0.3;
        let deltaDragY = gameMap.length * tileHeight * 0.4;
        let dragMap = false;
        const maxDragX = (gameMap[0].length * zoomTileWidth) - gameBoardWidth; 
        const maxDragY = (gameMap.length * zoomTileHeight) - gameBoardHeight; 
        const minDragX = 0;  
        const minDragY = 0;
        let drawTileNumber: number = 0;
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

        //console.log(gameMap.length, gameMap[0].length)
        const checkMouse = (e: MouseEvent) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            const scaleX = canvas.width / canvasRect.width;
            const scaleY = canvas.height / canvasRect.height;
            const scaledMouseX = mouseX * scaleX;
            const scaledMouseY = mouseY * scaleY;
            const adjustedMouseX = scaledMouseX - gameBoardX + deltaDragX;
            const adjustedMouseY = scaledMouseY - gameBoardY + deltaDragY;

            // click on drawnTile
            if ( scaledMouseX > 50 && scaledMouseX < 50+240 && scaledMouseY > 350 && scaledMouseY < 350+240 ){
                
                //console.log('clicked inside');
                console.log(drawNewTile.connect);
                moveTiletoggle = true;

                dragTileX = scaledMouseX;
                dragTileY = scaledMouseY;
            }
            // click on Rotate
            if ( scaledMouseX > 200 && scaledMouseX < 200+100 && scaledMouseY > 270 && scaledMouseY < 270+50 ){
                drawNewTile.rotate();
            }
            // click on Draw Tile
            if ( oneTurn.drawTile && scaledMouseX > 50 && scaledMouseX < 50+150 && scaledMouseY > 270 && scaledMouseY < 270+50){
                console.log('draw tile');
                drawTileNumber = Math.floor(Math.random() * allTiles.length);
                drawNewTile = makeTile(drawTileNumber);
                updateUsedTiles();
                updatePlayableTiles();
                oneTurn.drawTile = false;
                oneTurn.placeTile = true;
            }
            if (scaledMouseX >= gameBoardX && scaledMouseX <= (gameBoardX + gameBoardWidth) && scaledMouseY >= gameBoardY && scaledMouseY <= (gameBoardY + gameBoardHeight)) {
                
                dragMap = true;

                dragMapX = scaledMouseX;
                dragMapY = scaledMouseY;
                
                        
                const col = Math.floor(adjustedMouseX / zoomTileWidth);
                const row = Math.floor(adjustedMouseY / zoomTileHeight);

                if (row >= 0 && row < gameMap.length && col >= 0 && col < gameMap[row].length) {
                    const clickedTile = gameMap[col][row];
                    // console.log('Adjusted mouse position:', adjustedMouseX, adjustedMouseY);
                    console.log('Clicked tile:', clickedTile, 'col:',  col, 'row:',  row);
                    
                    // You can do something with the clickedTile here, such as rotating it or modifying its state
                }
                
            }
            if (scaledMouseX > 50 && scaledMouseX < 50 + (allPlayersStats[currentPlayer].remainingMeeples * 25) && scaledMouseY > 700 && scaledMouseY < 700+80){
                console.log('mEEEPLE!');
                moveMeepleToggle = true;
                allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples - 1 >= 0) ? (allPlayersStats[currentPlayer].remainingMeeples - 1) : 0;
                dragMeepleX = scaledMouseX;
                dragMeepleY = scaledMouseY;
            }
            if (scaledMouseX > 50 && scaledMouseX < 50 + 160 && scaledMouseY > 762 && scaledMouseY < 762+50){
                console.log('end turn')
                oneTurn.turnOver = true;
                countPoints();
                switchTurns();
            }
            if (scaledMouseX > 780 && scaledMouseX < 780 + 220 && scaledMouseY > 100 && scaledMouseY < 100+55){
                newGame();
            }
        } 
        canvas.onmousedown = checkMouse;
        canvas.onmouseup = (e) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            const scaleX = canvas.width / canvasRect.width;
            const scaleY = canvas.height / canvasRect.height;
            const scaledMouseX = mouseX * scaleX;
            const scaledMouseY = mouseY * scaleY;
            const adjustedMouseX = scaledMouseX - gameBoardX + deltaDragX;
            const adjustedMouseY = scaledMouseY - gameBoardY + deltaDragY;
            const col = Math.floor(adjustedMouseX / zoomTileWidth);
            const row = Math.floor(adjustedMouseY / zoomTileHeight);
            if ( 
                oneTurn.placeTile &&
                moveTiletoggle && 
                row >= 0 && 
                row < gameMap.length && 
                col >= 0 && 
                col < gameMap[row].length &&
                scaledMouseX >= gameBoardX && 
                scaledMouseX <= (gameBoardX + gameBoardWidth) && 
                scaledMouseY >= gameBoardY && 
                scaledMouseY <= (gameBoardY + gameBoardHeight) &&
                checkAjecentTiles(col, row, drawNewTile) 
            ) {
                gameMap[col][row] = drawNewTile;
                lastTilePlayed = drawNewTile;
                
                drawNewTile = new Tile({
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
                updateConnections(col, row);
                updatePlayableTiles();
                updateUsedTiles();
                console.log({closed: finishedConnections});
                console.log({open: connectedTiles});
                oneTurn.placeTile = false;
                oneTurn.placeMeeple = true;
            }

            if ( 
                oneTurn.placeMeeple &&
                moveMeepleToggle && 
                row == usedTiles[usedTiles.length - 1].row && 
                col == usedTiles[usedTiles.length - 1].col && 
                scaledMouseX >= gameBoardX && 
                scaledMouseX <= (gameBoardX + gameBoardWidth) && 
                scaledMouseY >= gameBoardY && 
                scaledMouseY <= (gameBoardY + gameBoardHeight)
            ){ 
                console.log('MEEEE!');
                const tile: Tile = lastTilePlayed;
                const TileX = adjustedMouseX - (zoomTileWidth * col);
                const TileY = adjustedMouseY - (zoomTileHeight * row);
                console.log({tilex: TileX, tileY: TileY});

                if ( (TileX < zoomTileWidth * 0.66 ) && (TileX > zoomTileWidth * 0.33) && (TileY < zoomTileHeight * 0.66) && (TileY > zoomTileHeight * 0.33) ){
                    console.log('centre')
                    const claimed = claimConnection( 'centre', 'centre', {col: col, row: row});
                    if (claimed) {
                        const newMeeple = {col: adjustedMouseX, row: adjustedMouseY, color: user.color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                } else if ( (TileX > TileY) && (TileX < (zoomTileWidth - TileY))){
                    console.log('top', tile.connect[0]);
                    const claimed = claimConnection( tile.connect[0], 'top', {col: col, row: row});
                    if (claimed) {
                        const newMeeple = {col: adjustedMouseX, row: adjustedMouseY, color: user.color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                   
                } else if ( (TileX > TileY) && (TileX > (zoomTileWidth - TileY))){
                    console.log('right', tile.connect[1]);
                    const claimed = claimConnection( tile.connect[1], 'right', {col: col, row: row});
                    if (claimed) {
                        const newMeeple = {col: adjustedMouseX, row: adjustedMouseY, color: user.color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }

                } else if ( (TileX < TileY) && (TileX > (zoomTileWidth - TileY))){
                    console.log('bottom', tile.connect[2]);
                    const claimed = claimConnection( tile.connect[2], 'bottom', {col: col, row: row});
                    if (claimed) {
                        const newMeeple = {col: adjustedMouseX, row: adjustedMouseY, color: user.color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                } else if ( (TileX < TileY) && (TileY < (zoomTileHeight - TileX))){
                    console.log('left', tile.connect[3])
                    const claimed = claimConnection( tile.connect[3], 'left', {col: col, row: row});
                    if (claimed) {
                        const newMeeple = {col: adjustedMouseX, row: adjustedMouseY, color: user.color};
                        placedMeeples.push(newMeeple);
                        oneTurn.placeMeeple = false
                    } else {
                        allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
                    }
                }
                console.log(placedMeeples);
            }

            dragMap = false;
            moveTiletoggle = false;
            moveMeepleToggle = false;
            
            //allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples + 1 <= 7) ? (allPlayersStats[currentPlayer].remainingMeeples + 1) : 7;
            
        }
        canvas.onmousemove = (e) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;

            const scaleX = canvas.width / canvasRect.width;
            const scaleY = canvas.height / canvasRect.height;
            const scaledMouseX = mouseX * scaleX;
            const scaledMouseY = mouseY * scaleY;
            if (dragMap && scaledMouseX >= gameBoardX && scaledMouseX <= (gameBoardX + gameBoardWidth) && scaledMouseY >= gameBoardY && scaledMouseY <= (gameBoardY + gameBoardHeight)) {
                
                deltaDragX -= scaledMouseX - dragMapX;
                deltaDragY -= scaledMouseY - dragMapY;

                deltaDragX = Math.max(minDragX, Math.min(deltaDragX, maxDragX));
                deltaDragY = Math.max(minDragY, Math.min(deltaDragY, maxDragY));

                dragMapX = scaledMouseX;
                dragMapY = scaledMouseY;
                //console.log({x: deltaDragX, y: deltaDragY});
            }

            if ( moveTiletoggle ) {
                deltaDragTileX -= scaledMouseX - dragTileX;
                deltaDragTileY -= scaledMouseY - dragTileY;

                dragTileX = scaledMouseX;
                dragTileY = scaledMouseY;
            }
            if ( moveMeepleToggle ) {
                deltaDragMeepleX -= scaledMouseX - dragMeepleX;
                deltaDragMeepleY -= scaledMouseY - dragMeepleY;

                dragMeepleX = scaledMouseX;
                dragMeepleY = scaledMouseY;
            }
        }
        // canvas.onmouseout
        // canvas.addEventListener('wheel', function(e){
        //     if ( e.x > 320 && e.x < 1765 && e.y > 200 && e.y < 950) {
        //         if (e.deltaY < 0) {
        //             zoomFactor = 1.1;
        //         } else {
        //             zoomFactor = 0.9;
        //         }
        //         const mouseX = e.x ;
        //         const mouseY = e.y ;
        //         let scaleChangeY: number;
        //         let scaleChangeX: number;
        //         if ( zoomFactor >= minZoom && zoomFactor <= maxZoom){
        //             zoomTileWidth = tileWidth * zoomFactor;
        //             zoomTileHeight = tileHeight * zoomFactor;
        //             scaleChangeX = (mouseX - deltaDragX) * (zoomFactor - (zoomFactor - zoomSpeed));
        //             scaleChangeY = (mouseY - deltaDragY) * (zoomFactor - (zoomFactor - zoomSpeed));
        //             deltaDragX += scaleChangeX;
        //             deltaDragY += scaleChangeY;
        //         }
        //         e.preventDefault();
        //     }  
        // })
        //const mytesttile = allTiles[4]
        //const secondTile = new Tile(mytesttile);

        const makeTile = (id: number) => {
            // const tileID = Math.floor(Math.random() * allTiles.length) + 1;
            const tile = new Tile(allTiles[id]);
            tile.image = tilePath;
            return tile
        }
        const drawTile = (ctx: CanvasRenderingContext2D, id: number) => {
            const tile = makeTile(id);
            tile.draw(ctx, 50, 350, 240, 240)
        }
        
        const updateUsedTiles = (): void => {
            //console.log(gameMap);
            gameMap.forEach((row, colIndex) => {
                row.forEach((tile, rowIndex) => {
                    const tileCordinates = {col: colIndex, row: rowIndex};           
                    if (tile.image !== backsidePath && !usedTiles.some(t => t.col == colIndex && t.row == rowIndex)){
                        usedTiles.push(tileCordinates);
                    }
                });
            });
            //console.log(usedTiles);
            updatePlayableTiles();
        }
        const updatePlayableTiles = (): void => {
            playableTiles = [];
            usedTiles.forEach((tileCordinate) => {
                const col = tileCordinate.col;
                const row = tileCordinate.row;
                
                const checkAndAddPlayableTile = (colCheck: number, rowCheck: number ) => {
                    if (colCheck >= 0 && colCheck < gameMap.length && rowCheck >= 0 && rowCheck < gameMap[colCheck].length) {
                        if (gameMap[colCheck][rowCheck].image === backsidePath &&
                            !playableTiles.some(t => t.col === colCheck && t.row === rowCheck) &&
                            !usedTiles.some(t => t.col === colCheck && t.row === rowCheck)) {
                                if (playableTiles.length == 0) {
                                    playableTiles[0] = {col: colCheck, row: rowCheck};
                                } else {
                                    playableTiles.push({col: colCheck, row: rowCheck});
                                }
                        }
                    }
                };
                
                checkAndAddPlayableTile(col - 1, row);
                checkAndAddPlayableTile(col + 1, row);
                checkAndAddPlayableTile(col, row + 1);
                checkAndAddPlayableTile(col, row - 1);
            });
            //console.log({playableTiles : playableTiles});
            //console.log({usedTiles: usedTiles})
        }

        const checkAjecentTiles = (col:number, row:number, tile: Tile): boolean => {

            if (col < 0 || row < 0 || col >= gameMap.length || row >= gameMap[0].length) {
                return false;
            }
            // const tile = gameMap[col][row];

            const top = tile.connect[0];
            const right = tile.connect[1];
            const bottom = tile.connect[2];           
            const left = tile.connect[3];

            const checkRight = (col + 1 < gameMap.length) ? gameMap[col + 1][row].connect[3] : '';
            const checkBottom = (row + 1 < gameMap[0].length) ? gameMap[col][row + 1].connect[0] : '';
            const checkLeft = (col - 1 >= 0) ? gameMap[col - 1][row].connect[1] : '';
            const checkTop = (row - 1 >= 0) ? gameMap[col][row - 1].connect[2] : '';

            // console.log(`Tile Connections: tile: ${col}/${row} Top: ${top}, Right: ${right}, Bottom: ${bottom}, Left: ${left}`);
            // console.log(`Adjacent Checks: tile: ${col}/${row} Top: ${checkTop}, Right: ${checkRight}, Bottom: ${checkBottom}, Left: ${checkLeft}`);

            
            if ( 
                ( checkTop == top|| checkTop == '') &&
                ( checkRight ==  right || checkRight == '') &&
                ( checkBottom == bottom || checkBottom == '') &&
                ( checkLeft == left || checkLeft == '')
            ) {
                
                return true
            } else {
                return false
            }
        };
        // console.log(checkAjecentTiles(10, 10));
        const updateConnections = (col: number, row: number) => {
            console.log('updateconnect')
            const thisTile = gameMap[col][row];
            const directions = [
                {dx: 1, dy: 0, type: 3, direction: 'right'},   // Check right
                {dx: -1, dy: 0, type: 1, direction: 'left'},   // Check left
                {dx: 0, dy: 1, type: 0, direction: 'down'},    // Check down
                {dx: 0, dy: -1, type: 2, direction: 'up'}      // Check up
            ];

            directions.forEach(({dx, dy, type, direction}) => {
                const newCol = col + dx;
                const newRow = row + dy;

                if (newCol >= 0 && newCol < gameMap.length && newRow >= 0 && newRow < gameMap[newCol].length) {
                    const isAdjacentUsed = usedTiles.some(t => t.col === newCol && t.row === newRow);
                    const connections = connectedTiles;
                    if (isAdjacentUsed) {
                        const checkType = gameMap[newCol][newRow].connect[type];
                        console.log(direction);
                        checkConnections({col, row}, {col: newCol, row: newRow}, checkType, connections);
                        if ( checkType == 'R') {
                            connectRoads({col: col, row: row});
                            connectRoads({col: newCol, row: newRow});  
                        } ;
                        if ( checkType == 'C' ) {
                            connectCity({col: col, row: row});
                            connectCity({col: newCol, row: newRow});
                        };
                        
                    }
                }
            });
            closedConnections();
        }
        const checkConnections = (newTile: TileCordinates, checkTile: TileCordinates, type: string, connections: Array<Connection>) => {
            console.log({message: 'checkconnections', type: type});
            const newConnections: Connection[] = [];
            let nonAdded = true;
            if (type == 'R' && connections.length > 0){
                let connectionsChecked = 0;
                console.log('checking connect R');
                let connectionsNotAdded = 0;
                connections.forEach((connection) => { 
                    console.log('Checking', connection)
                    if (
                        nonAdded
                        && connection.type == type 
                        && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                    ) {
                        const compareConnect: string[] = gameMap[checkTile.col][checkTile.row].connect;
                        const typeNumber = compareConnect.filter((x) => {
                            return x == 'R';
                        })
                        console.log({typeNumber: typeNumber})
                        if (
                            typeNumber.length == 2  
                            && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row) 
                        ){
                            console.log('add connectopn newRoad')
                            connection.add(newTile);
                            nonAdded = false;
                        } else if (
                            typeNumber.length == 1
                            && connection.span.length == 1
                            && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)
                        ) {
                            console.log('add connectopn newRoad to a singel-Connection')
                            connection.add(newTile);
                            nonAdded = false;
                        } else {
                            connectionsNotAdded++;  
                        }
                        connectionsChecked++
                    } else if ( 
                        nonAdded
                        &&connection.type == type 
                        && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                        && connection.span.some(t => t.col == newTile.col && t.row == newTile.row) 
                    ) {
                        console.log('add connectopn checkRoad')
                        connection.add(checkTile);
                        nonAdded = false;
                    } else if ( 
                        nonAdded
                        && connection.type == type
                        && connectionsChecked == connectionsNotAdded 
                    ) {
                        console.log('all new connect Road')
                        console.log(connection);
                        const newConnection = new Connection({type: type, tile: newTile, user: ['no player'] });
                        newConnection.add(newTile);
                        newConnection.add(checkTile);
                        newConnections.push(newConnection);
                        nonAdded = false;
                    }   
                })  
                connectedTiles.push(...newConnections);
            } else if ( type == "C"  && connections.length > 0){
                console.log('checking connect C')
                let connectionsChecked = 0;
                let connectionsNotAdded = 0;
                connections.forEach((connection) => {
                    console.log('checking', connection)
                    const compareConnectNewTile: string[] = gameMap[newTile.col][newTile.row].connect;
                    const typeNumberNewTile = compareConnectNewTile.filter((x) => {
                        return x == 'C';
                    })
                    console.log({typeNumber: typeNumberNewTile});
                    const compareConnectcheckTile: string[] = gameMap[checkTile.col][checkTile.row].connect;
                    const typeNumberCheckTile = compareConnectcheckTile.filter((x) => {
                        return x == 'C';
                    })
                    console.log({typeNumber: typeNumberCheckTile});
                    if (
                        nonAdded
                        && connection.type == 'C' 
                        && connection.span.some(t => t.col == newTile.col && t.row ==newTile.row)
                    ) {
                        if (
                            typeNumberNewTile.length > 1  
                            && gameMap[newTile.col][newTile.row].cityConnect == true 
                            && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                        ){
                            console.log('add connection Checktile C:connect')
                            connection.add(checkTile);
                            nonAdded = false;
                        } else if ( 
                            typeNumberNewTile.length == 1 
                            && !connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                        ){
                            console.log('new connection Checktile oneWay')
                            const newConnection = new Connection({type: type, tile: newTile, user: ['no player'] });
                            newConnection.add(newTile);
                            newConnection.add(checkTile);
                            newConnections.push(newConnection)
                            nonAdded = false;
                        } else if (
                            typeNumberNewTile.length == 1
                            && connection.span.length == 1
                            && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                            && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)
                        ) {
                            console.log('add connectopn newRoad to a singel-Connection')
                            connection.add(newTile);
                            nonAdded = false;
                        } else {
                            connectionsNotAdded++;
                        }
                        connectionsChecked++;
                    } else if ( 
                        nonAdded
                        && connection.type == 'C'  
                        && connection.span.some(t => t.col == checkTile.col && t.row == checkTile.row)
                        && !connection.span.some(t => t.col == newTile.col && t.row ==newTile.row)
                    ) {
                        console.log('<-- YES!!')
                        if ( gameMap[checkTile.col][checkTile.row].cityConnect == true || typeNumberCheckTile.length == 1 ) {
                            console.log('add connection NewTile C:connect')
                            connection.add(newTile);
                            nonAdded = false;
                        }
                        
                    } else if ( 
                        nonAdded
                        && connection.type == type 
                        && connectionsChecked == connectionsNotAdded
                    ) {
                        console.log('all new connect')
                        const newConnection = new Connection({type: type, tile: newTile, user: ['no player'] });
                        newConnection.add(newTile);
                        newConnection.add(checkTile);
                        newConnections.push(newConnection)
                        nonAdded = false;
                    }
                }) 
                connectedTiles.push(...newConnections);
            }
             if ( connectedTiles.length < 1 || !connections.some(t => t.type == type) ) {
                console.log('newconnection', connectedTiles.length);
                const newConnection = new Connection({type: type, tile: newTile, user: ['no player'] });
                newConnection.add(checkTile);
                newConnection.add(newTile);
                console.log(newConnection);
                connectedTiles.push(newConnection); 
            }
        }

        const connectRoads = (newTile: TileCordinates) => {
            console.log('connectRoads');
            let connectionIndexes: number[] = [];
            let connectionNames: string[] = [];
            const toBeConnected: Connection[] = [];
            const newConnection: Connection = new Connection({ type: 'R', span: [], user: ['no player']});
            const gameTile = gameMap[newTile.col][newTile.row].connect;
            let tileRoads = 0;
            gameTile.forEach(element => {
                if ( element == 'R' ) {
                    tileRoads++
                }
            });
            console.log({tileRoads: tileRoads})
            connectedTiles.forEach((connection, index) => {
                console.log('checking connections R', connection)
                if ( 
                    connection.span.some(t => t.col == newTile.col && t.row == newTile.row) 
                    && tileRoads == 2
                    && connection.type == 'R'
                ) {
                    console.log('added toBeConnected');
                    toBeConnected.push(connection);
                    connectionNames = [...connection.user]
                    connectionIndexes.push(index);
                }
            })
            console.log({toBeConnected: toBeConnected})
            console.log({connectionIndexes: connectionIndexes})
            if ( connectionIndexes.length > 1) {
                console.log('connecting roads!', toBeConnected)
                toBeConnected.forEach((tile) => {
                    tile.span.forEach(element => {
                        if ( !newConnection.span.some(t => t.col == element.col && t.row == element.row)) {
                            newConnection.span.push(element);
                        }
                    });
                })
                connectionIndexes.sort((a, b) => b - a);
                connectionIndexes.forEach((id) => {
                    console.log(id)
                    connectedTiles.splice(id, 1);
                    const tempConnectedTiles = connectedTiles;
                    console.log('spliced!', tempConnectedTiles)
                })
                connectionNames.forEach((name) => {
                    if (name !== 'no player') {
                        newConnection.user.push(name);
                    }
                    
                })
                
                connectedTiles.push(newConnection)
            }
        }

        const connectCity = (newTile: TileCordinates) => {
            console.log('connectCity');
            let connectionIndexes: number[] = [];
            const toBeConnected: Connection[] = [];
            const newConnection: Connection = new Connection({ type: 'C', span: [], user: ['no player']});
            const gameTile = gameMap[newTile.col][newTile.row].connect;
            const cityConnect = gameMap[newTile.col][newTile.row].cityConnect;
            let tileCity = 0;
            gameTile.forEach(element => {
                if ( element == 'C' ) {
                    tileCity++
                }
            });
            console.log({tileCity: tileCity})
            connectedTiles.forEach((connection, index) => {
                console.log('checking connections C', connection)
                if ( 
                    connection.span.some(t => t.col == newTile.col && t.row == newTile.row) 
                    && tileCity > 1
                    && connection.type == 'C'
                    && cityConnect
                ) {
                    console.log('added toBeConnected');
                    toBeConnected.push(connection);
                    connectionIndexes.push(index);
                }
            })
            console.log({toBeConnected: toBeConnected})
            console.log({connectionIndexes: connectionIndexes})
            if ( connectionIndexes.length > 1) {
                console.log('connecting cities!', toBeConnected)
                toBeConnected.forEach((tile) => {
                    tile.span.forEach(element => {
                        if ( !newConnection.span.some(t => t.col == element.col && t.row == element.row)) {
                            newConnection.span.push(element);
                        }
                    });
                })
                connectionIndexes.sort((a, b) => b - a);
                connectionIndexes.forEach((id) => {
                    console.log(id)
                    connectedTiles.splice(id, 1);
                    const tempConnectedTiles = connectedTiles;
                    console.log('spliced!', tempConnectedTiles)
                })
                connectedTiles.push(newConnection)
            }
        }

        const closedConnections = () => {
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
                        && !finishedConnections.some(c => c == connection)) {
                        finishedConnections.push(connection);
                    }
                }
            })
        }

        const claimConnection = (type: string, direction:  'top' | 'left' | 'bottom' | 'right' | 'centre', tile: TileCordinates ): boolean => {
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
                connectedTiles.push(newConnection);
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
                        || (connection.type !== type)
                    ) {
                        console.log('new sigle connection with meeple')
                        const newConnection = new Connection({type: type, user: [user.name] });
                        newConnection.span.push({col: tile.col, row: tile.row})
                        connectedTiles.push(newConnection);
                        Claimed = true;
                    }    
                }   
            })
            console.log('Claimed', Claimed);
            return Claimed;
        }
        const switchTurns = () => {
            
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
        }
        const countPoints = () => {
            finishedConnections.forEach((connection) => {
                if ( connection.type == 'R' ){
                    let points = 0;
                    points = points + connection.span.length;
                    connection.user.forEach((user) => {
                        const player = allPlayersStats.find(p => p.name === user);
                        if (player) {
                            player.points = points;
                        }
                        console.log(player);
                    })
                } else if ( connection.type == 'C') {
                    let points = 0;
                    points = points + connection.span.length*2;
                    connection.span.forEach((cordinates) => {
                        if (gameMap[cordinates.col][cordinates.row].cityBadge == true){
                            points++
                        }
                    })
                    connection.user.forEach((user) => {
                        const player = allPlayersStats.find(p => p.name === user);
                        if (player) {
                            player.points = points;
                        }
                        console.log(player);
                    })
                }
            })
        }
        const newGame = () => {
            window.location.reload();
            // let completedTurns: Turn[] = [];
            // const players = 2;
            // let currentPlayer = 0;
        
            // let oneTurn = {
            //     player: avaliblePlayers[currentPlayer].name, 
            //     turn: 1,
            //     drawTile: true,
            //     placeTile: false,
            //     placeMeeple: false,
            //     turnOver: false
            // }
            // let user = avaliblePlayers[currentPlayer];
            // let gamePoints: number = 0;
            // let gameTurn: number = 1;
            // const allPlayersStats: {name: string, remainingMeeples: number, color: string, points: number}[] = []; 
            // for ( let i = 0; i < players; i++) {
            //     const player = {
            //         name: user.name,
            //         remainingMeeples: 7,
            //         color: user.color,
            //         points: 0
            //     }
            //     allPlayersStats.push(player);
            // }
            // for ( let i = 0; i < gameBoardTiles; i++ ){
            //     if (gameMap.length < gameBoardTiles) {
            //     gameMap.push([]) 
            //     }
            //     for (let j = 0; j < gameBoardTiles; j++){
            //         const empltyTile = new Tile({
            //             image: backsidePath, 
            //             width: 224, 
            //             height: 224, 
            //             imageStartX: 0,
            //             imageStartY: 0,
            //             connections: ['', '', '', ''],
            //             monastery: false,
            //             badge: false,
            //             cityConnect: false,
            //             roadConnect: false
            //         })
            //         gameMap[i].push(empltyTile);
            //     }
            // }
            // placedMeeples = [];
            // connectedTiles = [];
            // finishedConnections = [];
            // dragMapX = 0;
            // dragMapY = 0;
            // deltaDragX = gameMap[0].length * tileWidth * 0.3;
            // deltaDragY = gameMap.length * tileHeight * 0.4;
            // playableTiles = [];
            // usedTiles = [];
        }

        function animate() {
            
                // Create the ui
            if (ctx){
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.drawImage(LOGO, 40, 0, CANVAS_WIDTH * 0.36 , (CANVAS_WIDTH * 0.36) * (LOGO.height / LOGO.width));
                ctx.font = '40px serif';
                const newGame = ctx.fillText('New Game', 800, 140, 200);
                ctx.strokeRect(780, 100, 220, 55);
                const leaderBoard = ctx.fillText('Leaderboard', 1100, 140, 200);
                ctx.strokeRect(1080, 100, 240, 55);
                const onlinePlay = ctx.fillText('Play Online', 1400, 140, 200);
                ctx.strokeRect(1380, 100, 230, 55);
                const userName = ctx.fillText(`Username: ${user.name}`, 50, 250, 240);
                const drawTileText = ctx.fillText('Draw Tile', 55 , 310, 140);
                ctx.strokeRect(50, 270, 150, 50);
                const rotateTileText = ctx.fillText('rotate', 205, 310, 100);  
                ctx.strokeRect(200, 270, 100, 50);
                ctx.strokeRect(50, 350, 240, 240);
                //ctx.fillStyle = 'rgba(217, 217, 217, 1)';
                const remainingMeeples = ctx.fillText('remaining meeples', 50, 650, 240);
                const endTurnText = ctx.fillText('End Turn', 50, 800, 240);
                ctx.strokeRect(50, 762, 160, 50);
                const TurnText = ctx.fillText( `Turn: ${gameTurn}`, 50, 850, 240);
                const PointsText = ctx.fillText(`Points: ${allPlayersStats[currentPlayer].points}`, 50, 900, 240);
                const GameBoard = ctx.fillRect( 320, 200, 1445, 750);

                const drawMeeple = () => {
                    ctx.save(); 
                    for (let i = 0; i < allPlayersStats[currentPlayer].remainingMeeples; i++){
                        ctx.drawImage(meepleImage, 0 + (meepleSize*playerColors.indexOf(user.color)), 0, meepleSize, meepleSize, 50 + (i * 25), 675, meepleSize, meepleSize);
                    }
                    ctx.restore();
                }
                
                const drawGameBoard = () => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(gameBoardX, gameBoardY, gameBoardWidth, gameBoardHeight); 
                    ctx.clip(); 
                    gameMap.forEach((row, colIndex) => {
                        row.forEach((tile, rowIndex) => {                   
                            const tileX = gameBoardX + (zoomTileWidth * colIndex) - deltaDragX ; 
                            const tileY = gameBoardY + (zoomTileHeight * rowIndex) - deltaDragY;
                            tile.draw(ctx, tileX, tileY, zoomTileHeight, zoomTileWidth);
                        });
                    });
                    placedMeeples.forEach((m) => {
                        const tileX = gameBoardX + (m.col - meepleSize/2) - deltaDragX ; 
                        const tileY = gameBoardY + (m.row - meepleSize/2) - deltaDragY;
                        ctx.drawImage(meepleImage, 0 + (meepleSize*playerColors.indexOf(m.color)), 0, meepleSize, meepleSize, tileX, tileY, meepleSize*0.7, meepleSize*0.7 )
                    })
                    ctx.restore();
                    ctx.strokeRect(gameBoardX, gameBoardY, gameBoardWidth, gameBoardHeight);
                }
                const drawPlayableTiles = () => {

                    playableTiles.forEach((tile) => {
                        const tileX = gameBoardX + (zoomTileWidth * tile.col) - deltaDragX ; 
                        const tileY = gameBoardY + (zoomTileHeight * tile.row) - deltaDragY;
                        let strokeColor = 'black'
                        ctx.save();
                        ctx.clip();
                        ctx.lineWidth = playableTilesBorderWidth;
                        if ( moveTiletoggle ) {
                            if (checkAjecentTiles(tile.col, tile.row, drawNewTile)) {
                                strokeColor = 'red';
                            }  
                        }
                        ctx.strokeStyle = strokeColor;
                        ctx.strokeRect(tileX - playableTilesBorderWidth/2 , tileY - playableTilesBorderWidth/2, zoomTileHeight + playableTilesBorderWidth/2, zoomTileWidth + playableTilesBorderWidth/2);
                        ctx.restore();
                    })
                        
                }
                gameMap[10][10] = makeTile(12);


                drawGameBoard(); 
                drawMeeple();
                drawPlayableTiles();
                if ( moveTiletoggle ) {
                    const tileX = dragTileX  - tileWidth/2 ; 
                    const tileY = dragTileY - tileHeight/2;
                    drawNewTile.draw(ctx, tileX, tileY, tileWidth*0.9, tileHeight*0.9 )
                } else {
                    drawNewTile.draw(ctx, 50, 350, 240, 240);
                }
                if (moveMeepleToggle){
                    const dragMeepleSize = meepleSize * 0.7;
                    const MeepleX = dragMeepleX - dragMeepleSize/2;
                    const MeepleY = dragMeepleY - dragMeepleSize/2;
                    ctx.drawImage(meepleImage, 0 + (80*playerColors.indexOf(user.color)), 0, 80, 80, MeepleX, MeepleY, dragMeepleSize, dragMeepleSize)
                }
                
            };
            requestAnimationFrame(animate);
        }
        animate();
    }
}
