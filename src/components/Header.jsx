import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faUser
} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [navigationExpanded, setNavigationExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleNavigationChange = (event) => {
      setNavigationExpanded(event.detail.expandido);
    };

    document.addEventListener('navigationStateChange', handleNavigationChange);
    return () => {
      document.removeEventListener('navigationStateChange', handleNavigationChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPageTitle = () => {
    const pageMap = {
      '/dashboard': null,
      '/vendas': 'Vendas',
      '/add-produto': 'Registrar Compra',
      '/compras': 'Histórico de Compras',
      '/historico-vendas': 'Histórico de Vendas',
      '/fornecedores': 'Fornecedores',
      '/clients': 'Clientes'
    };
    return pageMap[location.pathname] || null;
  };

  // Função para obter o nome do usuário
  const getUserName = () => {
    if (!user) return 'Usuário';
    
    // Tenta diferentes propriedades possíveis
    return user.nome || user.name || user.username || user.email || 'Usuário';
  };

  // Função para obter o email do usuário
  const getUserEmail = () => {
    if (!user) return '';
    return user.email || '';
  };

  return (
    <header className={`top-header ${navigationExpanded ? 'nav-expanded' : ''}`}>
      {/* Left Section - Brand */}
      <div className="header-left">
        <div className="brand-section">
          <h1 className="brand-name">Só Bujiganga</h1>
          <span className="brand-subtitle">Estoque</span>
        </div>
        
        {getPageTitle() && (
          <div className="page-extension">
            <span className="page-title">{getPageTitle()}</span>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* User Menu */}
        <div className="user-menu-container">
          <button 
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Menu do Usuário"
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="user-name">{getUserName()}</span>
          </button>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="user-details">
                  <span className="user-full-name">{getUserName()}</span>
                  <span className="user-role">{getUserEmail() || 'Administrador'}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
