export default function PublicLoading() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-24">
      <div className="glass-panel w-full max-w-5xl rounded-[2rem] p-6">
        <div className="grid gap-4">
          <div className="h-4 w-1/4 animate-pulse rounded-full bg-ink/10 dark:bg-white/10" />
          <div className="h-[42vh] animate-pulse rounded-[1.6rem] bg-ink/5 dark:bg-white/5" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="h-56 animate-pulse rounded-[1.4rem] bg-ink/5 dark:bg-white/5" />
            <div className="h-56 animate-pulse rounded-[1.4rem] bg-ink/5 dark:bg-white/5" />
            <div className="h-56 animate-pulse rounded-[1.4rem] bg-ink/5 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}
