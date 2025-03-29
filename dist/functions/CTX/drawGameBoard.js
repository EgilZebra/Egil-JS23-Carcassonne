// Generate the Gameboard.
export const drawGameBoard = (ctx, gameMap, placedMeeples, Gameboard, zoomTileWidth, zoomTileHeight, deltaDragX, deltaDragY, MeepleInfo) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(Gameboard.x, Gameboard.y, Gameboard.width, Gameboard.height);
    ctx.clip();
    gameMap.forEach((row, colIndex) => {
        row.forEach((tile, rowIndex) => {
            const tileX = Gameboard.x + (zoomTileWidth * colIndex) - deltaDragX;
            const tileY = Gameboard.y + (zoomTileHeight * rowIndex) - deltaDragY;
            tile.draw(ctx, tileX, tileY, zoomTileHeight, zoomTileWidth);
        });
    });
    placedMeeples.forEach((m) => {
        const tileX = Gameboard.x + (m.col - MeepleInfo.Size / 2) - deltaDragX;
        const tileY = Gameboard.y + (m.row - MeepleInfo.Size / 2) - deltaDragY;
        ctx.drawImage(MeepleInfo.Image, 0 + (MeepleInfo.Size * MeepleInfo.colors.indexOf(m.color)), 0, MeepleInfo.Size, MeepleInfo.Size, tileX, tileY, MeepleInfo.Size * 0.7, MeepleInfo.Size * 0.7);
    });
    ctx.restore();
    ctx.strokeRect(Gameboard.x, Gameboard.y, Gameboard.width, Gameboard.height);
};
