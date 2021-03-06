const version = "1.8";
const jumpBoost = 0;
const speed = 0;
const slowness = 0;
let ground;
const blockSize = 48;
const canvasSize = 600;
const blockCount = Math.floor(canvasSize / blockSize);
let tickSequence;
let initialPositionSlider;
let initialPositionInput;

const inputTextStyle = '1rem -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';

let player;
let camSpeed = 1;
let pointerLock;

let rotating = false;
let rotatingText;

let tickSequenceContainer;

let Canvas;

let textures = {};

let blocks = [];

let params;

let blockLayout;
let coords;
let strat;

let coord;

let paramStratEle;
let paramCoordsEle;
let paramBlocksEle;

let ts;


if (window.addEventListener)
    window.addEventListener("load", onLoad, false);
else if (window.attachEvent)
    window.attachEvent("onload", onLoad);
else window.onload = onLoad;

function onLoad() {
    window.history.replaceState({ first: true }, null, decodeURIComponent(window.location.pathname));
}

function getGraphicsFromImg(i, rot = 0) {
    let w = rot % PI == 0 ? i.width : i.height;
    let h = rot % PI == 0 ? i.height : i.width;
    let g = createGraphics(w * blockSize, h * blockSize);
    g.translate(w * blockSize / 2, h * blockSize / 2);
    g.rotate(rot);
    g.translate(-i.width * blockSize / 2, -i.height * blockSize / 2);
    g.image(i, 0, 0, i.width * blockSize, i.height * blockSize);
    return g;
}

function preload() {
    //TODO: TEXTURE LOADING
	try {
		textures = {
			"ladder_front": loadImage("/s/assets/images/ladder_front.png"),
			"ladder_top": loadImage("/s/assets/images/ladder_top.png"),
			"ladder_side": loadImage("/s/assets/images/ladder_side.png"),
			"trapdoor_front": loadImage("/s/assets/images/trapdoor_front.png"),
			"trapdoor_side": loadImage("/s/assets/images/trapdoor_side.png"),
			"empty": loadImage("/s/assets/images/empty.png")
		}
	} catch(e){ textures = undefined };
}

function setup() {
	if(textures){
		BlockType.types.l.texture = {
			front: textures["ladder_front"],
			back: textures["ladder_front"],
			top: textures["ladder_top"],
			bottom: textures["ladder_top"],
			left: textures["ladder_side"],
			right: textures["ladder_side"]
		};
		BlockType.types.td.texture = {
			front: textures["trapdoor_front"],
			back: textures["empty"],
			top: textures["trapdoor_side"],
			bottom: textures["trapdoor_side"],
			left: textures["trapdoor_side"],
			right: textures["trapdoor_side"]	
		};
	}

    document.oncontextmenu = e => {
        if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) return false;
    }

    window.onpopstate = e => {
        if (e.state) {
            updateCurrUrl()
        }
    }

    console.log(window.history)

    Canvas = createCanvas(canvasSize, canvasSize, WEBGL);
    drawingContext.imageSmoothingEnabled = false;
    Canvas.parent("canvas");

    Canvas.elt.ondblclick = function (e) {
        if (onCanvas() && !pointerLock.locked && mouseButton == LEFT) {
            /*  if (window.getSelection) window.getSelection().removeAllRanges();
             else if (document.selection) document.selection.empty(); */
            pointerLock.lock();
            return false;
        }
    }
    imageMode(CENTER);

    tickSequenceContainer = document.getElementById("tickSequenceContainer");

    paramStratEle = document.getElementById("paramStrat");
    paramStratEle.value = strat;

    paramBlocksEle = document.getElementById("paramBlocks");
    paramBlocksEle.value = blockLayout;

    paramCoordsEle = document.getElementById("paramCoords");
    paramCoordsEle.value = coords;


    paramStratEle.oninput = () => {
        let start = paramStratEle.selectionStart;
        let end = paramStratEle.selectionEnd;
        updateUrl("/s/" + blockLayout + "/" + coords + "/" + paramStratEle.value);
        paramStratEle.setSelectionRange(start, end);
    }

    paramBlocksEle.oninput = () => {
        let start = paramBlocksEle.selectionStart;
        let end = paramBlocksEle.selectionEnd;
        updateUrl("/s/" + paramBlocksEle.value + "/" + coords + "/" + strat);
        paramBlocksEle.setSelectionRange(start, end);
    }

    paramCoordsEle.oninput = () => {
        let start = paramCoordsEle.selectionStart;
        let end = paramCoordsEle.selectionEnd;
        updateUrl("/s/" + blockLayout + "/" + paramCoordsEle.value + "/" + strat);
        paramCoordsEle.setSelectionRange(start, end);
    }

    document.getElementById("arrowBack").onclick = () => {
        if (!window.history.state.first)
            window.history.back();
    }
    document.getElementById("arrowForward").onclick = () => {
        window.history.forward();
    }

    rotatingText = new TextEle(`Rotating: ${rotating} (Press mouse wheel to toggle)`, width / 20, height / 50, false);
    rotatingText.addToDom();
    rotatingText.elt.ondblclick = Canvas.elt.ondblclick;

    pointerLock = new PointerLock(document, Canvas.elt, (x, y) => { player.mouseMoved(-x, y); });

    ground = new Ground();

    player = new Player(-13 * blockSize, (blockCount / 2) * blockSize, (blockCount / 2) * blockSize, HALF_PI, HALF_PI);
    player.updateCamera();

    console.log(params);

    updateCurrUrl();



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

    // //2.125+.5bm 5-.5
    // blocks.push(new Block(0, blockCount - 5, 0.875, 1, 1, 0.125));
    // blocks.push(new Block(0, blockCount - 5, 1, 1, 1));
    // blocks.push(new Block(0, blockCount - 5.5, 2, 1, 0.5));
    // blocks.push(new Block(0, blockCount - 5, 8, 1, 1));
    // tickSequence = new TickSequence(createVector(0.5, 0.5, 3.08723));
    // tickSequence.pushStopTick();
    // tickSequence.pushITicks(2, 0, "s");
    // tickSequence.pushITick(0, " s");
    // tickSequence.pushITicks(12, 0, "s");
    // tickSequence.pushITick(0, " s");
    // tickSequence.pushITicks(11, 0, "ctrlw");
    // tickSequence.pushITick(0, " ctrlw");
    // tickSequence.pushITicks(9, 0, "ctrlw")
    // tickSequence.pushITick(0, " ctrlw");
    // tickSequence.pushITicks(13, 0, "ctrlw", true)


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

    tickSequenceContainer.innerHTML = "";
    for (let td of getTicksAsDivs(tickSequence)) {
        tickSequenceContainer.appendChild(td);
    }

	document.getElementById("metaBase64").setAttribute("imageData", Canvas.elt.toDataURL().split(",")[1]);
}

function draw() {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        player.updateCamera();
    }
    if (!pointerLock.locked && rotating) {
        player.rotate();
    }

    if (pointerLock.locked) {
        let xKeys = 0;
        let zKeys = 0;
        let yKeys = 0;

        let slowMode = 1;

        if (keyIsDown(87)) zKeys -= 1; //w
        if (keyIsDown(65)) xKeys += 1; //a
        if (keyIsDown(83)) zKeys += 1; //s
        if (keyIsDown(68)) xKeys -= 1; //d
        if (keyIsDown(32)) yKeys -= 1; //space
        if (keyIsDown(16)) yKeys += 1; //shift
        if (yKeys == 0 && keyIsDown(32)) slowMode = 0.2;

        if (xKeys != 0 || zKeys != 0) {
            let strafe = (abs(xKeys) + abs(zKeys));

            let off =
                ((zKeys + 1 * abs(zKeys)) * HALF_PI) +
                (strafe == 2 ? -QUARTER_PI * zKeys * xKeys : (xKeys * HALF_PI));

            player.move(
                sin(player.yaw + off) * 5 * camSpeed * slowMode,
                0,
                cos(player.yaw + off) * 5 * camSpeed * slowMode,
            )
        }
        if (yKeys != 0) {
            player.move(0, 3 * yKeys * camSpeed, 0);
        }
    }

    background(0);
    stroke(255);
    noFill();
    if (pointerLock.locked || onCanvas()) {
        for (let i = 0; i <= blockCount; i++) {
            for (let j = 0; j < blockCount; j++) {
                push();
                translate(blockSize + 1, 0, 0);
                rotateY(-HALF_PI);
                rect(0, j * blockSize, i * blockSize, blockSize, blockSize);
                pop();
            }
        }
    }
    let bs = blocks.sort((a, b) =>
        dist(player.camPos.x, player.camPos.y, player.camPos.z, (b.pos.x + b.size.x / 2) * blockSize, (b.pos.y + b.size.y / 2) * blockSize, (b.pos.z + b.size.z / 2) * blockSize) -
        dist(player.camPos.x, player.camPos.y, player.camPos.z, (a.pos.x + a.size.x / 2) * blockSize, (a.pos.y + a.size.y / 2) * blockSize, (a.pos.z + a.size.z / 2) * blockSize)
    );

    noFill();
    for (let i of tickSequence) {
        stroke(220);
        push();
        translate(i.pos.x * blockSize, (blockCount - i.pos.y - 5) * blockSize, i.pos.z * blockSize);
        sphere(1);
        pop();
        stroke(255, 0, 0);
        push();
        translate(i.pos.x * blockSize, (blockCount - ground.groundHeight(i.pos) - 5) * blockSize, i.pos.z * blockSize);
        sphere(0.8);
        pop();
    }
    let expanded = tickSequenceContainer.getElementsByClassName("show");
    expanded = expanded.length > 0 ? expanded[0] : undefined;
    if (expanded) {
        let i = tickSequence[expanded.parentElement.id];
        stroke(0, 255, 0, 150);
        push();
        translate(i.pos.x * blockSize, (blockCount - i.pos.y - 5) * blockSize, i.pos.z * blockSize);
        sphere(4);
        pop();
    }
    for (let b of bs) {
        b.show(true);
    }
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

function mouseDragged() {
    if (onCanvas() && mouseButton == LEFT && !pointerLock.locked && !rotating) {
        let xOff = mouseX - pmouseX;
        let yOff = mouseY - pmouseY;

        let x = 0, z = 0;
        if (xOff != 0) {
            x = sin(player.yaw + HALF_PI * (xOff / abs(xOff))) * abs(xOff);
            z = cos(player.yaw + HALF_PI * (xOff / abs(xOff))) * abs(xOff);
        }
        player.move(x, -yOff, z);
    }
}

function tickSequenceUpdate() {
    ts = TickSequence.fromStratString(strat);
    let addedBlocks = blocks.filter(e => !e.defaultBlock);
    console.log(addedBlocks);
    if (addedBlocks.length > 0) {
        let minBlock = addedBlocks.reduce((a, b) => (b.pos.z < a.pos.z) ? b : a);
        if (minBlock.pos.z > coord.z) {
            coord.z = minBlock.pos.z;
        }
    }

    if (typeof ts == "number") {
        console.log(strat.slice(0, ts) + "%c" + strat.slice(ts), "background-color: red;")
        let w = getTextWidth(strat.slice(0, ts), inputTextStyle);
        let tw = getTextWidth(strat.slice(ts), inputTextStyle);
        paramStratEle.style.backgroundSize = tw + "px";
        paramStratEle.style.backgroundImage = "linear-gradient(red, red)"
        paramStratEle.style.backgroundPosition = (w + 12) + "px";
        paramStratEle.style.backgroundRepeat = "no-repeat";

        tickSequence = new TickSequence();
        tickSequence.updateInitialPosition(createVector(coord.x - 0.3, 0, coord.z - 0.3));
        tickSequence.pushStopTick();
    } else {
        paramStratEle.style = "";
        tickSequence = ts;
        tickSequence.updateInitialPosition(createVector(coord.x - 0.3, ground.groundHeight(createVector(coord.x - 0.3, 0, coord.z - 0.3)), coord.z - 0.3));
    }
}

function blocksUpdate() {
    let bString = Block.fromBlocksString(blockLayout);
    if (typeof bString == "number") {
        console.log(blockLayout.slice(0, bString) + "%c" + blockLayout.slice(bString), "background-color: red;")
        let w = getTextWidth(blockLayout.slice(0, bString), inputTextStyle);
        let tw = getTextWidth(blockLayout.slice(bString), inputTextStyle);
        paramBlocksEle.style.backgroundSize = tw + "px";
        paramBlocksEle.style.backgroundImage = "linear-gradient(red, red)"
        paramBlocksEle.style.backgroundPosition = (w + 12) + "px";
        paramBlocksEle.style.backgroundRepeat = "no-repeat";

        blocks = Block.groundRow();
    } else {
        paramBlocksEle.style = "";
        blocks = Block.groundRow();
        blocks.push(...bString);
    }
}

function updateParam() {
    params = window.location.pathname.split("/");
    params.splice(0, 2);
    if (params.length == 1 && params[0] == "") {
        params = ["(b;[0,0,0])(b;[0,0,5])", "0", "space+w_W11t_jam_W11t"];
        updateUrl("/s/" + params.join("/"));
    }
    params = params.map(p => decodeURIComponent(p));

    console.log(params);
    if (params.length > 2)
        strat = params[2];
    else strat = "";

    if (params.length > 0)
        blockLayout = params[0];
    else blockLayout = "";

    if (params.length > 1)
        coords = params[1];
    else coords = "0";

    let cs = coords.split(";");
    if (cs.length == 1 && cs[0] == "") cs[0] = "0";
    if (cs.every(e => e.match(/^-?\d+(\.\d+)?$/) != null)) {
        paramCoordsEle.style = "";

        coord = {
            x: cs.length > 1 ? parseFloat(cs[0]) || 0 : 0.5,
            z: cs.length > 1 ? parseFloat(cs[1]) || 0 : parseFloat(cs[0])
        }
        if (coord.x < 0) coord.x += 1.6;
        if (coord.z < 0) coord.z += 1.6;
    } else {
        let i = cs[0].match(/^-?\d+(\.\d+)?$/) != null ? coords.indexOf(";") : 0;
        console.log(coords.slice(0, i) + "%c" + coords.slice(i), "background-color: red;")
        let w = getTextWidth(coords.slice(0, i), inputTextStyle);
        let tw = getTextWidth(coords.slice(i), inputTextStyle);
        paramCoordsEle.style.backgroundSize = tw + "px";
        paramCoordsEle.style.backgroundImage = "linear-gradient(red, red)"
        paramCoordsEle.style.backgroundPosition = (w + 12) + "px";
        paramCoordsEle.style.backgroundRepeat = "no-repeat";

    }
}

function updateCurrUrl() {
    updateParam();

    let startS = paramStratEle.selectionStart, stratE = paramStratEle.selectionEnd;
    paramStratEle.value = strat;

    let blocksS = paramBlocksEle.selectionStart, blocksE = paramBlocksEle.selectionEnd;
    paramBlocksEle.value = blockLayout;

    let coordsS = paramCoordsEle.selectionStart, coordsE = paramCoordsEle.selectionEnd;
    paramCoordsEle.value = coords;

    blocksUpdate();
    tickSequenceUpdate();

    tickSequenceContainer.innerHTML = "";
    for (let td of getTicksAsDivs(tickSequence)) {
        tickSequenceContainer.appendChild(td);
    }

    /* paramStratEle.setSelectionRange(startS, stratE);
    paramBlocksEle.setSelectionRange(blocksS, blocksE);
    paramCoordsEle.setSelectionRange(coordsS, coordsE); */
}

function updateUrl(path) {
    window.history.pushState({}, null, path);
    updateCurrUrl();
}

function onCanvas(x = mouseX, y = mouseY) {
    return x > 0 && x < width && y > 0 && y < height;
}

function mousePressed() {
    if (onCanvas() && mouseButton == CENTER) {
        rotating = !rotating;
        rotatingText.updateText(`Rotating: ${rotating} (Press mouse wheel to toggle)`, false);
    }
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

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
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
    return createEle("div", { "class": "card" }, [
        createEle("button", {
            "class": "btn collapsed",
            "type": "button",
            "data-toggle": "collapse",
            "data-target": "#collapse" + index,
            "aria-expanded": "false",
            "aria-controls": "collapse" + index,
            "id": "button" + index,
        },
            [
                createEle("div", {
                    "class": "d-flex justify-content-around align-items-center"
                },
                    [
                        createEle("p", { "class": "mb-0" }, [], t => t.innerText = (index - -1) + ". Tick"),
                        createEle("p", { "class": "mb-0" }, [], t => t.innerText = Tick.vectorToStringSmall(tick))
                    ])
            ]),
        createEle("div", {
            "id": "collapse" + index,
            "class": "collapse",
            "aria-labelledby": "button" + index,
            "data-parent": "#tickSequenceContainer",
        },
            [
                createEle("div", {
                    "class": "card-body"
                },
                    [
                        createEle("div", {
                            "class": "row"
                        },
                            [
                                createEle("div", {
                                    "class": "col-2"
                                },
                                    [
                                        createEle("p", {}, [], e => {
                                            e.innerText = (index - -1) + ". Tick";
                                        })
                                    ]),
                                createEle("div", {
                                    "class": "col"
                                },
                                    [
                                        createEle("p", {}, [], e => {
                                            e.innerText = "Pos:\n" + Tick.vectorToString(tick);
                                        })
                                    ]),
                                createEle("div", {
                                    "class": "col"
                                },
                                    [
                                        createEle("p", {}, [], e => {
                                            e.innerText = "Vel:\n" + Tick.velToString(tick);
                                        })
                                    ])
                            ]),
                        createEle("div", {
                            "class": "row"
                        },
                            [
                                createEle("div", {
                                    "class": "col"
                                },
                                    [
                                        createEle("p", {}, [], (t) => {
                                            let inp = tick.getInputs();
                                            let keys = inp.keys;
                                            let fac = -inp.facing + "°";
                                            keys = keys.map(e => e == " " ? "space" : e).join(", ");
                                            if (keys == "") keys = "NONE";
                                            t.innerText = "Inputs: " + keys + "\nFacing: " + fac;
                                        })
                                    ])
                            ])
                    ])
            ])
    ]);
}
