export class Connection {
    constructor({ type, span = [], user }) {
        this.type = type;
        this.span = span;
        this.user = user;
    }
    add(tile) {
        this.span.push(tile);
    }
    contains(otherConnection) {
        return otherConnection.span.every(tile => this.span.some(existingTile => existingTile.col === tile.col && existingTile.row === tile.row));
    }
}
;
