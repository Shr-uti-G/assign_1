export default function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="aspect-square bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
