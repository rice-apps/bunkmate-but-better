"use client";

import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from 'react';

const supabase = createClient();

interface Todo {
	title: string,
	description: string,
	created_at: string,
	id: number
}

export default function Index() {
	const [todos, setTodos] = useState<Todo[]>([]);

	useEffect(() => {
		fetchTodos();
	}, []);

	async function fetchTodos() {
		let { data: eric_rahul_todos, error } = await supabase
			.from('eric_rahul_todos')
			.select('title,description,created_at,id')
			.order('created_at', { ascending: false });

		if (error) {
			console.error("Error fetching todos:", error);
		} else if (eric_rahul_todos) {
			setTodos(eric_rahul_todos);
		}
	}

	async function addTodo(title: string, description: string) {
		const { data, error } = await supabase
			.from('eric_rahul_todos')
			.insert([
				{ title: title, description: description },
			])
			.select();

		if (error) {
			console.error("Error adding todo:", error);
		} else if (data) {
			setTodos([data[0], ...todos]);
		}
	}

	return (
		<main className="flex-1 flex flex-col gap-6 px-4">
			<h2 className="font-medium text-xl mb-4">REnotion</h2>
			<CardWithForm addTodo={addTodo} />
			<TableDemo todos={todos} />
		</main>
	);
}

export function CardWithForm({ addTodo }: { addTodo: (title: string, description: string) => Promise<void> }) {
	const [name, setName] = useState("");
	const [desc, setDesc] = useState("");

	async function handleAdd() {
		await addTodo(name, desc);
		setName("");
		setDesc("");
	}

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create to do</CardTitle>
				<CardDescription>Fill in your events.</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="To do name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="Description"
								value={desc}
								onChange={(e) => setDesc(e.target.value)}
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={() => { setName(""); setDesc(""); }}>Cancel</Button>
				<Button onClick={handleAdd}>Add TODO</Button>
			</CardFooter>
		</Card>
	);
}

export function TableDemo({ todos }: { todos: Todo[] }) {	
	async function FinishTODO(id: number) {
		const { error } = await supabase
			.from('eric_rahul_todos')
			.delete()
			.eq('id', id)

		if (error) {
			console.error("Error adding todo:", error);
		}
	}


	return (
		<Table>
			<TableCaption>A list of your To do's.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Title</TableHead>
					<TableHead>Description</TableHead>
					<TableHead>Timestamp</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{todos.map((todo) => (
					<TableRow key={todo.id}>
						<TableCell className="font-medium">{todo.title}</TableCell>
						<TableCell>{todo.description}</TableCell>
						<TableCell>{new Date(todo.created_at).toLocaleString()}</TableCell>
						<TableCell>
							<Button variant="destructive"
								onClick={() => { FinishTODO(todo.id); location.reload();} }>
								Complete
								
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}