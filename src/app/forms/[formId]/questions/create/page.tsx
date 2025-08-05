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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { questionService } from '@/services/question-service';
import type { PerguntaTipo } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateQuestionPage() {
  const { formId } = useParams<{ formId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [responseOrientation, setResponseOrientation] = useState('');
  const [order, setOrder] = useState(1);
  const [required, setRequired] = useState(false);
  const [subQuestion, setSubQuestion] = useState(false);
  const [questionType, setQuestionType] = useState<PerguntaTipo>('texto_livre');

  const createQuestionMutation = useMutation({
    mutationFn: questionService.createQuestion,
    onSuccess: (newQuestion) => {
      queryClient.invalidateQueries({ queryKey: ['questions', formId] });
      toast.success('Pergunta criada!', {
        description: `A pergunta "${newQuestion.titulo}" foi adicionada ao formulário.`,
      });
      router.push(`/forms/${formId}`);
    },
    onError: (err) => {
      toast.error('Erro ao criar pergunta', {
        description: err.message || 'Ocorreu um erro inesperado.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) {
      toast.error('Campos obrigatórios', {
        description: 'Título e Código da pergunta são obrigatórios.',
      });
      return;
    }

    createQuestionMutation.mutate({
      id_formulario: formId,
      titulo: title,
      codigo: code,
      orientacao_resposta: responseOrientation || null,
      ordem: order,
      obrigatoria: required,
      sub_pergunta: subQuestion,
      tipo_pergunta: questionType,
    });
  };

  const questionTypes: { value: PerguntaTipo; label: string }[] = [
    { value: 'Sim_Nao', label: 'Sim/Não' },
    { value: 'multipla_escolha', label: 'Múltipla Escolha' },
    { value: 'unica_escolha', label: 'Única Escolha' },
    { value: 'texto_livre', label: 'Texto Livre' },
    { value: 'Inteiro', label: 'Número Inteiro' },
    {
      value: 'Numero_com_duas_casas_decimais',
      label: 'Número Decimal (2 casas)',
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/forms/${formId}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para o Formulário</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Adicionar Nova Pergunta</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes da Pergunta</CardTitle>
          <CardDescription>
            Preencha as informações para adicionar uma nova pergunta ao
            formulário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Pergunta</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Qual seu nível de satisfação?"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Código da Pergunta</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: SATISFACAO_GERAL"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="questionType">Tipo de Pergunta</Label>
              <Select
                value={questionType}
                onValueChange={(value: PerguntaTipo) => setQuestionType(value)}
              >
                <SelectTrigger id="questionType">
                  <SelectValue placeholder="Selecione o tipo de pergunta" />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responseOrientation">
                Orientação de Resposta (Opcional)
              </Label>
              <Textarea
                id="responseOrientation"
                value={responseOrientation}
                onChange={(e) => setResponseOrientation(e.target.value)}
                placeholder="Ex: De 1 a 5, sendo 5 muito satisfeito."
                rows={2}
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
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={required}
                onCheckedChange={setRequired}
              />
              <Label htmlFor="required">Obrigatória</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="subQuestion"
                checked={subQuestion}
                onCheckedChange={setSubQuestion}
              />
              <Label htmlFor="subQuestion">
                Sub-pergunta (Exibida condicionalmente)
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createQuestionMutation.isPending}
            >
              {createQuestionMutation.isPending
                ? 'Adicionando...'
                : 'Adicionar Pergunta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
