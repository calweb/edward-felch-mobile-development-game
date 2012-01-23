// Handle for the actual game, this holds the interval for how long between characters are scrambled.
var play;
var gameScore = 0;

// How long the game will last.
var playTimeInSeconds = 30;
var playTimeInMilliSeconds = playTimeInSeconds * 1000;

// How quickly a new character appears on the screen once it is scrambled.
var characterFadeInTime = 400;

// How long before the character disappears, adjust this to make the game easier or harder.
var characterFadeOutTime = 1750;

// How long before another character is scrambled, adjust this to make the game easier or harder.
var characterScrambleTime = 650;
var characterScrambleTravelTime = 550;

// Effects when a character is clicked.
var characterClickedEffectTime = 250;
var characterClickedVibrateTimeAlly = 50;
var characterClickedVibrateTimeEnemy = 50;

// How long it takes for the game over overlay to fade in.
var gameOverOverlayFadeInTime = 500;

// These are handles in PhoneGap to a media resource on a phone. There are two handles for the enemy
// sound, because frequently the player will click on a spot with two characters that overlap. If two
// enemies are overlapping, the sound will be off. You may want to have multiple ally sounds, but with
// only two allies this happened less often. This is all just a giant hack.
var backgroundMedia = null;
var enemyMedia1 = null;
var enemyMedia2 = null;
var allyMedia = null;

// A hack to check which media handle was last used to play an enemy sound.
var lastUsedEnemyMedia = "";

// Intercept the back button on an Android phone when the game is in session, stop the background music.
function backButtonStop()
{
    if (window.device && backgroundMedia)
    {
        backgroundMedia.stop();
    }

    document.removeEventListener("backbutton");
    clearInterval(play);
    play = null;
    gameScore = 0;
    $.mobile.changePage("ui.html");
}

function startGame() {
    if (window.localStorage.getItem("difficulty") && window.localStorage.getItem("difficulty") != "normal")
    {
        if (window.localStorage.getItem("difficulty") == "easy")
        {
            characterFadeOutTime = 2500;
            characterScrambleTime = 1000;
        }
        else
        {
            characterFadeOutTime = 1000;
            characterScrambleTime = 300;
            characterScrambleTravelTime = 100;
        }

    }

    if (window.device)
    {
        document.addEventListener("backbutton", backButtonStop, false);

        backgroundMedia = createAudioResource("/android_asset/guile_music.mp3", backgroundMedia);
        backgroundMedia.play();

        allyMedia = createAudioResource("/android_asset/catwail.wav", allyMedia);
        enemyMedia1 = createAudioResource("/android_asset/ninjastar.mp3", enemyMedia1);
        enemyMedia2 = createAudioResource("/android_asset/ninjastar.mp3", enemyMedia2);
    }

    $("#gameover_overlay").fadeOut('slow');

    $(".character").fadeOut('slow');;

    $("#gameScore").html("Score: 0");

    gameScore = 0;

    $("#startButton").unbind("click");
    $("#startButton").slideUp();
    $("#stat h2").slideUp();

    // Begin scrambling characters.
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

// Move a random character that is not already active.
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

// Get the height and width of the container that characters can appear in.
// This handles phones, browsers, etc. of different resolutions.
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
