const version = "1.9";
const jumpBoost = 0;
const speed = 0;
const slowness = 0;
let ground;
const blockSize = 40;
const canvasSize = 600;
const blockCount = Math.floor(canvasSize / blockSize);
let tickSequence;
let initialPositionSlider;
let initialPositionInput;

let tickSequenceContainer;

let Canvas;

let blocks = [];

function setup() {
    Canvas = createCanvas(canvasSize, canvasSize);
    Canvas.parent("canvas")
    for (let i = 0; i < blockCount; i++) blocks.push(new Block(i, blockCount - 1, 1))
    ground = new Ground();
    background(0);
    for (let i = 0; i < 18; i++) {
        console.log(i, posY(i))
    }

    tickSequenceContainer = document.getElementById("tickSequenceContainer");

    document.oncontextmenu = e => {
        if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) return false;
    }

    /* //Jam
    tickSequence = new TickSequence(createVector(0, 0, 1));
    tickSequence.push(Tick.stopTick());
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(11, 0, "sprint", "w", false); */

    //rex bwmm
    blocks.push(new Block(1, blockCount - 5, 1, 1));
    blocks.push(new Block(6.375, blockCount - 5, 1, 1));
    tickSequence = new TickSequence(createVector(0, 0, 2.172));
    tickSequence.pushStopTick();
    tickSequence.pushTick(0, "walk", "s", false, true, "default");
    tickSequence.pushTicks(12, 0, "walk", "s", false, "default");
    tickSequence.pushTick(0, "sprint", "wa", true, true, "default");
    tickSequence.pushTicks(11, 0, "sprint", "w", false, "default");
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(12, 0, "sprint", "w", true, false);

    /* tickSequence = new TickSequence();
    tickSequence.push(Tick.landTick(createVector(0, 0, 0.1105)));
    tickSequence.pushTick(0, "sprint", "w", false, true, "default");
    tickSequence.pushTicks(11, 0, "sprint", "w", false, false, "default") */

    /* //hh 2 jumps
    tickSequence = new TickSequence(createVector(0, 0, 1));
    tickSequence.push(Tick.stopTick());
    tickSequence.pushTick(0, "sprint", "w", false, false)
    tickSequence.pushTick(0, "sprint", "w", false, true)
    tickSequence.pushTicks(11);
    tickSequence.pushTick(0, "sprint", "w", false, true)
    tickSequence.pushTicks(11); */


    /* //3bm 5-.5 strat - start at .98 
    for (let i = 1; i < 4; i++) blocks.push(new Block(i, blockCount - 5, 1));
    blocks.push(new Block(9, blockCount - 5 + 0.5, 1, 0.5))
    tickSequence = new TickSequence(createVector(0, 0, 0.98));
    tickSequence.pushStopTick();
    tickSequence.pushTick(0, "walk", "s", false, false);
    tickSequence.pushTick(0, "walk", "s", false, false);
    tickSequence.pushTick(0, "walk", "s", false, true);
    tickSequence.pushTicks(11, 0, "sprint", "w", false);
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(11, 0, "sprint", "w", false);
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(12, 0, "sprint", "w", true, false); */

    console.log(tickSequence);

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
    initialPositionInput = createInput(tickSequence.initialPosition.z + "");
    initialPositionSlider = createSlider(0, 1, 0, 0.01);
    initialPositionSlider.input(() => initialPositionInput.elt.value = initialPositionSlider.value())

    tickSequenceContainer.innerHTML = "";
    for (let td of getTicksAsDivs(tickSequence)) {
        tickSequenceContainer.appendChild(td);
    }
}

function draw() {
    if (tickSequence.initialPosition.z != parseFloat(initialPositionInput.value())) {
        tickSequence.updateInitialPosition(createVector(0, 0, parseFloat(initialPositionInput.value())));
        console.log("update")
        tickSequenceContainer.innerHTML = "";
        for (let td of getTicksAsDivs(tickSequence)) {
            tickSequenceContainer.appendChild(td);
        }
        /* console.log(tickSequence.getPos(-2));
        console.log(tickSequence.getPos(25));
        console.log(tickSequence.getPos(-2).z - tickSequence.getPos(25).z); */
    }
    background(0);
    stroke(255);
    fill(0);
    for (let i = 0; i < blockCount; i++) {
        for (let j = 0; j < blockCount; j++) {
            rect(i * blockSize, j * blockSize, blockSize, blockSize);
        }
    }
    for (let b of blocks) {
        b.show();
    }
    stroke(255);
    fill(255);
    strokeWeight(5);
    for (let i of tickSequence) {
        stroke(255);
        fill(255);
        point(i.pos.z * blockSize, (blockCount - i.pos.y - 5) * blockSize);
        push()
        strokeWeight(2);
        stroke(255, 0, 0);
        point(i.pos.z * blockSize, (blockCount - ground.groundHeight(i.pos) - 5) * blockSize)
        pop()
    }
    let expanded = tickSequenceContainer.getElementsByClassName("show");
    expanded = expanded.length > 0 ? expanded[0] : undefined;
    if (expanded) {
        let i = tickSequence[expanded.parentElement.id];
        fill(255, 0, 0, 150);
        noStroke();
        rect((i.pos.z - 0.3) * blockSize, (blockCount - i.pos.y - 0.3 - 5) * blockSize, 0.6 * blockSize, 0.6 * blockSize)
        stroke(255);
        fill(255);
        point(i.pos.z * blockSize, (blockCount - i.pos.y - 5) * blockSize);
    }
    strokeWeight(1);
}
function keyPressed() {
    if (key == " ") console.log(tickSequence);
}

function mousePressed() {
    if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) return;
    let posX = Math.floor(mouseX / blockSize);
    let posY = Math.floor(mouseY / blockSize);
    let b = blocks.findIndex(e => e.pos.x == posX && e.pos.y == posY);
    if (b < 0) blocks.push(new Block(posX, posY, 1));
    else blocks.splice(b, 1);
    tickSequence.reload();
    return false;
}

function getTicksAsDivs(ticks) {
    let divs = [];
    for (let tick in ticks) {
        if (isNaN(tick)) continue;
        let td = getTickAsDiv(tick, ticks[tick]);
        td.id = tick;
        divs.push(td);
    }
    return divs;
}

function getTickAsDiv(index, tick) {
    let container = createEle("div", { "class": "card" });

    let button = createEle("button", {
        "class": "btn collapsed",
        "type": "button",
        "data-toggle": "collapse",
        "data-target": "#collapse" + index,
        "aria-expanded": "false",
        "aria-controls": "collapse" + index,
        "id": "button" + index,
    });
    container.appendChild(button);

    let buttonText = createEle("div", { "class": "d-flex justify-content-around align-items-center" });
    button.appendChild(buttonText);

    let buttonTextTickcount = createEle("p", { "class": "mb-0" });
    buttonTextTickcount.innerText = (index - -1) + ". Tick";
    buttonText.appendChild(buttonTextTickcount);

    let buttonTextCoords = createEle("p", { "class": "mb-0" });
    buttonTextCoords.innerText = Tick.vectorToStringSmall(tick);
    buttonText.appendChild(buttonTextCoords);

    let card = createEle("div", {
        "id": "collapse" + index,
        "class": "collapse",
        "aria-labelledby": "button" + index,
        "data-parent": "#tickSequenceContainer",
    })
    container.appendChild(card);

    let cardBody = createEle("div", { "class": "card-body" });
    card.appendChild(cardBody);

    let row = createEle("div", { "class": "row" })
    cardBody.appendChild(row);

    let colTickIndex = createEle("div", { "class": "col-2" });
    let tickIndex = document.createElement("p");
    tickIndex.innerText = (index - -1) + ". Tick";
    colTickIndex.appendChild(tickIndex);
    row.appendChild(colTickIndex);

    let colCoords = createEle("div", { "class": "col" });
    let coords = document.createElement("p");
    coords.innerText = Tick.vectorToStringSmall(tick);
    colCoords.appendChild(coords);

    row.appendChild(colCoords);
    return container;
}

function createEle(type, options) {
    let t = document.createElement(type);
    if (options == undefined) return t;
    for (let k in options) t.setAttribute(k, options[k]);
    return t;
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