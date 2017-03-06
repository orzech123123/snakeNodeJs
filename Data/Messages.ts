export class Update {
    public Width : number;
    public Height : number;
    public Snakes: Array<SnakeDto> = [];
    public Cookies: Array<Point> = [];
}

export class SnakeDto
{
    constructor(points: Array<Point>, id: string) {
        this.Points = points;
        this.Id = id;
    }

    public Points: Array<Point>;
    public Id : string;
}

export class Point {
    public X : number;
    public Y : number;

    constructor(x : number, y : number) {
        this.X = x;
        this.Y = y;
    }
}