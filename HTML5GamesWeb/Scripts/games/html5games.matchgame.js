var matchingGame = {};
matchingGame.deck = [
    'cardAQ', 'cardAQ',
    'cardAK', 'cardAK',
    'cardBQ', 'cardBQ',
    'cardBK', 'cardBK',
    'cardCQ', 'cardCQ',
    'cardCK', 'cardCK'
];

matchingGame.savingObject = {};
matchingGame.savingObject.deck = [];

// an array to store which card is removed by storing their index.
matchingGame.savingObject.removedCards = [];

// store the counting elapsed time.
matchingGame.savingObject.currentElapsedTime = 0;

function shuffle() {
    return 0.5 - Math.random();
}

function selectCard() {
    // we do nothing if there are already two card flipped.
    if ($(".card-flipped").size() > 1) {
        return;
    }
    $(this).addClass("card-flipped");
    // check the pattern of both flipped card 0.7s later.
    if ($(".card-flipped").size() == 2) {
        setTimeout(checkPattern, 700);
    }
}

function checkPattern() {
    if (isMatchPattern()) {
        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        $(".card-removed").bind("webkitTransitionEnd", removeTookCards);
    } else {
        $(".card-flipped").removeClass("card-flipped");
    }
}

function isMatchPattern() {
    var cards = $(".card-flipped");
    var pattern = $(cards[0]).data("pattern");
    var anotherPattern = $(cards[1]).data("pattern");
    return (pattern == anotherPattern);
}

function removeTookCards() {
    // add each removed card into the array which store which cards are removed
    $(".card-removed").each(function(){
        matchingGame.savingObject.removedCards.push($(this).data("card-index"));
        $(this).remove();
    });

    // check if all cards are removed and show game over
    if ($(".card").length == 0) {
        gameover();
    }
}

function gameover() {
    // stop the timer
    clearInterval(matchingGame.timer);

    // set the score in the game over popup
    $(".score").html($("#elapsed-time").html());

    // load the saved last score from local storage
    var lastElapsedTime = localStorage.getIte("last-elapsed-time");

    // check if there is no any saved record
    lastScoreObj = JSON.parse(lastScore);
    if (lastScoreObj == null) {
        // create an empty record if there is no any saved record
        lastScoreObj = { "savedTime": "no record", "score": 0 };
    }
    var lastElapsedTime = lastScoreObj.score;

    // convert the elapsed seconds into minute:second format
    // calculate the minutes and seconds from elapsed time
    var minute = Math.floor(lastElapsedTime / 60);
    var second = lastElapsedTime % 60;

    // add padding 0 if minute and second is less then 10
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

    // display the last elapsed time in game over popup
    $(".last-score").html(minute + ":" + second);

    // display the saved time of last score
    var savedTime = lastScoreObj.savedTime;
    $(".saved-time").html(savedTime);

    // get the current datetime
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    // add padding 0 to minutes
    if (minutes < 10) minutes = "0" + minutes;
    var seconds = currentTime.getSeconds();
    // add padding 0 to seconds
    if (seconds < 10) seconds = "0" + seconds;

    var now = day+"/"+month+"/"+year+""+hours+":"+minutes+":"+seconds;

    //construct the object of datetime and game score
    var obj = { "savedTime": now, "score": matchingGame.elapsedTime};

    // save the score into local storage
    localStorage.setItem("last-elapsed-time", matchingGame.elapsedTime);

    // show the game over popup
    $("#popup").removeClass("hide");

    if (lastElapsedTime == 0 || matchingGame.elapsedTime < lastElapsedTime) {
        $(".ribbon").removeClass("hide");
    }

    //at last, we clear the saved savingObject
    localStorage.removeItem("savingObject");
}

function saveSavingObject() {
    // save the encoded saving object into local storage
    localStorage["savingObject"] = JSON.stringify(matchingGame.savingObject);
}
function countTimer() {
    matchingGame.elapsedTime++;

    // save the current elapsed time into savingObject.
    matchingGame.savingObject.currentElapsedTime = matchingGame.elapsedTime;
    saveSavingObject();

    // calculate the minutes and seconds from elapsed time
    var minute = Math.floor(matchingGame.elapsedTime / 60);
    var second = matchingGame.elapsedTime % 60;

    // add padding 0 if minute and second is less then 10
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

    // display the elapsed time
    $("#elapsed-time").html(minute + ":" + second);
}

// Returns the saved savingObject from the local storage.
function savedSavingObject() {
    // returns the saved saving object from local storage
    var savingObject = localStorage["savingObject"];
    if (savingObject != undefined) {
        savingObject = JSON.parse(savingObject);
    }
    return savingObject;
}

$(function () {
    saveSavingObject();

    // start the timer
    matchingGame.timer = setInterval(countTimer, 1000);

    // reset the elapsed time to 0.
    matchingGame.elapsedTime = 0;

    matchingGame.deck.sort(shuffle);

    // re-create the saved deck
    var savedObject = savedSavingObject();
    if (savedObject != undefined) {
        matchingGame.deck = savedObject.deck;
    }

    // copying the deck into saving object.
    matchingGame.savingObject.deck = matchingGame.deck.slice();

    // clone 12 copies of the card
    for (var i = 0; i < 11; i++) {
        $(".card:first-child").clone().appendTo("#cards");
    }


    // initialize each card's position
    $("#cards").children().each(function (index) {
        // align the cards to be 4x3 ourselves.
        $(this).css({
            "left": ($(this).width() + 20) * (index % 4),
            "top": ($(this).height() + 20) * Math.floor(index / 4)
        });

        // get a pattern from the shuffled deck
        var pattern = matchingGame.deck.pop();

        // visually apply the pattern on the card's back side.
        $(this).find(".back").addClass(pattern);

        // embed the pattern data into the DOM element.
        $(this).attr("data-pattern", pattern);

        // listen the click event on each card DIV element.
        $(this).click(selectCard);
    });

});