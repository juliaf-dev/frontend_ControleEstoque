import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Cadastro.css';
import Voltar from '../components/Voltar';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cadastro } = useAuth();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await cadastro(nome, email, senha, 'usuario');
      navigate('/');
    } catch (error) {
      setErro(error.message || 'Erro ao fazer cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <Voltar />
      <h1>Cadastro</h1>
      <div className="cadastro-container">
        <h2>Cadastro</h2>
        <form onSubmit={handleCadastro}>
          <input 
            type="text" 
            placeholder="Nome" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            required 
            disabled={loading}
          />
          {erro && <div className="erro">{erro}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <div className="cadastro-links">
          <span onClick={() => navigate('/')}>Já tem conta? Entrar</span>
        </div>
      </div>
    </div>
  );
} 