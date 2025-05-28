import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination({ currentPage = 1, totalPages = 10 }) {
  const pages = []

  // Generate page numbers
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button className="flex items-center justify-center w-8 h-8 bg-white border rounded-md border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-teal-500 text-white"
              : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {page}
        </button>
      ))}

      {totalPages > 5 && (
        <>
          <span className="text-slate-500">...</span>
          <button className="flex items-center justify-center w-8 h-8 bg-white border rounded-md border-slate-300 text-slate-600 hover:bg-slate-50">
            {totalPages}
          </button>
        </>
      )}

      <button className="flex items-center justify-center w-8 h-8 bg-white border rounded-md border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
