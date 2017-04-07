export class MessageTypes {
    public static get Connect(): string { return "connect"; }
    public static get Disconnect(): string { return "disconnect"; } 
    public static get Connection(): string { return "connection"; } 

    public static get Update(): string { return "update"; }
    public static get UpdateAck(): string { return "updateAck"; } 

    public static get ChangeDirection(): string { return "changeDirection"; } 
}