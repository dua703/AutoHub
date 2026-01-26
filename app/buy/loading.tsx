const SkeletonCard = () => (
  <div className="bg-white border rounded-lg overflow-hidden animate-pulse">
    <div className="h-40 sm:h-44 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
    </div>
  </div>
)

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2 animate-pulse">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-200 rounded" />
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1 space-y-3 animate-pulse">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
          <div className="h-10 w-full bg-gray-200 rounded" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
