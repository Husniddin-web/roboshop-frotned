export default function LoadingOrders() {
  return (
    <div className="p-12 text-center">
      <div
        className="mx-auto w-10 h-10 border-3 border-white/20 border-t-amber-400 rounded-full animate-spin"
      />
      <p className="mt-4 text-zinc-400 text-sm">Loading orders...</p>
    </div>
  );
}

