var startBtn, stopBtn, hypothesisDiv, phraseDiv, statusDiv;
var key, languageOptions, formatOptions, recognitionMode, inputSource, filePicker;
var SDK;
var recognizer;
var previousSubscriptionKey;

document.addEventListener("DOMContentLoaded", function () {
    createBtn = document.getElementById("createBtn");
    startBtn = document.getElementById("startBtn");
    stopBtn = document.getElementById("stopBtn");
    phraseDiv = document.getElementById("phraseDiv");
    hypothesisDiv = document.getElementById("hypothesisDiv");
    statusDiv = document.getElementById("statusDiv");
    key = document.getElementById("key");
    languageOptions = document.getElementById("languageOptions");
    formatOptions = document.getElementById("formatOptions");
    inputSource = document.getElementById("inputSource");
    recognitionMode = document.getElementById("recognitionMode");
    filePicker = document.getElementById('filePicker');

    languageOptions.addEventListener("change", Setup);
    formatOptions.addEventListener("change", Setup);
    recognitionMode.addEventListener("change", Setup);

    startBtn.addEventListener("click", function () {
        if (key.value == "" || key.value == "YOUR_BING_SPEECH_API_KEY") {
            alert("Please enter your Bing Speech subscription key!");
            return;
        }
        if (inputSource.value === "File") {
            filePicker.click();
        } else {
            if (!recognizer || previousSubscriptionKey != key.value) {
                previousSubscriptionKey = key.value;
                Setup();
            }

            hypothesisDiv.innerHTML = "";
            phraseDiv.innerHTML = "";
            RecognizerStart(SDK, recognizer);
            startBtn.disabled = true;
            stopBtn.disabled = false;
        }
    });

    key.addEventListener("focus", function () {
        if (key.value == "YOUR_BING_SPEECH_API_KEY") {
            key.value = "";
        }
    });

    key.addEventListener("focusout", function () {
        if (key.value == "") {
            key.value = "YOUR_BING_SPEECH_API_KEY";
        }
    });

    filePicker.addEventListener("change", function () {
        Setup();
        hypothesisDiv.innerHTML = "";
        phraseDiv.innerHTML = "";
        RecognizerStart(SDK, recognizer);
        startBtn.disabled = true;
        stopBtn.disabled = false;
        filePicker.value = "";
    });

    stopBtn.addEventListener("click", function () {
        RecognizerStop(SDK, recognizer);
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    Initialize(function (speechSdk) {
        SDK = speechSdk;
        startBtn.disabled = false;
    });
});

function Setup() {
    if (recognizer != null) {
        RecognizerStop(SDK, recognizer);
    }
    recognizer = RecognizerSetup(SDK, recognitionMode.value, languageOptions.value, SDK.SpeechResultFormat[formatOptions.value], key.value);
}

function UpdateStatus(status) {
    statusDiv.innerHTML = status;
}

function UpdateRecognizedHypothesis(text, append) {
    if (append)
        hypothesisDiv.innerHTML += text + " ";
    else
        hypothesisDiv.innerHTML = text;

    var length = hypothesisDiv.innerHTML.length;
    if (length > 403) {
        hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length - 400, length);
    }
}

function OnSpeechEndDetected() {
    stopBtn.disabled = true;
}

function UpdateRecognizedPhrase(json) {
    hypothesisDiv.innerHTML = "";
    phraseDiv.innerHTML += json + "\n";
}

function OnComplete() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
}