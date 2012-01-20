var play;
var hit = 0;

function startplay() {
    var playTimeInSeconds = 10;
    var playTimeinMilliSeconds = playTimeInSeconds * 1000;

    $("#message").fadeOut('slow');
    $(".character").fadeOut('slow');;
    $("#hit").html("Score: 0");

    hit = 0;

    $("#btnstart").css("color", "#e3e3e3");
    $("#btnstart").unbind("click");
    $("#btnstart").slideUp();

    play = setInterval(scramble, 1800);

    setTimeout(function() {
        clearInterval(play);
        $("#btnstart").css("color", "#333333");
        $("#btnstart").bind("click", startplay);

        // show the final message
        var containerPos = $('#content_container').offset();
        $("#message").animate({
            top: containerPos.top,
            left: containerPos.left
        }, 'fast', function() {
            setTimeout(function() {
                showConfirm(hit);
                navigator.notification.vibrate(1000);
                $("#message").fadeIn('slow');
                $(".character").fadeIn('slow');
            }, 500);
        });
    }, playTimeinMilliSeconds);

    $('#note').countDown({
        startNumber: playTimeInSeconds,
        callBack: function(me) {

        }
    });
}

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function scramble() {
    var children = $('#container').children();

    var randomId = randomFromTo(1, children.length);
    moveRandom('char'+randomId);

    setTimeout(function(){
        $("#char"+randomId).slideDown('fast');
    }, 500);

    setTimeout(function() {
        $("#char"+randomId).slideUp('fast');
    }, 2500);
}

function moveRandom(id) {
    /* get container position and size
     * -- access method : cPos.top and cPos.left */
    var cPos = $('#container').offset();
    var cHeight = $('#container').height();
    var cWidth = $('#container').width();

    // get box padding (assume all padding have same value)
    var pad = parseInt($('#container').css('padding-top').replace('px', ''));

    // get movable box size
    var bHeight = $('#'+id).height();
    var bWidth = $('#'+id).width();

    // set maximum position
    maxY = cPos.top + cHeight - bHeight - pad;
    maxX = cPos.left + cWidth - bWidth - pad;

    // set minimum position
    minY = cPos.top + pad;
    minX = cPos.left + pad;

    // set new position
    newY = randomFromTo(minY, maxY);
    newX = randomFromTo(minX, maxX);

    $('#'+id).animate({
        top: newY,
        left: newX
    }, 'slow', function() {
    });
}


function onConfirm(button) {
    alert('You selected button ' + button);

    if (button == "1")
    {
        prompt("sometext","defaultvalue");
    }

}

function showConfirm(score) {
    compareScores(score)      ;

    navigator.notification.confirm(
        'Your score is: ' + score,  // message
        onConfirm,              // callback to invoke with index of button pressed
        'Game Over',            // title
        'OK'          // buttonLabels
    );
}

function saveHighScores(scoreList)
{
    for (i = 0; i < scoreList.length; i++)
    {
        if (scoreList[i].score != 0)
        {
            window.localStorage.setItem("score" + i, scoreList[i].score + "," + scoreList[i].nickname);
        }
    }
}

function compareScores(score)
{
    var currentHighScores = generateHighScoreList();


    // Rebuild high score list, save it
    saveHighScores(currentHighScores);

    var found = true;

    for (i = 1; i <= 10; i++)
    {
        if (window.localStorage.getItem("score" + i) != null)
        {
            if (score < window.localStorage.getItem("score" + i))
            {
                found = false;
            }
            else
            {
                found = true;
            }
        }
    }

    if (found == true)
    {
        alert("New high score!");
    }

}

function scoreSort(a, b) {
    if (a.score < b.score)
    {
        return 1;
    } else if (a.score == b.score)
    {
        return 0;
    } else {
        return -1;
    }
}

function generateHighScoreList() {
    var highscores = new Array();

    for (i = 1; i <= 10; i++) {
        var highscore = new Object();

        if (window.localStorage.getItem("score" + i) != null) {
            highscore.nickname = window.localStorage.getItem("score" + i).split(",")[1];
            highscore.score = window.localStorage.getItem("score" + i).split(",")[0];

        } else {
            highscore.nickname = "";
            highscore.score = 0;
        }

        highscores.push(highscore);
    }

    highscores.sort(scoreSort);

    return highscores;
}

/*
End Game Workflow:

    Build a JavaScript array/object of the current high scores. Account for < 10 entries, or even 0 entries.
    Compare the player's score against the high scores.
    If the player's score is equal to or higher than the lowest existing high score:
        Remove the lowest high score
        Ask the user for their nickname
        Add the entry for the user's high score and nickname

    Else:
        Display message: "Game over, you did not set a new high score"

*/