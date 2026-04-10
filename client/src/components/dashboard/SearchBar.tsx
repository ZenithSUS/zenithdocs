import { Search, X } from "lucide-react";

interface SearchBar {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ searchQuery, setSearchQuery, placeholder }: SearchBar) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
      <input
        type="text"
        placeholder={placeholder ? placeholder : "Search..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-9 py-2 bg-transparent border border-white/10 rounded-sm text-[13px] font-sans text-text/70 placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text/30 hover:text-text/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
