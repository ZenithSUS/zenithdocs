interface Folder {
  _id: string;
  name: string;
}

interface Props {
  folders: Folder[];
  value: string;
  onChange: (value: string) => void;
}

const FolderSelect = ({ folders, value, onChange }: Props) => (
  <div className="mb-8">
    <label className="text-[11px] tracking-[0.15em] text-[#C9A227] mb-3 block font-sans">
      SELECT FOLDER (OPTIONAL)
    </label>
    <div className="relative w-full sm:w-64">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-3 pr-10 bg-white/8 border border-[#C9A227]/18 rounded text-[#F5F5F5] text-sm font-sans focus:outline-none focus:border-[#C9A227]/40 transition-colors cursor-pointer"
      >
        <option value="">No Folder</option>
        {folders.map((folder) => (
          <option key={folder._id} value={folder._id}>
            {folder.name}
          </option>
        ))}
      </select>

      {/* Custom arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-[#C9A227]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default FolderSelect;
