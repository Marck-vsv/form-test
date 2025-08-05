'use client';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { formService } from '@/services/form-service';
import { questionService } from '@/services/question-service';
import type { Pergunta } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function DynamicFormViewerPage() {
  const { formId } = useParams<{ formId: string }>();

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

  const {
    data: options,
    isLoading: isLoadingOptions,
    error: errorOptions,
  } = useQuery({
    queryKey: ['allOptions'],
    queryFn: () => questionService.getAllOptions(),
  });

  const {
    data: conditionals,
    isLoading: isLoadingConditionals,
    error: errorConditionals,
  } = useQuery({
    queryKey: ['allConditionals'],
    queryFn: () => questionService.getAllConditionals(),
  });

  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const isQuestionVisible = useMemo(() => {
    return (question: Pergunta) => {
      if (!question.sub_pergunta) {
        return true;
      }

      const relevantConditionals = conditionals?.filter(
        (cond) => cond.id_pergunta === question.id,
      );

      if (!relevantConditionals || relevantConditionals.length === 0) {
        return true;
      }

      return relevantConditionals.some((cond) => {
        const revealingOption = options?.find(
          (opt) => opt.id === cond.id_opcao_resposta,
        );
        if (!revealingOption) return false;

        const parentQuestionId = revealingOption.id_pergunta;
        const parentAnswer = answers[parentQuestionId];

        const parentQuestion = questions?.find(
          (q) => q.id === parentQuestionId,
        );

        if (!parentQuestion) return false;

        if (parentQuestion.tipo_pergunta === 'Sim_Nao') {
          return parentAnswer === revealingOption.resposta;
        } else if (parentQuestion.tipo_pergunta === 'unica_escolha') {
          return parentAnswer === revealingOption.id;
        } else if (parentQuestion.tipo_pergunta === 'multipla_escolha') {
          return (
            Array.isArray(parentAnswer) &&
            parentAnswer.includes(revealingOption.id)
          );
        }
        return false;
      });
    };
  }, [answers, conditionals, options, questions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Respostas do Formulário:', answers);
    toast.success('Formulário submetido!', {
      description: 'Verifique o console para as respostas.',
    });
  };

  if (
    isLoadingForm ||
    isLoadingQuestions ||
    isLoadingOptions ||
    isLoadingConditionals
  ) {
    return <div className="p-8 text-center">Carregando formulário...</div>;
  }

  if (errorForm || errorQuestions || errorOptions || errorConditionals) {
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar formulário:{' '}
        {errorForm?.message ||
          errorQuestions?.message ||
          errorOptions?.message ||
          errorConditionals?.message}
      </div>
    );
  }

  if (!form) {
    return <div className="p-8 text-center">Formulário não encontrado.</div>;
  }

  const sortedQuestions = questions?.sort((a, b) => a.ordem - b.ordem) || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-bold">Formulário: {form.titulo}</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{form.titulo}</CardTitle>
          <CardDescription>{form.descricao}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {sortedQuestions.map((question) => {
              const questionOptions =
                options?.filter((opt) => opt.id_pergunta === question.id) || [];
              const isVisible = isQuestionVisible(question);

              if (!isVisible) {
                return null;
              }

              return (
                <div
                  key={question.id}
                  className={`space-y-2 ${
                    question.sub_pergunta
                      ? 'pl-6 border-l-2 border-gray-200'
                      : ''
                  }`}
                >
                  <Label
                    htmlFor={question.id}
                    className="text-lg font-semibold"
                  >
                    {question.titulo}{' '}
                    {question.obrigatoria && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  {question.orientacao_resposta && (
                    <p className="text-sm text-gray-500">
                      {question.orientacao_resposta}
                    </p>
                  )}

                  {question.tipo_pergunta === 'texto_livre' && (
                    <Textarea
                      id={question.id}
                      value={answers[question.id] || ''}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      required={question.obrigatoria}
                      placeholder="Digite sua resposta aqui..."
                    />
                  )}

                  {(question.tipo_pergunta === 'Inteiro' ||
                    question.tipo_pergunta ===
                      'Numero_com_duas_casas_decimais') && (
                    <Input
                      id={question.id}
                      type="number"
                      step={
                        question.tipo_pergunta ===
                        'Numero_com_duas_casas_decimais'
                          ? '0.01'
                          : '1'
                      }
                      value={answers[question.id] || ''}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      required={question.obrigatoria}
                      placeholder="Digite um número..."
                    />
                  )}

                  {question.tipo_pergunta === 'Sim_Nao' && (
                    <RadioGroup
                      value={answers[question.id] || ''}
                      onValueChange={(value) =>
                        handleAnswerChange(question.id, value)
                      }
                      required={question.obrigatoria}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sim" id={`${question.id}-sim`} />
                        <Label htmlFor={`${question.id}-sim`}>Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Não" id={`${question.id}-nao`} />
                        <Label htmlFor={`${question.id}-nao`}>Não</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {question.tipo_pergunta === 'unica_escolha' && (
                    <RadioGroup
                      value={answers[question.id] || ''}
                      onValueChange={(value) =>
                        handleAnswerChange(question.id, value)
                      }
                      required={question.obrigatoria}
                    >
                      {questionOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={`${question.id}-${option.id}`}
                          />
                          <Label htmlFor={`${question.id}-${option.id}`}>
                            {option.resposta}
                          </Label>
                          {option.resposta_aberta &&
                            answers[question.id] === option.id && (
                              <Input
                                type="text"
                                placeholder="Especifique..."
                                className="ml-4 w-auto"
                                value={
                                  answers[`${question.id}-${option.id}-open`] ||
                                  ''
                                }
                                onChange={(e) =>
                                  handleAnswerChange(
                                    `${question.id}-${option.id}-open`,
                                    e.target.value,
                                  )
                                }
                              />
                            )}
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.tipo_pergunta === 'multipla_escolha' && (
                    <div className="space-y-2">
                      {questionOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${question.id}-${option.id}`}
                            checked={
                              Array.isArray(answers[question.id]) &&
                              answers[question.id].includes(option.id)
                            }
                            onCheckedChange={(checked) => {
                              const currentAnswers = Array.isArray(
                                answers[question.id],
                              )
                                ? [...answers[question.id]]
                                : [];
                              if (checked) {
                                handleAnswerChange(question.id, [
                                  ...currentAnswers,
                                  option.id,
                                ]);
                              } else {
                                handleAnswerChange(
                                  question.id,
                                  currentAnswers.filter(
                                    (item: string) => item !== option.id,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`${question.id}-${option.id}`}>
                            {option.resposta}
                          </Label>
                          {option.resposta_aberta &&
                            Array.isArray(answers[question.id]) &&
                            answers[question.id].includes(option.id) && (
                              <Input
                                type="text"
                                placeholder="Especifique..."
                                className="ml-4 w-auto"
                                value={
                                  answers[`${question.id}-${option.id}-open`] ||
                                  ''
                                }
                                onChange={(e) =>
                                  handleAnswerChange(
                                    `${question.id}-${option.id}-open`,
                                    e.target.value,
                                  )
                                }
                              />
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Button type="submit" className="w-full">
              Enviar Respostas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
