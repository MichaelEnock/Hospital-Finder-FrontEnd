// SearchBar.jsx
export function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search hospitals..."
        className="flex-1 px-4 py-2 bg-[#2A2A2A] text-[#E0E0E0] placeholder-[#B0B0B0] rounded-l focus:outline-none"
      />
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-[#1E90FF] hover:bg-[#187bcd] text-white font-semibold rounded-r"
      >
        Search
      </button>
    </div>
  );
}
