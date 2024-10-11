"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { signup } from "./actions";
import Link from "next/link";

// create the schema using zod and validate password
const formSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().trim().min(6, "Confirm password is required"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function Register() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // define the form with useForm from react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // handle register
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signup(data.email, data.password);
      toast.success(
        "User was registerted successfully! Please check email for confirmation"
      );
      setIsLoading(false);
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
      <h1 className="font-bold text-5xl mb-20">Let's get you started!</h1>
      <section className="shadow bg-white dark:bg-slate-800 w-1/4 py-10 px-5 flex flex-col items-center rounded-lg">
        <h2 className="font-bold mb-5 uppercase text-2xl tracking-wide">
          Sign Up
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

            {/* confirm password */}
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black rounded placeholder:text-gray-400 "
                      type="password"
                      placeholder="Confirm password"
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
                REGISTER
              </Button>
            </div>
          </form>
        </Form>

        <p>
          Already have an account?{" "}
          <Link href={"/login"} className="font-semibold">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
