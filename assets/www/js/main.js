var play;
var gameScore = 0;

var playTimeInSeconds = 30;
var playTimeInMilliSeconds = playTimeInSeconds * 1000;

var characterFadeInTime = 400;
var characterFadeOutTime = 1750;

var characterClickedEffectTime = 250;
var characterClickedVibrateTimeAlly = 50;
var characterClickedVibrateTimeEnemy = 50;

var characterScrambleTime = 650;
var characterScrambleTravelTime = 550;

var gameOverOverlayFadeInTime = 500;

var backgroundMedia = null;
var enemyMedia = null;
var allyMedia = null;

function backButtonStop()
{
    if (window.device && backgroundMedia)
    {
        backgroundMedia.stop();
    }

    document.removeEventListener("backbutton");
    $.mobile.changePage("ui.html");
}

function startGame() {
    if (window.device)
    {
        document.addEventListener("backbutton", backButtonStop, false);

        backgroundMedia = createAudio("/android_asset/guile_music.mp3", backgroundMedia);
        backgroundMedia.play();

        allyMedia = createAudio("/android_asset/catwail.wav", allyMedia);
        enemyMedia = createAudio("/android_asset/ninjastar.mp3", enemyMedia);
    }

    $("#gameover_overlay").fadeOut('slow');

    $(".character").fadeOut('slow');;

    $("#gameScore").html("Score: 0");

    gameScore = 0;

    $("#startButton").unbind("click");
    $("#startButton").slideUp();
    $("#stat h2").slideUp();

    play = setInterval(scramble, characterScrambleTime);

    setTimeout(function() {
        clearInterval(play);
        $("#startButton").css("color", "#333333");
        $("#startButton").bind("click", startGame);

        // End the game, show the overlay and dialog boxes.
        var containerPos = $('#content_container').offset();

        $("#gameover_overlay").animate({
            top: containerPos.top,
            left: containerPos.left
        }, 'fast', function() {
            setTimeout(function() {
                if (window.device)
                {
                    backgroundMedia.stop();
                }
                $("#gameover_overlay").fadeIn('slow');
                $("#note").hide();
                $(".character").hide();
                showConfirm(gameScore);
                $("#gameover_overlay").fadeOut('slow');

                $("#startButton").slideDown();
                $("#startButton").bind("click");
                $("#note").html("");
                $("#note").show();
            }, gameOverOverlayFadeInTime);
        });
    }, playTimeInMilliSeconds);

    $('#note').countDown({
        startNumber: playTimeInSeconds,
        callBack: function(e) {}
    });
}

function randomMinMax(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function scramble() {
    var children = $('#container').children();

    var randomCharacterId = randomMinMax(1, children.length);

    if ($("#char"+randomCharacterId).hasClass("active"))
    {
        return;
    }

    moveRandom('char'+randomCharacterId);

    setTimeout(function(){
        $("#char"+randomCharacterId).addClass("active");
        $("#char"+randomCharacterId).fadeIn('fast');
    }, characterFadeInTime);

    setTimeout(function() {
        $("#char"+randomCharacterId).removeClass("active");
        $("#char"+randomCharacterId).fadeOut(100);
    }, characterFadeOutTime);
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

    var newY = randomMinMax(minimumY, maximumY);
    var newX = randomMinMax(minimumX, maximumX);

    $('#'+id).animate(
        {
            top: newY,
            left: newX
        },
        characterScrambleTravelTime,
        function() {}
    );
}

function showConfirm(score) {
    var currentHighScores = compareScores(score);

    if (currentHighScores != null)
    {
        var nickname = prompt("New High Score! Enter your name:", "");

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
