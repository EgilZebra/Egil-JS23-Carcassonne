
const tilespaceX = 218;
const tilespaceY = 265;
interface TileOptions {
    image: string;
    width: number;
    height: number;
    imageStartX: number;
    imageStartY: number;
    connections: string[];
    monastery: boolean;
    badge: boolean;
    cityConnect: boolean;
    roadConnect: boolean
}

export const allTiles: TileOptions[] = [{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 0),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'C', 'C', 'C'],
                monastery: false,
                badge: true,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 1),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'C', 'R', 'C'],
                monastery: false,
                badge: true,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 2),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'C', 'F', 'C'],
                monastery: false,
                badge: true,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 3),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'C', 'F', 'F'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 4),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'C', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 5),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'F', 'C', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 6),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'F', 'F', 'C'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 7),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['F', 'C', 'F', 'C'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 8),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'F', 'F', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 9),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'F', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 10),
                imageStartY: 128 + (tilespaceY * 0),
                connections: ['C', 'R', 'R', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 0),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['C', 'R', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 1),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['C', 'R', 'F', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 2),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'F', 'F', 'F'],
                monastery: true,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 3),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'F', 'R', 'F'],
                monastery: true,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 4),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['R', 'F', 'R', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 5),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'F', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 6),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['R', 'R', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 7),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'R', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 8),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'R', 'R', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 9),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['R', 'C', 'R', 'C'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 10),
                imageStartY: 128 + (tilespaceY * 1),
                connections: ['F', 'C', 'R', 'C'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 0),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'C', 'C', 'C'],
                monastery: true,
                badge: true,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 1),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['R', 'R', 'R', 'R'],
                monastery: true,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 2),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'R', 'C', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 3),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'R', 'R', 'C'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: true
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 4),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'C', 'C', 'C'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 5),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['F', 'F', 'R', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 6),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['F', 'F', 'C', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 7),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['F', 'F', 'R', 'F'],
                monastery: false,
                badge: false,
                cityConnect: true,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 8),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'F', 'F', 'R'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 9),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'R', 'F', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },{
                image: '../../../assets/tiles.png', 
                width: 200,
                height: 200,
                imageStartX: 120 + (tilespaceX * 10),
                imageStartY: 128 + (tilespaceY * 2),
                connections: ['C', 'F', 'R', 'F'],
                monastery: false,
                badge: false,
                cityConnect: false,
                roadConnect: false
            },
        ];