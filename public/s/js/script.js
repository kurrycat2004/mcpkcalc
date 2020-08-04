const version = "1.8";
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

let cam;
let camSpeed = 1;
let pointerLock;

let tickSequenceContainer;

let Canvas;
let mousePressPos = { x: -1, y: -1 }

let blocks = [];

let params = window.location.pathname.split("/");
params.splice(0, 2);
if (params[0] == "") params = [];
console.log(params);
params.map(p => decodeURIComponent(p));

function setup() {
    Canvas = createCanvas(canvasSize, canvasSize, WEBGL);
    Canvas.parent("canvas")
    for (let i = 0; i < blockCount; i++) { blocks.push(new Block(0, blockCount - 1, i, 1)) }
    ground = new Ground();
    background(0);

    cam = new Camera(-13 * blockSize, (blockCount / 2) * blockSize, (blockCount / 2) * blockSize, HALF_PI, HALF_PI);
    cam.updateCamera();

    pointerLock = new PointerLock(document, Canvas.elt, (x, y) => { cam.mouseMoved(-x, y); });

    console.log(params);

    tickSequenceContainer = document.getElementById("tickSequenceContainer");

    document.oncontextmenu = e => {
        if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) return false;
    }

    /* //Jam
    tickSequence = new TickSequence(createVector(0, 0, 1));
    tickSequence.push(Tick.stopTick());
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(11, 0, "sprint", "w", false); */

    // //rex bwmm
    // blocks.push(new Block(0, 1, blockCount - 5, 1, 1));
    // blocks.push(new Block(0, 6.375, blockCount - 5, 1, 1));
    // tickSequence = new TickSequence(createVector(0, 0, 2.172));
    // tickSequence.pushStopTick();
    // tickSequence.pushTick(0, "walk", "s", false, true, "default");
    // tickSequence.pushTicks(12, 0, "walk", "s", false, "default");
    // tickSequence.pushTick(0, "sprint", "wa", true, true, "default");
    // tickSequence.pushTicks(11, 0, "sprint", "w", false, "default");
    // tickSequence.pushTick(0, "sprint", "w", false, true);
    // tickSequence.pushTicks(12, 0, "sprint", "w", true, false);


    // //rex bwmm 1 shift tick
    // blocks.push(new Block(0, 1, blockCount - 5, 1, 1));
    // blocks.push(new Block(0, 7, blockCount - 4, 1, 1));
    // tickSequence = new TickSequence(createVector(0, 0, 2.2704));
    // tickSequence.pushStopTick();
    // tickSequence.pushTick(0, "sneak", "s", false, false);
    // tickSequence.pushTick(0, "walk", "s", false, true, "default");
    // tickSequence.pushTicks(12, 0, "walk", "s", false, "default");
    // tickSequence.pushTick(0, "sprint", "wa", true, true, "default");
    // tickSequence.pushTicks(11, 0, "sprint", "w", true);
    // tickSequence.pushTick(0, "sprint", "w", false, true);
    // tickSequence.pushTicks(14, 0, "sprint", "w", true);

    /*
    //rex bwmm 3 strafes
    blocks.push(new Block(0, 1, blockCount - 5, 1, 1));
    blocks.push(new Block(0, 7, blockCount - 4, 1, 1));
    tickSequence = new TickSequence(createVector(0, 0, 2.1855));
    tickSequence.pushStopTick();
    tickSequence.pushTick(0, "walk", "s", true, true, "default");
    tickSequence.pushTicks(12, 0, "walk", "s", true, "default");
    tickSequence.pushTick(1.8, "sprint", "wa", true, true, "default");
    tickSequence.pushTicks(11, 0, "sprint", "w", true);
    tickSequence.pushTick(0, "sprint", "w", false, true);
    tickSequence.pushTicks(14, 0, "sprint", "w", true, false);
    */


    /* //2.125+.5bm 5-.5
    blocks.push(new Block(0, 0.875, blockCount-5, 0.125, 1));
    blocks.push(new Block(0, 1, blockCount-5, 1, 1));
    blocks.push(new Block(0, 2, blockCount-5.5, 1, 0.5));
    blocks.push(new Block(0, 8, blockCount-5, 1,1));
    tickSequence = new TickSequence(createVector(0,0.5,3.08723));
    tickSequence.pushStopTick();
    tickSequence.pushTicks(2, 0, "walk", "s", false);
    tickSequence.pushTick(0,"walk", "s", false, true);
    tickSequence.pushTicks(12, 0,"walk","s",false);
    tickSequence.pushTick(0,"walk","s",false,true);
    tickSequence.pushTicks(11, 0, "sprint","w",false);
    tickSequence.pushTick(0, "sprint","w",false,true);
    tickSequence.pushTicks(9,0,"sprint","w",false)
    tickSequence.pushTick(0,"sprint","w",false,true);
    tickSequence.pushTicks(13,0,"sprint","w",true) */

    //2.125+.5bm 5-.5
    blocks.push(new Block(0, blockCount - 5, 0.875, 1, 1, 0.125));
    blocks.push(new Block(0, blockCount - 5, 1, 1, 1));
    blocks.push(new Block(0, blockCount - 5.5, 2, 1, 0.5));
    blocks.push(new Block(0, blockCount - 5, 8, 1, 1));
    tickSequence = new TickSequence(createVector(0.5, 0.5, 3.08723));
    tickSequence.pushStopTick();
    tickSequence.pushITicks(2, 0, "s");
    tickSequence.pushITick(0, " s");
    tickSequence.pushITicks(12, 0, "s");
    tickSequence.pushITick(0, " s");
    tickSequence.pushITicks(11, 0, "ctrlw");
    tickSequence.pushITick(0, " ctrlw");
    tickSequence.pushITicks(9, 0, "ctrlw")
    tickSequence.pushITick(0, " ctrlw");
    tickSequence.pushITicks(13, 0, "ctrlw", true)


    // //rex bwmm 3 strafes
    // blocks.push(new Block(1, blockCount - 5, 0, 1, 1));
    // blocks.push(new Block(7, blockCount - 4, 0, 1, 1));
    // tickSequence = new TickSequence(createVector(0, 0, 2.187));
    // tickSequence.pushStopTick();
    // tickSequence.pushTick(0, "walk", "s", false, true, "default");
    // tickSequence.pushTicks(12, 0, "walk", "s", true, "default");
    // tickSequence.pushTick(0, "sprint", "wa", true, true, "default");
    // tickSequence.pushTicks(11, 0, "sprint", "w", true);
    // tickSequence.pushTick(0, "sprint", "w", false, true);
    // tickSequence.pushTicks(14, 0, "sprint", "w", true, false);

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
    for (let i = 1; i < 4; i++) blocks.push(new Block(i, blockCount - 5, 0, 1));
    blocks.push(new Block(9, blockCount - 5 + 0.5, 0, 1, 0.5))
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

    initialPositionInput = createInput(tickSequence.initialPosition.z + "");
    initialPositionSlider = createSlider(0, 1, 0, 0.01);
    initialPositionSlider.input(() => initialPositionInput.elt.value = initialPositionSlider.value())

    tickSequenceContainer.innerHTML = "";
    for (let td of getTicksAsDivs(tickSequence)) {
        tickSequenceContainer.appendChild(td);
    }
}

function draw() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        cam.updateCamera();
    }
    if (!pointerLock.locked) {
        cam.rotate();
    }

    if (pointerLock.locked) {
        let xKeys = 0;
        let zKeys = 0;
        let yKeys = 0;

        if (keyIsDown(87)) zKeys -= 1; //w
        if (keyIsDown(65)) xKeys += 1; //a
        if (keyIsDown(83)) zKeys += 1; //s
        if (keyIsDown(68)) xKeys -= 1; //d
        if (keyIsDown(32)) yKeys -= 1; //space
        if (keyIsDown(16)) yKeys += 1; //shift

        if (xKeys != 0 || zKeys != 0) {
            let strafe = (abs(xKeys) + abs(zKeys));

            let off =
                ((zKeys + 1 * abs(zKeys)) * HALF_PI) +
                (strafe == 2 ? -QUARTER_PI * zKeys * xKeys : (xKeys * HALF_PI));

            cam.move(
                sin(cam.yaw + off) * 3 * camSpeed,
                0,
                cos(cam.yaw + off) * 3 * camSpeed,
            )
        }
        if (yKeys != 0) {
            cam.move(0, 3 * yKeys * camSpeed, 0);
        }
    }

    if (tickSequence.initialPosition.z != parseFloat(initialPositionInput.value())) {
        tickSequence.updateInitialPosition(createVector(0, tickSequence.initialPosition.y, parseFloat(initialPositionInput.value())));
        tickSequenceContainer.innerHTML = "";
        for (let td of getTicksAsDivs(tickSequence)) {
            tickSequenceContainer.appendChild(td);
        }
    }
    background(0);
    stroke(255);
    noFill();
    for (let i = 0; i <= blockCount; i++) {
        for (let j = 0; j < blockCount; j++) {
            push();
            translate(blockSize + 1, 0, 0);
            rotateY(-HALF_PI);
            rect(0, j * blockSize, i * blockSize, blockSize, blockSize);
            pop();
        }
    }
    for (let b of blocks) {
        b.show(true);
    }
    stroke(255);
    fill(255);
    for (let i of tickSequence) {
        stroke(255);
        fill(255);
        push();
        translate(i.pos.x * blockSize, (blockCount - i.pos.y - 5) * blockSize, i.pos.z * blockSize);
        sphere(1);
        pop();
        stroke(255, 0, 0);
        push();
        translate(i.pos.x * blockSize, (blockCount - ground.groundHeight(i.pos) - 5) * blockSize, i.pos.z * blockSize);
        sphere(1);
        pop();
    }
    let expanded = tickSequenceContainer.getElementsByClassName("show");
    expanded = expanded.length > 0 ? expanded[0] : undefined;
    if (expanded) {
        let i = tickSequence[expanded.parentElement.id];
        stroke(0, 255, 0, 150);
        fill(0, 255, 0, 150);
        push();
        translate(i.pos.x * blockSize, (blockCount - i.pos.y - 5) * blockSize, i.pos.z * blockSize);
        sphere(4);
        pop();
    }
    strokeWeight(1);
}
/* function keyPressed() {
    console.log(keyCode)
    //if (key == " ") console.log(tickSequence);
} */

function mouseWheel(event) {
    if (pointerLock.locked) {
        camSpeed = constrain(camSpeed - event.delta / abs(event.delta), 0, 10);
    }
}

function mousePressed() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
        pointerLock.lock();
}
/* 
function mouseReleased() {
    if (Math.abs(mousePressPos.x - mouseX) > 10 || Math.abs(mousePressPos.y - mouseY) > 10) return;
    if (mouseX > width || mouseX < 0 || mouseY > height || mouseY < 0) return;
    let posX = Math.floor(mouseX / blockSize);
    let posY = Math.floor(mouseY / blockSize);
    let b = blocks.findIndex(e => e.pos.x == posX && e.pos.y == posY);
    if (b < 0) blocks.push(new Block(posX, posY, 0, 1));
    else blocks.splice(b, 1);
    tickSequence.reload();
    return false;
} */

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

    cardBody.appendChild(
        createEle("div", { "class": "row" }, [
            createEle("div", { "class": "col-2" }, [
                createEle("p", {}, [], e => {
                    e.innerText = (index - -1) + ". Tick";
                })
            ]),
            createEle("div", { "class": "col" }, [
                createEle("p", {}, [], e => {
                    e.innerText = Tick.vectorToString(tick);
                })
            ])
        ])
    );

    cardBody.appendChild(
        createEle("div", { "class": "row" }, [
            createEle("div", { "class": "col" }, [
                createEle("p", {}, [], (t) => {
                    let inp = tick.getInputs();
                    let keys = inp.keys;
                    keys = keys.map(e => {
                        if (e == " ") return "space";
                        return e;
                    });
                    keys = keys.join(", ");
                    if (keys == "") keys = "NONE";
                    let fac = inp.facing;
                    fac += "°";
                    t.innerText = "Inputs: " + keys + "\nFacing: " + fac;
                })
            ])
        ])
    );

    return container;
}

function createEle(type, options, childs = [], editCallback = ((t) => t)) {
    let t = document.createElement(type);
    if (options == undefined) return t;
    for (let k in options) t.setAttribute(k, options[k]);
    for (let i of childs) t.appendChild(i);
    editCallback(t);
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