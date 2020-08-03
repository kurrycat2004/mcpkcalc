class TickSequence extends Array {
    constructor(initialPosition = undefined) {
        super();
        this.initialPosition = initialPosition == undefined ? createVector(0, 0, 0) : initialPosition.copy();
    }

    reload() {
        this.forEach(e => e.reload());
    }
    updateInitialPosition(initialPosition) {
        this.initialPosition = initialPosition == undefined ? createVector(0, 0, 0) : initialPosition.copy();
        this.forEach(e => e.updateInitialPosition(this.initialPosition));
        this.reload();
    }

    pushStopTick() {
        this.push(Tick.stopTick(this.initialPosition));
    }

    static autoJump(ticks, initialPosition = undefined) {
        if (ticks < 1) return;
        let tS = new TickSequence(initialPosition);
        tS.pushTick(
            0,
            "stop",
            "",
            false,
            false,
            "default",
        )
        tS.pushTick(
            0,
            "sprint",
            "w",
            false,
            ground.groundHeight(tS[tS.length - 1].pos) == tS[tS.length - 1].pos.y,
            "default",
        )
        for (let i = 0; i < ticks - 2; i++) {
            tS.pushTick(
                0,
                "sprint",
                "w",
                false,
                ground.groundHeight(tS[tS.length - 2].pos) == tS[tS.length - 1].pos.y,
                "default"
            )
        }
        return tS;
    }

    pushTick(facing = 0, movementType = "sprint", keys = "w", strafe = false, jumpTick = false, groundType = "default") {
        this.push(
            new Tick(
                this.length > 0 ? this[this.length - 1] : undefined,
                facing,
                movementType,
                keys,
                strafe,
                jumpTick,
                groundType,
                this.initialPosition
            )
        )
    }

    pushITick(facing = 0, inputs = "", strafe = false){
        this.push(
            Tick.fromInputs(
                this.length > 0 ? this[this.length - 1] : undefined,
                this.initialPosition,
                facing,
                inputs,
                strafe
            )
        )
    }

    pushITicks(count = 1, facing, inputs, strafe){
        for (let i = 0; i < count; i++)
            this.pushITick(facing, inputs, strafe);
    }

    pushTicks(count = 1, facing = 0, movementType = "sprint", keys = "w", strafe = false, groundType = "default") {
        for (let i = 0; i < count; i++)
            this.pushTick(facing, movementType, keys, strafe, false, groundType);
    }

    getPos(tick) {
        tick = (tick < 0 ? this.length + tick : tick) || this.length - 1;
        if (this.length == 0) return createVector(0, 0, 0);
        return this[tick].pos.copy();
    }
    getVel(tick) {
        tick = (tick < 0 ? this.length + tick : tick) || this.length - 1;
        if (this.length == 0) return createVector(0, 0, 0);
        return this[tick].vel.copy();
    }

    getJump(jump) {
        let jumpTicks = [];
        this.forEach((e, i) => { if (e.jumpTick) jumpTicks.push({ index: i, tick: e }) })
        jumpTicks.forEach(e => {
            let land = this.findIndex((ele, i) => {
                if (i <= e.index) return false;
                return ground.groundHeight(this[i].pos) >= this[i].nextY();
            }
                , this);
            e.landTick = land >= 0 ? this[land] : undefined;
            e.landIndex = land;
        }, this)
        if (jump < jumpTicks.length && jump >= -jumpTicks.length) return jumpTicks[jump < 0 ? jumpTicks.length + jump : jump];
    }
    getJumpLength(jump) {
        let j = this.getJump(jump);
        if (j == undefined) return;
        let l = this.getPos(j.landIndex);
        let f = this.getPos(j.index - 2);
        l.y = ground.groundHeight(l);
        f.y = ground.groundHeight(f);
        return l.copy().sub(f);
    }
    download(name) {
        let allInputs = [];
        this.forEach(e => allInputs.push(e.getInputs()));
        let macroTXT = [["Files", "W", "A", "S", "D", "Sprint", "Sneak", "Jump", "LMB", "RMB", "rotationX", "rotationY"]];
        let facings = [];
        allInputs.forEach(v => {
            let tick = [
                "",
                v.keys.includes("w") ? "1" : "",
                v.keys.includes("a") ? "1" : "",
                v.keys.includes("s") ? "1" : "",
                v.keys.includes("d") ? "1" : "",
                v.keys.includes("ctrl") ? "1" : "",
                v.keys.includes("shift") ? "1" : "",
                v.keys.includes(" ") ? "1" : "",
                "",
                "",
                facings.length > 0 && facings[facings.length - 1] != v.facing ? v.facing - facings[facings.length - 1] + "" : "",
                "",
            ];
            facings.push(v.facing);
            macroTXT.push(tick);
        })
        exportToCsv(name || "test.txt", macroTXT);
        console.log(macroTXT);
    }
}