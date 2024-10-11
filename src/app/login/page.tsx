"use client";

import { FaGithub } from "react-icons/fa";
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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import Link from "next/link";

// Create a schema uzing Zod schema
const formSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // using useForm from react-hook-form to define the login form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle Submit
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(data.email, data.password); //sign in using the server action
      toast.success("User signed in successfully!");
      setIsLoading(false);
      router.push("/"); // navigate to home
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);

        toast.error(`Failed to sign in. ${error.message}`);
      } else {
        console.error("Unknown error:", error);
      }
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-200">
      <h1 className="font-bold text-5xl mb-20">Welcome to To-do List App!</h1>
      <section className="shadow bg-white dark:bg-slate-800 w-1/4 py-10 px-5 flex flex-col items-center rounded-lg">
        <h2 className="font-bold mb-5 uppercase text-2xl tracking-wide">
          Sign In
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mb-5"
          >
            {/* email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black rounded"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-10">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black rounded"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* login btn */}
            <div className="flex justify-center items-center w-full">
              <Button
                type="submit"
                className="rounded bg-slate-900 text-white shadow-lg font-semibold tracking-wide w-1/2"
                disabled={isLoading}
              >
                {isLoading ?? <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                LOGIN
              </Button>
            </div>
          </form>
        </Form>

        <p>
          Don't have an account yet?{" "}
          <Link href={"/register"} className="font-semibold">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}
