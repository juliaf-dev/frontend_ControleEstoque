import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faShoppingBasket, faClipboardList, faHistory, faTruck, faUsers } from '@fortawesome/free-solid-svg-icons';
import './MainButtons.css';

export default function MainButtons() {
  const navigate = useNavigate();
  return (
    <div className="main-buttons">
      <button onClick={() => navigate('/vendas')}>
        <FontAwesomeIcon icon={faCashRegister} className="icon" />
        <span>(+)Vendas</span>
      </button>
      <button onClick={() => navigate('/add-produto')}>
        <FontAwesomeIcon icon={faShoppingBasket} className="icon" />
        <span>(+)Compras</span>
      </button>
      <button onClick={() => navigate('/compras')}>
        <FontAwesomeIcon icon={faClipboardList} className="icon" />
        <span>Pedidos</span>
      </button>
      <button onClick={() => navigate('/historicos')}>
        <FontAwesomeIcon icon={faHistory} className="icon" />
        <span>Históricos</span>
      </button>
      <button onClick={() => navigate('/fornecedores')}>
        <FontAwesomeIcon icon={faTruck} className="icon" />
        <span>Fornecedores</span>
      </button>
      <button onClick={() => navigate('/clientes')}>
        <FontAwesomeIcon icon={faUsers} className="icon" />
        <span>Clientes</span>
      </button>
    </div>
  );
} 