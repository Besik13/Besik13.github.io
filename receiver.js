const context = cast.framework.CastReceiverContext.getInstance();

const playerManager = context.getPlayerManager();

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

// Optional: add event logging
playerManager.addEventListener(
  cast.framework.events.EventType.MEDIA_STATUS,
  event => {
    console.log(`Player State Changed: ${event}`);
  }
);

context.start();
