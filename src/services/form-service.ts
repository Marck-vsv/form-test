import { generateId, getMockDb, updateMockDb } from '@/data/mock-db';
import type { CreateFormularioDto, Formulario } from '@/types';

export const formService = {
  async getAllForms(): Promise<Formulario[]> {
    const db = await getMockDb();
    return db.formularios.sort((a, b) => a.ordem - b.ordem);
  },

  async getFormById(id: string): Promise<Formulario | undefined> {
    const db = await getMockDb();
    return db.formularios.find((form) => form.id === id);
  },

  async createForm(data: CreateFormularioDto): Promise<Formulario> {
    const db = await getMockDb();
    const newForm: Formulario = {
      id: generateId('form'),
      ...data,
    };
    db.formularios.push(newForm);
    await updateMockDb(db);
    return newForm;
  },

  async updateForm(
    id: string,
    data: Partial<Formulario>,
  ): Promise<Formulario | undefined> {
    const db = await getMockDb();
    const index = db.formularios.findIndex((form) => form.id === id);
    if (index === -1) return undefined;

    db.formularios[index] = { ...db.formularios[index], ...data };
    await updateMockDb(db);
    return db.formularios[index];
  },

  async deleteForm(id: string): Promise<boolean> {
    const db = await getMockDb();
    const initialLength = db.formularios.length;
    db.formularios = db.formularios.filter((form) => form.id !== id);
    db.perguntas = db.perguntas.filter((q) => q.id_formulario !== id);
    await updateMockDb(db);
    return db.formularios.length < initialLength;
  },
};
