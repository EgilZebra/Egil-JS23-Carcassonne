export const drawPlayableTiles = (ctx, playableTiles, GameBoardSize, playableTilesBorderWidth, drawNewTile, zoomTileHeight, zoomTileWidth, moveTiletoggle, checkAjecentTiles, deltaDragX, deltaDragY, gameMap) => {
    playableTiles.forEach((tile) => {
        const tileX = GameBoardSize.x + (zoomTileWidth * tile.col) - deltaDragX;
        const tileY = GameBoardSize.y + (zoomTileHeight * tile.row) - deltaDragY;
        let strokeColor = 'black';
        ctx.save();
        ctx.clip();
        ctx.lineWidth = playableTilesBorderWidth;
        if (moveTiletoggle) {
            if (checkAjecentTiles(tile.col, tile.row, drawNewTile, gameMap)) {
                strokeColor = 'red';
            }
        }
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(tileX - playableTilesBorderWidth / 2, tileY - playableTilesBorderWidth / 2, zoomTileHeight + playableTilesBorderWidth / 2, zoomTileWidth + playableTilesBorderWidth / 2);
        ctx.restore();
    });
};
