export class Tile {
    constructor(image, x, y, connections, monastery, badge, cityConnect) {
        this.image = image,
            this.width = 145,
            this.height = 145,
            this.x = x,
            this.y = y,
            this.connect = connections,
            this.monastery = monastery,
            this.cityBadge = badge,
            this.cityConnect = cityConnect;
    }
    update() {
        const firstDirection = this.connect.shift();
        if (firstDirection !== undefined) {
            this.connect.push(firstDirection);
        }
        ;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
