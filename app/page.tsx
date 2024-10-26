"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";


interface Todo {
  name: string;
  description: string;
  id: string;
}

export default function Index() {
  const supabase = createClient();
  const [fetchTodos, setFetchTodos] = useState(false);
  const [todos, setTodos] = useState<Todo[] | null>(null);

  useEffect(() => {
    supabase
      .from("moyin_kelvin_todos")
      .select("name, description, id")
      .then(({ data }) => {
        setTodos(data as Todo[]);
      });
  }, [fetchTodos]);

	const refetchTodos = () => {
		setFetchTodos(prev => !prev);
	}

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
  .from('moyin_kelvin_todos')
  .delete()
  .eq('id', id);

    if (error) {
      console.log(error);
    } else {
      refetchTodos();
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 h-full">
      <h2 className="font-medium text-xl mb-4">Todos</h2>
      <AddTodoForm refetchTodos={refetchTodos} />
      <div className="w-full flex flex-col flex-1 min-h-0 gap-5">
        {todos?.map((todo) => (
          <TodoCard key={todo.id} todo={todo} deleteTodo={deleteTodo}/>
        ))}
      </div>
    </main>
  );
}

const formItems: { name: "name" | "description"; label: string; description: string }[] = [
  {
    name: "name",
    label: "Name",
    description: "The title of your todo.",
  },
  {
    name: "description",
    label: "Description",
    description: "The description of your todo.",
  },
];

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
});

const AddTodoForm = ({ refetchTodos }: { refetchTodos: ()=>void }) => { 
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {toast} = useToast();

  const onSubmit = async ({name, description}: { name: string; description: string }) => {
    const supabase = createClient();
    const { data: all, error } = await supabase
      .from("moyin_kelvin_todos")
      .insert([{ name, description}])
      .select();

		if (error) {
			console.log(error);
		} else {
      toast({
        title: "Todo Added",
        description: "Todo was added successfully",
      })
      form.reset();
			refetchTodos();
		};
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-10 items-center"
      >
        {formItems.map(({ name, label, description }) => (
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Add Todo</Button>
      </form>
    </Form>
  );
};

const TodoCard = ({ todo, deleteTodo }: { todo: Todo, deleteTodo: (id: string) => void }) => {
  const { name, description, id } = todo;

  const supabase = createClient();
  
  return (
    <div className="flex flex-col rounded-md border p-5 gap-3 w-3/4">
      <h2 className="font-bold">{name}</h2>
      <p>{description}</p>
      <Button onClick={() => deleteTodo(id)} className="w-fit">Completed</Button>
    </div>
  );
};
