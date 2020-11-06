import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Consumer } from '../../context';
import Mic from '../layout/mic.svg';
import Voice from '../layout/voice.svg';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function Search1() {
  const [trackTitle, setTrackTitle] = useState('');
  const [isListening, setIsListing] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const findTrack = (dispatch, e) => {
    e.preventDefault();

    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?
        q_track=${trackTitle}&page_size=10&page=1&s_track_rating=desc&apikey=${process.env.REACT_APP_MM_KEY}`
      )
      .then((res) => {
        dispatch({
          type: 'SEARCH_TRACKS',
          payload: res.data.message.body.track_list,
        });
        setTrackTitle('');
        setIsListing(false);
      })
      .catch((err) => console.log(err));
  };

  const inputChange = (e) => {
    setTrackTitle(e.target.value);
  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click');
      };
    }
    mic.onstart = () => {
      console.log('Mics on');
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setTrackTitle(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  return (
    <Consumer>
      {(value) => {
        const { dispatch } = value;
        return (
          <div className="card card-body mb-4 p-4">
            <h1 className="display-4 text-center">
              <i className="fas fa-music"></i> Search For A Song
            </h1>
            <p className="lead text-center">Get the lyrics for any song</p>
            <form onSubmit={findTrack.bind(this, dispatch)}>
              <div className="form-group">
                <div className="input-group">
                  <input
                    autoComplete="off"
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Song title..."
                    name="trackTitle"
                    value={trackTitle}
                    onChange={inputChange}
                  />
                  <div
                    className="input-group-append"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsListing((prevState) => !prevState)}
                  >
                    <span className="input-group-text">
                      {isListening ? (
                        <img
                          src={Voice}
                          alt="micIcon"
                          style={{ height: '34px' }}
                        />
                      ) : (
                        <img
                          src={Mic}
                          alt="voiceIcon"
                          style={{ height: '34px' }}
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg btn-block mb-5"
                type="submit"
              >
                Get Track Lyrics
              </button>
            </form>
          </div>
        );
      }}
    </Consumer>
  );
}

export default Search1;
