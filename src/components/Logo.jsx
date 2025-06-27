import React from 'react';
import './Logo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

export default function Logo({ size = 'large', showSubtitle = true }) {
  return (
    <div className={`logo-container ${size}`}>
      {/* Aqui você pode adicionar a imagem do logo */}
      {/* <img src="/path/to/logo.png" alt="So Bugiganga Logo" className="logo-image" /> */}
      
      <div className="logo-text">
        <h1 className="logo-title">
          <FontAwesomeIcon icon={faStore} style={{ marginRight: 10 }} />
          So bugiganga
          {showSubtitle && <span className="logo-subtitle">estoque</span>}
        </h1>
      </div>
    </div>
  );
} 