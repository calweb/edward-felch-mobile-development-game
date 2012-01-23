// Play audio
//
function createAudioResource(src, media_var) {
    // Create Media object from src
    media_var = new Media(src, onSuccess, onError);

    // Play audio
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

