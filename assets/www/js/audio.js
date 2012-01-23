// These are handles in PhoneGap to a media resource on a phone. There are two handles for the enemy
// sound, because frequently the player will click on a spot with two characters that overlap. If two
// enemies are overlapping, the sound will be off. You may want to have multiple ally sounds, but with
// only two allies this happened less often. This is all just a giant hack.
var backgroundMedia = null;
var enemyMedia1 = null;
var enemyMedia2 = null;
var allyMedia = null;

if (window.device)
{
    backgroundMedia = createAudioResource("/android_asset/guile_music.mp3", backgroundMedia);
    backgroundMedia.play();

    allyMedia = createAudioResource("/android_asset/catwail.wav", allyMedia);
    enemyMedia1 = createAudioResource("/android_asset/ninjastar.mp3", enemyMedia1);
    enemyMedia2 = createAudioResource("/android_asset/ninjastar.mp3", enemyMedia2);
}

function createAudioResource(src, media_var) {
    // Create Media object from src
    media_var = new Media(src, onSuccess, onError);

    return media_var;
}

// onSuccess Callback
function onSuccess() {
//  console.log("playAudio():Audio Success");
}

// onError Callback - do nothing for the game
function onError(error) {
//  alert('code: '    + error.code    + '\n' +
//        'message: ' + error.message + '\n');
}

