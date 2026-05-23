"use client";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="cursor-pointer rounded-md border border-[#1E3A5F] bg-white px-4 py-1 text-base font-medium text-[#1E3A5F] duration-500 transition hover:bg-[#1E3A5F] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`cursor-pointer px-4 py-1 text-base font-medium transition ${page === currentPage ? "text-[#1E3A5F] underline decoration-[#1E3A5F] underline-offset-4" : "text-slate-600 hover:text-[#1E3A5F] hover:underline hover:decoration-[#1E3A5F] hover:underline-offset-4"}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="cursor-pointer rounded-md border border-[#1E3A5F] bg-white px-4 py-1 text-base font-medium text-[#1E3A5F] duration-500 transition hover:bg-[#1E3A5F] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
