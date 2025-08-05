import { generateId, getMockDb, updateMockDb } from '@/data/mock-db';
import type {
  CreateOpcaoRespostaDto,
  CreateOpcaoRespostaPerguntaDto,
  CreatePerguntaDto,
  OpcaoResposta,
  OpcaoRespostaPergunta,
  Pergunta,
} from '@/types';

export const questionService = {
  async getAllQuestions(): Promise<Pergunta[]> {
    const db = await getMockDb();
    return db.perguntas.sort((a, b) => a.ordem - b.ordem);
  },

  async getQuestionsByFormId(formId: string): Promise<Pergunta[]> {
    const db = await getMockDb();
    return db.perguntas
      .filter((q) => q.id_formulario === formId)
      .sort((a, b) => a.ordem - b.ordem);
  },

  async getQuestionById(id: string): Promise<Pergunta | undefined> {
    const db = await getMockDb();
    return db.perguntas.find((q) => q.id === id);
  },

  async createQuestion(data: CreatePerguntaDto): Promise<Pergunta> {
    const db = await getMockDb();
    const newQuestion: Pergunta = {
      id: generateId('q'),
      ...data,
    };
    db.perguntas.push(newQuestion);
    await updateMockDb(db);
    return newQuestion;
  },

  async updateQuestion(
    id: string,
    data: Partial<Pergunta>,
  ): Promise<Pergunta | undefined> {
    const db = await getMockDb();
    const index = db.perguntas.findIndex((q) => q.id === id);
    if (index === -1) return undefined;

    db.perguntas[index] = { ...db.perguntas[index], ...data };
    await updateMockDb(db);
    return db.perguntas[index];
  },

  async deleteQuestion(id: string): Promise<boolean> {
    const db = await getMockDb();
    const initialLength = db.perguntas.length;
    db.perguntas = db.perguntas.filter((q) => q.id !== id);
    db.opcoesRespostas = db.opcoesRespostas.filter(
      (opt) => opt.id_pergunta !== id,
    );
    db.opcoesRespostaPerguntas = db.opcoesRespostaPerguntas.filter(
      (cond) =>
        cond.id_pergunta !== id ||
        db.opcoesRespostas.some((opt) => opt.id === cond.id_opcao_resposta),
    );
    await updateMockDb(db);
    return db.perguntas.length < initialLength;
  },

  async getAllOptions(): Promise<OpcaoResposta[]> {
    const db = await getMockDb();
    return db.opcoesRespostas.sort((a, b) => a.ordem - b.ordem);
  },

  async getOptionsByQuestionId(questionId: string): Promise<OpcaoResposta[]> {
    const db = await getMockDb();
    return db.opcoesRespostas
      .filter((opt) => opt.id_pergunta === questionId)
      .sort((a, b) => a.ordem - b.ordem);
  },

  async createOption(data: CreateOpcaoRespostaDto): Promise<OpcaoResposta> {
    const db = await getMockDb();
    const newOption: OpcaoResposta = {
      id: generateId('opt'),
      ...data,
    };
    db.opcoesRespostas.push(newOption);
    await updateMockDb(db);
    return newOption;
  },

  async updateOption(
    id: string,
    data: Partial<OpcaoResposta>,
  ): Promise<OpcaoResposta | undefined> {
    const db = await getMockDb();
    const index = db.opcoesRespostas.findIndex((opt) => opt.id === id);
    if (index === -1) return undefined;

    db.opcoesRespostas[index] = { ...db.opcoesRespostas[index], ...data };
    await updateMockDb(db);
    return db.opcoesRespostas[index];
  },

  async deleteOption(id: string): Promise<boolean> {
    const db = await getMockDb();
    const initialLength = db.opcoesRespostas.length;
    db.opcoesRespostas = db.opcoesRespostas.filter((opt) => opt.id !== id);
    db.opcoesRespostaPerguntas = db.opcoesRespostaPerguntas.filter(
      (cond) => cond.id_opcao_resposta !== id,
    );
    await updateMockDb(db);
    return db.opcoesRespostas.length < initialLength;
  },

  async getAllConditionals(): Promise<OpcaoRespostaPergunta[]> {
    const db = await getMockDb();
    return db.opcoesRespostaPerguntas;
  },

  async getConditionalsByQuestionId(
    questionId: string,
  ): Promise<OpcaoRespostaPergunta[]> {
    const db = await getMockDb();
    return db.opcoesRespostaPerguntas.filter(
      (cond) => cond.id_pergunta === questionId,
    );
  },

  async getConditionalsByOptionId(
    optionId: string,
  ): Promise<OpcaoRespostaPergunta[]> {
    const db = await getMockDb();
    return db.opcoesRespostaPerguntas.filter(
      (cond) => cond.id_opcao_resposta === optionId,
    );
  },

  async createConditional(
    data: CreateOpcaoRespostaPerguntaDto,
  ): Promise<OpcaoRespostaPergunta> {
    const db = await getMockDb();
    const newConditional: OpcaoRespostaPergunta = {
      id: generateId('cond'),
      ...data,
    };
    db.opcoesRespostaPerguntas.push(newConditional);
    await updateMockDb(db);
    return newConditional;
  },

  async deleteConditional(id: string): Promise<boolean> {
    const db = await getMockDb();
    const initialLength = db.opcoesRespostaPerguntas.length;
    db.opcoesRespostaPerguntas = db.opcoesRespostaPerguntas.filter(
      (cond) => cond.id !== id,
    );
    await updateMockDb(db);
    return db.opcoesRespostaPerguntas.length < initialLength;
  },
};
