var canvas, context2d, width, height, particles = [], probability = 0.04, xPoint, yPoint;
window.addEventListener("resize", resize);
window.addEventListener("DOMContentLoaded", init);
window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
function init() {
    document.querySelector("button").onclick = function (e) {
        document.querySelector("button").style.display = "none";
        document.querySelector("div").style.display = "block";
        canvas = document.querySelector("canvas");
        context2d = canvas.getContext("2d");
        resize();
        window.requestAnimationFrame(buildWorld);
        document.getElementById("audioID").play();
    };
}
function resize() {
    if (!!canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
}
function buildWorld() {
    render();
    plotFireworks();
    window.requestAnimationFrame(buildWorld);
}
function render() {
    if (particles.length < 500 && Math.random() < probability) {
        buildFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
            alive.push(particles[i]);
        }
    }
    particles = alive;
}
function plotFireworks() {
    context2d.globalCompositeOperation = "source-over";
    context2d.fillStyle = "rgba(0,0,0,0.2)";
    context2d.fillRect(0, 0, width, height);
    context2d.globalCompositeOperation = "lighter";
    particles.forEach(function (particle) { return particle.draw(context2d); });
}
function buildFirework() {
    xPoint = Math.random() * (width - 200) + 100;
    yPoint = Math.random() * (height - 200) + 100;
    var fireCount = Math.random() * 50 + 100;
    var color = "rgb(" +
        ~~(Math.random() * 200 + 55) +
        "," +
        ~~(Math.random() * 200 + 55) +
        "," +
        ~~(Math.random() * 200 + 55) +
        ")";
    for (var i = 0; i < fireCount; i++) {
        var particle = Particle.create();
        particle.color = color;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}
var Particle = /** @class */ (function () {
    function Particle(w, h, x, y, vx, vy, opacity) {
        this.gravity = 0.05;
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.opacity = opacity;
    }
    Particle.create = function () {
        var size = Math.random() * 4 + 1;
        var sX = xPoint - size / 2;
        var sY = yPoint - size / 2;
        var velocityX = (Math.random() - 0.5) * 10;
        var velocityY = (Math.random() - 0.5) * 10;
        var opacity = Math.random() * 0.5 + 0.5;
        return new Particle(size, size, sX, sY, velocityX, velocityY, opacity);
    };
    Particle.prototype.draw = function (context2d) {
        context2d.save();
        context2d.beginPath();
        context2d.translate(this.x + this.w / 2, this.y + this.h / 2);
        context2d.arc(0, 0, this.w, 0, Math.PI * 2);
        context2d.fillStyle = this.color;
        context2d.globalAlpha = this.opacity;
        context2d.closePath();
        context2d.fill();
        context2d.restore();
    };
    Particle.prototype.move = function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.opacity -= 0.01;
        if (this.x <= -this.w ||
            this.x >= screen.width ||
            this.y >= screen.height ||
            this.opacity <= 0) {
            return false;
        }
        return true;
    };
    return Particle;
}());
