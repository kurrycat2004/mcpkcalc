class Block {
    constructor(x, y, z, sizeX, sizeY, sizeZ) {
        this.pos = createVector(x, y, z);
        this.size = createVector(sizeX, sizeY != undefined ? sizeY : sizeX, sizeZ != undefined ? sizeZ : sizeX);
    }

    static groundRow() {
        let b = [];
        for (let i = 0; i < blockCount; i++) { b.push(new Block(0, -4, i, 1)) }
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
                if(!Object.keys(BlockType.types).includes(b)){
                    errorChar = parts.slice(0, p).join("").length;
                    break;
                }

                b = new BlockType(b, o);
                let bOff = b.coords;
                let bSize = b.size;

                let x = parseFloat(m.groups.x) + bOff.x, y = parseFloat(m.groups.y) + bOff.y, z = parseFloat(m.groups.z) + bOff.z;
                bs.push(new Block(x, y, z, bSize.x, bSize.y, bSize.z));
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
            stroke(0);
            fill(255);
            translate(this.pos.x * blockSize + this.size.x * blockSize / 2, (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize, this.pos.z * blockSize + this.size.z * blockSize / 2);
            box(this.size.x * blockSize, this.size.y * blockSize, this.size.z * blockSize);
            pop();
        } else {
            stroke(0);
            fill(255);
            rect(this.pos.z * blockSize, this.pos.y * blockSize, this.size.z * blockSize, this.size.y * blockSize);
        }
    }
}