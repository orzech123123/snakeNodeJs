export class Update {
    public Points : Array<Point> = [];
}

export class Point {
    private x : number;
    private y : number;

    constructor(x : number, y : number) {
        this.y = y;
        this.x = x;
    }

    public X: number;
    public Y: number;
}