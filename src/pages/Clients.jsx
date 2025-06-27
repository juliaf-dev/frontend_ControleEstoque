import React, { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';
import Voltar from '../components/Voltar';
import './AddProduto.css';

function Clients() {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

  function handleEdit(id) {
    setEditando(id);
    const cliente = clientes.find(c => c.id === id);
    setForm({ ...cliente });
    setSucesso('');
    setErro('');
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

  return (
    <div className="add-produto-page">
      <Voltar />
      <h1>Clientes</h1>
      {erro && <div className="erro-categorias">{erro}</div>}
      {sucesso && <div className="mensagem-sucesso">{sucesso}</div>}
      <div className="lista-notas-fiscais">
        {clientes.map(cliente => (
          <div className="nota-fiscal-item" key={cliente.id}>
            {editando === cliente.id ? (
              <>
                <div><b>Nome:</b> <input name="nome" value={form.nome || ''} onChange={handleChange} /></div>
                <div><b>Email:</b> <input name="email" value={form.email || ''} onChange={handleChange} /></div>
                <div><b>Telefone:</b> <input name="telefone" value={form.telefone || ''} onChange={handleChange} /></div>
                <div><b>Endereço:</b> <input name="endereco" value={form.endereco || ''} onChange={handleChange} /></div>
                <button className="btn-adicionar" onClick={() => handleSave(cliente.id)}>Salvar</button>
                <button className="btn-adicionar" style={{ background: '#aaa', marginLeft: 8 }} onClick={() => setEditando(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <div><b>Nome:</b> {cliente.nome}</div>
                <div><b>Email:</b> {cliente.email}</div>
                <div><b>Telefone:</b> {cliente.telefone}</div>
                <div><b>Endereço:</b> {cliente.endereco}</div>
                <button className="btn-adicionar" onClick={() => handleEdit(cliente.id)}>Editar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients; 