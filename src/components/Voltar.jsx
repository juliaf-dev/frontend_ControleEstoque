import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Voltar.css';

export default function Voltar() {
  const navigate = useNavigate();
  return (
    <button className="btn-voltar" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} /> Voltar
    </button>
  );
} 