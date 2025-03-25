import { TileCordinates } from "../types/tileCordinates";

export class Connection {
    type: string
    span: Array<TileCordinates>
    user: string[]
    constructor({
        type,
        span = [],
        user
    }: any ){
        this.type = type;
        this.span = span;
        this.user = user
    }
    add(tile: TileCordinates){
        this.span.push(tile);
    }
};