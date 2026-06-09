"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { PublicRoute } from "@/lib/web/auth/guards";
import { useAuth } from "@/lib/web/auth/AuthProvider";
import { AuthError, login } from "@/lib/web/auth/authApi";
import {
  AuthSplitShell,
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "../_components/auth-ui";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

function SignInForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => login(values.email, values.password),
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
    <AuthSplitShell title="Welcome to Afia" subtitle="Sign in to your account">
      {errorMessage && <FormError message={errorMessage} />}
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
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex justify-end -mt-1 mb-4">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[#0FA37F] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={mutation.isPending}>Sign in</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#0FA37F] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthSplitShell>
  );
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <SignInForm />
    </PublicRoute>
  );
}
