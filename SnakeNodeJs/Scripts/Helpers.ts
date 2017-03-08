import * as messages from "../../Data/Messages";

export class MathHelper {
    public static RandomIntInc(low: number, high: number) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
}

export class CollisionHelper {
    public static CollisionPoints(firstSet: Array<messages.Point>, secondSet: Array<messages.Point>): Array<messages.Point> {
        for (let first of firstSet) {
            for (let second of secondSet) {
                if (first.X == second.X && first.Y == second.Y)
                    return [first, second];
            }
        }

        return [];
    }
}

