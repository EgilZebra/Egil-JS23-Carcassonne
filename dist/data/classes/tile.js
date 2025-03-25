export class Tile {
    constructor({ image, width, height, imageStartX, imageStartY, connections, monastery, badge, cityConnect, roadConnect }) {
        this.image = image,
            this.width = width,
            this.height = height,
            this.imageStartX = imageStartX,
            this.imageStartY = imageStartY,
            this.connect = connections,
            this.monastery = monastery,
            this.cityBadge = badge,
            this.cityConnect = cityConnect,
            this.roadConnect = roadConnect;
        this.rotationAngle = 0,
            this.img = new Image(),
            this.img.src = this.image;
    }
    update() {
    }
    draw(ctx, dx, dy, dWidth, dHeight) {
        ctx.save();
        ctx.translate(dx + dWidth / 2, dy + dHeight / 2);
        ctx.rotate((this.rotationAngle * Math.PI) / 180);
        ctx.drawImage(this.img, this.imageStartX, this.imageStartY, this.width, this.height, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
        ctx.restore();
    }
    rotate() {
        this.rotationAngle += 90;
        const lastDirection = this.connect.pop();
        if (lastDirection !== undefined) {
            this.connect.unshift(lastDirection);
        }
        ;
    }
}
