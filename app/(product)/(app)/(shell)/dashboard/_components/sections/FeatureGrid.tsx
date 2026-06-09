"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { FeatureCard } from "@/lib/web/dashboard-types";
import { featureCards } from "@/lib/web/dashboard-data";
import { Card } from "../ui/Card";

function FeatureTileBody({ feature }: { feature: FeatureCard }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <img
          src={feature.iconSrc}
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain"
        />
        <ArrowUpRight
          className="h-5 w-5 text-dash-muted transition-colors group-hover:text-dash-ink"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-dash-ink">
        {feature.title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-dash-muted">
        {feature.description}
      </p>
    </>
  );
}

function FeatureTile({ feature }: { feature: FeatureCard }) {
  const tileClasses =
    "flex h-full w-full flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-brand rounded-lg";
  return (
    <Card className="group p-5 text-left transition-shadow hover:shadow-dash-md">
      {feature.href ? (
        <Link href={feature.href} className={tileClasses}>
          <FeatureTileBody feature={feature} />
        </Link>
      ) : (
        <button type="button" className={tileClasses}>
          <FeatureTileBody feature={feature} />
        </button>
      )}
    </Card>
  );
}

export function FeatureGrid() {
  return (
    <section
      aria-label="Creator tools"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {featureCards.map((feature) => (
        <FeatureTile key={feature.id} feature={feature} />
      ))}
    </section>
  );
}
