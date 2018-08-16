chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'popup') {
    console.log('Received ping from popup at', new Date());
    setTimeout(
      () =>
        sendResponse({
          from: 'background',
          date: Date.now(),
          type: 'pong'
        }),
      1500
    );
  } else {
    console.error('Unknown sender', request);
  }
  return true;
});
