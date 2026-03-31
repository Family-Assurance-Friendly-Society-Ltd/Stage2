interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search Pokémon…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Pokémon"
      />
    </div>
  );
}
