/*
*
*
*
*   Claculate the mouseplacement on the gameMap based on location and drag.
*   Also factor in the scale.
*   
*
*
*
*/

export const mousePlacement = ( e: MouseEvent, canvas: HTMLCanvasElement, gameBoardX: number, deltaDragX: number, gameBoardY: number, deltaDragY: number ) => {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    const scaledX = mouseX * scaleX;
    const scaledY = mouseY * scaleY;
    const adjustedX = scaledX - gameBoardX + deltaDragX;
    const adjustedY = scaledY - gameBoardY + deltaDragY;

    const mouse = {
        adjustedX: adjustedX,
        adjustedY: adjustedY,
        scaledX: scaledX,
        scaledY: scaledY
    }

    return mouse
}