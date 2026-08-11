import { HomepageHeader } from "@/components/homepage/homepage-header";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-white text-slate-900 selection:bg-emerald-600 selection:text-white flex flex-col justify-between">
      <div>
        <HomepageHeader />
        <main>{/* <HomepageHero /> */}</main>
      </div>
    </div>
  );
}
