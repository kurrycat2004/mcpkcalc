class Tick {
    constructor(lastTick, facing = 0, movementType = "sprint", keys = "w", strafe = false, jumpTick = false, groundType = "default", initialPosition = undefined) {
        this.initialPosition = initialPosition == undefined ? createVector(0, 0, 0) : initialPosition.copy();
        this.lastTick = lastTick;
        this.facingDegrees = facing || 0;
        this.facing = Tick.getFacingFromDegrees(this.facingDegrees);
        this.keys = keys;
        this.directionDegrees = Tick.getDirectionFromKeys(this.keys, this.facingDegrees)
        this.direction = Tick.getFacingFromDegrees(this.directionDegrees);
        this.propMovementType = movementType || "sprint";
        this.movementType = this.propMovementType;
        this.strafe = strafe || false;
        this.jumpTick = jumpTick || false;
        this.onGround = false;
        if (this.lastTick == undefined || this.lastTick.lastTick == undefined || ground.groundHeight(this.lastTick.lastTick.pos) == this.lastTick.pos.y) this.onGround = true;
        if (this.lastTick != undefined && this.propMovementType == "sprint" && this.lastTick.propMovementType != "sprint" && !this.onGround) this.movementType = "walk";
        this.groundType = groundType;
        this.groundSlipperiness = Tick.getSlipperinessFromBlock(this.onGround ? (this.groundType || "default") : "air");

        this.vel = this._getVel();
        this.pos = this._getPos();

        this.doReload = true;
    }

    static fromInputs(lastTick, initialPosition, facing = 0, inputs = "", strafe = false){
        let jumpTick = inputs.includes(" ") || inputs.includes("space");
        let movementType = inputs.includes("shift") ? "sneak" : (inputs.includes("ctrl") ? "sprint" : "walk");
        let keys = [...inputs].filter(e => "wasd".includes(e)).join("");
        if(keys == "") movementType = "stop";
        return new Tick(lastTick, facing, movementType, keys, strafe, jumpTick, "default", initialPosition);
    }

    static vectorToStringSmall(vector) {
        return `X: ${vector.pos.x.toFixed(3)}, Y: ${vector.pos.y.toFixed(3)}, Z: ${vector.pos.z.toFixed(3)}`;
    }

    static vectorToString(vector) {
        return `X: ${vector.pos.x.toFixed(16)}, \nY: ${vector.pos.y.toFixed(16)}, \nZ: ${vector.pos.z.toFixed(16)}`;
    }

    static stopTick(initialPosition) {
        let t = new Tick(undefined, 0, "stop", "", false, false, "default", initialPosition);
        t.doReload = false;
        return t;
    }

    static landTick(velocity, initialPosition) {
        let t = Tick.stopTick(initialPosition);
        t.onGround = false;
        t.groundSlipperiness = Tick.getSlipperinessFromBlock("air");
        if (velocity != undefined) t.vel = velocity.copy();
        return t;
    }

    reload() {
        if (!this.doReload) {
            this.pos = this.initialPosition.copy();
            return;
        }
        this.onGround = false;
        if (this.lastTick == undefined || this.lastTick.lastTick == undefined || ground.groundHeight(this.lastTick.lastTick.pos) == this.lastTick.pos.y) this.onGround = true;
        this.groundSlipperiness = Tick.getSlipperinessFromBlock(this.onGround ? (this.groundType || "default") : "air");

        this.vel = this._getVel();
        this.pos = this._getPos();
    }
    updateInitialPosition(initialPosition) {
        this.initialPosition = initialPosition == undefined ? createVector(0, 0, 0) : initialPosition.copy();
        this.reload();
    }

    static JumpTick(lastTick, facing = 0, movementType = "sprint", keys = "w", strafe = false, ground = "default", initialPosition = undefined) {
        return new Tick(lastTick, facing, movementType, keys, strafe, true, ground, initialPosition);
    }
    // static GroundTick(lastTick, facing = 0, movementType = "sprint", strafe = false, ground = "default") {
    //     return new Tick(lastTick, facing, movementType, strafe, false, ground);
    // }
    // static AirTick(lastTick, facing = 0, movementType = "sprint", strafe = false, ground = "default") {
    //     return new Tick(lastTick, facing, movementType, strafe, false, ground);
    // }

    static getFacingFromDegrees(degrees = 0) {
        return degrees * Math.PI / 180;
    }
    static getDirectionFromKeys(keys, facing) {
        let ks = keys.split("");
        let ws = 0;
        let ad = 0;
        for (let k of ks) {
            switch (k) {
                case "w": ws = 1; break;
                case "a": ad = 1; break;
                case "s": ws = -1; break;
                case "d": ad = -1; break;
            }
        }
        let angle = 0;
        if (ws == 0) angle += ad * 90;
        else {
            angle = (ws - 1) * 90;
            angle += ad * 45;
        }
        return angle + facing;
    }

    static getSlipperinessFromBlock(block) {
        switch (block) {
            case "slime": return 0.8;
            case "ice": return 0.98;
            case "air": return 1;
            default: return 0.6;
        }
    }

    _M() {
        let typeMultiplier = 0;
        let strafeMultiplier = 0.98;
        switch (this.movementType) {
            case "sprint": typeMultiplier = 1.3; break;
            case "walk": typeMultiplier = 1.0; break;
            case "sneak": typeMultiplier = 0.3; break;
        }
        if (this.strafe) {
            if (this.movementType == "sneak") strafeMultiplier *= Math.sqrt(2);
            else strafeMultiplier = 1.0;
        }
        return typeMultiplier * strafeMultiplier;
    }

    _E() {
        let m = ((1 + 0.2 * speed) * (1 - 0.15 * slowness))
        return m < 0 ? 0 : m;
    }

    _getVel() {
        let lastTick = this.lastTick || {
            groundSlipperiness: Tick.getSlipperinessFromBlock("default"),
            vel: createVector(0, 0, 0),
            onGround: true
        }

        let velX = lastTick.vel.x * lastTick.groundSlipperiness * 0.91;
        let velZ = lastTick.vel.z * lastTick.groundSlipperiness * 0.91;
        
        velX = Math.abs(velX) < (version == "1.8" ? 0.005 : 0.003) ? 0 : velX;
        velZ = Math.abs(velZ) < (version == "1.8" ? 0.005 : 0.003) ? 0 : velZ;
        
        if (this.onGround) {
            let acc = 0.1 * this._M() * this._E() * Math.pow(0.6 / this.groundSlipperiness, 3);
            velX += acc * Math.sin(this.direction);
            velZ += acc * Math.cos(this.direction);
            if (this.jumpTick && this.movementType == "sprint") {
                velX += 0.2 * Math.sin(this.facing);
                velZ += 0.2 * Math.cos(this.facing);
            }
        } else {
            velX += 0.02 * this._M() * Math.sin(this.direction);
            velZ += 0.02 * this._M() * Math.cos(this.direction);
        }

        let velY = this.jumpTick ?
            (0.42 + (0.1 * jumpBoost)) :
            this.lastTick == undefined || ground.groundHeight(this.lastTick.pos) >= this.lastTick.pos.y ? 0 : (lastTick.vel.y - 0.08) * 0.98;
        velY = Math.abs(velY) < (version == "1.8" ? 0.005 : 0.003) ? 0 : velY;


        return createVector(velX, velY, velZ);
    }

    _getPos() {
        let old = this.lastTick != undefined ? this.lastTick.pos.copy() : this.initialPosition.copy();
        old.x += this.vel.x;
        old.y += this.vel.y;
        old.y = Math.max(ground.groundHeight(old), old.y);
        old.z += this.vel.z;
        return old;
    }

    nextY() {
        return this.pos.y + (this.vel.y - 0.08) * 0.98;
    }

    getInputs() {
        let inputs = { keys: this.keys.split(""), facing: this.facingDegrees };
        if (!inputs.keys.includes("a") && !inputs.keys.includes("d") && this.strafe) { inputs.facing += 45; inputs.keys.push("a") }
        if (this.jumpTick) inputs.keys.push(" ");
        if (this.propMovementType == "sprint") inputs.keys.push("ctrl");
        if (this.propMovementType == "sneak") inputs.keys.push("shift");
        return inputs;
    }
}