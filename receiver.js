const context = cast.framework.CastReceiverContext.getInstance();

const playerManager = context.getPlayerManager();

// Debug Logger
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const LOG_TAG = 'MyAPP.LOG';

// Enable HLS playback
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  loadRequestData => {
    console.log('Received LOAD request');
    if (loadRequestData.media.contentType === 'application/x-mpegURL') {
      console.log('HLS stream detected');
    }
    return loadRequestData;
  }
);

// Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
context.addEventListener(cast.framework.system.EventType.READY, () => {
  if (!castDebugLogger.debugOverlayElement_) {
      castDebugLogger.setEnabled(true);
  }
});

// Set verbosity level for Core events.
castDebugLogger.loggerLevelByEvents = {
  'cast.framework.events.category.CORE': cast.framework.LoggerLevel.INFO,
  'cast.framework.events.EventType.MEDIA_STATUS': cast.framework.LoggerLevel.DEBUG
};

// Set verbosity level for custom tags.
castDebugLogger.loggerLevelByTags = {
    LOG_TAG: cast.framework.LoggerLevel.DEBUG, // display all levels
};

context.start();
