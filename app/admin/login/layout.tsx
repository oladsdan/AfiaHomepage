export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#f7f8fa]">
      {children}
    </div>
  );
}
