var untangleGame = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: [],
    currentLevel: 0
};

untangleGame.levels =
[
    {
        "level" : 0,
        "circles" : [{"x" : 400, "y" : 156},
        {"x" : 381, "y" : 241},
        {"x" : 84, "y" : 233},
        {"x" : 88, "y" : 73}],
        "relationship" : {
            "0" : {"connectedPoints" : [1,2]},
            "1" : {"connectedPoints" : [0,3]},
            "2" : {"connectedPoints" : [0,3]},
            "3" : {"connectedPoints" : [1,2]}
        }
    },
    {
        "level": 1,
        "circles": [{ "x": 401, "y": 73 },
        { "x": 400, "y": 240 },
        { "x": 88, "y": 241 },
        { "x": 84, "y": 72}],
        "relationship": {
            "0": { "connectedPoints": [1, 2, 3] },
            "1": { "connectedPoints": [0, 2, 3] },
            "2": { "connectedPoints": [0, 1, 3] },
            "3": { "connectedPoints": [0, 1, 2] }
        }
    },
{
    "level": 2,
    "circles": [{ "x": 92, "y": 85 },
    { "x": 253, "y": 13 },
    { "x": 393, "y": 86 },
    { "x": 390, "y": 214 },
    { "x": 248, "y": 275 },
    { "x": 95, "y": 216}],
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
        untangleGame.circles.push(new Point(level.circles[i].x, level.circles[i].y, 10));
    }
}