"use strict";
// export const checkMouse = (e: MouseEvent, canvas: HTMLCanvasElement, gameBoardX: number, gameBoardY: number, deltaDragX: number, deltaDragY: number, moveTiletoggle: boolean,  ) => {
//             const canvasRect = canvas.getBoundingClientRect();
//             const mouseX = e.clientX - canvasRect.left;
//             const mouseY = e.clientY - canvasRect.top;
//             const scaleX = canvas.width / canvasRect.width;
//             const scaleY = canvas.height / canvasRect.height;
//             const scaledMouseX = mouseX * scaleX;
//             const scaledMouseY = mouseY * scaleY;
//             const adjustedMouseX = scaledMouseX - gameBoardX + deltaDragX;
//             const adjustedMouseY = scaledMouseY - gameBoardY + deltaDragY;
//             // click on drawnTile
//             if ( scaledMouseX > 50 && scaledMouseX < 50+240 && scaledMouseY > 350 && scaledMouseY < 350+240 ){
//                 moveTiletoggle = true;
//                 dragTileX = scaledMouseX;
//                 dragTileY = scaledMouseY;
//             }
//             // click on Rotate
//             if ( scaledMouseX > 200 && scaledMouseX < 200+100 && scaledMouseY > 270 && scaledMouseY < 270+50 ){
//                 drawNewTile.rotate();
//             }
//             // click on Draw Tile
//             if ( oneTurn.drawTile && scaledMouseX > 50 && scaledMouseX < 50+150 && scaledMouseY > 270 && scaledMouseY < 270+50){
//                 console.log('draw tile');
//                 drawTileNumber = Math.floor(Math.random() * allTiles.length);
//                 drawNewTile = makeTile(drawTileNumber);
//                 updateUsedTiles();
//                 updatePlayableTiles();
//                 oneTurn.drawTile = false;
//                 oneTurn.placeTile = true;
//             }
//             if (scaledMouseX >= gameBoardX && scaledMouseX <= (gameBoardX + gameBoardWidth) && scaledMouseY >= gameBoardY && scaledMouseY <= (gameBoardY + gameBoardHeight)) {
//                 dragMap = true;
//                 dragMapX = scaledMouseX;
//                 dragMapY = scaledMouseY;                       
//                 const col = Math.floor(adjustedMouseX / zoomTileWidth);
//                 const row = Math.floor(adjustedMouseY / zoomTileHeight);
//                 if (row >= 0 && row < gameMap.length && col >= 0 && col < gameMap[row].length) {
//                     const clickedTile = gameMap[col][row];
//                     console.log('Clicked tile:', clickedTile, 'col:',  col, 'row:',  row);
//                 }
//             }
//             if ( oneTurn.placeMeeple && scaledMouseX > 50 && scaledMouseX < 50 + (allPlayersStats[currentPlayer].remainingMeeples * 25) && scaledMouseY > 700 && scaledMouseY < 700+80){
//                 console.log('mEEEPLE!');
//                 moveMeepleToggle = true;
//                 allPlayersStats[currentPlayer].remainingMeeples = (allPlayersStats[currentPlayer].remainingMeeples - 1 >= 0) ? (allPlayersStats[currentPlayer].remainingMeeples - 1) : 0;
//                 dragMeepleX = scaledMouseX;
//                 dragMeepleY = scaledMouseY;
//             }
//             if (scaledMouseX > 50 && scaledMouseX < 50 + 160 && scaledMouseY > 762 && scaledMouseY < 762+50){
//                 console.log('end turn')
//                 oneTurn.turnOver = true;
//                 countPoints();
//                 switchTurns();
//             }
//             if (scaledMouseX > 780 && scaledMouseX < 780 + 220 && scaledMouseY > 100 && scaledMouseY < 100+55){
//                 newGame();
//             }
//         } 
