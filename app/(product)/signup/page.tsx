"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { PublicRoute } from "@/lib/web/auth/guards";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { AuthError, signup } from "@/lib/web/auth/authApi";
import {
  AuthShell,
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "../_components/auth-ui";

const schema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function SignUpForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      signup({
        fullName: values.fullName.trim(),
        email: values.email,
        password: values.password,
      }),
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken);
      router.replace("/dashboard");
    },
  });

  const errorMessage =
    mutation.error instanceof AuthError
      ? mutation.error.message
      : mutation.isError
        ? "Something went wrong. Please try again."
        : null;

  return (
    <AuthShell title="Create your account" subtitle="Start creating with Afia">
      {errorMessage && <FormError message={errorMessage} />}
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <TextField
          id="fullName"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton loading={mutation.isPending}>Create account</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#0FA37F] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <PublicRoute>
      <SignUpForm />
    </PublicRoute>
  );
}
