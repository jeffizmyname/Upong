const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
let isStarted = false

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const customFont = new FontFace('YourCustomFont', `url('font.ttf')`);
document.fonts.add(customFont);
ctx.font = '60px YourCustomFont';

const ballsize = 10;

function drawDashedLine() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 20
    ctx.setLineDash([20, 20]); // Set the dash pattern: 5 pixels on, 5 pixels off
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // Reset the dash pattern to a solid line
}

class Ball {
    constructor({
        position = {
            x: (canvas.width / 2) - ballsize,
            y: (canvas.height / 2) - ballsize,
        },
        speed = 4,
        size = 10,
        velocity = {
            dx: 1,
            dy: 1,
        },
    }) {
        this.position = position;
        this.speed = speed;
        this.size = size;
        this.velocity = velocity;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    update() {

        if (this.position.x + this.velocity.dx > canvas.width - this.size) {
            this.position.x = (canvas.width / 2) - this.size;
            this.position.y = (canvas.height / 2) - this.size;
            p1Points.count +=1;
            this.velocity.dx = -this.velocity.dx;
        } else if (this.position.x + this.velocity.dx < 0) {
            p2Points.count +=1;
            this.position.x = (canvas.width / 2) - this.size;
            this.position.y = (canvas.height / 2) - this.size;
            this.velocity.dx = -this.velocity.dx;
        }

        if (
            this.position.y + this.velocity.dy > canvas.height - this.size ||
            this.position.y + this.velocity.dy < this.size
        ) {
            this.velocity.dy = -this.velocity.dy;
        }

        if (
            this.position.x + this.size >= player1.position.x &&
            player1.position.x + player1.width >= this.position.x &&
            this.position.y + this.size >= player1.position.y &&
            player1.position.y + player1.height >= this.position.y
        ) {
            this.velocity.dx = -this.velocity.dx;
        }

        if (
            this.position.x + this.size >= player2.position.x &&
            player2.position.x + player2.width >= this.position.x &&
            this.position.y + this.size >= player2.position.y &&
            player2.position.y + player2.height >= this.position.y
        ) {
            this.velocity.dx = -this.velocity.dx;
        }

        this.position.x += this.velocity.dx * this.speed;
        this.position.y += this.velocity.dy * this.speed;
    }
}

class player {
    constructor({
        position = {
            x: 0,
            y: 0,
        },
        name = 'player',
        width = 30,
        height = 300,
    }) {
        this.position = position;
        this.name = name;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    moveUp() {
        if (this.position.y > 15) {
            this.position.y -= 10;
        }
    }

    moveDown() {
        if (this.position.y < canvas.height - this.height - 15) {
            this.position.y += 10;
        }
    }
}

class points {
    constructor({
        position = {
            x: 0,
            y: 0,
        },
        count = 0
    }) {
        this.position = position
        this.count = count
    }

    draw() {
        ctx.fillStyle = "white";
        ctx.fillText(this.count, this.position.x, this.position.y)
    }

    reset() {
        this.count = 0
    }
}

const ballz = new Ball({
    position: {
        x: (canvas.width / 2) - ballsize,
        y: (canvas.height / 2) - ballsize,
    },
    speed: 20,
    size: 10,
});

const player1 = new player({
    position: {
        x: 20,
        y: (canvas.height/2) - 150,
    }
});

const player2 = new player({
    position: {
        x: canvas.width - 50,
        y: (canvas.height/2) - 150,
    }
});

const p1Points = new points({
    position: {
        x: (canvas.width / 2) - 130,
        y: 100
    }
});

const p2Points = new points({
    position: {
        x: (canvas.width / 2) + 100,
        y: 100
    }
});

var keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
    delete keys[event.key];
});

function handleKeys() {
    
    if(isStarted) {
        if (keys["ArrowUp"]) player2.moveUp();
        if (keys["ArrowDown"]) player2.moveDown();
        if (keys["w"]) player1.moveUp();
        if (keys["s"]) player1.moveDown();
    }
    if(keys[" "]) {
        isStarted = true;
        p1Points.reset();
        p2Points.reset();
    }
}

function collision({ ball, player }) {
    return (
        ball.position.x + ball.size >= player.position.x && 
        player.position.x + player.width >= ball.position.x && 
        ball.position.y + ball.size >= player.position.y && 
        player.position.y + player.height >= ball.position.y
    )
}

function drawTextAtCenter(text, fontSize) {
    ctx.font = `${fontSize}px YourCustomFont`;
    ctx.fillStyle = "green";
    
    // Measure the text width to center it horizontally
    const textWidth = ctx.measureText(text).width;
    
    // Calculate center coordinates
    const centerX = (canvas.width - textWidth) / 2;
    const centerY = canvas.height / 2;

    // Draw the text
    ctx.fillText(text, centerX, centerY);
    ctx.font = `60px YourCustomFont`;
}

function animate() {

    window.requestAnimationFrame(animate);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player1.draw();
    player2.draw();

    p1Points.draw();
    p2Points.draw();

    ballz.draw();

    if(isStarted) {
        ballz.update();
    }

    handleKeys();
    drawDashedLine()

    if(collision({ ball: ballz, player: player1 })) {
        console.log("touched 1")
    }

    if(collision({ ball: ballz, player: player2 })) {
        console.log("touched 2")
}

    if(p1Points.count === 5) {
        isStarted = false;
        drawTextAtCenter("player 1 won", 200)
    }

    if(p2Points.count === 5) {
        isStarted = false;
        drawTextAtCenter("player 2 won", 200)
    }
}

animate();
