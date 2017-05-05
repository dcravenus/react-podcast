class EpisodeDiv extends React.Component {
  render() {
    var data = this.props.children;
    var date = new Date(data.published);
    date = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="episode-card">
        <div className="episode-title">{this.props.children.title}</div>
        <div className="episode-date">{date}</div>
        <p dangerouslySetInnerHTML={{__html: this.props.children.description}}></p>
        <audio src={data.enclosure.url} controls="controls"></audio>
      </div>
    );
  }
}

class PodcastCard extends React.Component {
  render() {
    if (this.props.hidden) return null;

    let data = this.props.podcast;
    if(!data.episodes) data.episodes = [];
    if(!data.description) data.description = {};

    return (
      <div className="podcast-card">
        <h1>{data.title}</h1>
        <div>
          <img src={data.image}/>
          <div className="episodes">
            {
              data.episodes.map(function(episode, i){
                return React.createElement(EpisodeDiv, {key: i}, episode);
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

class PodcastsContainer extends React.Component {
  constructor() {
    super();
    this.addPodcast = this.addPodcast.bind(this);
    this.state = {
      podcasts: []
    }
  }

  addPodcast(podcast) {
    this.state.podcasts.push(podcast);
  }

  render() {
    return React.createElement('div', {className: "podcasts-container"},
      this.podcasts.map(function(podcast, i){
        return React.createElement(PodcastCard, {key: i}, podcast);
      })
    );
  }
}

class PodcastTile extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    main.setState({
      currentPodcast: this.props.children,
      tileView: false
    });
  }

  render() {
    return (
      <div className="podcast-tile" onClick={this.handleClick}>
        <img src={this.props.children.image}/>
      </div>
    );
  }
}

class PodcastTiles extends React.Component {
  render() {
    if(this.props.hidden){
      return null
    } else {
      return React.createElement('div', {className: "podcast-tiles"},
        this.props.podcasts.map(function(podcast, i){
          return React.createElement(PodcastTile, {key: i}, podcast);
        })
      );
    }
  }
}

class Nav extends React.Component {
  constructor() {
    super();
    this.handleHomeClick = this.handleHomeClick.bind(this);
  }

  handleHomeClick() {
    main.setState({
      currentPodcast: {},
      tileView: true
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleHomeClick}>Home</button>
        <input id="podcast-url-input" type="text"/>
        <button onClick={getAndAddPodcast}>Add</button>
        <button onClick={removePodcast}>Remove</button>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(){
    super();
    this.state = {
      podcasts : [],
      currentPodcast : {},
      tileView: true
    };
  }

  updatePodcasts(podcasts) {
    this.setState({
      podcasts: podcasts
    });
  }

  updateCurrentPodcast(podcast) {
    this.setState({
      currentPodcast: podcast
    });
  }

  render() {
    return (
      <div>
        <Nav/>
        <PodcastTiles podcasts={this.state.podcasts} hidden={!this.state.tileView}/>
        <PodcastCard podcast={this.state.currentPodcast} hidden={this.state.tileView}/>
      </div>
    );
  }
}

module.exports = {
  PodcastTiles: PodcastTiles,
  PodcastsContainer: PodcastsContainer,
  Nav: Nav,
  Main: Main
};