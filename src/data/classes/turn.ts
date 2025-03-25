import { Tile } from "./tile";
import { TileCordinates } from '../types/tileCordinates'

export class Turn {
    player: string
    turn: number
    drawTile: boolean
    TileDrawn: Tile
    placeTile: boolean
    TilePlace: TileCordinates
    placeMeeple: boolean
    MeeplePlaced: any
    endTurn: boolean
    constructor(
        player: string,
        turn: number,
        drawTile: boolean,
        TileDrawn: Tile,
        placeTile: boolean,
        TilePlace: TileCordinates,
        placeMeeple: boolean,
        MeeplePlaced: any,
        endTurn: boolean,
    ){
        this.player = player
        this.turn = turn
        this.drawTile = drawTile
        this.TileDrawn = TileDrawn
        this.placeTile = placeTile
        this.TilePlace = TilePlace
        this.placeMeeple = placeMeeple
        this.MeeplePlaced = MeeplePlaced
        this.endTurn = endTurn
    };
}