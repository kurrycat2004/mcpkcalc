class Ground {
    constructor() {
        this.ground = 0;
    }

    isOnGround(pos) {
        return pos.y < this.groundHeight(pos);
    }
    groundHeight(pos) {
        if (pos != undefined) {
            let highest = blocks.filter(b => {
                return pos.z + 0.3 >= b.pos.z && pos.z - 0.3 < b.pos.z + b.size.z && pos.x + 0.3 >= b.pos.x && pos.x - 0.3 < b.pos.x + b.size.x;
            });
            if(highest.length == 0) return -5;
            return highest.reduce((a, b) => {
                if (a.pos.y > b.pos.y) return a;
                return b;
            }).pos.y;
        }
    }
}