"use client";

import { useEffect, useState } from "react";
import TodoItem from "../components/todo-item";

import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  deleteTodo,
  getTodos,
  insertTodo,
  Todo,
  updateCompleted,
  updateTodo,
} from "./actions";
import Navbar from "@/components/nav-bar";

const todoSchema = z.object({
  name: z.string().min(1, "Todo cannot be empty"),
});

export default function Home() {
  // TO-DOs state
  const [todos, setTodos] = useState<Todo[]>([]);

  // selected index (for editing a todo)
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number | null>(
    null
  );

  // define the form using useForm from react-hook-form
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: "",
    },
  });

  // fetch todos from supabase on initial render
  useEffect(() => {
    const fetchTodos = async () => {
      const result = await getTodos();

      if (result != null) {
        console.log(result);

        setTodos(result);
      }
    };

    fetchTodos();
  }, []);

  // handle Submit
  const onSubmit = async (data: { name: string }) => {
    try {
      const todoInput = data.name;

      // Check if selected index is not null
      // Edit a todo
      if (selectedTodoIndex !== null) {
        let tempTodos = todos;
        const result = await updateTodo(
          tempTodos[selectedTodoIndex].id,
          todoInput
        );

        if (result) {
          tempTodos[selectedTodoIndex].name = todoInput;
          setTodos([...tempTodos]);
        }
        setSelectedTodoIndex(null);
        form.reset(); // Reset the input
        return;
      }

      // Insert a new todo to supabase
      const result = await insertTodo(todoInput);

      if (result) {
        setTodos([...todos, result[0]]);
      }

      form.reset(); // Reset the input
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Check
  const handleCheck = async (id: number, index: number) => {
    try {
      let tempTodos = todos;
      const result = await updateCompleted(id, !tempTodos[index].completed);
      if (result) {
        tempTodos[index] = result[0];
        setTodos([...tempTodos]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Delete
  const handleDel = async (index: number) => {
    try {
      let tempTodos = todos;

      await deleteTodo(tempTodos[index].id);
      tempTodos.splice(index, 1); //remove the todo from the todo state
      setTodos([...tempTodos]);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Edit
  const handleEditClick = (index: number) => {
    const todoToEdit = todos[index];
    form.setValue("name", todoToEdit.name); // Populate the form input with todo name
    setSelectedTodoIndex(index); // Set the index of the todo being edited
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen grid place-items-center">
        <section className="shadow max-h-[75vh] min-h-[50vh] max-w-screen-sm w-full bg-white p-10 flex flex-col items-center">
          <h1 className="font-bold text-4xl mb-10">To-Do List</h1>

          {/* todo input */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full mb-10"
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-center">
                      <div className="w-1/2">
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            placeholder="Add a todo"
                            className="bg-gray-200 p-2 rounded-l-md border-none focus:outline-none focus:ring-0 w-full"
                          />
                        </FormControl>
                      </div>
                      <Button
                        type="submit"
                        className="py-2.5 px-4 rounded-l-none  h-full"
                      >
                        {selectedTodoIndex != null ? "EDIT" : "ADD"}
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* todo display */}
          <div className="max-h-[75vh] overflow-y-scroll w-3/4 px-2">
            {/* use map to loop through todos and display each todo as todo item */}
            {todos.map((todo, index) => {
              return (
                <TodoItem
                  todo={todo}
                  index={index}
                  handleCheck={handleCheck}
                  handleDel={handleDel}
                  handleEditClick={handleEditClick}
                  key={index}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
