class BlockType {
    constructor(type, orientation = "Z+") {
        this.type = type;
        this.blockType = BlockType.types[type];
        if (BlockType.types[type].texture) {
            this.blockType = {
                size: BlockType.types[type].size,
                transforms: BlockType.types[type].transforms,
            };
            if (orientation.startsWith("X")) {
                let oS = orientation.length > 1 ? (orientation[1] == "+" ? 1 : -1) : 1
                this.blockType.texture = {
                    front: getGraphicsFromImg(oS == -1 ? BlockType.types[type].texture.front : BlockType.types[type].texture.back),
                    back: getGraphicsFromImg(oS == -1 ? BlockType.types[type].texture.back : BlockType.types[type].texture.front),
                    top: getGraphicsFromImg(BlockType.types[type].texture.top, (oS + 1) / 2 * PI),
                    bottom: getGraphicsFromImg(BlockType.types[type].texture.bottom, (oS + 1) / 2 * PI),
                    left: getGraphicsFromImg(BlockType.types[type].texture.left),
                    right: getGraphicsFromImg(BlockType.types[type].texture.right),
                };
            } else {
                let oS = orientation.length > 1 ? (orientation[1] == "+" ? 1 : -1) : 1
                this.blockType.texture = {
                    front: getGraphicsFromImg(BlockType.types[type].texture.left),
                    back: getGraphicsFromImg(BlockType.types[type].texture.right),
                    top: getGraphicsFromImg(BlockType.types[type].texture.top, HALF_PI * oS),
                    bottom: getGraphicsFromImg(BlockType.types[type].texture.bottom, -HALF_PI * oS),
                    left: getGraphicsFromImg(oS == 1 ? BlockType.types[type].texture.front : BlockType.types[type].texture.back),
                    right: getGraphicsFromImg(oS == 1 ? BlockType.types[type].texture.back : BlockType.types[type].texture.front),
                };
            }
        } else {
            this.blockType = BlockType.types[type];
        }

        this.orientation = orientation;
    }

    get size() {
        let s = BlockType.types[this.type].size;
        switch (this.orientation) {
            case "0":
                return s;
            case "Z":
                if (this.blockType.transforms) {
                    if (this.type == "cw")
                        return {
                            x: 0.375,
                            y: s.y,
                            z: 1
                        }
                    return {
                        x: s.x,
                        y: s.y,
                        z: 1
                    }
                }
            case "Z+":
            case "Z-":
                if (this.blockType.transforms)
                    return {
                        x: s.x,
                        y: s.y,
                        z: s.z + (1 - s.z) / 2
                    }
                return {
                    x: s.x,
                    y: s.y,
                    z: s.z
                }
            case "X":
                if (this.blockType.transforms) {
                    if (this.type == "cw")
                        return {
                            x: 1,
                            y: s.y,
                            z: 0.375
                        }
                    return {
                        x: 1,
                        y: s.y,
                        z: s.x
                    }
                }
            case "X+":
            case "X-":
                if (this.blockType.transforms)
                    return {
                        x: s.z + (1 - s.z) / 2,
                        y: s.y,
                        z: s.x
                    }
                return {
                    x: s.z,
                    y: s.y,
                    z: s.x
                }
        }
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
            case "Z":
                if (this.blockType.transforms)
                    return {
                        x: (1 - s.x) / 2,
                        y: s.y,
                        z: 0
                    }
                return {
                    x: (1 - s.x) / 2,
                    y: s.y,
                    z: 1 - s.z
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
            case "X":
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

    static get replacements() {
        return {
            "block": "b",
            "cobblewall": "cw",
            "ladder": "l",
            "fence": "f",
            "slab": "s",
            "tcw": "scw",
            "trapdoor": "td"
        }
    }
}

BlockType.types = {
    "s": {
        size: {
            x: 1,
            y: 0.5,
            z: 1,
        },
        texture: undefined,
    },
    "b": {
        size: {
            x: 1,
            y: 1,
            z: 1,
        },
        texture: undefined,
    },
    "l": {
        size: {
            x: 1,
            y: 1,
            z: 0.125,
        },
        texture: undefined,
    },
    "td": {
        size: {
            x: 1,
            y: 1,
            z: 0.1875,
        },
        texture: undefined,
    },
    "f": {
        size: {
            x: 0.25,
            y: 1.5,
            z: 0.25
        },
        transforms: true,
        texture: undefined,
    },
    "cw": {
        size: {
            x: 0.5,
            y: 1.5,
            z: 0.5
        },
        transforms: true,
        texture: undefined,
    },
}