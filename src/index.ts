// import { Tile } from './data/classes/tile';
// import { Direction } from './data/types/connections';
console.log('Hello');
const canvas = document.getElementById('canvasMain') as HTMLCanvasElement | null;
if (canvas) {
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const CANVAS_WIDTH: number = canvas.width = 1808;
    const CANVAS_HEIGHT: number = canvas.height = 980;
    const LOGO = new Image;
    LOGO.src = '../assets/Carcassonne-logo.png'
    const gamePoints: number = 0;
    const gameTurn: number = 1;


    class Tile {
        image: any
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

    const rectagle = new Image();
    rectagle.src = '../assets/Demo_Spiel_C2_Feature_Start_Tile.png'
    const firstTile = new Tile(rectagle, 500, 500, ['F', 'R', 'R', 'S'], false, false, false);

    function animate() {
        
        if (ctx){
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            firstTile.draw(ctx);
            
            ctx.drawImage(LOGO, 40, 0, CANVAS_WIDTH * 0.36 , (CANVAS_WIDTH * 0.36) * (LOGO.height / LOGO.width));
            ctx.font = '40px serif';
            const newGame = ctx.fillText('New Game', 800, 140, 200);
            const leaderBoard = ctx.fillText('Leaderboard', 1100, 140, 200);
            const onlinePlay = ctx.fillText('Play Online', 1400, 140, 200);
            const userName = ctx.fillText('Username', 90, 300, 200);
            ctx.fillRect(50, 350, 240, 240);
            ctx.fillStyle = 'rgba(217, 217, 217, 1)';
            const remainingMeeples = ctx.fillText('remaining meeples', 50, 650, 240);
            const Turn = ctx.fillText( `Turn: ${gameTurn}`, 50, 650, 240);
            const Points = ctx.fillText(`Points: ${gamePoints}`, 50, 650, 240);

        }
        
        requestAnimationFrame(animate);
    }
    animate();
}
