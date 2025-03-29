import { drawFilledRect } from "./drawFilledRect.js";

// Draw the startmeny, where it's possible to pick colors for the players.
export const drawStartMenu = (ctx: CanvasRenderingContext2D, allPlayersStats: {name: string, remainingMeeples: number, color: string, points: number}[], clickableElements: { name: string, color: string }[]  ) => {
    ctx.font = '80px serif';
    ctx.fillRect(604, 90, 600, 800);
    ctx.fillStyle = 'rgba(0, 204, 156, 1)';
    ctx.strokeRect(604, 90, 600, 800);
    ctx.strokeText('Carcassonne', 704, 190, 400);
    ctx.font = '20px serif';
    ctx.strokeText('The classic boardgame now online', 604+160, 90+150, 300);
    drawFilledRect( ctx, allPlayersStats[0].color, 704, 305, 400, 75)
        drawFilledRect(ctx, 'rgba(0, 100, 164, 1)', 704, 380, 80, 75);
        drawFilledRect(ctx, 'rgba(0, 141, 65, 1)', 684+100, 90+290, 80, 75);
        drawFilledRect(ctx, 'rgba(223, 194, 20, 1)', 764+100, 90+290, 80, 75);
        drawFilledRect(ctx, 'rgba(207, 24, 31, 1)', 844+100, 90+290, 80, 75);
        drawFilledRect(ctx, 'rgba(57, 56, 58, 1)', 924+100, 90+290, 80, 75);
    drawFilledRect( ctx, allPlayersStats[1].color, 704, 505, 400, 75)
        drawFilledRect(ctx, 'rgba(0, 100, 164, 1)',704, 90+490, 80, 75);
        drawFilledRect(ctx, 'rgba(0, 141, 65, 1)', 684+100, 90+490, 80, 75);
        drawFilledRect(ctx, 'rgba(223, 194, 20, 1)', 764+100, 90+490, 80, 75);
        drawFilledRect(ctx, 'rgba(207, 24, 31, 1)', 844+100, 90+490, 80, 75);
        drawFilledRect(ctx, 'rgba(57, 56, 58, 1)', 924+100, 90+490, 80, 75);
    drawFilledRect(ctx, clickableElements[0].color, 704, 690, 400, 100);
    ctx.font = '60px serif';
    ctx.strokeText(allPlayersStats[0].name, 804, 360, 400);
    ctx.strokeText(allPlayersStats[1].name, 804, 560, 400);
    ctx.strokeText('Start Game', 764, 760, 400);
} 