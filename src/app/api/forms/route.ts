import { formService } from '@/services/form-service';
import type { CreateFormularioDto } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const forms = await formService.getAllForms();
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { message: 'Failed to fetch forms' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: CreateFormularioDto = await request.json();
    const newForm = await formService.createForm(data);
    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { message: 'Failed to create form' },
      { status: 500 },
    );
  }
}
