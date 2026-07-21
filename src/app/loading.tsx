export default function RootLoading() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-24">
      <div className="glass-panel flex w-full max-w-xl items-center gap-4 rounded-[2rem] p-6">
        <div className="h-14 w-14 animate-pulse rounded-full bg-saffron/20" />
        <div className="grid flex-1 gap-3">
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-ink/10 dark:bg-white/10" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-ink/10 dark:bg-white/10" />
        </div>
      </div>
    </main>
  );
}
