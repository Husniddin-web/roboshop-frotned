export const MobileFilterSkeleton: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:hidden">
      <div className="absolute left-0 top-0 h-full w-72 bg-gray-900 border-r border-yellow-500 p-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-6 w-6 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Filter items skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-700 rounded animate-pulse"
              style={{
                width: `${Math.random() * 40 + 60}%`,
                animationDelay: `${i * 100}ms`,
              }}
            ></div>
          ))}
        </div>

        {/* Clear filters button skeleton */}
        <div className="mt-6 h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
