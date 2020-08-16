class Camera {
    static get sensitivity() { return 1 };
    static get _mouseSensitivityConstant() { return 0.002617993877991494 };

    constructor(x, y, z, pitch, yaw) {
        this.pos = createVector(x, y, z);
        this.camPos = this.pos;
        this.pitch = pitch;
        this.yaw = yaw;
        this.updateDist();
    }

    mouseMoved(x, y) {
        this.yaw += x * Camera._mouseSensitivityConstant * Camera.sensitivity;
        this.pitch += y * Camera._mouseSensitivityConstant * Camera.sensitivity;
    }

    updateDist() {
        this.distToCenter = dist(this.pos.x, this.pos.z, 0, canvasSize / 2);
    }

    move(xOff, yOff, zOff) {
        this.pos.x += xOff;
        this.pos.y += yOff;
        this.pos.z += zOff;
        this.updateDist();
    }

    updateCamera() {
        this.pitch = constrain(this.pitch, 0.0001, PI - 0.0001);
        this.yaw = this.yaw % TWO_PI;

        this.camPos = this.pos;

        camera(
            this.pos.x,
            this.pos.y,
            this.pos.z,
            this.pos.x + sin(this.yaw) * sin(this.pitch),
            this.pos.y + -cos(this.pitch),
            this.pos.z + cos(this.yaw) * sin(this.pitch),
            0, 1, 0
        );
    }

    rotate() {
        this.camPos = createVector(
            sin(frameCount / 500 % TWO_PI) * this.distToCenter,
            canvasSize / 2,
            canvasSize / 2 + cos(frameCount / 500 % TWO_PI) * this.distToCenter
        );
        camera(
            this.camPos.x,
            this.camPos.y,
            this.camPos.z,
            0,
            canvasSize / 2,
            canvasSize / 2,
            0, 1, 0
        );
    }
}