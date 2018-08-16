
import './popup.css';
const pingButton = document.getElementById('ping');
const clearButton = document.getElementById('clear');
const logNode = document.getElementById('log');

const readLog = cb => chrome.storage.sync.get(['entries'], cb);
const clearLog = cb => chrome.storage.sync.set({ entries: [] }, cb);

const appendToPersistentLog = data =>
  readLog(result => {
    const entries = result.entries || [];
    chrome.storage.sync.set({ entries: [...entries, data] });
  });

const renderEntry = root => ({ from, date, type }) => {
  const node = document.createElement('div');
  const dateString = new Date(date).toISOString();
  node.innerText = `${type} from ${from} at ${dateString}`.toUpperCase();
  root.appendChild(node);
};

const addLog = data => {
  renderEntry(logNode)(data);
  appendToPersistentLog(data);
};

const init = () =>
  readLog(({ entries }) => {
    const fragment = (entries || []).reduce((node, entry) => {
      renderEntry(node)(entry);
      return node;
    }, document.createDocumentFragment());
    logNode.appendChild(fragment);
  });

init();

pingButton.addEventListener('click', () => {
  const message = { from: 'popup', date: Date.now(), type: 'ping' };
  addLog(message);
  chrome.runtime.sendMessage(message, response => {
    console.log('Received message from background', response);
    addLog(response);
  });
});

clearButton.addEventListener('click', () => {
  clearLog();
  while (logNode.firstChild) {
    logNode.removeChild(logNode.firstChild);
  }
});
