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

    static _formatStratString(original) {
        let s = original
            .replace(/bwjam(\d+t)/g, "(space+s)$1")
            .replace(/jam(\d+t)/g, "(ctrl+w+space)$1")
            .replace(/W(\d+t)/g, "(ctrl+w)$1")
            .replace(/bwjam/g, "space+s")
            .replace(/jam/g, "ctrl+w+space")
            .replace(/W/g, "ctrl+w")
            .replace(/bwhh([^_]*)(_([^_]*))?/g, (_match, p1, _, p2) => {
                let st = "s" + p1 + "_s+space";
                console.log(p2)
                if (p2 != undefined && p2 != "") st += (p2.startsWith("_") ? "" : "+") + p2;
                return st;
            })
            .replace(/hh([^_]*)(_([^_]*))?/g, (_match, p1, _, p2) => {
                let st = "ctrl+w" + p1 + "_ctrl+w+space";
                if (p2 != undefined && p2 != "") st += (p2.startsWith("_") ? "" : "+") + p2;
                return st;
            })
        console.log(s);
        return s;
    }

    static fromStratString(original) {
        let s = original
            .replace(/sprint/g, "ctrl")
            .replace(/sneak/g, "shift")
            .replace(/jump/g, "space");
        s = this._formatStratString(s);

        let parts = s.split("_");
        let inputs = [];
        let errorChar = -1;
        let i = 0;
        parts.forEach((v, splitTick) => {
            if (errorChar != -1) return;

            let p = v.split(/;(?=-?\d{1,3}(?:.\d+)?°(?:_|$))/);
            let f = p.length > 1 ? p[1] : "0°";
            let k = p[0];
            if (k == "") {
                i++;
                return;
            }

            let m;

            if ((m = f.match(/-?\d{1,3}(.\d+)?°/)) != null) {
                if (inputs[i] == undefined) inputs[i] = [];
                inputs[i].push(f);
            } else {
                errorChar = original.split("_").splice(0, splitTick).join("_").length + original.split("_").splice(splitTick, 1)[0].split(";")[0].length + 1;
                return;
            }

            let bsplit = k.split("+");
            if (bsplit.every(e => ["w", "a", "s", "d", "shift", "space", "ctrl"].includes(e))) {
                if (inputs[i] == undefined) inputs[i] = [];
                inputs[i].push(...bsplit);
                i++;
                return;
            }

            if ((m = k.match(/(?<content>[a-zA-Z]+|(?<=\()[^\)]+(?=\)))\)?(?<len>\d+)t/)) != null) {
                console.log(m)
                let pa = m.groups.content.split(";")
                let keys = pa[0].split("+");
                let fa = pa.length > 1 ? pa[1] : "0°";
                if (keys.every(e => ["w", "a", "s", "d", "shift", "space", "ctrl"].includes(e))) {
                    for (let j = 0; j < (m.groups.len || 1); j++) {
                        let an = fa;
                        if (inputs[i + j] == undefined) inputs[i + j] = [];
                        if (j == 0 && inputs[i].length > 0 && inputs[i][0].match(/-?\d{1,3}(.\d+)?°/) != null) {
                            an = parseFloat(fa.substring(0, an.length - 1)) + parseFloat(inputs[i][0].substring(0, inputs[i][0].length - 1)) + "°";
                            inputs[i].splice(0, 1);
                        }
                        inputs[i + j].push(an, ...keys);
                    }
                    i -= -m.groups.len;
                    return;
                }
                errorChar = original.split("_").splice(0, splitTick).join("_").length + 1;
            }
            errorChar = original.split("_").splice(0, splitTick).join("_").length + 1;
        })
        console.log(parts);
        console.log(inputs);
        if (errorChar != -1)
            return errorChar;
        else {
            let ts = new TickSequence();
            ts.pushStopTick();
            let a = 0;
            for (let t of inputs) {
                console.log(t)
                if (t[0].match(/-?\d{1,3}(.\d+)?°/) != null) a += parseFloat(t[0].substring(0, t[0].length - 1));
                ts.pushITick(-a, t)
            }
            return ts;
        }
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

    pushITick(facing = 0, inputs = "") {
        this.push(
            Tick.fromInputs(
                this.length > 0 ? this[this.length - 1] : undefined,
                this.initialPosition,
                facing,
                inputs,
                (inputs.includes("w") || inputs.includes("s")) && (inputs.includes("a") || inputs.includes("d"))
            )
        )
    }

    pushITicks(count = 1, facing, inputs) {
        for (let i = 0; i < count; i++)
            this.pushITick(facing, inputs);
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