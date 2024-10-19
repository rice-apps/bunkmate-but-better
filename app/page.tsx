"use client"

import { useState, useEffect } from 'react'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Card,
  CardContent,
	CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";

import { createClient } from '@/utils/supabase/client';

interface TodoProps {
	id: number,
	title: string,
	description: string,
	handleClick: MouseEventHandler<HTMLButtonElement>
};

function Todo({id, title, description, handleClick}: TodoProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p>{description}</p>
			</CardContent>
			<CardFooter>
				<Button id={`${id}`} onClick={handleClick}>Completed</Button>
			</CardFooter>
		</Card>
	)
}

export default function Index() {
	const [error, setError] = useState<string>("");
	const [todos, setTodos] = useState<any[]>([]);
	const [reload, setReload] = useState<boolean>(false);

	const supabase = createClient();

	useEffect(() => {
		async function loadTodos() {
			const { data: todos } = await supabase.from("gabriels_todos").select();
			if (todos == null) {
				setTodos([]);
			} else {
				setTodos(todos);
			}
		}
		
		loadTodos()
	}, [reload])

	const formSchema = z.object({
		title: z.string(),
		description: z.string()
	});

	const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
			description: ""
    },
  });

	async function handleSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.from("gabriels_todos").insert({title: values.title, description: values.description});
		if (error != null) {
			console.error(error.message);
			setError(error.message);
		} else {
			setError("");
			form.reset();
			setReload(!reload);
		}
	}

	async function handleDelete(e: MouseEvent) {
		e.preventDefault();
		const target = e.target as HTMLButtonElement;
		console.log(parseInt(target.id));
		const resp = await supabase.from("gabriels_todos").delete().eq("id", parseInt(target.id));
		console.log(resp.status, resp.data);
		setReload(!reload);
	}

  return (
		<main className="flex-1 flex flex-col gap-6 px-4">
			<h1 className="text-2xl text-center bold">TODOs</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-row gap-2">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Your todo" {...field} />
								</FormControl>
								<FormDescription>
									The title of your TODO.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Input placeholder="Lorem ispum dolor" {...field} />
								</FormControl>
								<FormDescription>
									The description of your TODO.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="self-center">Add TODO</Button>
				</form>
			</Form>
			<h1>{error}</h1>
			{todos.map((todo, idx) => <Todo key={idx} id={todo.id}  title={todo.title} description={todo.description} handleClick={handleDelete} />)}
		</main>
  );
}
