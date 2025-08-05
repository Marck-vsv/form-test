import { questionService } from '@/services/question-service';
import type { CreatePerguntaDto } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { formId: string } },
) {
  try {
    const questions = await questionService.getQuestionsByFormId(params.formId);
    return NextResponse.json(questions);
  } catch (error) {
    console.error(`Error fetching questions for form ${params.formId}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch questions' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { formId: string } },
) {
  try {
    const data: Omit<CreatePerguntaDto, 'id_formulario'> = await request.json();
    const newQuestion = await questionService.createQuestion({
      ...data,
      id_formulario: params.formId,
    });
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error(`Error creating question for form ${params.formId}:`, error);
    return NextResponse.json(
      { message: 'Failed to create question' },
      { status: 500 },
    );
  }
}
