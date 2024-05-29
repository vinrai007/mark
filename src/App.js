import React, { useState } from 'react';
import styled from 'styled-components';
import VideoPlayer from './components/VideoPlayer';

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`;

function App() {
  const [subtitleSettings, setSubtitleSettings] = useState({
    fontSize: '16px',
    color: '#ffffff',
    background: 'rgba(0, 0, 0, 0.5)',
  });

  return (
    <AppContainer>
      <h1>Customizable Video Player</h1>
      <VideoPlayer settings={subtitleSettings} />
    </AppContainer>
  );
}

export default App;
