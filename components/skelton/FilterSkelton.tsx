export const FilterSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-yellow-400/30 h-full">
      {/* Title skeleton */}
      <div className="h-6 bg-gray-700 rounded w-20 mb-4 animate-pulse"></div>

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
    </div>
  );
};
