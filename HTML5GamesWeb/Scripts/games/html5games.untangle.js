var untangleGame = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: [],
    circleRadius: 10,
    currentLevel: 0,
    progressPercentage: 0
};

untangleGame.layers = new Array();

// prepare layer 0 (bg)
var canvas_bg = document.getElementById("bg");
untangleGame.layers[0] = canvas_bg.getContext("2d");

// prepare layer 1 (guide)
var canvas_guide = document.getElementById("guide");
untangleGame.layers[1] = canvas_guide.getContext("2d");

untangleGame.layers[2] = ctx;
// prepare layer 3 (ui)
var canvas_ui = document.getElementById("ui");
untangleGame.layers[3] = canvas_ui.getContext("2d");

// prepare layer 2 (game)
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

untangleGame.layers[2] = ctx;
// prepare layer 3 (ui)
var canvas_ui = document.getElementById("ui");
untangleGame.layers[3] = canvas_ui.getContext("2d");

untangleGame.levels =
[
    {
        "level": 0,
        "circles": [
            { "x": 400, "y": 156 },
            { "x": 381, "y": 241 },
            { "x": 84, "y": 233 },
            { "x": 88, "y": 73 }
        ],
        "relationship": {
            "0": { "connectedPoints": [1, 2] },
            "1": { "connectedPoints": [0, 3] },
            "2": { "connectedPoints": [0, 3] },
            "3": { "connectedPoints": [1, 2] }
        }
    },
    {
        "level": 1,
        "circles": [
            { "x": 401, "y": 73 },
            { "x": 400, "y": 240 },
            { "x": 88, "y": 241 },
            { "x": 84, "y": 72 }
        ],
        "relationship": {
            "0": { "connectedPoints": [1, 2, 3] },
            "1": { "connectedPoints": [0, 2, 3] },
            "2": { "connectedPoints": [0, 1, 3] },
            "3": { "connectedPoints": [0, 1, 2] }
        }
    },
    {
        "level": 2,
        "circles": [
            { "x": 112, "y": 105 },
            { "x": 273, "y": 33 },
            { "x": 413, "y": 106 },
            { "x": 410, "y": 234 },
            { "x": 268, "y": 295 },
            { "x": 115, "y": 236}],
        "relationship": {
            "0": { "connectedPoints": [2, 3, 4] },
            "1": { "connectedPoints": [3, 5] },
            "2": { "connectedPoints": [0, 4, 5] },
            "3": { "connectedPoints": [0, 1, 5] },
            "4": { "connectedPoints": [0, 2] },
            "5": { "connectedPoints": [1, 2, 3] }
        }
    }
];

function setupCurrentLevel() {
    untangleGame.circles = [];
    var level = untangleGame.levels[untangleGame.currentLevel];
    for (var i = 0; i < level.circles.length; i++) {
        untangleGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, untangleGame.circleRadius));
    }
    // setup line data after setup the circles.
    connectCircles();
    //updateLineIntersection();
}

function checkLevelCompleteness() {
    if ($("#progress").html() == "100") {
        if (untangleGame.currentLevel + 1 < untangleGame.levels.length)
            untangleGame.currentLevel++;
        setupCurrentLevel();
    }
}
function Point(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
}

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

function Line(startPoint, endPoint, thickness) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
}

function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCircle(ctx, x, y, radius) {
    // prepare the radial gradients fill style
    var circle_gradient = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, untangleGame.circleRadius);
    circle_gradient.addColorStop(0, "#fff");
    circle_gradient.addColorStop(1, "#cc0");
    ctx.fillStyle = circle_gradient;

    // draw the path
    ctx.beginPath();
    ctx.arc(x, y, untangleGame.circleRadius, 0, Math.PI * 2, true);
    ctx.closePath();

    // actually fill the circle path
    ctx.fill();
}

function drawLine(ctx, x1, y1, x2, y2, thickness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.setLineWidth(thickness);
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}

function connectCircles() {
    // connect the circles to each other with lines
    untangleGame.lines.length = 0;
    for (var i = 0; i < untangleGame.circles.length; i++) {
        var startPoint = untangleGame.circles[i];
        for (var j = 0; j < i; j++) {
            var endPoint = untangleGame.circles[j];
            untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThickness));
            
        }
    }
}

function isIntersect(line1, line2) {
    // convert line1 to general form of line: Ax+By = C
    var a1 = line1.endPoint.y - line1.startPoint.y;
    var b1 = line1.startPoint.x - line1.endPoint.x;
    var c1 = a1 * line1.startPoint.x + b1 * line1.endPoint.y;

    // convert line2 to general form of line: Ax+By = C
    var a2 = line2.endPoint.y - line2.startPoint.y;
    var b2 = line2.startPoint.x - line2.endPoint.x;
    var c2 = a2 * line2.startPoint.x + b2 * line2.endPoint.y;

    // calculate the intersection point
    var d = a1 * b2 - a2 * b1;

    // parallel when d is 0
    if (d == 0) {
        return false;
    } else {
        var x = (b2 * c1 - b1 * c2) / d;
        var y = (a1 * c2 - a2 * c1) / d;

        // check if the interception point is on both line segments
        if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) ||
            isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
            (isInBetween(line2.startPoint.x, x, line2.endPoint.x) ||
            isInBetween(line2.startPoint.y, y, line2.endPoint.y))) {
            return true;
        }

        return true;
    }
    return false;
}

// return true if b is between a and c,
// we exclude the result when a==b or b==c
function isInBetween(a, b, c) {
    // return false if b is almost equal to a or c.
    // this is to eliminate some floating point when
    // two value is equal to each other but different with 0.00000...0001
    if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
        return false;
    }
    // true when b is in between a and c
    return (a < b && b < c) || (c < b && b < a);
}

function updateLineIntersection() {
    // checking lines intersection and bold those lines.
    for (var i = 0; i < untangleGame.lines.length; i++) {
        for (var j = 0; j < i; j++) {
            var line1 = untangleGame.lines[i];
            var line2 = untangleGame.lines[j];
            // we check if two lines are intersected,
            // and bold the line if they are.
            if (isIntersect(line1, line2)) {
                line1.thickness = untangleGame.boldLineThickness;
                line2.thickness = untangleGame.boldLineThickness;
            }
        }
    }
}

function gameloop() {
    drawLayerGuide();
    drawLayerGame();
    drawLayerUI();
}

function drawLayerGuide() {
    var ctx = untangleGame.layers[1];
    clear(ctx);
    // draw the guide animation
    if (untangleGame.guideReady) {
        // the dimension of each frame is 80x130.
        var nextFrameX = untangleGame.guideFrame * 80;
        ctx.drawImage(untangleGame.guide, nextFrameX, 0, 80, 130, 325, 130, 80, 130);
    }
    // fade out the guideline after level 0
    if (untangleGame.currentLevel == 1) {
        $("#guide").addClass('fadeout');
    }
}

function drawLayerGame() {
    // get the reference of the canvas element and the drawing context.
    var ctx = untangleGame.layers[2];

    // draw the game state visually
    // clear the canvas before drawing.
    clear(ctx);

    // draw all remembered line
    for (var i = 0; i < untangleGame.lines.length; i++) {
        var line = untangleGame.lines[i];
        var startPoint = line.startPoint;
        var endPoint = line.endPoint;
        var thickness = line.thickness;
        drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness);
    }

    // draw all remembered circles
    for (var i = 0; i < untangleGame.circles.length; i++) {
        var circle = untangleGame.circles[i];
        drawCircle(ctx, circle.x, circle.y, circle.radius);
    }
}

function drawLayerUI() {
    var ctx = untangleGame.layers[3];
    clear(ctx);
    // draw the level progress text
    ctx.font = "26px 'Rock Salt'";
    ctx.fillStyle = "#dddddd";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Puzzle "+untangleGame.currentLevel+",Completeness: ", 60,ctx.canvas.height-80);
    ctx.fillText(untangleGame.progressPercentage+"%",450, ctx.canvas.height-80);
    // get all circles, check if the ui overlap with the game objects
    var isOverlappedWithCircle = false;
    for(var i in untangleGame.circles) {
        var point = untangleGame.circles[i];
        if (point.y > 310)
        {
            isOverlappedWithCircle = true;
        }
    }

    if (isOverlappedWithCircle)
    {
        $("#ui").addClass('dim');
    }
    else
    {
        $("#ui").removeClass('dim');
    }
}

function guideNextFrame() {
    untangleGame.guideFrame++;
    // there are only 6 frames (0-5) in the guide animation.
    // we loop back the frame number to frame 0 after frame 5.
    if (untangleGame.guideFrame > 5) {
        untangleGame.guideFrame = 0;
    }
}

function drawLayerBG() {
    var ctx = untangleGame.layers[0];
    clear(ctx);
    // draw the image background
    ctx.drawImage(untangleGame.background, 0, 0);
}

$(function () {
    // get the reference of canvas element.
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    clear(ctx);

    // draw bg
    var bg_gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    bg_gradient.addColorStop(0, "#cccccc");
    bg_gradient.addColorStop(1, "#efefef");
    ctx.fillStyle = bg_gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw the loading text
    ctx.font = "26px 'Patrick Hand', cursive";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333333";
    ctx.fillText("loading...", ctx.canvas.width / 2, canvas.height / 2);

    // load the background image
    untangleGame.background = new Image();
    untangleGame.background.onload = function () {
        drawLayerBG();
        setupCurrentLevel();
        // setup an interval to loop the game loop
        setInterval(gameloop, 30);
    }
    untangleGame.background.onerror = function () {
        console.log("Error loading the image.");
    }
    untangleGame.background.src = "../Content/images/board.png";

    // load the guide sprite image
    untangleGame.guide = new Image();
    untangleGame.guide.onload = function () {
        untangleGame.guideReady = true;
        // setup timer to switch the display frame of the guide sprite
        untangleGame.guideFrame = 0;
        setInterval(guideNextFrame, 500);
    }
    untangleGame.guide.src = "../Content/images/guide_sprite.png";

    var width = canvas.width;
    var height = canvas.height;

    // random 5 circles
//    var circlesCount = 5;
//    for (var i = 0; i < circlesCount; i++) {
//        var x = Math.random() * width;
//        var y = Math.random() * height;
//        drawCircle(ctx, x, y, untangleGame.circleRadius);
//        untangleGame.circles.push(new Circle(x, y, untangleGame.circleRadius));
//    }
//    connectCircles();
    //updateLineIntersection();

    // Add Mouse Event Listener to canvas
    // we find if the mouse down position is on any circle
    // and set that circle as target dragging circle.
    $("#layers").mousedown(function (e) {
        var canvasPosition = $(this).offset();
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        for (var i = 0; i < untangleGame.circles.length; i++) {
            var circleX = untangleGame.circles[i].x;
            var circleY = untangleGame.circles[i].y;
            var radius = untangleGame.circles[i].radius;
            if (Math.pow(mouseX - circleX, 2) + Math.pow(mouseY - circleY, 2) < Math.pow(radius, 2)) {
                untangleGame.targetCircle = i;
                untangleGame.guideReady = false;
                break;
            }
        }
    });

    // we move the target dragging circle when the mouse is moving
    $("#layers").mousemove(function (e) {

        if (untangleGame.targetCircle != undefined) {
            var canvasPosition = $(this).offset();
            var mouseX = e.layerX || 0;
            var mouseY = e.layerY || 0;
            var radius = untangleGame.circles[untangleGame.targetCircle].radius;
            untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY, radius);
        }
        connectCircles();
        //updateLineIntersection();
    });

    // We clear the dragging circle data when mouse is up
    $("#layers").mouseup(function (e) {
        untangleGame.targetCircle = undefined;

        // on every mouse up, check if the untangle puzzle is solved.
        checkLevelCompleteness();
    });
    // setup an interval to loop the game loop
    //setInterval(gameloop, 30);

});