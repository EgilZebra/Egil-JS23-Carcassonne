export class Turn {
    constructor(player, turn, drawTile, TileDrawn, placeTile, TilePlace, placeMeeple, MeeplePlaced, endTurn) {
        this.player = player;
        this.turn = turn;
        this.drawTile = drawTile;
        this.TileDrawn = TileDrawn;
        this.placeTile = placeTile;
        this.TilePlace = TilePlace;
        this.placeMeeple = placeMeeple;
        this.MeeplePlaced = MeeplePlaced;
        this.endTurn = endTurn;
    }
    ;
}
