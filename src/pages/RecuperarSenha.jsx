import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './RecuperarSenha.css';
import Voltar from '../components/Voltar';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recuperarSenha } = useAuth();

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    setLoading(true);

    try {
      await recuperarSenha(email);
      setMensagem('Se o e-mail existir, você receberá instruções para recuperar a senha.');
    } catch (error) {
      setErro(error.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-senha-page">
      <Voltar />
      <h1>Recuperar Senha</h1>
      <div className="recuperar-container">
        <form onSubmit={handleRecuperar}>
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Recuperar'}
          </button>
        </form>
        {mensagem && <div className="mensagem">{mensagem}</div>}
        {erro && <div className="erro">{erro}</div>}
        <div className="recuperar-links">
          <span onClick={() => navigate('/')}>Voltar ao login</span>
        </div>
      </div>
    </div>
  );
} 