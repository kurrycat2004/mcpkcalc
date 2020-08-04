class TextEle {
    constructor(text, x, y, centerMode = true) {
        this.text = text;
        this.pos = createVector(x, y);
        this.fontSize = 16;
        this.centerMode = centerMode;
    }

    addToDom(parentElement) {
        if (parentElement == undefined) parentElement = document.getElementById("canvas");
        this.parentElement = parentElement;

        let text = document.createElement("p");
        this.elt = text;
        parentElement.appendChild(text);

        text.innerText = this.text;
        text.setAttribute("style", "position: absolute; float: left; margin: 0;top: 0;left: 0;color: white;");
        text.style.fontSize = `${this.fontSize}px`;

        let posX = this.pos.x, posY = this.pos.y;
        if (this.centerMode) {
            posX -= text.offsetWidth / 2;
            posY -= text.offsetHeight / 2;
        }
        text.style.transform = `translate(${posX}px,${posY}px)`;
    }

    textSize(size, shift = true) {
        this.fontSize = size;
        text.style.fontSize = `${this.fontSize}px`;
        if (shift && this.centerMode) {
            let posX = this.pos.x - this.elt.offsetWidth / 2;
            let posY = this.pos.y - this.elt.offsetHeight / 2;
            text.style.transform = `translate(${posX}px,${posY}px)`;
        }
    }

    updateText(text, shift = true) {
        this.text = text;
        this.elt.innerText = text;
        if (shift && this.centerMode) {
            let posX = this.pos.x - this.elt.offsetWidth / 2;
            let posY = this.pos.y - this.elt.offsetHeight / 2;
            this.elt.style.transform = `translate(${posX}px,${posY}px)`;
        }
    }
    remove() {
        this.parentElement.removeChild(this.elt);
    }
}