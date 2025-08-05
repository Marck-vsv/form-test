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
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/sonner';
import { questionService } from '@/services/question-service';
import type { OpcaoResposta, PerguntaTipo } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuestionDetailsPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: question,
    isLoading: isLoadingQuestion,
    error: errorQuestion,
  } = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => questionService.getQuestionById(questionId),
  });

  const {
    data: options,
    isLoading: isLoadingOptions,
    error: errorOptions,
  } = useQuery({
    queryKey: ['options', questionId],
    queryFn: () => questionService.getOptionsByQuestionId(questionId),
    enabled:
      !!questionId &&
      (question?.tipo_pergunta === 'unica_escolha' ||
        question?.tipo_pergunta === 'multipla_escolha'),
  });

  const {
    data: allQuestions,
    isLoading: isLoadingAllQuestions,
    error: errorAllQuestions,
  } = useQuery({
    queryKey: ['allQuestions'],
    queryFn: () => questionService.getAllQuestions(),
  });

  const {
    data: allOptions,
    isLoading: isLoadingAllOptions,
    error: errorAllOptions,
  } = useQuery({
    queryKey: ['allOptions'],
    queryFn: () => questionService.getAllOptions(),
  });

  const {
    data: conditionals,
    isLoading: isLoadingConditionals,
    error: errorConditionals,
  } = useQuery({
    queryKey: ['conditionals', questionId],
    queryFn: () => questionService.getConditionalsByQuestionId(questionId),
    enabled: !!questionId,
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<typeof question>;
    }) => questionService.updateQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
      toast({
        title: 'Pergunta atualizada!',
        description: 'As informações da pergunta foram salvas.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao atualizar pergunta',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const createOptionMutation = useMutation({
    mutationFn: questionService.createOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options', questionId] });
      toast({
        title: 'Opção criada!',
        description: 'A nova opção de resposta foi adicionada.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao criar opção',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpcaoResposta> }) =>
      questionService.updateOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options', questionId] });
      toast({
        title: 'Opção atualizada!',
        description: 'A opção de resposta foi salva.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao atualizar opção',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const deleteOptionMutation = useMutation({
    mutationFn: questionService.deleteOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options', questionId] });
      queryClient.invalidateQueries({ queryKey: ['conditionals'] });
      toast({
        title: 'Opção excluída!',
        description: 'A opção de resposta foi removida.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao excluir opção',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const createConditionalMutation = useMutation({
    mutationFn: questionService.createConditional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditionals', questionId] });
      toast({
        title: 'Condicional criada!',
        description: 'A nova regra condicional foi adicionada.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao criar condicional',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const deleteConditionalMutation = useMutation({
    mutationFn: questionService.deleteConditional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditionals', questionId] });
      toast({
        title: 'Condicional excluída!',
        description: 'A regra condicional foi removida.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao excluir condicional',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const handleQuestionUpdate = (
    field: string,
    value: string | number | boolean,
  ) => {
    if (question) {
      updateQuestionMutation.mutate({
        id: question.id,
        data: { [field]: value },
      });
    }
  };

  const handleAddOption = () => {
    if (question) {
      createOptionMutation.mutate({
        id_pergunta: question.id,
        resposta: `Nova Opção ${options ? options.length + 1 : 1}`,
        ordem: options ? options.length + 1 : 1,
        resposta_aberta: false,
      });
    }
  };

  const handleUpdateOption = (id: string, data: Partial<OpcaoResposta>) => {
    updateOptionMutation.mutate({ id, data });
  };

  const handleDeleteOption = (id: string) => {
    deleteOptionMutation.mutate(id);
  };

  const [newConditionalOptionId, setNewConditionalOptionId] = useState<
    string | null
  >(null);
  const [newConditionalQuestionId, setNewConditionalQuestionId] = useState<
    string | null
  >(null);

  const handleCreateConditional = () => {
    if (newConditionalOptionId && newConditionalQuestionId) {
      createConditionalMutation.mutate({
        id_opcao_resposta: newConditionalOptionId,
        id_pergunta: newConditionalQuestionId,
      });
      setNewConditionalOptionId(null);
      setNewConditionalQuestionId(null);
    } else {
      toast({
        title: 'Selecione opção e pergunta',
        description:
          'Por favor, selecione uma opção e uma pergunta para criar a condicional.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConditional = (id: string) => {
    deleteConditionalMutation.mutate(id);
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

  if (isLoadingQuestion)
    return <div className="p-8 text-center">Carregando pergunta...</div>;
  if (errorQuestion)
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar pergunta: {errorQuestion.message}
      </div>
    );
  if (!question)
    return <div className="p-8 text-center">Pergunta não encontrada.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/forms/${question.id_formulario}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para o Formulário</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          Gerenciar Pergunta: {question.titulo}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes da Pergunta</CardTitle>
          <CardDescription>
            Edite as informações básicas desta pergunta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="question-title">Título da Pergunta</Label>
            <Input
              id="question-title"
              value={question.titulo}
              onChange={(e) => handleQuestionUpdate('titulo', e.target.value)}
              placeholder="Título da Pergunta"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="question-code">Código da Pergunta</Label>
            <Input
              id="question-code"
              value={question.codigo}
              onChange={(e) => handleQuestionUpdate('codigo', e.target.value)}
              placeholder="Código da Pergunta"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="questionType">Tipo de Pergunta</Label>
            <Select
              value={question.tipo_pergunta}
              onValueChange={(value: PerguntaTipo) =>
                handleQuestionUpdate('tipo_pergunta', value)
              }
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
              value={question.orientacao_resposta || ''}
              onChange={(e) =>
                handleQuestionUpdate('orientacao_resposta', e.target.value)
              }
              placeholder="Orientação de Resposta"
              rows={2}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="question-order">Ordem</Label>
            <Input
              id="question-order"
              type="number"
              value={question.ordem}
              onChange={(e) =>
                handleQuestionUpdate(
                  'ordem',
                  Number.parseInt(e.target.value) || 0,
                )
              }
              placeholder="Ordem"
              min="0"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="required"
              checked={question.obrigatoria}
              onCheckedChange={(checked) =>
                handleQuestionUpdate('obrigatoria', checked)
              }
            />
            <Label htmlFor="required">Obrigatória</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="subQuestion"
              checked={question.sub_pergunta}
              onCheckedChange={(checked) =>
                handleQuestionUpdate('sub_pergunta', checked)
              }
            />
            <Label htmlFor="subQuestion">
              Sub-pergunta (Exibida condicionalmente)
            </Label>
          </div>
        </CardContent>
      </Card>

      {(question.tipo_pergunta === 'unica_escolha' ||
        question.tipo_pergunta === 'multipla_escolha') && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Opções de Resposta</CardTitle>
            <Button size="sm" onClick={handleAddOption}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Opção
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingOptions ? (
              <div className="text-center">Carregando opções...</div>
            ) : errorOptions ? (
              <div className="text-center text-red-500">
                Erro ao carregar opções: {errorOptions.message}
              </div>
            ) : options && options.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhuma opção encontrada. Adicione uma para começar!
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resposta</TableHead>
                    <TableHead>Ordem</TableHead>
                    <TableHead>Resposta Aberta</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options?.map((option) => (
                    <OptionRow
                      key={option.id}
                      option={option}
                      onUpdate={handleUpdateOption}
                      onDelete={handleDeleteOption}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">
            Condicionais (Esta pergunta é exibida se...)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="grid gap-2">
              <Label htmlFor="conditional-option">Opção que revela</Label>
              <Select
                value={newConditionalOptionId || ''}
                onValueChange={setNewConditionalOptionId}
                disabled={isLoadingAllOptions}
              >
                <SelectTrigger id="conditional-option">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {allOptions?.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.resposta} (Pergunta:{' '}
                      {allQuestions?.find((q) => q.id === opt.id_pergunta)
                        ?.titulo || opt.id_pergunta}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="conditional-question">Pergunta revelada</Label>
              <Select
                value={newConditionalQuestionId || ''}
                onValueChange={setNewConditionalQuestionId}
                disabled={isLoadingAllQuestions}
              >
                <SelectTrigger id="conditional-question">
                  <SelectValue placeholder="Selecione uma pergunta" />
                </SelectTrigger>
                <SelectContent>
                  {allQuestions
                    ?.filter((q) => q.id !== questionId)
                    .map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.titulo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCreateConditional}
                className="w-full"
                disabled={createConditionalMutation.isPending}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Condicional
              </Button>
            </div>
          </div>

          {isLoadingConditionals ||
          isLoadingAllOptions ||
          isLoadingAllQuestions ? (
            <div className="text-center">Carregando condicionais...</div>
          ) : errorConditionals || errorAllOptions || errorAllQuestions ? (
            <div className="text-center text-red-500">
              Erro ao carregar condicionais:{' '}
              {errorConditionals?.message ||
                errorAllOptions?.message ||
                errorAllQuestions?.message}
            </div>
          ) : conditionals && conditionals.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhuma condicional configurada para esta pergunta.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opção que revela</TableHead>
                  <TableHead>Pergunta revelada</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conditionals?.map((conditional) => {
                  const revealingOption = allOptions?.find(
                    (opt) => opt.id === conditional.id_opcao_resposta,
                  );
                  const revealedQuestion = allQuestions?.find(
                    (q) => q.id === conditional.id_pergunta,
                  );
                  return (
                    <TableRow key={conditional.id}>
                      <TableCell>
                        {revealingOption
                          ? `${revealingOption.resposta} (Pergunta: ${
                              allQuestions?.find(
                                (q) => q.id === revealingOption.id_pergunta,
                              )?.titulo || 'N/A'
                            })`
                          : conditional.id_opcao_resposta}
                      </TableCell>
                      <TableCell>
                        {revealedQuestion
                          ? revealedQuestion.titulo
                          : conditional.id_pergunta}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Excluir Condicional
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá
                                permanentemente esta regra condicional.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteConditional(conditional.id)
                                }
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface OptionRowProps {
  option: OpcaoResposta;
  onUpdate: (id: string, data: Partial<OpcaoResposta>) => void;
  onDelete: (id: string) => void;
}

function OptionRow({ option, onUpdate, onDelete }: OptionRowProps) {
  const [resposta, setResposta] = useState(option.resposta);
  const [ordem, setOrdem] = useState(option.ordem);
  const [respostaAberta, setRespostaAberta] = useState(option.resposta_aberta);

  useEffect(() => {
    setResposta(option.resposta);
    setOrdem(option.ordem);
    setRespostaAberta(option.resposta_aberta);
  }, [option]);

  const handleBlurResposta = () => {
    if (resposta !== option.resposta) {
      onUpdate(option.id, { resposta });
    }
  };

  const handleBlurOrdem = () => {
    if (ordem !== option.ordem) {
      onUpdate(option.id, { ordem });
    }
  };

  const handleCheckedChangeRespostaAberta = (checked: boolean) => {
    setRespostaAberta(checked);
    onUpdate(option.id, { resposta_aberta: checked });
  };

  return (
    <TableRow>
      <TableCell>
        <Input
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          onBlur={handleBlurResposta}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={ordem}
          onChange={(e) => setOrdem(Number.parseInt(e.target.value) || 0)}
          onBlur={handleBlurOrdem}
        />
      </TableCell>
      <TableCell>
        <Checkbox
          checked={respostaAberta}
          onCheckedChange={handleCheckedChangeRespostaAberta}
        />
      </TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir Opção</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente a
                opção <span className="font-semibold">{option.resposta}</span> e
                quaisquer condicionais que dependam dela.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(option.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
