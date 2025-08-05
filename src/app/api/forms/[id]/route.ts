import { formService } from '@/services/form-service';
import type { Formulario } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const form = await formService.getFormById(params.id);
    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }
    return NextResponse.json(form);
  } catch (error) {
    console.error(`Error fetching form ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to fetch form' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data: Partial<Formulario> = await request.json();
    const updatedForm = await formService.updateForm(params.id, data);
    if (!updatedForm) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }
    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error(`Error updating form ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to update form' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const success = await formService.deleteForm(params.id);
    if (!success) {
      return NextResponse.json(
        { message: 'Form not found or could not be deleted' },
        { status: 404 },
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting form ${params.id}:`, error);
    return NextResponse.json(
      { message: 'Failed to delete form' },
      { status: 500 },
    );
  }
}
