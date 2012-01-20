var play;
var gameScore = 0;

function startplay() {
    var playTimeInSeconds = 30;
    var playTimeinMilliSeconds = playTimeInSeconds * 1000;

    $("#gameover_overlay").fadeOut('slow');

    $(".character").fadeOut('slow');;

    $("#gameScore").html("Score: 0");

    gameScore = 0;

    $("#startButton").unbind("click");
    $("#startButton").slideUp();
    $("#stat h2").slideUp();

    play = setInterval(scramble, 800);

    setTimeout(function() {
        clearInterval(play);
        $("#startButton").css("color", "#333333");
        $("#startButton").bind("click", startplay);

        // End the game, show the overlay and dialog boxes.
        var containerPos = $('#content_container').offset();

        $("#gameover_overlay").animate({
            top: containerPos.top,
            left: containerPos.left
        }, 'fast', function() {
            setTimeout(function() {
                $("#gameover_overlay").fadeIn('slow');
                $("#note").hide();
                $(".character").hide();
                showConfirm(gameScore);
                $("#gameover_overlay").fadeOut('slow');

                $("#startButton").slideDown();
                $("#startButton").bind("click");
                $("#note").html("");
                $("#note").show();
            }, 500);
        });
    }, playTimeinMilliSeconds);

    $('#note').countDown({
        startNumber: playTimeInSeconds,
        callBack: function(me) {}
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
        $("#char"+randomId).fadeIn('fast');
    }, 300);

    setTimeout(function() {
        $("#char"+randomId).fadeOut('fast');
    }, 1250);
}

function moveRandom(id) {
    var containerPositionOffset = $('#container').offset();
    var containerHeight = $('#container').height();
    var containerWidth = $('#container').width();

    var containerPadding = parseInt($('#container').css('padding-top').replace('px', ''));

    var bHeight = $('#'+id).height();
    var bWidth = $('#'+id).width();

    var maximumY = containerPositionOffset.top + containerHeight - bHeight - containerPadding;
    var maximumX = containerPositionOffset.left + containerWidth - bWidth - containerPadding;

    var minimumY = containerPositionOffset.top + containerPadding;
    var minimumX = containerPositionOffset.left + containerPadding;

    var newY = randomFromTo(minimumY, maximumY);
    var newX = randomFromTo(minimumX, maximumX);

    $('#'+id).animate(
        {
            top: newY,
            left: newX
        },
        'fast',
        function() {}
    );
}

function showConfirm(score) {
    var currentHighScores = compareScores(score);

    if (currentHighScores != null)
    {
        var nickname = prompt("New High Score! Enter your nickname:", "");

        if (nickname == null || nickname == "")
        {
            return;
        }

        var currentHighScores = updateHighScore(score, nickname, currentHighScores);
        saveHighScores(currentHighScores);
    }
    else
    {
        alert("Game Over, you did not set a high score.");
    }

    return;
}
