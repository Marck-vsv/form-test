export type PerguntaTipo =
  | 'Sim_Nao'
  | 'multipla_escolha'
  | 'unica_escolha'
  | 'texto_livre'
  | 'Inteiro'
  | 'Numero_com_duas_casas_decimais';

export interface Formulario {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface Pergunta {
  id: string;
  id_formulario: string;
  titulo: string;
  codigo: string;
  orientacao_resposta?: string;
  ordem: number;
  obrigatoria: boolean;
  sub_pergunta: boolean;
  tipo_pergunta: PerguntaTipo;
}

export interface OpcaoResposta {
  id: string;
  id_pergunta: string;
  resposta: string;
  ordem: number;
  resposta_aberta: boolean;
}

export interface OpcaoRespostaPergunta {
  id: string;
  id_opcao_resposta: string;
  id_pergunta: string;
}

export type CreateFormularioDto = Omit<Formulario, 'id'>;
export type CreatePerguntaDto = Omit<Pergunta, 'id'>;
export type CreateOpcaoRespostaDto = Omit<OpcaoResposta, 'id'>;
export type CreateOpcaoRespostaPerguntaDto = Omit<OpcaoRespostaPergunta, 'id'>;
