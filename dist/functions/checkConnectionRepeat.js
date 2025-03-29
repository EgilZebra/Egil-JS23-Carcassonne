/*
*
*
*
*   Check so that the list of connections does not include repeats.
*   And then check to se if any connection fully contains another.
*   In both cases, remove the unwanted enries.
*
*
*/
export const checkConnectionRepeat = (connectedTiles) => {
    console.log('checkConnectionRepeat!');
    let tempConnectedTiles = [...connectedTiles];
    const uniqueConnections = new Set();
    console.log(tempConnectedTiles);
    let newConnectedTiles = tempConnectedTiles.filter((connection, index) => {
        const connectionKey = JSON.stringify(connection);
        if (uniqueConnections.has(connectionKey)) {
            return false;
        }
        else {
            uniqueConnections.add(connectionKey);
            return true;
        }
    });
    newConnectedTiles = newConnectedTiles.filter((connection, index, array) => {
        return !array.some((otherConnection, otherIndex) => {
            if (index !== otherIndex) {
                return connection.contains(otherConnection);
            }
            return false;
        });
    });
    return newConnectedTiles;
};
