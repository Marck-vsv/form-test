import { questionService } from '@/services/question-service';
import type { CreateOpcaoRespostaDto } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { questionId: string } },
) {
  try {
    const options = await questionService.getOptionsByQuestionId(
      params.questionId,
    );
    return NextResponse.json(options);
  } catch (error) {
    console.error(
      `Error fetching options for question ${params.questionId}:`,
      error,
    );
    return NextResponse.json(
      { message: 'Failed to fetch options' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { questionId: string } },
) {
  try {
    const data: Omit<CreateOpcaoRespostaDto, 'id_pergunta'> =
      await request.json();
    const newOption = await questionService.createOption({
      ...data,
      id_pergunta: params.questionId,
    });
    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error(
      `Error creating option for question ${params.questionId}:`,
      error,
    );
    return NextResponse.json(
      { message: 'Failed to create option' },
      { status: 500 },
    );
  }
}
