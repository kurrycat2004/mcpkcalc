class PointerLock {
    constructor(document, canvas, listener) {
        this.locked = false;
        this.doc = canvas;
        this.document = document;
        this.listener = listener;

        this._changeCallback = (function () {
            this.locked = !this.locked;
            if (!this.locked) {
                this.document.removeEventListener("mousemove", this._mouseMoveCallback, false);
            }
        }).bind(this);

        this._mouseMoveCallback = (function (e) {
            let moveX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
            let moveY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
            this.listener(moveX, moveY);
        }).bind(this)


        this.document.addEventListener('pointerlockchange', this._changeCallback, false);
        this.document.addEventListener('mozpointerlockchange', this._changeCallback, false);
        this.document.addEventListener('webkitpointerlockchange', this._changeCallback, false);

        this.doc.requestPointerLock = this.doc.requestPointerLock || this.doc.mozRequestPointerLock || this.doc.webkitRequestPointerLock;
    }



    lock() {
        if (!this.locked && this.doc.requestPointerLock != undefined) {
            this.doc.requestPointerLock();
            this.document.addEventListener("mousemove", this._mouseMoveCallback, false);
        }
    }
}