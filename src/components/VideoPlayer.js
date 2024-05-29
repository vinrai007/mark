import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import videoSource from '../components/ronaldo.mp4'; // Import the video file
import { SketchPicker } from 'react-color'; // Import the color picker component

const VideoContainer = styled.div`
  position: relative;
  max-width: 70%;
  margin: auto;

  @media (max-width: 1000px) {
    max-width: 95%;
    padding-top:50px;
  }
  @media (max-width: 650px) {
    // max-width: 95%;
    padding-top:100px;
  }  
`;

const StyledVideo = styled.video`
  width: 100%;
  height: auto;
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  background: rgba(0, 0, 0, 0.5);
`;

const SeekBar = styled.input`
  max-width: 80%;
  flex-grow: 1;
  margin: 0 10px;
`;

const Button = styled.button`
  background-color: transparent;
  padding: 0px 5px;
  border: none;
  cursor: pointer;
  outline: none;
  color: white;
  font-size: 16px;
`;

const SettingsMenu = styled.div`
  position: absolute;
  bottom: 34px;
  right: 0;
  display:flex;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ccc;
  padding: 1px 10px;
  display: ${({ show }) => (show ? 'block' : 'none')};
  label {
    color: white;
    margin-bottom:20px;
  }
  span {
    color: white;
  }
  z-index:100;    
`;

const MenuItem = styled.div`
  padding: 10px 10px;
  cursor: pointer;
  
  label {
    color: black;
    margin-bottom:20px;
  }
  // &:hover {
    background-color: #f0f0f0;
  // }
`;

const SubtitleContainer = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  text-align: center;
  // z-index:100;
`;

const Subtitle = styled.p`
  display: inline-block;
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: ${(props) => props.$fontSize};
`;

const VideoPlayer = ({ settings }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSubtitlesOn, setIsSubtitlesOn] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
  const [showBgMenu, setShowBgMenu] = useState(false);

  const [subtitleSettings, setSubtitleSettings] = useState(settings);
  const videoRef = useRef(null);
  const seekBarRef = useRef(null);
// Subtitles
  const subtitles = [
    { start: 1, end: 3, text: "Madeira, Manchester, Madrid," },
    { start: 3, end: 7, text: "Turin and Manchester again." },
    { start: 7, end: 17, text: "CROWD CHEERING" },
    { start: 17, end: 19, text: "Wreathed in red." },
    { start: 19, end: 23, text: "Restored to this great gallery of the game." },
    { start: 23, end: 25, text: "A walking work of art. " },
    { start: 26, end: 27, text: "Vintage." },
    { start: 27, end: 30, text: "Beyond valuation, beyond forgery or imitation." },
    { start: 31, end: 35, text: "18 years since that trembling teenager of" },
    { start: 35, end: 37, text: "touch and tease " },
    { start: 37, end: 40, text: "first tiptoed onto this storied stage." },
    { start: 40, end: 43, text: "Now in his immaculate maturity." },
    { start: 43, end: 47, text: "CR7 reunited." },
  ];
// function for play-pause
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error('Error attempting to play:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
// function for time update
  const handleTimeUpdate = () => {
    if (videoRef.current && seekBarRef.current) {
      const currentTime = videoRef.current.currentTime;
      seekBarRef.current.value = (currentTime / videoRef.current.duration) * 100;

      const currentSubtitle = subtitles.find(
        (sub) => currentTime >= sub.start && currentTime <= sub.end
      );
      setSubtitle(currentSubtitle ? currentSubtitle.text : '');
    }
  };
// function for seek
  const handleSeek = (event) => {
    if (videoRef.current) {
      const seekTo = (event.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTo;
    }
  };
// finction for mute
  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
// function for fullscreen
  const handleFullscreenToggle = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        if (!document.fullscreenElement) {
          videoRef.current.requestFullscreen().catch((error) => {
            console.error('Error attempting to enable fullscreen:', error);
          });
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    }
  };
// function for subtitle customization
  const handleSubtitlesToggle = () => {
    setIsSubtitlesOn(!isSubtitlesOn);
  };

  const handleSettingsMenuToggle = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };
  const handleColorToggle = () => {
    setShowColorMenu(!showColorMenu);
  };  
  const handleBgToggle = () => {
    setShowBgMenu(!showBgMenu);
  };
  const handleFontSizeChange = (event) => {
    const fontSize = `${event.target.value}px`;
    setSubtitleSettings((prevSettings) => ({
      ...prevSettings,
      fontSize,
    }));
  };

  const handleBackgroundColorChange = (color) => {
    setSubtitleSettings((prevSettings) => ({
      ...prevSettings,
      background: color.hex,
    }));
  };

  const handleFontColorChange = (color) => {
    setSubtitleSettings((prevSettings) => ({
      ...prevSettings,
      color: color.hex,
    }));
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  return (
    <VideoContainer>
      <StyledVideo
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        controls={false}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </StyledVideo>

      {/* control panel  */}
      
      <Controls>
        <Button onClick={handlePlayPause}>
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
              <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
            </svg>
          )}
        </Button>
        <SeekBar
          type="range"
          ref={seekBarRef}
          defaultValue="0"
          onChange={handleSeek}
        />
        <Button onClick={handleMuteToggle}>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-mute-fill" viewBox="0 0 16 16">
              <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06m7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-volume-up-fill" viewBox="0 0 16 16">
              <path d="M11.536 14.01a.5.5 0 0 1-.697-.716A5.98 5.98 0 0 0 13 8a5.98 5.98 0 0 0-2.161-4.702.5.5 0 1 1 .697-.716A6.98 6.98 0 0 1 14 8a6.98 6.98 0 0 1-2.464 6.01m1.972-1.972a.5.5 0 0 1-.707-.707A3.986 3.986 0 0 0 13 8a3.986 3.986 0 0 0-1.199-2.83.5.5 0 1 1 .707-.707A4.986 4.986 0 0 1 14 8a4.986 4.986 0 0 1-1.492 3.538m-1.832-1.83a.5.5 0 0 1-.707-.707c.284-.285.44-.677.44-1.082a1.51 1.51 0 0 0-.44-1.082.5.5 0 0 1 .707-.707c.48.48.733 1.122.733 1.789 0 .667-.253 1.309-.733 1.789M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
            </svg>
          )}
        </Button>
        <Button onClick={handleFullscreenToggle}>
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
            </svg>
          )}
        </Button>
        <Button onClick={handleSubtitlesToggle}>
          {isSubtitlesOn ?
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-badge-cc-fill" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm3.027 4.002c-.83 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05H7.36v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747C2.5 6.051 3.414 5 5.018 5c1.318 0 2.29.813 2.342 2v.11H6.213c-.048-.638-.505-1.108-1.186-1.108m6.14 0c-.831 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.318 1.727.69 0 1.139-.435 1.187-1.05H13.5v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.751 2.518-2.751 1.318 0 2.29.813 2.342 2v.11h-1.147c-.048-.638-.505-1.108-1.187-1.108z"/>
            </svg>            :
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-badge-cc" viewBox="0 0 16 16">
            <path d="M3.708 7.755c0-1.111.488-1.753 1.319-1.753.681 0 1.138.47 1.186 1.107H7.36V7c-.052-1.186-1.024-2-2.342-2C3.414 5 2.5 6.05 2.5 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114H6.213c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727zm6.14 0c0-1.111.488-1.753 1.318-1.753.682 0 1.139.47 1.187 1.107H13.5V7c-.053-1.186-1.024-2-2.342-2C9.554 5 8.64 6.05 8.64 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.497 1.05-1.187 1.05-.839 0-1.318-.62-1.318-1.727z"/>
            <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
            </svg>          }
        </Button>
        <Button onClick={handleSettingsMenuToggle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
        </Button>
      </Controls>

      {/* Subtitle Settings */}

      <SettingsMenu show={showSettingsMenu}>
        <div>
          <label>Font Size: </label>
          <input
            type="range"
            min="1"
            max="100"
            value={parseInt(subtitleSettings.fontSize)}
            onChange={handleFontSizeChange}
          />
          <span>{subtitleSettings.fontSize}</span>
        </div>
        <Button onClick={handleColorToggle}>Font Color</Button>
        <SettingsMenu show={showColorMenu}>
        <MenuItem>
          <label>Font Color: </label>
          <SketchPicker
            color={subtitleSettings.color}
            onChangeComplete={handleFontColorChange}
          />
        </MenuItem>
        </SettingsMenu>
        <div></div>
        <Button onClick={handleBgToggle}>Background Color</Button>
        <SettingsMenu show={showBgMenu}>
        <MenuItem>
          <label>Background Color: </label>
          <SketchPicker
            color={subtitleSettings.background}
            onChangeComplete={handleBackgroundColorChange}
          />
        </MenuItem>
        </SettingsMenu>        
      </SettingsMenu>

      {/* Subtitles */}

      {isSubtitlesOn && subtitle && (
        <SubtitleContainer>
          <Subtitle
            $background={subtitleSettings.background}
            $color={subtitleSettings.color}
            $fontSize={subtitleSettings.fontSize}
          >
            {subtitle}
          </Subtitle>
        </SubtitleContainer>
      )}
    </VideoContainer>
  );
};

export default VideoPlayer;
