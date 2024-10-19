"use client"

import { addTodo } from "../supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string()
  })

interface AddFormProps {
    refetch: () => void
}

  export function AddItemForm({ refetch }: AddFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          description: "",
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        const { title, description } = values
        try {
            await addTodo(title, description);
            form.reset();
            refetch();
            console.log("hello")
          } catch (error) {
            console.error("Failed to add TODO:", error);
          }
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-row space-x-6 items-center">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
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
                <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Input placeholder="Lorem ipsum dolor" {...field} />
                    </FormControl>
                    <FormDescription>
                    The description of your TODO.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
                
            />
            <div className="flex flex-col space-y-2">
                <Button type="submit">Add TODO</Button>
            </div>
        </div>
        </form>
        </Form>
    )
  }
