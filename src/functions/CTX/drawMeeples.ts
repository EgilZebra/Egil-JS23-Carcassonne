// Draw the remaining meeples
export const drawMeeples = ( ctx: CanvasRenderingContext2D, remaining: number, color: number, img: HTMLImageElement, meepleSize: number ) => {
    ctx.save(); 
    for (let i = 0; i < remaining; i++){
        ctx.drawImage(img, 0 + (meepleSize*color), 0, meepleSize, meepleSize, 50 + (i * 25), 675, meepleSize, meepleSize);
    }
    ctx.restore();
}