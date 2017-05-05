// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const parsePodcast = require('node-podcast-parser');
const request = require('request');
const storage = require('electron-json-storage');

const {Main} = require('./dist/components.js');

window.podcastData = [];
window.main;

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

        data.url = url;
        resolve(data);
      });
    });
  });
}

window.getAndAddPodcast = function() {
  var podcastURLInput = document.getElementById('podcast-url-input');
  getPodcastDataFromURL(podcastURLInput.value).then(addPodcast);
};

function renderMain(){
  return ReactDOM.render(
    React.createElement(Main, {}, null),
    document.getElementById('podcasts-container')
  );
}

function addPodcast(data) {
  var index = podcastData.findIndex((podcast)=>podcast.title === data.title);

  if(~index){
    podcastData[index] = data;
  } else {
    podcastData.push(data);
  }

  storage.set('podcastData', podcastData);

  main.setState({
    podcasts: podcastData
  });

  if(main.state.currentPodcast.title){
    main.setState({
      currentPodcast: data,
      tileView: false
    });
  }

}

window.removePodcast = function() {
  var title = main.state.currentPodcast.title;
  var index = podcastData.findIndex((podcast)=>podcast.title === title);
  if(!~index) return;
  podcastData.splice(index, 1);
  storage.set('podcastData', podcastData);
  main.setState({
    podcasts: podcastData,
    currentPodcast: {},
    tileView: true
  });
}

window.refreshPodcasts = function() {
  podcastData.forEach((podcast)=>{
    getPodcastDataFromURL(podcast.url).then(addPodcast);
  });
}

function init() {
  storage.get('podcastData', function(err, data){
    podcastData = data;
    main = renderMain();
    main.setState({podcasts: podcastData});
    refreshPodcasts();
  });
}

init();