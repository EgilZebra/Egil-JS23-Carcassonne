// Draw the remaining meeples
export const drawMeeples = (ctx, remaining, color, img, meepleSize) => {
    ctx.save();
    for (let i = 0; i < remaining; i++) {
        ctx.drawImage(img, 0 + (meepleSize * color), 0, meepleSize, meepleSize, 50 + (i * 25), 675, meepleSize, meepleSize);
    }
    ctx.restore();
};
