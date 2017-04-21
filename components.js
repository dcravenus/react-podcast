class EpisodeDiv extends React.Component {
  render() {
    return React.createElement('div', {}, this.props.children.title);
  }
}

class PodcastCard extends React.Component {
  render() {
    let data = this.props.children;
    return React.createElement('div', {className: 'podcast-card'},
      React.createElement('a', {href: data.link},
        React.createElement('h1', {}, data.title)
      ),
      React.createElement('p', {}, data.description.long),
      React.createElement('img', {src: data.image}),
      React.createElement('div', {className: 'episodes'},
        data.episodes.map(function(episode, i){
          return React.createElement(EpisodeDiv, {key: i}, episode);
        })
      )
    );
  }
}

class PodcastsContainer extends React.Component {
  render() {
    return React.createElement('div', {className: "podcasts-container"},
      this.props.podcasts.map(function(podcast, i){
        return React.createElement(PodcastCard, {key: i}, podcast);
      })
    );
  }
}

module.exports = PodcastsContainer;