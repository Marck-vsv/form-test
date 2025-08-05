import { questionService } from '@/services/question-service';
import type { Pergunta } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const question = await questionService.getQuestionById(params.id);
    if (!question) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(question);
  } catch (error) {
    console.error(`Error fetching question ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch question' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data: Partial<Pergunta> = await request.json();
    const updatedQuestion = await questionService.updateQuestion(
      params.id,
      data,
    );
    if (!updatedQuestion) {
      return NextResponse.json(
        { message: 'Question not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error(`Error updating question ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update question' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const success = await questionService.deleteQuestion(params.id);
    if (!success) {
      return NextResponse.json(
        { message: 'Question not found or could not be deleted' },
        { status: 404 },
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting question ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete question' },
      { status: 500 },
    );
  }
}
