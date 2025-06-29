import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faHome,
  faUsers,
  faTruck,
  faHistory,
  faCashRegister,
  faShoppingCart,
  faBars,
  faChevronLeft,
  faChevronRight,
  faChartLine,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import './navegacao.css';

export default function Navegacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandido, setExpandido] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const atalhos = [
    { 
      path: '/vendas', 
      icon: faCashRegister, 
      label: 'Vendas',
      description: 'Gerenciar vendas e transações',
      category: 'operacoes'
    },
    { 
      path: '/add-produto', 
      icon: faBoxOpen, 
      label: 'Registrar Compra',
      description: 'Adicionar novos produtos ao estoque',
      category: 'operacoes'
    },
    { 
      path: '/compras', 
      icon: faShoppingCart, 
      label: 'Hist. Compras',
      description: 'Visualizar histórico de compras',
      category: 'operacoes'
    },
    { 
      path: '/historico-vendas', 
      icon: faHistory, 
      label: 'Hist. Vendas',
      description: 'Consultar vendas realizadas',
      category: 'operacoes'
    },
    { 
      path: '/fornecedores', 
      icon: faTruck, 
      label: 'Fornecedores',
      description: 'Gerenciar fornecedores',
      category: 'gestao'
    },
    { 
      path: '/clients', 
      icon: faUsers, 
      label: 'Clientes',
      description: 'Gerenciar cadastro de clientes',
      category: 'gestao'
    },
  ];

  const categorias = {
    operacoes: { label: 'Operações', icon: faChartLine },
    gestao: { label: 'Gestão', icon: faCog }
  };

  // Emitir evento quando o estado da navegação mudar
  useEffect(() => {
    const event = new CustomEvent('navigationStateChange', {
      detail: { expandido }
    });
    document.dispatchEvent(event);
  }, [expandido]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getAtalhosPorCategoria = () => {
    const agrupados = {};
    atalhos.forEach(atalho => {
      if (!agrupados[atalho.category]) {
        agrupados[atalho.category] = [];
      }
      agrupados[atalho.category].push(atalho);
    });
    return agrupados;
  };

  return (
    <div className="navegacao-container">
      <aside className={`navegacao ${expandido ? 'expandido' : 'colapsado'}`}>
        {/* Dashboard Button */}
        <button 
          className={`dashboard-button ${isActive('/dashboard') ? 'active' : ''}`} 
          onClick={() => navigate('/dashboard')} 
          title="Dashboard"
          onMouseEnter={() => setHoveredItem('dashboard')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="button-content">
            <FontAwesomeIcon icon={faHome} className="icone" />
         
          </div>
          {isActive('/dashboard') && <div className="active-indicator" />}
        </button>
        
        {/* Navigation Items */}
        <nav className="atalhos">
          {Object.entries(getAtalhosPorCategoria()).map(([categoria, itens]) => (
            <div key={categoria} className="categoria-grupo">
              {expandido && (
                <div className="categoria-header">
                  <FontAwesomeIcon icon={categorias[categoria].icon} />
                  <span>{categorias[categoria].label}</span>
                </div>
              )}
              {itens.map(({ path, icon, label, description }) => (
                <button 
                  key={path} 
                  className={`atalho ${isActive(path) ? 'active' : ''}`} 
                  onClick={() => navigate(path)} 
                  title={expandido ? description : label}
                  onMouseEnter={() => setHoveredItem(path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="button-content">
                    <FontAwesomeIcon icon={icon} className="icone" />
                    {expandido && <span className="label">{label}</span>}
                  </div>
                  {isActive(path) && <div className="active-indicator" />}
                  {!expandido && hoveredItem === path && (
                    <div className="tooltip">
                      <span>{label}</span>
                      <span className="tooltip-description">{description}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

       
      </aside>
      
      {/* Toggle Button */}
      <button 
        className="toggle-button" 
        onClick={() => setExpandido(!expandido)}
        title={expandido ? 'Recolher menu' : 'Expandir menu'}
      >
        <FontAwesomeIcon icon={expandido ? faChevronLeft : faChevronRight} />
      </button>
    </div>
  );
}