import { Tile } from "../../data/classes/tile.js";
import { TileCordinates } from "../../data/types/tileCordinates.js";

// Draw a border around the tiles that are adjecent to the ones allready in play.
export const drawPlayableTiles = ( 
    ctx: CanvasRenderingContext2D, 
    playableTiles: TileCordinates[], 
    GameBoardSize: { x: number, y: number, width: number, height: number }, 
    playableTilesBorderWidth: number, 
    drawNewTile: Tile,
    zoomTileHeight: number,
    zoomTileWidth: number,
    moveTiletoggle: boolean,
    checkAjecentTiles: Function,
    deltaDragX: number,
    deltaDragY: number,
    gameMap: Tile[][]
) => {
    playableTiles.forEach((tile) => {
        const tileX = GameBoardSize.x + (zoomTileWidth * tile.col) - deltaDragX ; 
        const tileY = GameBoardSize.y + (zoomTileHeight * tile.row) - deltaDragY;
        let strokeColor = 'black'
        ctx.save();
        ctx.clip();
        ctx.lineWidth = playableTilesBorderWidth;
        if ( moveTiletoggle ) {
            if (checkAjecentTiles(tile.col, tile.row, drawNewTile, gameMap)) {
                strokeColor = 'red';
            }  
        }
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(tileX - playableTilesBorderWidth/2 , tileY - playableTilesBorderWidth/2, zoomTileHeight + playableTilesBorderWidth/2, zoomTileWidth + playableTilesBorderWidth/2);
        ctx.restore();
    })    
}