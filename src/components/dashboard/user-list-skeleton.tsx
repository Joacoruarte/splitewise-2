export function UserListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-50 p-4 h-28 rounded-lg border border-gray-200 animate-pulse"
        ></div>
      ))}
    </div>
  );
}
