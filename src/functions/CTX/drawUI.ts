import { drawFilledRect } from "./drawFilledRect.js";

// Draw the basic UI of the game.
export const drawUI = (ctx: CanvasRenderingContext2D, LOGO: HTMLImageElement, height: number, width: number, turn: number, points: number, name: string, clickableElements: { name: string, color: string }[]) => {

    ctx.save();
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(LOGO, 40, 0, width * 0.36 , (width * 0.36) * (LOGO.height / LOGO.width));
    ctx.font = '40px serif';    

    drawFilledRect(ctx, clickableElements[1].color ,780, 100, 220, 55);
    ctx.fillText('New Game', 800, 140, 200);

    drawFilledRect(ctx, 'rgba(207, 24, 31, 1)', 1080, 100, 240, 55);
    ctx.fillText('Leaderboard', 1100, 140, 200);

    drawFilledRect(ctx, 'rgba(207, 24, 31, 1)', 1380, 100, 230, 55);
    ctx.fillText('Play Online', 1400, 140, 200);

    ctx.fillText(`Username: ${name}`, 50, 250, 240);

    drawFilledRect(ctx, clickableElements[2].color ,50, 270, 150, 50); 
    ctx.fillText('Draw Tile', 55 , 310, 140);

    drawFilledRect(ctx, clickableElements[3].color ,200, 270, 100, 50);
    ctx.fillText('rotate', 205, 310, 100);  

    ctx.strokeRect(50, 350, 240, 240);
    ctx.fillText('remaining meeples', 50, 650, 240);

    drawFilledRect(ctx, clickableElements[4].color ,50, 762, 160, 50);
    ctx.fillText('End Turn', 50, 800, 240);

    ctx.fillText( `Turn: ${turn}`, 50, 850, 240);

    ctx.fillText(`Points: ${points}`, 50, 900, 240);

    ctx.fillRect( 320, 200, 1445, 750);

    ctx.restore();
}