class Block {
    constructor(x, y, z, sizeX, sizeY, sizeZ, type) {
        this.pos = createVector(x, y, z);
        this.size = createVector(sizeX, sizeY != undefined ? sizeY : sizeX, sizeZ != undefined ? sizeZ : sizeX);
        this.type = type;
    }

    static groundRow() {
        let b = [];
        for (let i = 0; i < blockCount; i++) { b.push(new Block(0, -4, i, 1, 1, 1, BlockType.types.b)) }
        return b;
    }

    static fromBlocksString(original) {
        let errorChar = -1;
        let bs = [];
        let parts = original.split(/(?<=\))(?=\()/);
        for (let p in parts) {
            let part = parts[p];
            let m;
            if ((m = part.match(/^\((?<blockType>[a-zA-Z]*)(:(?<orientation>[ZX]([+-])?))?;\[(?<x>-?\d+),(?<y>-?\d+),(?<z>-?\d+)\]\)$/)) != null) {
                let o = m.groups.orientation || "0";

                let b = m.groups.blockType.toLowerCase();
                if (BlockType.replacements[b] != undefined) b = BlockType.replacements[b];
                if (!Object.keys(BlockType.types).includes(b)) {
                    errorChar = parts.slice(0, p).join("").length;
                    break;
                }

                b = new BlockType(b, o);
                let bOff = b.coords;
                let bSize = b.size;

                let x = parseFloat(m.groups.x) + bOff.x, y = parseFloat(m.groups.y) + bOff.y, z = parseFloat(m.groups.z) + bOff.z;
                bs.push(new Block(x, y, z, bSize.x, bSize.y, bSize.z, b.blockType));
            } else {
                errorChar = parts.slice(0, p).join("").length;
            }
        }
        if (errorChar == -1)
            return bs;
        else return errorChar;
    }

    show(threeD = false) {
        if (threeD) {
            push();
            translate(this.pos.x * blockSize + this.size.x * blockSize / 2, (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize, this.pos.z * blockSize + this.size.z * blockSize / 2);
            if (this.type && this.type.texture) {
                noStroke();
                noFill();
                push();
                rectMode(CENTER);

                //TOP
                texture(this.type.texture.top);
                translate(0, -this.size.y * blockSize / 2, 0);
                rotateX(HALF_PI);
                rect(0, 0, this.size.x * blockSize, this.size.z * blockSize);
                rotateX(-HALF_PI);

                //BOTTOM
                translate(0, this.size.y * blockSize, 0);
                rotateX(-HALF_PI);
                texture(this.type.texture.bottom);
                rect(0, 0, this.size.x * blockSize, this.size.z * blockSize);
                rotateX(HALF_PI);
                translate(0, -this.size.y * blockSize / 2, 0);

                //LEFT
                texture(this.type.texture.left);
                translate(0, 0, -this.size.z * blockSize / 2);
                rect(0, 0, this.size.x * blockSize, this.size.y * blockSize);

                //RIGHT
                texture(this.type.texture.right);
                translate(0, 0, this.size.z * blockSize);
                rect(0, 0, this.size.x * blockSize, this.size.y * blockSize);
                translate(0, 0, -this.size.z * blockSize / 2);

                //FRONT
                texture(this.type.texture.front);
                translate(-this.size.x * blockSize / 2, 0, 0);
                rotateY(HALF_PI);
                rect(0, 0, this.size.y * blockSize, this.size.z * blockSize);
                rotateY(-HALF_PI);
                translate(this.size.x * blockSize / 2, 0, 0);

                //BACK
                texture(this.type.texture.back);
                translate(this.size.x * blockSize / 2, 0, 0);
                rotateY(-HALF_PI);
                rect(0, 0, this.size.y * blockSize, this.size.z * blockSize);
                rotateY(HALF_PI);
                translate(-this.size.x * blockSize / 2, 0, 0);

                pop();
            } else {
                stroke(0);
                fill(255);
                box(this.size.x * blockSize, this.size.y * blockSize, this.size.z * blockSize);
            }
            pop();
        } else {
            stroke(0);
            fill(255);
            rect(this.pos.z * blockSize, this.pos.y * blockSize, this.size.z * blockSize, this.size.y * blockSize);
        }
    }
}