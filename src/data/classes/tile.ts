import { Direction } from "../types/connections"

export class Tile {
    image: ImageBitmap
    width: number
    height: number
    x: number
    y: number
    connect: string[]
    monastery: boolean
    cityBadge: boolean
    cityConnect: boolean
    constructor(
            image: any, 
            x: number, 
            y: number,
            connections: string[],
            monastery: boolean,
            badge: boolean,
            cityConnect: boolean,
        ){
            this.image = image,
            this.width = 145,
            this.height = 145,
            this.x = x,
            this.y = y,
            this.connect = connections,
            this.monastery = monastery,
            this.cityBadge = badge,
            this.cityConnect = cityConnect
    }
    update(){
        const firstDirection: string | undefined = this.connect.shift();
        if (firstDirection !== undefined) {
            this.connect.push(firstDirection);
        };
    }
    draw(ctx: CanvasRenderingContext2D){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}