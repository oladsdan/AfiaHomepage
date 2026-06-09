import type { ReactNode } from "react";
import { WebProviders } from "./providers";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <WebProviders>{children}</WebProviders>;
}
