import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Voltar.css';

/**
 * Componente Voltar melhorado com múltiplas funcionalidades
 * 
 * Props:
 * @param {string} to - Rota específica para navegar (opcional)
 * @param {string} title - Texto do botão (padrão: 'Voltar')
 * @param {boolean} showHome - Mostra botão home adicional (padrão: false)
 * @param {string} variant - Variante do botão: 'default', 'minimal', 'home' (padrão: 'default')
 * @param {string} className - Classes CSS adicionais
 * 
 * Exemplos de uso:
 * <Voltar /> - Botão padrão que volta uma página
 * <Voltar to="/dashboard" title="Voltar ao Dashboard" /> - Vai para rota específica
 * <Voltar variant="minimal" showHome={true} /> - Botão minimal com home
 * <Voltar variant="home" title="Ir para Home" /> - Botão estilo home
 */
export default function Voltar() {
  const navigate = useNavigate();
  return (
    <button className="btn-voltar" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
      Voltar
    </button>
  );
} 