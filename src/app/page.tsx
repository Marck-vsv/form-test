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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { formService } from '@/services/form-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FormsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: forms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: formService.getAllForms,
  });

  const deleteFormMutation = useMutation({
    mutationFn: formService.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast({
        title: 'Formulário excluído!',
        description: 'O formulário foi removido com sucesso.',
      });
    },
    onError: (err) => {
      toast({
        title: 'Erro ao excluir formulário',
        description: err.message || 'Ocorreu um erro inesperado.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteFormMutation.mutate(id);
  };

  if (isLoading)
    return <div className="p-8 text-center">Carregando formulários...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Erro ao carregar formulários: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Meus Formulários</h1>
        <Button asChild>
          <Link href="/forms/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Novo Formulário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Formulários</CardTitle>
          <CardDescription>
            Gerencie seus formulários dinâmicos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forms && forms.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum formulário encontrado. Crie um novo para começar!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms?.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/forms/${form.id}`}
                        className="hover:underline"
                      >
                        {form.titulo}
                      </Link>
                    </TableCell>
                    <TableCell>{form.descricao}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/forms/${form.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar Formulário</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Excluir Formulário
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso excluirá
                                permanentemente o formulário{' '}
                                <span className="font-semibold">
                                  {form.titulo}
                                </span>{' '}
                                e todas as suas perguntas e opções.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(form.id)}
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
