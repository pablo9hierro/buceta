"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../api/supabase";

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);

  const [relatorioWhatsappData, setRelatorioWhatsappData] = useState({
    nome: "",
    quantidade_votos_garantidos: "",
    quantidade_votos_incerto: "",
    mensagem_relevante: [] as string[],
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      setLoading(false);

      if (!sessionData.session) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRelatorioWhatsappData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMensagemRelevanteChange = (index: number, value: string) => {
    const updatedMensagens = [...relatorioWhatsappData.mensagem_relevante];
    updatedMensagens[index] = value;

    setRelatorioWhatsappData((prevData) => ({
      ...prevData,
      mensagem_relevante: updatedMensagens,
    }));
  };

  const addMensagemRelevante = () => {
    setRelatorioWhatsappData((prevData) => ({
      ...prevData,
      mensagem_relevante: [...prevData.mensagem_relevante, ""],
    }));
  };

  const removeMensagemRelevante = (index: number) => {
    const updatedMensagens = relatorioWhatsappData.mensagem_relevante.filter((_, i) => i !== index);
    setRelatorioWhatsappData((prevData) => ({
      ...prevData,
      mensagem_relevante: updatedMensagens,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user_id = session.user.id;

    const formData = {
      ...relatorioWhatsappData,
      user_id,
      quantidade_votos_garantidos: parseInt(relatorioWhatsappData.quantidade_votos_garantidos) || null,
      quantidade_votos_incerto: parseInt(relatorioWhatsappData.quantidade_votos_incerto) || null,
    };

    const tableName = "whatsapp_relatorio";

    const { error } = await supabase.from(tableName).insert([formData]);

    if (error) {
      alert("Erro ao salvar o relatório: " + error.message);
    } else {
      alert("Relatório salvo com sucesso!");
      resetForm();
    }
  };

  const resetForm = () => {
    setRelatorioWhatsappData({
      nome: "",
      quantidade_votos_garantidos: "",
      quantidade_votos_incerto: "",
      mensagem_relevante: [],
    });
  };

  return (
    <div className="d-flex justify-content-center m-2 p-2 align-items-center vh-100">
      <form onSubmit={handleSubmit} className="p-4 border m-4 rounded bg-light w-50">
        <h3 className="text-center mb-4">Relatório WhatsApp</h3>

        <div className="mb-3">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            name="nome"
            value={relatorioWhatsappData.nome}
            onChange={handleInputChange}
            className="form-control m-2 p-2 text-black w-auto p-3 h-"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantidade de Votos Garantidos (opcional):</label>
          <input
            type="number"
            name="quantidade_votos_garantidos"
            value={relatorioWhatsappData.quantidade_votos_garantidos}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantidade de Votos Incertos (opcional):</label>
          <input
            type="number"
            name="quantidade_votos_incerto"
            value={relatorioWhatsappData.quantidade_votos_incerto}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Mensagens Relevantes (opcional):</label>
          {relatorioWhatsappData.mensagem_relevante.map((mensagem, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                value={mensagem}
                onChange={(e) => handleMensagemRelevanteChange(index, e.target.value)}
                className="form-control"
              />
              <button
                type="button"
                onClick={() => removeMensagemRelevante(index)}
                className="btn btn-outline-danger"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMensagemRelevante}
            className="btn btn-outline-success"
          >
            Adicionar Nova Mensagem
          </button>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Salvar Relatório
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
