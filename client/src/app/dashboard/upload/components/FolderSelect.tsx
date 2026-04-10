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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-64 px-4 py-3 bg-white/8 border border-[#C9A227]/18 rounded text-[#F5F5F5] text-sm font-sans focus:outline-none focus:border-[#C9A227]/40 transition-colors"
    >
      <option value="">No Folder</option>
      {folders.map((folder) => (
        <option key={folder._id} value={folder._id}>
          {folder.name}
        </option>
      ))}
    </select>
  </div>
);

export default FolderSelect;
