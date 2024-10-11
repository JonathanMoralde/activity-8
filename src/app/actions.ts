"use server";

import { createClient } from "@/utils/supabase/server";

import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export interface Todo {
  id: number;
  name: string;
  completed: boolean;
  uid: string;
}

export async function getTodos(): Promise<Todo[] | null> {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  let query = supabase.from("todos").select("*").eq("uid", data.user?.id);
  const { data: todos, error } = await query;

  if (error) {
    console.error("Error fetching data from Supabase:", error);
    throw new Error(error.message);
  }
  return todos;
}

export async function insertTodo(todo: string) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("todos")
    .insert([{ name: todo, completed: false, uid: user.user?.id }])
    .select();

  if (error) {
    console.error("Error inserting todo to Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}

// update check
export async function updateCompleted(id: number, completed: boolean) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id)
    .eq("uid", user.user?.id)
    .select();

  if (error) {
    console.error("Error updating todo to Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}

// update todo
export async function updateTodo(id: number, updatedTodo: string) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("todos")
    .update({ name: updatedTodo })
    .eq("id", id)
    .eq("uid", user.user?.id)
    .select();

  if (error) {
    console.error("Error updating todo to Supabase:", error);
    throw new Error(error.message);
  }

  return data;
}

// delete a todo
export async function deleteTodo(id: number) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("uid", user.user?.id);

  if (error) {
    console.error("Error updating todo to Supabase:", error);
    throw new Error(error.message);
  }
}
