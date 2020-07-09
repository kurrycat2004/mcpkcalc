class Ground {
    constructor() {
        this.ground = 0;
    }

    isOnGround(pos) {
        return pos.y < this.groundHeight(pos);
    }
    groundHeight(pos) {
        if (pos != undefined) {
            let highest = blocks.reduce((a, b) => {
                if (!(pos.z + 0.3 > a.pos.x && pos.z - 0.3 < a.pos.x + a.sizeX)) return b;
                if (!(pos.z + 0.3 > b.pos.x && pos.z - 0.3 < b.pos.x + a.sizeX)) return a;
                if (a.pos.y < b.pos.y) return a;
                return b;
            });
            push()
            strokeWeight(2);
            stroke(255, 0, 0);
            point(pos.z * blockSize, highest.pos.y * blockSize)
            pop()
            return blockCount - highest.pos.y - 5;
        }
    }
}