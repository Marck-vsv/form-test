import { getMockDb } from '@/data/mock-db';
import { questionService } from '@/services/question-service';
import type { OpcaoRespostaPergunta } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getMockDb();
    const conditional = db.opcoesRespostaPerguntas.find(
      (cond: OpcaoRespostaPergunta) => cond.id === params.id,
    );
    if (!conditional) {
      return NextResponse.json(
        { message: 'Conditional not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(conditional);
  } catch (error) {
    console.error(`Error fetching conditional ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch conditional' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const success = await questionService.deleteConditional(params.id);
    if (!success) {
      return NextResponse.json(
        { message: 'Conditional not found or could not be deleted' },
        { status: 404 },
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting conditional ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete conditional' },
      { status: 500 },
    );
  }
}
