import React from 'react';
import './home.css';
import imageSrc from '../images/WALLPAPER.png';

function Home() {
  return (
      <div
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          marginLeft: '-370px',
          marginTop: '-30px'
        }}
      >
      </div>
  );
}

export default Home;
