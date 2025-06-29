import React, { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';
import Voltar from '../components/Voltar';
import './Clients.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

function Clients() {
  const [clientes, setClientes] = useState([]);
  const [expandido, setExpandido] = useState(null);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function fetchClientes() {
      try {
        const data = await clientService.getClients();
        setClientes(data.data || []);
      } catch (e) {
        setErro('Erro ao carregar clientes');
      }
    }
    fetchClientes();
  }, []);

  const handleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  function handleEdit(id) {
    setEditando(id);
    const cliente = clientes.find(c => c.id === id);
    setForm({ ...cliente });
    setSucesso('');
    setErro('');
  }

  function handleCancel() {
    setEditando(null);
    setForm({});
    setErro('');
    setSucesso('');
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave(id) {
    try {
      await clientService.updateClient(id, form);
      setClientes(clientes.map(c => (c.id === id ? { ...form } : c)));
      setEditando(null);
      setSucesso('Cliente atualizado com sucesso!');
    } catch (e) {
      setErro(e.message || 'Erro ao atualizar cliente');
    }
  }

  // Filtro
  const clientesFiltrados = clientes.filter(c => {
    const nomeMatch = c.nome.toLowerCase().includes(busca.toLowerCase());
    const emailMatch = c.email.toLowerCase().includes(busca.toLowerCase());
    return nomeMatch || emailMatch;
  });

  return (
    <div className="clients-page">
      <Voltar showHome={true} title="Voltar aos Clientes" />
      <h1>Gerenciar Clientes</h1>
      {erro && <div className="erro-clients">{erro}</div>}
      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}
      <div className="filtros-clients">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>
      <ul className="clients-lista">
        {clientesFiltrados.map(cliente => (
          <li key={cliente.id} className="cliente-item">
            <div className="cliente-cabecalho" onClick={() => handleExpandir(cliente.id)}>
              <div className="cliente-info">
                <span className="cliente-nome">{cliente.nome}</span>
                <span className="cliente-email">{cliente.email}</span>
              </div>
              <span className="cliente-expand-icon">
                <FontAwesomeIcon icon={expandido === cliente.id ? faChevronUp : faChevronDown} />
              </span>
            </div>
            {expandido === cliente.id && (
              <div className="cliente-detalhes">
            {editando === cliente.id ? (
                  <button className="btn-cancel-icon" onClick={handleCancel}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                ) : (
                  <button className="btn-edit-icon" onClick={() => handleEdit(cliente.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                <div><b>Nome:</b> {editando === cliente.id ? (
                  <input name="nome" value={form.nome || ''} onChange={handleChange} />
                ) : (
                  cliente.nome
                )}</div>
                <div><b>Email:</b> {editando === cliente.id ? (
                  <input name="email" value={form.email || ''} onChange={handleChange} />
                ) : (
                  cliente.email
                )}</div>
                <div><b>Telefone:</b> {editando === cliente.id ? (
                  <input name="telefone" value={form.telefone || ''} onChange={handleChange} />
                ) : (
                  cliente.telefone
                )}</div>
                <div><b>Endereço:</b> {editando === cliente.id ? (
                  <input name="endereco" value={form.endereco || ''} onChange={handleChange} />
                ) : (
                  cliente.endereco
                )}</div>
                {editando === cliente.id && (
                  <button className="btn-salvar" onClick={() => handleSave(cliente.id)}>
                    <FontAwesomeIcon icon={faSave} /> Salvar
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {clientesFiltrados.length === 0 && (
        <div className="sem-clientes">Nenhum cliente encontrado.</div>
      )}
    </div>
  );
}

export default Clients; 