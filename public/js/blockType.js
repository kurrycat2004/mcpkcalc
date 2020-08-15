class BlockType {
    constructor(type, orientation = "Z+") {
        this.type = type;
        this.orientation = orientation;
    }

    get size() {
        return BlockType.types[this.type].size;
    }

    get coords() {
        let s = this.size;
        switch (this.orientation) {
            case "0":
                return {
                    x: (1 - s.x) / 2,
                    y: s.y,
                    z: (1 - s.z) / 2
                }
            case "Z+":
                return {
                    x: (1 - s.x) / 2,
                    y: s.y,
                    z: 1 - s.z
                }
            case "Z-":
                return {
                    x: (1 - s.x) / 2,
                    y: s.y,
                    z: 0
                }
            case "X+":
                return {
                    x: 0,
                    y: s.y,
                    z: (1 - s.z) / 2
                }
            case "X-":
                return {
                    x: 1 - s.x,
                    y: s.y,
                    z: (1 - s.z) / 2
                }
        }
    }

    static types = {
        "s": {
            size: {
                x: 1,
                y: 0.5,
                z: 1,
            }
        },
        "b": {
            size: {
                x: 1,
                y: 1,
                z: 1,
            }
        },
        "l": {
            size: {
                x: 1,
                y: 1,
                z: 0.125,
            }
        },
        "f": {
            size: {
                x: 0.25,
                y: 1.5,
                z: 0.25
            }
        },
        "cw": {
            size: {
                x: 0.5,
                y: 1.5,
                z: 0.5
            }
        },
    }

    static replacements = {
        "block": "b",
        "cobblewall": "cw",
    }
}