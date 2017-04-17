import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'

import ReactPlayer from 'react-player'

const VideoPlayer = React.createClass ({
  	getInitialState(){
      return{
          url: this.props.courseURL,
          playing: this.props.playing,
          volume: 0.8,
          played: 0,
          loaded: 0,
          duration: 0,
          playbackRate: 1.0,
          seeking: false,
      }
  },
  load(url){
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  },
  seekTo(time){
    this.player.seekTo(time);
  },
  playPause(){
    this.setState({ playing: !this.state.playing })
  },
  stop(){
    this.setState({ url: null, playing: false })
  },
  setVolume(e){
    this.setState({ volume: parseFloat(e.target.value) })
  },
  setPlaybackRate(e){
    console.log(parseFloat(e.target.value))
    this.setState({ playbackRate: parseFloat(e.target.value) })
  },
  onSeekMouseDown(e){
    this.setState({ seeking: true })
  },
  onSeekChange(e){
    this.setState({ played: parseFloat(e.target.value) })
  },
  onSeekMouseUp(e){
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
    console.log(this.state.duration);
    console.log(parseFloat(e.target.value))
  },
  onProgress(state){
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  },
  onClickFullscreen(){
    screenfull.request(findDOMNode(this.player))
  },
  renderLoadButton(url, label){
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  },
  getPlayedTime(){
    const time = this.state.duration * this.state.played;
    return {duration: time, played: this.state.played};
  },
  jumpToTime(time){
    this.player.seekTo(time)
    console.log(time)
  },
  render () {
    const {
      url, playing, volume,
      played, loaded, duration,
      playbackRate,
      soundcloudConfig,
      vimeoConfig,
      youtubeConfig,
      fileConfig
    } = this.state

    return (
      <div>
          <ReactPlayer
            ref={player => { this.player = player }}
            className='react-player'
            width={this.props.width}
            height={this.props.height}
            url={url}
            playing={playing}
            playbackRate={playbackRate}
            volume={volume}
            soundcloudConfig={soundcloudConfig}
            vimeoConfig={vimeoConfig}
            youtubeConfig={youtubeConfig}
            fileConfig={fileConfig}
            onReady={() => console.log('onReady')}
            onStart={() => console.log('onStart')}
            onPlay={() => this.setState({ playing: true })}
            onPause={() => this.setState({ playing: false })}
            onBuffer={() => console.log('onBuffer')}
            onEnded={() => this.setState({ playing: false })}
            onError={e => console.log('onError', e)}
            onProgress={this.onProgress}
            controls={this.props.controls}
            onDuration={duration => this.setState({ duration })}
          />
      </div>
    )
  }
})
export default VideoPlayer