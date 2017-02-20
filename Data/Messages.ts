export class Update {
    public Width : number;
    public Height : number;
    public Points : Array<Point> = [];
}

export class Point {
    public X : number;
    public Y : number;

    constructor(x : number, y : number) {
        this.X = y;
        this.Y = x;
    }
}