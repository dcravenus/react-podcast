// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const parsePodcast = require('node-podcast-parser');
const request = require('request');
const storage = require('electron-json-storage');

const {PodcastsContainer, PodcastTiles, Main} = require('./dist/components.js');

const podcastURLInput = document.getElementById('podcast-url-input');
const addPodcastButton = document.getElementById('add-podcast-button');

window.podcastData = [];
window.main;

addPodcastButton.addEventListener('click', function(){
  getPodcastDataFromURL(podcastURLInput.value).then(addPodcast);
});


function getPodcastDataFromURL(url) {
  return new Promise((resolve, reject)=>{
    request(url, (err, res, data) => {
      if (err) {
        reject(err);
        return;
      }

      parsePodcast(data, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  });
}

function renderMain(){
  return ReactDOM.render(
    React.createElement(Main, {}, null),
    document.getElementById('podcasts-container')
  );
}

function addPodcast(data) {
  podcastData.push(data);
  storage.set('podcastData', podcastData);
  main.setState({
    podcasts: podcastData,
    currentPodcast: data
  });
}

function init() {
  storage.get('podcastData', function(err, data){
    podcastData = data;
    main = renderMain();
    main.setState({podcasts: podcastData});
  });
}

init();