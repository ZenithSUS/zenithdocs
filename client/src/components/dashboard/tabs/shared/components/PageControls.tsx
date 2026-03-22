interface PageControlsProps {
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading?: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
}

function PageControls({
  totalPages,
  page,
  hasNextPage,
  hasPreviousPage,
  isLoading,
  fetchNextPage,
  fetchPreviousPage,
}: PageControlsProps) {
  return (
    <div className="flex items-center justify-center my-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <button
        onClick={fetchPreviousPage}
        disabled={!hasPreviousPage || isLoading}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={fetchNextPage}
        disabled={!hasNextPage || isLoading}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default PageControls;
