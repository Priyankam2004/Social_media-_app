import React from 'react';

export default function Avatar({ src, name = '', size = 40, onClick, style = {} }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const palette = ['#667eea', '#48bb78', '#ed8936', '#e53e3e', '#9f7aea', '#38b2ac'];
  const colorIndex = name ? name.charCodeAt(0) % palette.length : 0;

  const baseStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  if (src) {
    // If it's a relative /uploads/... path, prefix with backend origin
   const API_URL = process.env.REACT_APP_API_URL;

    const imgSrc = src.startsWith('http')
      ? src
      : `${API_URL}${src}`;
    return (
      <img
        src={imgSrc}
        alt={name || 'avatar'}
        style={{ ...baseStyle, objectFit: 'cover' }}
        onClick={onClick}
        onError={e => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        background: palette[colorIndex],
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      {initials || '?'}
    </div>
  );
}
