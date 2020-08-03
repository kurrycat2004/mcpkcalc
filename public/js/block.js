class Block {
    constructor(x, y, z, sizeX, sizeY, sizeZ) {
        this.pos = createVector(x, y, z);
        this.size = createVector(sizeX, sizeY != undefined ? sizeY : sizeX, sizeZ != undefined ? sizeZ : sizeX);
    }

    show(threeD = false) {
        if (threeD) {
            push();
            stroke(0);
            fill(255);
            translate(this.pos.x * blockSize + this.size.x * blockSize / 2, this.pos.y * blockSize + this.size.y * blockSize / 2, this.pos.z * blockSize + this.size.z * blockSize / 2);
            box(this.size.x * blockSize, this.size.y * blockSize, this.size.z * blockSize);
            pop();
        } else {
            stroke(0);
            fill(255);
            rect(this.pos.z * blockSize, this.pos.y * blockSize, this.size.z * blockSize, this.size.y * blockSize);
        }
    }
}