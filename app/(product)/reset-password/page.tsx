"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { PublicRoute } from "@/lib/web/auth/guards";
import { AuthLoading } from "@/lib/web/auth/guards";
import { AuthError, resetPassword } from "@/lib/web/auth/authApi";
import {
  AuthShell,
  FormError,
  FormSuccess,
  PasswordField,
  SubmitButton,
} from "../_components/auth-ui";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      resetPassword(token ?? "", values.newPassword),
  });

  if (!token) {
    return (
      <AuthShell
        title="Reset your password"
        subtitle="This reset link is invalid"
      >
        <FormError message="This reset link is invalid or has expired." />
        <p className="mt-5 text-center text-sm text-gray-500">
          <Link
            href="/forgot-password"
            className="font-medium text-[#0FA37F] hover:underline"
          >
            Request a new link
          </Link>
        </p>
      </AuthShell>
    );
  }

  if (mutation.isSuccess) {
    return (
      <AuthShell title="Password updated" subtitle="You're all set">
        <FormSuccess message="Your password has been reset. You can now sign in." />
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

  const errorMessage =
    mutation.error instanceof AuthError
      ? mutation.error.message
      : mutation.isError
        ? "Something went wrong. Please try again."
        : null;

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password">
      {errorMessage && <FormError message={errorMessage} />}
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <PasswordField
          id="newPassword"
          label="New password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton loading={mutation.isPending}>Reset password</SubmitButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <PublicRoute>
      <Suspense fallback={<AuthLoading />}>
        <ResetPasswordForm />
      </Suspense>
    </PublicRoute>
  );
}
