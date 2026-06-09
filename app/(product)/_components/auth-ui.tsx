"use client";

import Image from "next/image";
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f7f8fa]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/afia-icon.png"
            alt="Afia"
            width={48}
            height={48}
            style={{ width: 48, height: 48 }}
            className="rounded-xl mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">{subtitle}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

const AUTH_GRADIENT =
  "linear-gradient(270.51deg, rgba(0, 191, 172, 0.231) 10.9%, rgba(151, 36, 177, 0.231) 35.38%, rgba(241, 241, 241, 0.2607) 92.2%)";

export function AuthSplitShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen w-full flex-col overflow-hidden lg:flex-row lg:items-stretch"
      style={{ backgroundColor: "#f1f1f1", backgroundImage: AUTH_GRADIENT }}
    >
      <div className="flex w-full justify-center px-4 py-12 lg:w-[45%] lg:shrink-0 lg:justify-center lg:px-12">
        <div className="w-full max-w-sm self-center">
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <Image
              src="/afia-icon.png"
              alt="Afia"
              width={48}
              height={48}
              style={{ width: 48, height: 48 }}
              className="mb-4 rounded-xl"
            />
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-center text-sm text-gray-500 lg:text-left">
              {subtitle}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-sm backdrop-blur-sm">
            {children}
          </div>
        </div>
      </div>

      <div className="relative hidden flex-1 self-stretch lg:block">
        <Image
          src="/auth/creators.png"
          alt="Creators on Afia"
          fill
          priority
          sizes="55vw"
          className="object-contain object-left"
        />
      </div>
    </div>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const inputClass =
  "w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#0FA37F] focus:outline-none focus:ring-1 focus:ring-[#0FA37F]";

export const TextField = forwardRef<HTMLInputElement, FieldProps>(
  function TextField({ label, error, id, ...props }, ref) {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
        <input id={id} ref={ref} className={inputClass} {...props} />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

export const PasswordField = forwardRef<HTMLInputElement, FieldProps>(
  function PasswordField({ label, error, id, ...props }, ref) {
    const [show, setShow] = useState(false);
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            type={show ? "text" : "password"}
            className={`${inputClass} pr-10`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

export function SubmitButton({
  loading,
  children,
  disabled,
  ...props
}: { loading?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-2 bg-[#0FA37F] hover:bg-[#0c8b6c] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
      {message}
    </div>
  );
}

export function FormSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-green-50 border border-green-200 px-3.5 py-2.5 text-sm text-green-700">
      {message}
    </div>
  );
}
