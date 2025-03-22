// import { Tile } from './data/classes/tile';
// import { Direction } from './data/types/connections';
import { allTiles } from "./data/tiles/tiles.js";
console.log('Hello');
const canvas = document.getElementById('canvasMain');
if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        const CANVAS_WIDTH = canvas.width = 1808;
        const CANVAS_HEIGHT = canvas.height = 980;
        const LOGO = new Image;
        LOGO.src = '../assets/Carcassonne-logo.png';
        const gamePoints = 0;
        const gameTurn = 1;
        // const LOGOPath: string = '../assets/Carcassonne-logo.png'
        const tilePath = '../assets/tiles.png';
        const backsidePath = '../assets/backside.jpg';
        const meeplesPath = '../assets/meeples.png';
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
        let playableTiles = [];
        const usedTiles = [];
        let moveTiletoggle = false;
        let dragTileX = 0;
        let deltaDragTileX = 0;
        let dragTileY = 0;
        let deltaDragTileY = 0;
        let moveMeepleToggle = false;
        let dragMeepleX = 0;
        let deltaDragMeepleX = 0;
        let dragMeepleY = 0;
        let deltaDragMeepleY = 0;
        const meepleSize = 80;
        const playerColors = [
            'blue',
            'green',
            'yellow',
            'red',
            'black',
        ];
        const userColor = playerColors[0];
        const maxMeeples = 7;
        let MeeplesLeft = 7;
        let connectedTiles = [];
        let finishedConnections = [];
        class Tile {
            constructor({ image, width, height, imageStartX, imageStartY, connections, monastery, badge, cityConnect, }) {
                this.image = image,
                    this.width = width,
                    this.height = height,
                    this.imageStartX = imageStartX,
                    this.imageStartY = imageStartY,
                    this.connect = connections,
                    this.monastery = monastery,
                    this.cityBadge = badge,
                    this.cityConnect = cityConnect,
                    this.rotationAngle = 0,
                    this.img = new Image(),
                    this.img.src = this.image;
            }
            update() {
            }
            draw(ctx, dx, dy, dWidth, dHeight) {
                ctx.save();
                ctx.translate(dx + dWidth / 2, dy + dHeight / 2);
                ctx.rotate((this.rotationAngle * Math.PI) / 180);
                ctx.drawImage(this.img, this.imageStartX, this.imageStartY, this.width, this.height, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
                ctx.restore();
            }
            rotate() {
                this.rotationAngle += 90;
                const lastDirection = this.connect.pop();
                if (lastDirection !== undefined) {
                    this.connect.unshift(lastDirection);
                }
                ;
            }
        }
        class Connection {
            constructor({ type, span = [], user }) {
                this.type = type;
                this.span = span;
                this.user = user;
            }
            add(tile) {
                this.span.push(tile);
            }
        }
        const firstTile = new Tile({
            image: tilePath,
            width: 200,
            height: 200,
            imageStartX: 120 + (200 + 18),
            imageStartY: 128 + (200 + 65),
            connections: ['', '', '', ''],
            monastery: false,
            badge: false,
            cityConnect: false
        });
        let gameMap = [[]];
        for (let i = 0; i < gameBoardTiles; i++) {
            if (gameMap.length < gameBoardTiles) {
                gameMap.push([]);
            }
            for (let j = 0; j < gameBoardTiles; j++) {
                const empltyTile = new Tile({
                    image: backsidePath,
                    width: 224,
                    height: 224,
                    imageStartX: 0,
                    imageStartY: 0,
                    connections: ['', '', '', ''],
                    monastery: false,
                    badge: false,
                    cityConnect: false
                });
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
        let drawTileNumber = 0;
        let lastTilePlayed;
        let drawNewTile = new Tile({
            image: backsidePath,
            width: 224,
            height: 224,
            imageStartX: 0,
            imageStartY: 0,
            connections: ['', '', '', ''],
            monastery: false,
            badge: false,
            cityConnect: false
        });
        //console.log(gameMap.length, gameMap[0].length)
        const checkMouse = (e) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            const scaleX = canvas.width / canvasRect.width;
            const scaleY = canvas.height / canvasRect.height;
            const scaledMouseX = mouseX * scaleX;
            const scaledMouseY = mouseY * scaleY;
            const adjustedMouseX = scaledMouseX - gameBoardX + deltaDragX;
            const adjustedMouseY = scaledMouseY - gameBoardY + deltaDragY;
            // console.log('Canvas position:', scaledMouseX, scaledMouseY);
            // console.log('Adjusted Mouse Position:', adjustedMouseX, adjustedMouseY);
            // console.log('Drag Offsets:', deltaDragX, deltaDragY);
            // click on drawnTile
            if (scaledMouseX > 50 && scaledMouseX < 50 + 240 && scaledMouseY > 350 && scaledMouseY < 350 + 240) {
                console.log('clicked inside');
                console.log(drawNewTile.connect);
                moveTiletoggle = true;
                dragTileX = scaledMouseX;
                dragTileY = scaledMouseY;
            }
            // click on Rotate
            if (scaledMouseX > 200 && scaledMouseX < 200 + 100 && scaledMouseY > 270 && scaledMouseY < 270 + 50) {
                drawNewTile.rotate();
            }
            // click on Draw Tile
            if (scaledMouseX > 50 && scaledMouseX < 50 + 150 && scaledMouseY > 270 && scaledMouseY < 270 + 50) {
                console.log('draw tile');
                drawTileNumber = Math.floor(Math.random() * allTiles.length);
                drawNewTile = makeTile(drawTileNumber);
                updateUsedTiles();
                updatePlayableTiles();
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
                    console.log('Clicked tile:', clickedTile, 'col:', col, 'row:', row);
                    // You can do something with the clickedTile here, such as rotating it or modifying its state
                }
            }
            if (scaledMouseX > 50 && scaledMouseX < 50 + (MeeplesLeft * 25) && scaledMouseY > 700 && scaledMouseY < 700 + 80) {
                console.log('mEEEPLE!');
                moveMeepleToggle = true;
                MeeplesLeft = (MeeplesLeft - 1 >= 0) ? (MeeplesLeft - 1) : 0;
                dragMeepleX = scaledMouseX;
                dragMeepleY = scaledMouseY;
            }
        };
        // window.addEventListener('click', function(e){
        //     checkMouse(e);
        // });
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
            if (moveTiletoggle &&
                row >= 0 &&
                row < gameMap.length &&
                col >= 0 &&
                col < gameMap[row].length &&
                scaledMouseX >= gameBoardX &&
                scaledMouseX <= (gameBoardX + gameBoardWidth) &&
                scaledMouseY >= gameBoardY &&
                scaledMouseY <= (gameBoardY + gameBoardHeight) &&
                checkAjecentTiles(col, row, drawNewTile)) {
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
                    cityConnect: false
                });
                updateConnections(col, row);
                updatePlayableTiles();
                updateUsedTiles();
                console.log({ closed: finishedConnections });
                console.log({ open: connectedTiles });
            }
            if (moveMeepleToggle &&
                row == usedTiles[usedTiles.length - 1].row &&
                col == usedTiles[usedTiles.length - 1].col &&
                scaledMouseX >= gameBoardX &&
                scaledMouseX <= (gameBoardX + gameBoardWidth) &&
                scaledMouseY >= gameBoardY &&
                scaledMouseY <= (gameBoardY + gameBoardHeight)) {
                console.log('MEEEE!');
                const tile = lastTilePlayed;
                const TileX = adjustedMouseX - (zoomTileWidth * col);
                const TileY = adjustedMouseY - (zoomTileHeight * row);
                console.log({ tilex: TileX, tileY: TileY });
                if ((TileX < zoomTileWidth * 0.66) && (TileX > zoomTileWidth * 0.33) && (TileY < zoomTileHeight * 0.66) && (TileY > zoomTileHeight * 0.33)) {
                    console.log('centre');
                }
                else if ((TileX > TileY) && (TileX < (zoomTileWidth - TileY))) {
                    console.log('top', tile.connect[0]);
                }
                else if ((TileX > TileY) && (TileX > (zoomTileWidth - TileY))) {
                    console.log('right', tile.connect[1]);
                }
                else if ((TileX < TileY) && (TileX > (zoomTileWidth - TileY))) {
                    console.log('bottom', tile.connect[2]);
                }
                else if ((TileX < TileY) && (TileY < (zoomTileHeight - TileX))) {
                    console.log('left', tile.connect[3]);
                }
            }
            dragMap = false;
            moveTiletoggle = false;
            moveMeepleToggle = false;
            MeeplesLeft = (MeeplesLeft + 1 <= 7) ? (MeeplesLeft + 1) : 7;
        };
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
            if (moveTiletoggle) {
                deltaDragTileX -= scaledMouseX - dragTileX;
                deltaDragTileY -= scaledMouseY - dragTileY;
                dragTileX = scaledMouseX;
                dragTileY = scaledMouseY;
            }
            if (moveMeepleToggle) {
                deltaDragMeepleX -= scaledMouseX - dragMeepleX;
                deltaDragMeepleY -= scaledMouseY - dragMeepleY;
                dragMeepleX = scaledMouseX;
                dragMeepleY = scaledMouseY;
            }
        };
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
        const makeTile = (id) => {
            // const tileID = Math.floor(Math.random() * allTiles.length) + 1;
            const tile = new Tile(allTiles[id]);
            return tile;
        };
        const drawTile = (ctx, id) => {
            const tile = makeTile(id);
            tile.draw(ctx, 50, 350, 240, 240);
        };
        const updateUsedTiles = () => {
            console.log(gameMap);
            gameMap.forEach((row, colIndex) => {
                row.forEach((tile, rowIndex) => {
                    const tileCordinates = { col: colIndex, row: rowIndex };
                    if (tile.image !== backsidePath && !usedTiles.some(t => t.col == colIndex && t.row == rowIndex)) {
                        usedTiles.push(tileCordinates);
                    }
                });
            });
            console.log(usedTiles);
            updatePlayableTiles();
        };
        const updatePlayableTiles = () => {
            playableTiles = [];
            usedTiles.forEach((tileCordinate) => {
                const col = tileCordinate.col;
                const row = tileCordinate.row;
                const checkAndAddPlayableTile = (colCheck, rowCheck) => {
                    if (colCheck >= 0 && colCheck < gameMap.length && rowCheck >= 0 && rowCheck < gameMap[colCheck].length) {
                        if (gameMap[colCheck][rowCheck].image === backsidePath &&
                            !playableTiles.some(t => t.col === colCheck && t.row === rowCheck) &&
                            !usedTiles.some(t => t.col === colCheck && t.row === rowCheck)) {
                            if (playableTiles.length == 0) {
                                playableTiles[0] = { col: colCheck, row: rowCheck };
                            }
                            else {
                                playableTiles.push({ col: colCheck, row: rowCheck });
                            }
                        }
                    }
                };
                checkAndAddPlayableTile(col - 1, row);
                checkAndAddPlayableTile(col + 1, row);
                checkAndAddPlayableTile(col, row + 1);
                checkAndAddPlayableTile(col, row - 1);
            });
            console.log({ playableTiles: playableTiles });
            console.log({ usedTiles: usedTiles });
        };
        const checkAjecentTiles = (col, row, tile) => {
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
            if ((checkTop == top || checkTop == '') &&
                (checkRight == right || checkRight == '') &&
                (checkBottom == bottom || checkBottom == '') &&
                (checkLeft == left || checkLeft == '')) {
                return true;
            }
            else {
                return false;
            }
        };
        // console.log(checkAjecentTiles(10, 10));
        const updateConnections = (col, row) => {
            console.log('updateconnect');
            const thisTile = gameMap[col][row];
            const directions = [
                { dx: 1, dy: 0, type: 3, direction: 'right' }, // Check right
                { dx: -1, dy: 0, type: 1, direction: 'left' }, // Check left
                { dx: 0, dy: 1, type: 0, direction: 'down' }, // Check down
                { dx: 0, dy: -1, type: 2, direction: 'up' } // Check up
            ];
            directions.forEach(({ dx, dy, type, direction }) => {
                const newCol = col + dx;
                const newRow = row + dy;
                if (newCol >= 0 && newCol < gameMap.length && newRow >= 0 && newRow < gameMap[newCol].length) {
                    const isAdjacentUsed = usedTiles.some(t => t.col === newCol && t.row === newRow);
                    const connections = connectedTiles;
                    if (isAdjacentUsed) {
                        const checkType = gameMap[newCol][newRow].connect[type];
                        console.log(direction);
                        checkConnections({ col, row }, { col: newCol, row: newRow }, checkType, connections);
                    }
                }
            });
            // if ( usedTiles.some(t => t.col == (col +1) &&  t.row == row) ){
            //     const checkType = gameMap[col +1][row].connect[3]
            //     console.log('right')
            //     checkConnections({col: col, row: row}, {col: col+1, row: row}, checkType)
            // }
            // if ( usedTiles.some(t => t.col == (col -1) &&  t.row == row) ){
            //     const checkType = gameMap[col -1][row].connect[1]
            //     console.log('left')
            //     checkConnections({col: col, row: row}, {col: col -1, row: row}, checkType)
            // }
            // if ( usedTiles.some(t => t.col == col &&  t.row == (row +1))){
            //     const checkType = gameMap[col][row +1].connect[0]
            //     console.log('down')
            //     checkConnections({col: col, row: row}, {col: col, row: row +1}, checkType)
            // }
            // if ( usedTiles.some(t => t.col == col &&  t.row == (row -1)) ){
            //     const checkType = gameMap[col][row -1].connect[2]
            //     console.log('up')
            //     checkConnections({col: col, row: row}, {col: col, row: row -1}, checkType)
            // }
            //closedConnections();
        };
        const checkConnections = (newTile, checkTile, type, connections) => {
            console.log({ message: 'checkconnections', type: type });
            const newConnections = [];
            if (type == 'R' && connections.length > 0) {
                connections.forEach((connection) => {
                    if (connection.type == type && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                        const compareConnect = gameMap[checkTile.col][checkTile.row].connect;
                        const typeNumber = compareConnect.filter((x) => {
                            return x == 'R';
                        });
                        console.log({ typeNumber: typeNumber });
                        if (typeNumber.length == 2 && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                            console.log('add connectopn');
                            connection.add(newTile);
                        }
                        else {
                            const newConnection = new Connection({ type: type, tile: newTile, user: 'player' });
                            console.log('new connectopn');
                            newConnection.add(checkTile);
                            newConnection.add(newTile);
                            newConnections.push(newConnection);
                        }
                    }
                    else {
                        console.log('all new connect');
                        console.log(connection);
                        const newConnection = new Connection({ type: type, tile: newTile, user: 'player' });
                        newConnection.add(newTile);
                        newConnection.add(checkTile);
                        newConnections.push(newConnection);
                    }
                });
                connectedTiles.push(...newConnections);
            }
            else if (type == "C" && connections.length > 0) {
                connections.forEach((connection) => {
                    if (connection.type == 'C' && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                        const compareConnect = gameMap[checkTile.col][checkTile.row].connect;
                        const typeNumber = compareConnect.filter((x) => {
                            return x == 'C';
                        });
                        if (typeNumber.length > 1 && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row) && gameMap[checkTile.col][checkTile.row].cityConnect == true) {
                            console.log('add connectopn');
                            connection.add(newTile);
                        }
                        else if (typeNumber.length == 1 && !connection.span.some(t => t.col == newTile.col && t.row == newTile.row)) {
                            console.log('add connectopn');
                            connection.add(newTile);
                        }
                        else {
                            console.log('new connectopn');
                            const newConnection = new Connection({ type: type, tile: newTile, user: 'player' });
                            newConnection.add(checkTile);
                            newConnection.add(newTile);
                            newConnections.push(newConnection);
                        }
                    }
                    else {
                        console.log('all new connect');
                        const newConnection = new Connection({ type: type, tile: newTile, user: 'player' });
                        newConnection.add(newTile);
                        newConnection.add(checkTile);
                        newConnections.push(newConnection);
                    }
                });
                connectedTiles.push(...newConnections);
            }
            else if (connectedTiles.length < 1 || !connections.some(t => t.type == type)) {
                console.log('newconnection', connectedTiles.length);
                const newConnection = new Connection({ type: type, tile: newTile, user: 'player' });
                newConnection.add(checkTile);
                newConnection.add(newTile);
                console.log(newConnection);
                connectedTiles.push(newConnection);
            }
            closedConnections();
        };
        const closedConnections = () => {
            console.log('closedConnections');
            connectedTiles.forEach((connection) => {
                if (connection.type == 'R') {
                    let singelRoadTiles = 0;
                    connection.span.forEach((tile) => {
                        const connections = gameMap[tile.col][tile.row].connect;
                        let types = 0;
                        connections.forEach((type) => { if (type == "R") {
                            types++;
                        } });
                        if (types == 1) {
                            singelRoadTiles++;
                            console.log(singelRoadTiles);
                        }
                        ;
                    });
                    if (singelRoadTiles == 2 && !finishedConnections.includes(connection)) {
                        finishedConnections.push(connection);
                    }
                }
                else if (connection.type == 'C') {
                    let singelRoadTiles = 0;
                    connection.span.forEach((tile) => {
                        const connections = gameMap[tile.col][tile.row].connect;
                        let types = 0;
                        connections.forEach((type) => { if (type == "R") {
                            types++;
                        } });
                        if (types == 1) {
                            singelRoadTiles++;
                        }
                        ;
                    });
                    if (singelRoadTiles == 2 && !finishedConnections.includes(connection)) {
                        finishedConnections.push(connection);
                    }
                }
            });
        };
        function animate() {
            // Create the ui
            if (ctx) {
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.drawImage(LOGO, 40, 0, CANVAS_WIDTH * 0.36, (CANVAS_WIDTH * 0.36) * (LOGO.height / LOGO.width));
                ctx.font = '40px serif';
                const newGame = ctx.fillText('New Game', 800, 140, 200);
                ctx.strokeRect(780, 100, 220, 55);
                const leaderBoard = ctx.fillText('Leaderboard', 1100, 140, 200);
                ctx.strokeRect(1080, 100, 240, 55);
                const onlinePlay = ctx.fillText('Play Online', 1400, 140, 200);
                ctx.strokeRect(1380, 100, 230, 55);
                const userName = ctx.fillText('Username:', 90, 250, 200);
                const drawTileText = ctx.fillText('Draw Tile', 55, 310, 140);
                ctx.strokeRect(50, 270, 150, 50);
                const rotateTileText = ctx.fillText('rotate', 205, 310, 100);
                ctx.strokeRect(200, 270, 100, 50);
                ctx.strokeRect(50, 350, 240, 240);
                //ctx.fillStyle = 'rgba(217, 217, 217, 1)';
                const remainingMeeples = ctx.fillText('remaining meeples', 50, 650, 240);
                const Turn = ctx.fillText(`Turn: ${gameTurn}`, 50, 850, 240);
                const Points = ctx.fillText(`Points: ${gamePoints}`, 50, 900, 240);
                const GameBoard = ctx.fillRect(320, 200, 1445, 750);
                const drawMeeple = () => {
                    const meepleImage = new Image();
                    meepleImage.src = meeplesPath;
                    ctx.save();
                    //ctx.clip();
                    for (let i = 0; i < MeeplesLeft; i++) {
                        ctx.drawImage(meepleImage, 0 + (80 * playerColors.indexOf(userColor)), 0, 80, 80, 50 + (i * 25), 700, 80, 80);
                    }
                    ctx.restore();
                };
                const drawGameBoard = () => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(gameBoardX, gameBoardY, gameBoardWidth, gameBoardHeight);
                    ctx.clip();
                    gameMap.forEach((row, colIndex) => {
                        row.forEach((tile, rowIndex) => {
                            const tileX = gameBoardX + (zoomTileWidth * colIndex) - deltaDragX;
                            const tileY = gameBoardY + (zoomTileHeight * rowIndex) - deltaDragY;
                            tile.draw(ctx, tileX, tileY, zoomTileHeight, zoomTileWidth);
                        });
                    });
                    ctx.restore();
                    ctx.strokeRect(gameBoardX, gameBoardY, gameBoardWidth, gameBoardHeight);
                };
                const drawPlayableTiles = () => {
                    playableTiles.forEach((tile) => {
                        const tileX = gameBoardX + (zoomTileWidth * tile.col) - deltaDragX;
                        const tileY = gameBoardY + (zoomTileHeight * tile.row) - deltaDragY;
                        let strokeColor = 'black';
                        ctx.save();
                        ctx.clip();
                        ctx.lineWidth = playableTilesBorderWidth;
                        if (moveTiletoggle) {
                            if (checkAjecentTiles(tile.col, tile.row, drawNewTile)) {
                                strokeColor = 'red';
                            }
                        }
                        ctx.strokeStyle = strokeColor;
                        ctx.strokeRect(tileX - playableTilesBorderWidth / 2, tileY - playableTilesBorderWidth / 2, zoomTileHeight + playableTilesBorderWidth / 2, zoomTileWidth + playableTilesBorderWidth / 2);
                        ctx.restore();
                    });
                };
                gameMap[10][10] = makeTile(12);
                // gameMap[11][10] = makeTile(11);
                // gameMap[12][10] = makeTile(16);
                drawGameBoard();
                drawMeeple();
                drawPlayableTiles();
                if (moveTiletoggle) {
                    const tileX = dragTileX - tileWidth / 2;
                    const tileY = dragTileY - tileHeight / 2;
                    drawNewTile.draw(ctx, tileX, tileY, tileWidth * 0.9, tileHeight * 0.9);
                }
                else {
                    drawNewTile.draw(ctx, 50, 350, 240, 240);
                }
                if (moveMeepleToggle) {
                    const dragMeepleSize = meepleSize * 0.7;
                    const meepleImage = new Image();
                    meepleImage.src = meeplesPath;
                    const MeepleX = dragMeepleX - dragMeepleSize / 2;
                    const MeepleY = dragMeepleY - dragMeepleSize / 2;
                    ctx.drawImage(meepleImage, 0 + (80 * playerColors.indexOf(userColor)), 0, 80, 80, MeepleX, MeepleY, dragMeepleSize, dragMeepleSize);
                }
            }
            ;
            requestAnimationFrame(animate);
        }
        animate();
    }
}
