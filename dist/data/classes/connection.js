export class Connection {
    constructor({ type, span = [], user }) {
        this.type = type;
        this.span = span;
        this.user = user;
    }
    add(tile) {
        this.span.push(tile);
    }
}
;
