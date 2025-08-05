'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formService } from '@/services/form-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateFormPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);

  const createFormMutation = useMutation({
    mutationFn: formService.createForm,
    onSuccess: (newForm) => {
      console.log('Formulário criado com sucesso:', newForm);
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success('Formulário criado!', {
        description: `O formulário "${newForm.titulo}" foi criado com sucesso.`,
      });
      router.push(`/forms/${newForm.id}`);
    },
    onError: (err) => {
      console.error('Erro ao criar formulário:', err);
      toast.error('Erro ao criar formulário', {
        description: err.message || 'Ocorreu um erro inesperado.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Título obrigatório', {
        description: 'Por favor, insira um título para o formulário.',
      });
      return;
    }
    console.log('Submetendo formulário com dados:', {
      titulo: title,
      descricao: description,
      ordem: order,
    });
    createFormMutation.mutate({
      titulo: title,
      descricao: description,
      ordem: order,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para Formulários</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Criar Novo Formulário</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes do Formulário</CardTitle>
          <CardDescription>
            Preencha as informações para criar seu novo formulário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Pesquisa de Satisfação do Cliente"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma breve descrição sobre o propósito do formulário."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
                placeholder="1"
                min="0"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createFormMutation.isPending}
            >
              {createFormMutation.isPending ? 'Criando...' : 'Criar Formulário'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
