const version = "1.8";
const jumpBoost = 0;
const speed = 0;
const slowness = 0;
let ground;
const blockSize = 40;
const canvasSize = 600;
const blockCount = Math.floor(canvasSize / blockSize);

let Canvas;

let blocks = [];

function setup() {
    for (let i = 0; i < 18; i++) {
        console.log(i, posY(i))
    }

    tickSequenceContainer = document.getElementById("tickSequenceContainer");

    document.oncontextmenu = e => {
        if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) return false;
    }    

    document.getElementById("calculate").onclick = () => {
        document.getElementById("solution").innerText = "";
        let initialSpeed = createVector(
            parseFloat(document.getElementById("initialSpeedX").value) || 0,
            0,
            parseFloat(document.getElementById("initialSpeedZ").value) || 0
        );
        let p = pos(
            initialSpeed,
            document.getElementById("ticks").value,
            true,
            document.getElementById("chained").checked,
            parseFloat(document.getElementById("facing").value) || 0,
            document.getElementById("strafe").checked
        );
        document.getElementById("solution").innerText = "X: " + p.x + ",\nY: " + p.y + ",\nZ: " + p.z;
    }
    document.getElementById("calculateDistance").onclick = () => {
        document.getElementById("solutionDistance").innerText = "";
        let d = getSpeed(
            createVector(
                parseFloat(document.getElementById("distanceX").value) || 0,
                parseFloat(document.getElementById("distanceY").value) || 0,
                parseFloat(document.getElementById("distanceZ").value) || 0,
            ),
            document.getElementById("chainedDistance").checked,
            parseFloat(document.getElementById("facingDistance").value) || 0,
            document.getElementById("strafeDistance").checked
        )
        document.getElementById("solutionDistance").innerText = "X: " + d.x + ",\nZ: " + d.z;
    }
    document.getElementById("jump").oninput = () => {
        document.getElementById("parsedDistance").innerText = "";
        let d = parseJump(document.getElementById("jump").value);
        document.getElementById("parsedDistance").innerText = d != undefined ? "X: " + d.x + ",\nY: " + d.y + ",\nZ: " + d.z : "Wrong Format";
    }
}

function parseJump(jump) {
    if (jump == "") return;
    let arr = [...jump.matchAll(/(((\d+)?\.\d+)|\d+)\s*((x(((\d+)?\.\d+)|\d+))|b)\s*([+-]\s*(((\d+)?\.\d+)|\d+))?/gi)];
    if (arr.length == 0) return;
    arr = arr[0];
    let d = createVector(parseFloat(arr[1] || 0), parseFloat(arr[9] || 0), parseFloat(arr[6] || 0));
    return d;
}

function velY(tick) {
    if (tick == 0) return 0.42 + (0.1 * jumpBoost);
    let vY = (velY(tick - 1) - 0.08) * 0.98;
    return Math.abs(vY) < (version == "1.8" ? 0.005 : 0.003) ? 0 : vY;
}

function posY(tick) {
    let pos = 0;
    for (let i = 0; i < tick; i++) {
        pos += velY(i);
    }
    return pos;
}

function movementMultiplier(type, strafing) {
    let typeMultiplier = 0;
    let strafeMultiplier = 0.98;
    switch (type) {
        case "sprint": typeMultiplier = 1.3; break;
        case "walk": typeMultiplier = 1.0; break;
        case "sneak": typeMultiplier = 0.3; break;
    }
    if (strafing) {
        if (type == "sneak") strafeMultiplier *= Math.sqrt(2);
        else strafeMultiplier = 1.0;
    }
    return typeMultiplier * strafeMultiplier;
}

function effectMultiplier(speed, slowness) {
    let m = ((1 + 0.2 * speed) * (1 - 0.15 * slowness))
    return m < 0 ? 0 : m;
}

function direction(degrees) {
    return facing(degrees);
}

function facing(degrees) {
    if (degrees == undefined) return 0;
    return degrees * (Math.PI / 180);
}

function slipperinessMultiplier(block) {
    switch (block) {
        case "slime": return 0.8;
        case "ice": return 0.98;
        case "air": return 1;
        default: return 0.6;
    }
}

function getSpeedRun(ticks, initialSpeed, sprinting, f, strafe) {
    if (ticks == 0) {
        return initialSpeed;
    }
    let prev = getSpeedRun(ticks - 1, initialSpeed, sprinting, f, strafe);
    let inertiaX = prev.x * slipperinessMultiplier("default") * 0.91;
    let inertiaZ = prev.z * slipperinessMultiplier("default") * 0.91;
    let acc = (
        0.1 * movementMultiplier(sprinting ? "sprint" : "walk", strafe) * effectMultiplier(0, 0) *
        Math.pow(0.6 / slipperinessMultiplier("default"), 3)
    );
    let vX = inertiaX + acc * Math.sin(direction(f));
    let vZ = inertiaZ + acc * Math.cos(direction(f));
    let v = createVector(
        vX < (version == "1.8" ? 0.005 : 0.003) ? 0 : vX,
        0,
        vZ < (version == "1.8" ? 0.005 : 0.003) ? 0 : vZ,
    )
    return v;
}

function getSpeedRunAir(ticks, sprinting, f, strafe) {
    if (ticks == 0) {
        return createVector(0, 0, 0);
    }
    let prev = getSpeedRunAir(ticks - 1, sprinting, f, strafe);
    let inertiaX = prev.x * slipperinessMultiplier("air") * 0.91;
    let inertiaZ = prev.z * slipperinessMultiplier("air") * 0.91;
    let acc = (
        0.02 * movementMultiplier(sprinting ? "sprint" : "walk", strafe)
    );
    let vX = inertiaX + acc * Math.sin(direction(f));
    let vZ = inertiaZ + acc * Math.cos(direction(f));
    let v = createVector(
        vX < (version == "1.8" ? 0.005 : 0.003) ? 0 : vX,
        0,
        vZ < (version == "1.8" ? 0.005 : 0.003) ? 0 : vZ,
    )
    return v;
}

function velXZ(initialSpeed, tick, sprinting = true, chained = false, f, strafe = false) {
    if (tick == 0) {
        let acc = (
            0.1 * movementMultiplier(sprinting ? "sprint" : "walk", false) * effectMultiplier(0, 0) *
            Math.pow(0.6 / slipperinessMultiplier("default"), 3)
        );
        let inertiaX = initialSpeed.x * slipperinessMultiplier(chained ? "air" : "default") * 0.91;
        let inertiaZ = initialSpeed.z * slipperinessMultiplier(chained ? "air" : "default") * 0.91;
        let sprintBoostX = sprinting ? (0.2 * Math.sin(facing(f))) : 0;
        let sprintBoostZ = sprinting ? (0.2 * Math.cos(facing(f))) : 0;
        let vX = inertiaX + acc * Math.sin(direction(f)) + sprintBoostX;
        let vZ = inertiaZ + acc * Math.cos(direction(f)) + sprintBoostZ;
        let v = createVector(
            vX < (version == "1.8" ? 0.005 : 0.003) ? 0 : vX,
            0,
            vZ < (version == "1.8" ? 0.005 : 0.003) ? 0 : vZ,
        )
        return v;
    } else {
        let prev = velXZ(initialSpeed, tick - 1, sprinting, chained, f, strafe);
        let inertiaX = prev.x * slipperinessMultiplier(tick == 1 ? "default" : "air") * 0.91;
        let inertiaZ = prev.z * slipperinessMultiplier(tick == 1 ? "default" : "air") * 0.91;
        let acc = 0.02 * movementMultiplier(sprinting ? "sprint" : "walk", strafe);
        let vX = inertiaX + acc * Math.sin(direction(f));
        let vZ = inertiaZ + acc * Math.cos(direction(f));
        let v = createVector(
            vX < (version == "1.8" ? 0.005 : 0.003) ? 0 : vX,
            0,
            vZ < (version == "1.8" ? 0.005 : 0.003) ? 0 : vZ,
        )
        return v;
    }
}

function posXZ(initialSpeed, tick, sprinting, chained, f, strafe) {
    let pos = createVector(initialSpeed.x, 0, initialSpeed.z);
    for (let i = 0; i < tick; i++) {
        pos.add(velXZ(initialSpeed, i, sprinting, chained, f, strafe));
    }
    return pos;
}

function pos(initialSpeed, tick, sprinting, chained, f, strafe) {
    let posxz = posXZ(initialSpeed, tick, sprinting, chained, f, strafe);
    let posy = posY(tick);
    return createVector(posxz.x, posy, posxz.z);
}

function getSpeed(distance, chained = false, f, strafe) {
    let top = { x: 10, z: 10 };
    let bottom = { x: -10, z: -10 };
    let ticks = 6;
    while (posY(ticks + 1) > distance.y) {
        ticks++;
    }
    for (let i = 0; i < 1000; i++) {
        let d = posXZ(createVector((top.x + bottom.x) / 2, 0, (top.z + bottom.z) / 2), ticks, true, chained, f, strafe);
        if (d.x < distance.x) {
            bottom.x = (top.x + bottom.x) / 2;
        } else if (d.x >= distance.x) {
            top.x = (top.x + bottom.x) / 2;
        }
        if (d.z < distance.z) {
            bottom.z = (top.z + bottom.z) / 2;
        } else if (d.z >= distance.z) {
            top.z = (top.z + bottom.z) / 2;
        }
    }
    return createVector(Math.max(0, top.x), 0, Math.max(0, top.z));
}