import type {
  Formulario,
  OpcaoResposta,
  OpcaoRespostaPergunta,
  Pergunta,
} from '@/types';

interface MockDatabase {
  formularios: Formulario[];
  perguntas: Pergunta[];
  opcoesRespostas: OpcaoResposta[];
  opcoesRespostaPerguntas: OpcaoRespostaPergunta[];
}

const mockDb: MockDatabase = {
  formularios: [
    {
      id: 'form-1',
      titulo: 'Pesquisa de Satisfação',
      descricao: 'Avalie sua experiência com nossos serviços.',
      ordem: 1,
    },
    {
      id: 'form-2',
      titulo: 'Cadastro de Novo Cliente',
      descricao: 'Informações para registro de novos clientes.',
      ordem: 2,
    },
  ],
  perguntas: [
    {
      id: 'q-1',
      id_formulario: 'form-1',
      titulo: 'Qual seu nível de satisfação geral?',
      codigo: 'SATISFACAO_GERAL',
      orientacao_resposta: 'De 1 a 5, sendo 5 muito satisfeito.',
      ordem: 1,
      obrigatoria: true,
      sub_pergunta: false,
      tipo_pergunta: 'unica_escolha',
    },
    {
      id: 'q-2',
      id_formulario: 'form-1',
      titulo: 'Você recomendaria nossos serviços?',
      codigo: 'RECOMENDACAO',
      orientacao_resposta: null,
      ordem: 2,
      obrigatoria: true,
      sub_pergunta: false,
      tipo_pergunta: 'Sim_Nao',
    },
    {
      id: 'q-3',
      id_formulario: 'form-1',
      titulo: 'Por favor, descreva o motivo da sua insatisfação.',
      codigo: 'MOTIVO_INSATISFACAO',
      orientacao_resposta: null,
      ordem: 3,
      obrigatoria: true,
      sub_pergunta: true,
      tipo_pergunta: 'texto_livre',
    },
    {
      id: 'q-4',
      id_formulario: 'form-2',
      titulo: 'Nome Completo',
      codigo: 'NOME_COMPLETO',
      orientacao_resposta: null,
      ordem: 1,
      obrigatoria: true,
      sub_pergunta: false,
      tipo_pergunta: 'texto_livre',
    },
    {
      id: 'q-5',
      id_formulario: 'form-2',
      titulo: 'Idade',
      codigo: 'IDADE',
      orientacao_resposta: null,
      ordem: 2,
      obrigatoria: true,
      sub_pergunta: false,
      tipo_pergunta: 'Inteiro',
    },
  ],
  opcoesRespostas: [
    {
      id: 'opt-1-1',
      id_pergunta: 'q-1',
      resposta: '1 - Muito Insatisfeito',
      ordem: 1,
      resposta_aberta: false,
    },
    {
      id: 'opt-1-2',
      id_pergunta: 'q-1',
      resposta: '2 - Insatisfeito',
      ordem: 2,
      resposta_aberta: false,
    },
    {
      id: 'opt-1-3',
      id_pergunta: 'q-1',
      resposta: '3 - Neutro',
      ordem: 3,
      resposta_aberta: false,
    },
    {
      id: 'opt-1-4',
      id_pergunta: 'q-1',
      resposta: '4 - Satisfeito',
      ordem: 4,
      resposta_aberta: false,
    },
    {
      id: 'opt-1-5',
      id_pergunta: 'q-1',
      resposta: '5 - Muito Satisfeito',
      ordem: 5,
      resposta_aberta: false,
    },
    {
      id: 'opt-2-sim',
      id_pergunta: 'q-2',
      resposta: 'Sim',
      ordem: 1,
      resposta_aberta: false,
    },
    {
      id: 'opt-2-nao',
      id_pergunta: 'q-2',
      resposta: 'Não',
      ordem: 2,
      resposta_aberta: false,
    },
  ],
  opcoesRespostaPerguntas: [
    { id: 'cond-1', id_opcao_resposta: 'opt-1-1', id_pergunta: 'q-3' },
    { id: 'cond-2', id_opcao_resposta: 'opt-1-2', id_pergunta: 'q-3' },
    { id: 'cond-3', id_opcao_resposta: 'opt-2-nao', id_pergunta: 'q-3' },
  ],
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getMockDb = async () => {
  await delay(500);
  return JSON.parse(JSON.stringify(mockDb));
};

export const updateMockDb = async (newDb: MockDatabase) => {
  await delay(500);
  Object.assign(mockDb, newDb);
};

export const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
