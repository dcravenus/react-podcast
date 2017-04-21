// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const parsePodcast = require('node-podcast-parser');
const request = require('request');
const storage = require('electron-json-storage');

const {PodcastsContainer, PodcastTiles} = require('./components.js');

const podcastURLInput = document.getElementById('podcast-url-input');
const addPodcastButton = document.getElementById('add-podcast-button');

window.podcastData = [];


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

function renderPodcastTiles(){
  ReactDOM.render(
    React.createElement(PodcastTiles, {podcasts: podcastData}, null),
    document.getElementById('podcasts-container')
  );
}

function renderPodcastsContainer(podcasts){
  ReactDOM.render(
    React.createElement(PodcastsContainer, {podcasts: podcasts}, null),
    document.getElementById('podcasts-container')
  );
}

function addPodcast(data) {
  podcastData.push(data);
  storage.set('podcastData', podcastData);
  renderPodcastTiles();
}

function init() {
  storage.get('podcastData', function(err, data){
    podcastData = data;
    renderPodcastTiles();
  });
}

init();