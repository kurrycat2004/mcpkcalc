class Block {
    constructor(x, y, sizeX, sizeY) {
        this.pos = createVector(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY != undefined ? sizeY : sizeX;
    }

    show() {
        stroke(0);
        fill(255);
        rect(this.pos.x * blockSize, this.pos.y * blockSize, this.sizeX * blockSize, this.sizeY * blockSize);
    }
}