// Play audio
//
function playAudio(src, media_var) {
    // Create Media object from src
    media_var = new Media(src, onSuccess, onError);

    // Play audio
    media_var.play();
}

// Pause audio
//
function pauseAudio(media_var) {
    if (media_var) {
        media_var.pause();
    }
}

// Stop audio
//
function stopAudio(media_var) {
    if (media_var) {
        media_var.stop();
    }
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}
