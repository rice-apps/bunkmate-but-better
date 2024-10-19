"use client"

import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AddItemForm } from "./components/form_component";
import ToDoCard from "./components/CardComponent";
import { createClient } from "@/utils/supabase/client";

interface Todo {
	id: number,
	title: string,
	description: string
}

export default function Index() {
	const supabase = createClient();
	const [fetchedTodos, setFetchedTodos] = useState<Todo[]>([]);
	const [reload, setReload] = useState<boolean>(false);

	useEffect(() => {
		const fetchTodos = async () => {
			const {data: todos, error} = await supabase.from('met_todos').select();
			if (todos == null) {
				setFetchedTodos([])
			} else {
				setFetchedTodos(todos);
			}
		}
		fetchTodos()
	}, [reload]);

	function refetch() {
		setReload(prev => !prev)
	}

	const completedTodo = async (id: number) => {
		await supabase.from('met_todos').delete().eq('id', id);
		refetch()
	}
	
	return (
		<main className="flex-1 flex flex-col gap-6 px-4">
			<h2 className="font-medium text-xl mb-4">TODO</h2>
			<AddItemForm refetch={refetch} />
			<div>
				<ul>
					{fetchedTodos.map((todo) => (
            			<ToDoCard key={todo.id} title={todo.title} description={todo.description} onComplete={() => completedTodo(todo.id)} />
          			))}
				</ul>
			</div>
		</main>
	);
}

{/* <div> 
	<ToDoCard />
</div> */}

{/* <div className="flex space-x-6">
					<div className="flex flex-col space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input placeholder="Your todo" id="title" />
					</div>
					<div className="flex flex-col space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input placeholder="Lorem ipsum dolor" id="description" />
					</div>
					<div className="flex flex-col space-y-2">
						<Button>Add TODO</Button>
					</div>
				</div> */}

