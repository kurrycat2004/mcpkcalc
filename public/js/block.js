class Block {
    constructor(x, y, z, sizeX, sizeY, sizeZ, b) {
        this.pos = createVector(x, y, z);
        this.size = createVector(sizeX, sizeY != undefined ? sizeY : sizeX, sizeZ != undefined ? sizeZ : sizeX);
        this.type = b.blockType;
        this.blockType = b;
    }

    static groundRow() {
        let b = [];
        for (let i = 0; i < blockCount; i++) { b.push(new Block(0, -4, i, 1, 1, 1, BlockType.types.b)) }
        return b;
    }

    static fromBlocksString(original) {
        let errorChar = -1;
        let bs = [];
        let parts = original.split(/(?=\()/);
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
                let blo = new Block(x, y, z, bSize.x, bSize.y, bSize.z, b);
                //blo.size = blo.type.size;
                console.log(blo.size)
                bs.push(blo);
            } else {
                errorChar = parts.slice(0, p).join("").length;
            }
        }
        if (errorChar == -1)
            return bs;
        else return errorChar;
    }

    _TextureTop() {
        push();
        texture(this.type.texture.top);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize - this.size.y * blockSize / 2,
            this.pos.z * blockSize + this.size.z * blockSize / 2
        );
        rotateX(HALF_PI);
        rect(0, 0, this.size.x * blockSize, this.size.z * blockSize);
        pop();
    }

    _TextureBottom() {
        push();
        texture(this.type.texture.bottom);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize + this.size.y * blockSize / 2,
            this.pos.z * blockSize + this.size.z * blockSize / 2
        );
        rotateX(-HALF_PI);
        rect(0, 0, this.size.x * blockSize, this.size.z * blockSize);
        pop();
    }

    _TextureLeft() {
        push();
        texture(this.type.texture.left);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
            this.pos.z * blockSize + this.size.z * blockSize / 2 - this.size.z * blockSize / 2
        );
        rect(0, 0, this.size.x * blockSize, this.size.y * blockSize);
        pop();
    }

    _TextureRight() {
        push();
        texture(this.type.texture.right);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
            this.pos.z * blockSize + this.size.z * blockSize / 2 + this.size.z * blockSize / 2
        );
        rect(0, 0, this.size.x * blockSize, this.size.y * blockSize);
        pop();
    }

    _TextureFront() {
        push();
        texture(this.type.texture.front);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2 - this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
            this.pos.z * blockSize + this.size.z * blockSize / 2
        );
        rotateY(HALF_PI);
        rect(0, 0, this.size.z * blockSize, this.size.y * blockSize);
        pop();
    }

    _TextureBack() {
        push();
        texture(this.type.texture.back);
        translate(
            this.pos.x * blockSize + this.size.x * blockSize / 2 + this.size.x * blockSize / 2,
            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
            this.pos.z * blockSize + this.size.z * blockSize / 2
        );
        rotateY(-HALF_PI);
        rect(0, 0, this.size.z * blockSize, this.size.y * blockSize);
        pop();
    }

    show(threeD = false) {
        if (threeD) {

            if (this.type && this.type.texture) {
                strokeWeight(0.1);
                stroke(0);
                fill(0);
                rectMode(CENTER);

                let x = this.pos.x * blockSize + this.size.x * blockSize / 2 - player.camPos.x;
                let y = (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize - player.camPos.y;
                let z = this.pos.z * blockSize + this.size.z * blockSize / 2 - player.camPos.z;

                let functions = {
                    front: {
                        f: this._TextureFront.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2 - this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
                            this.pos.z * blockSize + this.size.z * blockSize / 2
                        )
                    },
                    back: {
                        f: this._TextureBack.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2 + this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
                            this.pos.z * blockSize + this.size.z * blockSize / 2
                        )
                    },
                    top: {
                        f: this._TextureTop.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize - this.size.y * blockSize / 2,
                            this.pos.z * blockSize + this.size.z * blockSize / 2
                        )
                    },
                    bottom: {
                        f: this._TextureBottom.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize + this.size.y * blockSize / 2,
                            this.pos.z * blockSize + this.size.z * blockSize / 2
                        )
                    },
                    left: {
                        f: this._TextureLeft.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
                            this.pos.z * blockSize + this.size.z * blockSize / 2 - this.size.z * blockSize / 2
                        )
                    },
                    right: {
                        f: this._TextureRight.bind(this),
                        k: createVector(
                            this.pos.x * blockSize + this.size.x * blockSize / 2,
                            (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize,
                            this.pos.z * blockSize + this.size.z * blockSize / 2 + this.size.z * blockSize / 2
                        )
                    },
                }

                let first = ["front", "top", "left", "back", "bottom", "right"].sort(
                    (a, b) =>
                        dist(functions[b].k.x, functions[b].k.y, functions[b].k.z, player.camPos.x, player.camPos.y, player.camPos.z) -
                        dist(functions[a].k.x, functions[a].k.y, functions[a].k.z, player.camPos.x, player.camPos.y, player.camPos.z)
                );

                first.forEach(e => {
                    functions[e].f()
                });

                rectMode(CORNER);
                strokeWeight(1);
            } else {
                push();
                stroke(0);
                fill(255);
                translate(this.pos.x * blockSize + this.size.x * blockSize / 2, (blockCount - (this.pos.y + this.size.y / 2) - 5 + this.size.y) * blockSize, this.pos.z * blockSize + this.size.z * blockSize / 2);
                box(this.size.x * blockSize, this.size.y * blockSize, this.size.z * blockSize);
                pop();
            }

        } else {
            stroke(0);
            fill(255);
            rect(this.pos.z * blockSize, this.pos.y * blockSize, this.size.z * blockSize, this.size.y * blockSize);
        }
    }
}