import { questionService } from '@/services/question-service';
import type { CreateOpcaoRespostaPerguntaDto } from '@/types';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data: CreateOpcaoRespostaPerguntaDto = await request.json();
    const newConditional = await questionService.createConditional(data);
    return NextResponse.json(newConditional, { status: 201 });
  } catch (error) {
    console.error('Error creating conditional:', error);
    return NextResponse.json(
      { message: 'Failed to create conditional' },
      { status: 500 },
    );
  }
}
