$(document).ready(function () {
    msg = new SpeechSynthesisUtterance();
    var voices = speechSynthesis.getVoices(); //It needs to call getVoices() once.
});

$(".jp-pronounce").click(function (event) {
    var japanese = $(this).data("jp");
    if(japanese){
        msg.voice = speechSynthesis.getVoices().filter(function (voice) { return voice.name === "Google 日本語"; })[0];
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1;
        msg.lang = "ja-JP";
        msg.text = japanese;
        speechSynthesis.speak(msg);
    }
})