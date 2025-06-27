import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Logo size="large" />
      <div className="header-actions">
        <button className="add-produto" onClick={() => navigate('/add-produto')}>
          <FontAwesomeIcon icon={faBoxOpen} style={{ marginRight: 8 }} /> Novo Pedido
        </button>
        <button className="sair" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 6 }} /> Sair
        </button>
      </div>
    </header>
  );
} 