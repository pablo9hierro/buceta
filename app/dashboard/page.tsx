"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../api/supabase';

const Dashboard = () => {
  const [activeReport, setActiveReport] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  
  // Estados separados para cada formulário
  const [instagramFormData, setInstagramFormData] = useState({
    nome: '',
    nickname: '',
    segmento: '',
    link_post: '',
    data_post: new Date().toISOString().slice(0, 10),
    comentario: '',
    comprometido: false,
  });

  const [whatsappFormData, setWhatsappFormData] = useState({
    nome: '',
    telefone: '',
    segmento: '',
    interacoes: [{ pergunta: '', resposta: '' }], // Cada interação é um objeto com pergunta e resposta
    comprometido: false,
  });
  
  

  // Novos estados para os formulários adicionais
const [eventFormData, setEventFormData] = useState({
    nome_evento: '',
    data_evento: new Date().toISOString().slice(0, 10),
    hora_evento: new Date().toISOString().slice(11, 16),
    local_evento: '',
    telefone: '',
    segmento: '',
  });

  const [midiaFormData, setMidiaFormData] = useState({
    emissora: '',
    data_publicacao: new Date().toISOString().slice(0, 10),
    segmento: '',
    nome_apoiadores: [] as string[], // Array de apoiadores
    tipo_midia: [] as string[], // Array de tipos de mídia
    link_conteudo: '',
  });

  const [propagandaFormData, setPropagandaFormData] = useState({
    nome: '',
    acao: '',
    data: new Date().toISOString().slice(0, 10),
    local: '',
  });

  const router = useRouter();

  const reports = [
    'Relatório para Instagram',
    'Relatório para WhatsApp',
    'Relatório para Eventos',
    'Relatório Mídia Tradicional (TV/Rádio/Blog)',
    'Relatório Propaganda Pessoal'
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setLoading(false);

      if (!sessionData.session) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Funções de manuseio para o formulário do Instagram
  const handleInstagramInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstagramFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Funções de manuseio para o formulário do WhatsApp
  const handleWhatsappInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWhatsappFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Funções de manuseio para o formulário de Eventos
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Funções de manuseio para o formulário de Mídia Tradicional
  const handleMidiaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMidiaFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    // Função para adicionar um novo apoiador
    const addApoiador = (novoApoiador: string) => {
      if (novoApoiador.trim()) {
        setMidiaFormData((prevData) => ({
          ...prevData,
          nome_apoiadores: [...prevData.nome_apoiadores, novoApoiador],
        }));
      }
    };
  
    // Função para adicionar um novo tipo de mídia
    const addTipoMidia = (novoTipo: string) => {
      if (novoTipo.trim()) {
        setMidiaFormData((prevData) => ({
          ...prevData,
          tipo_midia: [...prevData.tipo_midia, novoTipo],
        }));
      }
    };
  

  // Funções de manuseio para o formulário de Propaganda Pessoal
  const handlePropagandaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPropagandaFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, isInstagram: boolean) => {
    if (isInstagram) {
      setInstagramFormData((prevData) => ({
        ...prevData,
        comprometido: e.target.checked,
      }));
    } else {
      setWhatsappFormData((prevData) => ({
        ...prevData,
        comprometido: e.target.checked,
      }));
    }
  };

// Função de envio de formulário refatorada para melhorar a clareza e evitar repetições
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const user_id = session.user.id;

  let formData: any;
  let tableName: string;

  switch (activeReport) {
    case 0:
      formData = { ...instagramFormData, user_id };
      tableName = 'instagram_reports';
      break;
    case 1:
      formData = { ...whatsappFormData, user_id };
      tableName = 'whatsapp_reports';
      break;
    case 2:
      formData = { ...eventFormData, user_id };
      tableName = 'eventos_reports';
      break;
    case 3:
      formData = { ...midiaFormData, user_id };
      tableName = 'midia_tradicional_reports';
      break;
    case 4:
      formData = { ...propagandaFormData, user_id };
      tableName = 'propaganda_pessoal_reports';
      break;
    default:
      return alert('Tipo de relatório desconhecido.');
  }

  const { error } = await supabase.from(tableName).insert([formData]);

  if (error) {
    alert('Erro ao salvar o relatório: ' + error.message);
  } else {
    alert('Relatório salvo com sucesso!');
    // Resetar os formulários após envio
    resetForm();
  }
};

// Função para adicionar um novo apoiador
const handleAddApoiador = () => {
  if (novoApoiador.trim()) {
    setMidiaFormData(prevData => ({
      ...prevData,
      nome_apoiadores: [...prevData.nome_apoiadores, novoApoiador],
    }));
    setNovoApoiador('');
    setAddingApoiador(false);
  }
};

// Função para adicionar um novo tipo de mídia
const handleAddTipoMidia = () => {
  if (novoTipoMidia.trim()) {
    setMidiaFormData(prevData => ({
      ...prevData,
      tipo_midia: [...prevData.tipo_midia, novoTipoMidia],
    }));
    setNovoTipoMidia('');
    setAddingTipoMidia(false);
  }
};

// Função para remover um apoiador
const handleRemoveApoiador = (index: number) => {
  setMidiaFormData(prevData => ({
    ...prevData,
    nome_apoiadores: prevData.nome_apoiadores.filter((_, i) => i !== index),
  }));
};

// Função para remover um tipo de mídia
const handleRemoveTipoMidia = (index: number) => {
  setMidiaFormData(prevData => ({
    ...prevData,
    tipo_midia: prevData.tipo_midia.filter((_, i) => i !== index),
  }));
};

const [novoApoiador, setNovoApoiador] = useState('');
const [novoTipoMidia, setNovoTipoMidia] = useState('');
const [addingApoiador, setAddingApoiador] = useState(false);
const [addingTipoMidia, setAddingTipoMidia] = useState(false);

// Função para resetar os formulários com base no relatório ativo
const resetForm = () => {
  switch (activeReport) {
    case 0:
      setInstagramFormData({
        nome: '',
        nickname: '',
        segmento: '',
        link_post: '',
        data_post: new Date().toISOString().slice(0, 10),
        comentario: '',
        comprometido: false,
      });
      break;
    case 1:
      setWhatsappFormData({
        nome: '',
        telefone: '',
        segmento: '',
        interacoes: [],
        comprometido: false,
      });
      break;
    case 2:
      setEventFormData({
        nome_evento: '',
        data_evento: new Date().toISOString().slice(0, 10),
        hora_evento: new Date().toISOString().slice(11, 16),
        local_evento: '',
        telefone: '',
        segmento: '',
      });
      break;
      case 3:
        setMidiaFormData({
          emissora: '',
          data_publicacao: new Date().toISOString().slice(0, 10),
          segmento: '',
          nome_apoiadores: [], // Array de apoiadores
          tipo_midia: [], // Array de tipos de mídia
          link_conteudo: '',
        });
        break;
      
    case 4:
      setPropagandaFormData({
        nome: '',
        acao: '',
        data: new Date().toISOString().slice(0, 10),
        local: '',
      });
      break;
    default:
      break;
  }
};


// Adicionar uma nova interação
const addInteraction = () => {
  setWhatsappFormData((prevData) => ({
    ...prevData,
    interacoes: [...prevData.interacoes, { pergunta: '', resposta: '' }],
  }));
};

// Atualizar uma interação específica
const handleInteractionChange = (index: number, field: string, value: string) => {
  const updatedInteractions = whatsappFormData.interacoes.map((interaction, i) => {
    if (i === index) {
      return { ...interaction, [field]: value };
    }
    return interaction;
  });

  setWhatsappFormData((prevData) => ({
    ...prevData,
    interacoes: updatedInteractions,
  }));
};

// Remover uma interação específica
const removeInteraction = (index: number) => {
  const updatedInteractions = whatsappFormData.interacoes.filter((_, i) => i !== index);

  setWhatsappFormData((prevData) => ({
    ...prevData,
    interacoes: updatedInteractions,
  }));
};


  const renderInstagramForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block">Nome:</label>
        <input
          type="text"
          name="nome"
          value={instagramFormData.nome}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Nickname:</label>
        <input
          type="text"
          name="nickname"
          value={instagramFormData.nickname}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Segmento:</label>
        <input
          type="text"
          name="segmento"
          value={instagramFormData.segmento}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Link do Post:</label>
        <input
          type="text"
          name="link_post"
          value={instagramFormData.link_post}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Data do Post:</label>
        <input
          type="date"
          name="data_post"
          value={instagramFormData.data_post}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Comentário:</label>
        <textarea
          name="comentario"
          value={instagramFormData.comentario}
          onChange={handleInstagramInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Comprometido?</label>
        <input
          type="checkbox"
          name="comprometido"
          checked={instagramFormData.comprometido}
          onChange={(e) => handleCheckboxChange(e, true)}
          className="mr-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Salvar Relatório
      </button>
    </form>
  );

  const renderWhatsAppForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block">Nome:</label>
        <input
          type="text"
          name="nome"
          value={whatsappFormData.nome}
          onChange={handleWhatsappInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Telefone:</label>
        <input
          type="text"
          name="telefone"
          value={whatsappFormData.telefone}
          onChange={handleWhatsappInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Segmento:</label>
        <input
          type="text"
          name="segmento"
          placeholder='Área de trabalho'
          value={whatsappFormData.segmento}
          onChange={handleWhatsappInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Interações:</label>
        {whatsappFormData.interacoes.map((interaction, index) => (
          <div key={index} className="space-y-2 mb-4">
            <div className="flex items-center">
              <input
                type="text"
                value={interaction.pergunta}
                onChange={(e) => handleInteractionChange(index, 'pergunta', e.target.value)}
                placeholder="Minha Interação"
                className="p-2 border border-gray-300 rounded w-full mr-2"
              />
              <input
                type="text"
                value={interaction.resposta}
                onChange={(e) => handleInteractionChange(index, 'resposta', e.target.value)}
                placeholder="Resposta"
                className="p-2 border border-gray-300 rounded w-full"
              />
              <button
                type="button"
                onClick={() => removeInteraction(index)}
                className="text-red-500 ml-2"
              >
                x
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addInteraction}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Adicionar Interação
        </button>
      </div>
      <div>
        <label className="block">Comprometido?</label>
        <input
          type="checkbox"
          name="comprometido"
          checked={whatsappFormData.comprometido}
          onChange={(e) => handleCheckboxChange(e, false)}
          className="mr-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Salvar Relatório
      </button>
    </form>
  );
  
  const renderEventForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block">Nome do Evento:</label>
        <input
          type="text"
          name="nome_evento"
          value={eventFormData.nome_evento}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Data do Evento:</label>
        <input
          type="date"
          name="data_evento"
          value={eventFormData.data_evento}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Hora do Evento:</label>
        <input
          type="time"
          name="hora_evento"
          value={eventFormData.hora_evento}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Local do Evento:</label>
        <input
          type="text"
          name="local_evento"
          value={eventFormData.local_evento}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Telefone:</label>
        <input
          type="text"
          name="telefone"
          value={eventFormData.telefone}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Segmento:</label>
        <input
          type="text"
          name="segmento"
          value={eventFormData.segmento}
          onChange={handleEventInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Salvar Relatório
      </button>
    </form>
  );
  

  const renderMidiaForm = () => {
    const [novoApoiador, setNovoApoiador] = useState('');
    const [novoTipoMidia, setNovoTipoMidia] = useState('');
    const [inputApoiadorAtivo, setInputApoiadorAtivo] = useState(false);
    const [inputTipoMidiaAtivo, setInputTipoMidiaAtivo] = useState(false);
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label className="block">Emissora:</label>
          <input
            type="text"
            name="emissora"
            value={midiaFormData.emissora}
            onChange={handleMidiaInputChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block">Data de Publicação:</label>
          <input
            type="date"
            name="data_publicacao"
            value={midiaFormData.data_publicacao}
            onChange={handleMidiaInputChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block">Segmento:</label>
          <input
            type="text"
            name="segmento"
            value={midiaFormData.segmento}
            onChange={handleMidiaInputChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div>
          <label className="block">Nome dos Apoiadores:</label>
          {midiaFormData.nome_apoiadores.length > 0 && (
            <ul className="mt-2">
              {midiaFormData.nome_apoiadores.map((apoiador, index) => (
                <li key={index} className="text-gray-700">
                  - {apoiador}
                </li>
              ))}
            </ul>
          )}
          {inputApoiadorAtivo ? (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={novoApoiador}
                onChange={(e) => setNovoApoiador(e.target.value)}
                placeholder="Novo Apoiador"
                className="p-2 border border-gray-300 rounded w-full mr-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (novoApoiador.trim()) {
                    setMidiaFormData((prevData) => ({
                      ...prevData,
                      nome_apoiadores: [...prevData.nome_apoiadores, novoApoiador],
                    }));
                    setNovoApoiador('');
                  }
                  setInputApoiadorAtivo(false);
                }}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Adicionar Apoiador
              </button>
              <button
                type="button"
                onClick={() => setInputApoiadorAtivo(false)}
                className="text-red-500 ml-2"
              >
                x
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setInputApoiadorAtivo(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Apoiador
            </button>
          )}
        </div>
        <div>
          <label className="block">Tipo de Mídia:</label>
          {midiaFormData.tipo_midia.length > 0 && (
            <ul className="mt-2">
              {midiaFormData.tipo_midia.map((tipo, index) => (
                <li key={index} className="text-gray-700">
                  - {tipo}
                </li>
              ))}
            </ul>
          )}
          {inputTipoMidiaAtivo ? (
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={novoTipoMidia}
                onChange={(e) => setNovoTipoMidia(e.target.value)}
                placeholder="Novo Tipo de Mídia"
                className="p-2 border border-gray-300 rounded w-full mr-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (novoTipoMidia.trim()) {
                    setMidiaFormData((prevData) => ({
                      ...prevData,
                      tipo_midia: [...prevData.tipo_midia, novoTipoMidia],
                    }));
                    setNovoTipoMidia('');
                  }
                  setInputTipoMidiaAtivo(false);
                }}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Adicionar Tipo de Mídia
              </button>
              <button
                type="button"
                onClick={() => setInputTipoMidiaAtivo(false)}
                className="text-red-500 ml-2"
              >
                x
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setInputTipoMidiaAtivo(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Tipo de Mídia
            </button>
          )}
        </div>
        <div>
          <label className="block">Link do Conteúdo:</label>
          <input
            type="text"
            name="link_conteudo"
            value={midiaFormData.link_conteudo}
            onChange={handleMidiaInputChange}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Salvar Relatório
        </button>
      </form>
    );
  };
  

  const renderPropagandaForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block">Nome:</label>
        <input
          type="text"
          name="nome"
          value={propagandaFormData.nome}
          onChange={handlePropagandaInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Ação:</label>
        <input
          type="text"
          name="acao"
          value={propagandaFormData.acao}
          onChange={handlePropagandaInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Data:</label>
        <input
          type="date"
          name="data"
          value={propagandaFormData.data}
          onChange={handlePropagandaInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div>
        <label className="block">Local:</label>
        <input
          type="text"
          name="local"
          value={propagandaFormData.local}
          onChange={handlePropagandaInputChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Salvar Relatório
      </button>
    </form>
  );

  const renderActiveReport = () => {
    switch (activeReport) {
      case 0:
        return renderInstagramForm();
      case 1:
        return renderWhatsAppForm();
      case 2:
        return renderEventForm();
      case 3:
        return renderMidiaForm();
      case 4:
        return renderPropagandaForm();
      default:
        return <div>Selecione um relatório</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <ul className="flex flex-col mt-2">
          {reports.map((report, index) => (
            <li
              key={index}
              onClick={() => setActiveReport(index)}
              className={`p-4 cursor-pointer hover:bg-gray-700 ${
                activeReport === index ? 'bg-gray-700' : ''
              }`}
            >
              {report}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-8 bg-gray-100">
        {renderActiveReport()}
      </main>
    </div>
  );
};

export default Dashboard;
