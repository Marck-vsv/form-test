'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formService } from '@/services/form-service';
import { questionService } from '@/services/question-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Eye, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function FormDetailsPage() {
  const { formId } = useParams<{ formId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: form,
    isLoading: isLoadingForm,
    error: errorForm,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formService.getFormById(formId),
  });

  const {
    data: questions,
    isLoading: isLoadingQuestions,
    error: errorQuestions,
  } = useQuery({
    queryKey: ['questions', formId],
    queryFn: () => questionService.getQuestionsByFormId(formId),
    enabled: !!formId,
  });

  const updateFormMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof form> }) =>
      formService.updateForm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
      toast.success('Formulário atualizado', {
        description: 'As informações do formulário foram salvas.',
      });
    },
    onError: (err) => {
      toast.error('Erro ao atualizar formulário', {
        description: err.message || 'Ocorreu um erro inesperado.',
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: questionService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', formId] });
      toast.success('Pergunta excluida!', {
        description: 'A pergunta foi removida com sucesso.',
      });
    },
    onError: (err) => {
      toast('Erro ao excluir pergunta', {
        description: err.message || 'Ocorreu um erro inesperado.',
      });
    },
  });

  useEffect(() => {
    if (formId === 'create') {
      router.replace('/forms/create');
    }
  }, [formId, router]);

  const handleFormUpdate = (field: string, value: string | number) => {
    if (form) {
      updateFormMutation.mutate({ id: form.id, data: { [field]: value } });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    deleteQuestionMutation.mutate(id);
  };

  if (formId === 'create') {
    return null;
  }

  if (isLoadingForm)
    return <div className="p-8 text-center">Carregando formulário...</div>;
  if (errorForm)
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar formulário: {errorForm.message}
      </div>
    );
  if (!form)
    return <div className="p-8 text-center">Formulário não encontrado.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar para Formulários</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            Gerenciar Formulário: {form.titulo}
          </h1>
        </div>
        <Button asChild>
          <Link href={`/forms/view/${formId}`}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar Formulário
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes do Formulário</CardTitle>
          <CardDescription>
            Edite as informações básicas do seu formulário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="form-title">Título</Label>
            <Input
              id="form-title"
              value={form.titulo}
              onChange={(e) => handleFormUpdate('titulo', e.target.value)}
              placeholder="Título do Formulário"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="form-description">Descrição</Label>
            <Textarea
              id="form-description"
              value={form.descricao}
              onChange={(e) => handleFormUpdate('descricao', e.target.value)}
              placeholder="Descrição do Formulário"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="form-order">Ordem</Label>
            <Input
              id="form-order"
              type="number"
              value={form.ordem}
              onChange={(e) =>
                handleFormUpdate('ordem', Number.parseInt(e.target.value) || 0)
              }
              placeholder="Ordem"
              min="0"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Perguntas do Formulário</h2>
        <Button asChild>
          <Link href={`/forms/${formId}/questions/create`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Pergunta
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Perguntas</CardTitle>
          <CardDescription>
            Gerencie as perguntas deste formulário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingQuestions ? (
            <div className="text-center">Carregando perguntas...</div>
          ) : errorQuestions ? (
            <div className="text-center text-red-500">
              Erro ao carregar perguntas: {errorQuestions.message}
            </div>
          ) : questions && questions.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhuma pergunta encontrada. Adicione uma para começar!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Obrigatória</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions?.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/questions/${question.id}`}
                        className="hover:underline"
                      >
                        {question.titulo}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {question.tipo_pergunta.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      {question.obrigatoria ? 'Sim' : 'Não'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/questions/${question.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar Pergunta</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir Pergunta</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá
                                permanentemente a pergunta{' '}
                                <span className="font-semibold">
                                  {question.titulo}
                                </span>{' '}
                                e todas as suas opções de resposta e
                                condicionais.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteQuestion(question.id)
                                }
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
