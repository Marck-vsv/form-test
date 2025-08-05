import { getMockDb } from '@/data/mock-db';
import { questionService } from '@/services/question-service';
import type { OpcaoResposta } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getMockDb();
    const option = db.opcoesRespostas.find(
      (opt: OpcaoResposta) => opt.id === params.id,
    );
    if (!option) {
      return NextResponse.json(
        { message: 'Option not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(option);
  } catch (error) {
    console.error(`Error fetching option ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch option' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data: Partial<OpcaoResposta> = await request.json();
    const updatedOption = await questionService.updateOption(params.id, data);
    if (!updatedOption) {
      return NextResponse.json(
        { message: 'Option not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error(`Error updating option ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update option' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const success = await questionService.deleteOption(params.id);
    if (!success) {
      return NextResponse.json(
        { message: 'Option not found or could not be deleted' },
        { status: 404 },
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting option ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete option' },
      { status: 500 },
    );
  }
}
