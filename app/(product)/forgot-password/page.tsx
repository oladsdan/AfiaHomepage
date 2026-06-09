"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { PublicRoute } from "@/lib/web/auth/guards";
import { forgotPassword } from "@/lib/web/auth/authApi";
import {
  AuthShell,
  FormSuccess,
  SubmitButton,
  TextField,
} from "../_components/auth-ui";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

const CONFIRMATION = "If an account exists, we've sent a reset link.";

function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => forgotPassword(values.email),
  });

  // The server never reveals whether the email exists, so we show the same
  // confirmation once the request settles, regardless of the outcome.
  const submitted = mutation.isSuccess || mutation.isError;

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {submitted ? (
        <FormSuccess message={CONFIRMATION} />
      ) : (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <SubmitButton loading={mutation.isPending}>
            Send reset link
          </SubmitButton>
        </form>
      )}
      <p className="mt-5 text-center text-sm text-gray-500">
        <Link
          href="/login"
          className="font-medium text-[#0FA37F] hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <ForgotPasswordForm />
    </PublicRoute>
  );
}
