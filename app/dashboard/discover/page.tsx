export default function DiscoverPage() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
          <p className="text-gray-600 mt-2">
            Find and explore creators that match your brand
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-8 w-full">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Discover Page Coming Soon
          </h3>
          <p className="text-gray-500">
            This page will contain the discover functionality. Content will be added when you share the specific page code and requirements.
          </p>
        </div>
      </div>
    </div>
  );
} 