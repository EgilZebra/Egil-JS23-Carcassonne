// Draw a simple rectangle filled with a given color.

export const drawFilledRect = (ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number ) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h); 
    ctx.clip(); 
    ctx.fillStyle = color;
    ctx.fillRect( x, y, w, h);
    ctx.restore();
    ctx.strokeRect( x, y, w, h);
}