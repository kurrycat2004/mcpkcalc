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

let tickSequenceContainer;

let Canvas;
let mousePressPos = { x:-1, y:-1 }

let blocks = [];

let params = window.location.pathname.split("/");
params.splice(0,2);
if(params[0] == "") params = [];
console.log(params);
params.map(p => decodeURIComponent(p));

function setup() {
    Canvas = createCanvas(canvasSize, canvasSize);
    Canvas.parent("canvas")
    for (let i = 0; i < blockCount; i++) blocks.push(new Block(i, blockCount - 1, 1))
    ground = new Ground();
    background(0);

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
    // blocks.push(new Block(1, blockCount - 5, 1, 1));
    // blocks.push(new Block(6.375, blockCount - 5, 1, 1));
    // tickSequence = new TickSequence(createVector(0, 0, 2.172));
    // tickSequence.pushStopTick();
    // tickSequence.pushTick(0, "walk", "s", false, true, "default");
    // tickSequence.pushTicks(12, 0, "walk", "s", false, "default");
    // tickSequence.pushTick(0, "sprint", "wa", true, true, "default");
    // tickSequence.pushTicks(11, 0, "sprint", "w", false, "default");
    // tickSequence.pushTick(0, "sprint", "w", false, true);
    // tickSequence.pushTicks(12, 0, "sprint", "w", true, false);
    
    
    // //rex bwmm 1 shift tick
    // blocks.push(new Block(1, blockCount - 5, 1, 1));
    // blocks.push(new Block(7, blockCount - 4, 1, 1));
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
    blocks.push(new Block(1, blockCount - 5, 1, 1));
    blocks.push(new Block(7, blockCount - 4, 1, 1));
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
    blocks.push(new Block(0.875, blockCount-5, 0.125, 1));
    blocks.push(new Block(1, blockCount-5, 1, 1));
    blocks.push(new Block(2, blockCount-5.5, 1, 0.5));
    blocks.push(new Block(8, blockCount-5,1,1));
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
    blocks.push(new Block(0.875, blockCount-5, 0.125, 1));
    blocks.push(new Block(1, blockCount-5, 1, 1));
    blocks.push(new Block(2, blockCount-5.5, 1, 0.5));
    blocks.push(new Block(8, blockCount-5,1,1));
    tickSequence = new TickSequence(createVector(0,0.5,3.08723));
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
    // blocks.push(new Block(1, blockCount - 5, 1, 1));
    // blocks.push(new Block(7, blockCount - 4, 1, 1));
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
        tickSequence.updateInitialPosition(createVector(0, tickSequence.initialPosition.y, parseFloat(initialPositionInput.value())));
        tickSequenceContainer.innerHTML = "";
        for (let td of getTicksAsDivs(tickSequence)) {
            tickSequenceContainer.appendChild(td);
        }
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
    mousePressPos = {mouseX, mouseY};
}

function mouseReleased() {
    if(Math.abs(mousePressPos.x-mouseX)>10 || Math.abs(mousePressPos.y-mouseY)>10) return;
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
        createEle("div", {"class": "row"}, [
            createEle("div", {"class": "col"}, [
                createEle("p", {}, [], (t) => {
                    let inp = tick.getInputs();
                    let keys = inp.keys;
                    keys = keys.map(e => {
                        if(e == " ") return "space";
                        return e;
                    });
                    keys = keys.join(", ");
                    if(keys == "") keys = "NONE";
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
    for(let i of childs) t.appendChild(i);
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