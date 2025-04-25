const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();


const castDebugLogger = cast.debug.CastDebugLogger.getInstance();

// castDebugLogger.setEnabled(true);
// castDebugLogger.showDebugLogs(true);
context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);

context.addCustomMessageListener('urn:x-cast:app.ha.custom', (event) => {
    castDebugLogger.info("ChromecastLog", event);
    const data = event.data;
    if (data.type === 'UPDATE_TITLE') {
        const media = playerManager.getMediaInformation();
        if (media) {
            castDebugLogger.info("ChromecastLog", "try to set title");
            media.metadata.title = data.title;
            playerManager.setMediaInformation(media);
        } else {
            castDebugLogger.info("ChromecastLog", "media not found");
        }
    }
    if (data.type === 'AUDIO_SWITCH') {
        castDebugLogger.info("ChromecastLog", "Change audio");
        playerManager.getShakaPlayer().selectVariantsByLabel(data.audio, true);
    }
});

playerManager.addEventListener(
    cast.framework.events.EventType.PLAYER_LOAD_COMPLETE, () => {
        castDebugLogger.info("ChromecastLog", "PLAYER_LOAD_COMPLETE");
        const audio = playerManager.getMediaInformation().customData?.audio;
        castDebugLogger.info("ChromecastLog", `audio: ${audio}`);
        if (audio) {
            const tracks = playerManager.getShakaPlayer().getVariantTracks().filter(item => item.originalAudioId == audio);
            castDebugLogger.info("ChromecastLog", `tracks: ${tracks}`);
            if (tracks.length > 0) {
                playerManager.getShakaPlayer().selectVariantsByLabel(audio, true);
            }
        }
    });

let castReceiverOptions = new cast.framework.CastReceiverOptions();
castReceiverOptions.useShakaForHls = true;
context.start(castReceiverOptions);
