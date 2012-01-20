function updateHighScore(score, nickname, highScores)
{
    for (i = 0; i < highScores.length; i++)
    {
        if (highScores[i].nickname == "<new player>")
        {
            highScores[i].nickname = nickname;
        }
    }

    highScores.sort(scoreSort);

    return highScores;
}

function compareScores(score)
{
    if (score <= 0)
    {
        return null;
    }

    var maxSizeList = 0;

    var currentHighScores = generateHighScoreList();

    var newScore = new Object();
    newScore.score = score;
    newScore.nickname = "<new player>";

    currentHighScores.push(newScore);

    currentHighScores.sort(scoreSort);

    if (currentHighScores.length > 10)
    {
        maxSizeList = 10;
    }
    else
    {
        maxSizeList = currentHighScores.length;
    }

    for (i = 0; i < maxSizeList; i++)
    {
        if (currentHighScores[i].nickname == "<new player>")
        {
            return currentHighScores;
        }
    }

    return null;
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
    var highScores = new Array();

    for (i = 0; i < 10; i++) {
        var highScore = new Object();

        if (window.localStorage.getItem("score" + i) != null) {
            highScore.nickname = window.localStorage.getItem("score" + i).split(",")[1];
            highScore.score = window.localStorage.getItem("score" + i).split(",")[0];

        } else {
            highScore.nickname = "";
            highScore.score = 0;
        }

        highScores.push(highScore);
    }

    highScores.sort(scoreSort);

    return highScores;
}

function saveHighScores(scoreList)
{
    for (i = 0; i < scoreList.length; i++)
    {
        window.localStorage.setItem("score" + i, scoreList[i].score + "," + scoreList[i].nickname);
    }
}

function buildScoreList(list)
{
    list.sort(scoreSort);

    for (i = 0; i < list.length; i++)
    {
        if (list[i].score > 0)
        {
            var scoreEntry = '<li><span class="player">'+list[i].nickname+'</span><span class="score">'+list[i].score+'</span></li>';
            $("#high_scores").append(scoreEntry);
        }
    }
}