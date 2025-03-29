import { drawFilledRect } from "./drawFilledRect.js";
/*
*
*
*
*   Draw the EndMenu to show the player points and give a option to play again.
*
*
*
*
*/
export const drawEndMenu = (ctx, allPlayersStats, clickableElements) => {
    ctx.font = '80px serif';
    ctx.fillRect(604, 90, 600, 800);
    ctx.fillStyle = 'rgba(0, 204, 156, 1)';
    ctx.strokeRect(604, 90, 600, 800);
    ctx.strokeText('Game End', 740, 190, 400);
    ctx.font = '20px serif';
    ctx.strokeText('How many points did you get?', 624 + 160, 90 + 150, 300);
    drawFilledRect(ctx, clickableElements[0].color, 704, 690, 400, 100);
    ctx.font = '60px serif';
    drawFilledRect(ctx, allPlayersStats[0].color, 704, 305, 400, 75);
    ctx.strokeText(allPlayersStats[0].name, 804, 360, 400);
    ctx.strokeText(`Points: ${allPlayersStats[0].points}`, 704, 435, 400);
    drawFilledRect(ctx, allPlayersStats[1].color, 704, 505, 400, 75);
    ctx.strokeText(allPlayersStats[1].name, 804, 560, 400);
    ctx.strokeText(`Points: ${allPlayersStats[1].points}`, 704, 635, 400);
    ctx.strokeText('New Game', 764, 760, 400);
};
