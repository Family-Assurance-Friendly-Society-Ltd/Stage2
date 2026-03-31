import { useEffect, useState, useCallback } from 'react';
import type { PokemonListItem, PokemonListResponse } from './types/pokemon';
import PokemonCard from './components/PokemonCard';
import SearchBar from './components/SearchBar';
import './App.css';


export default function App() {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`api/pokemon`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: PokemonListResponse = await res.json();
      setTotalCount(data.count);
      setAllPokemon((prev) => (pageNum === 1 ? data.results : [...prev, ...data.results]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };

  const filtered = search.trim()
    ? allPokemon.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : allPokemon;

  const hasMore = allPokemon.length < totalCount && !search.trim();

  return (
    <>
      <header className="app-header">
        <h1>Pokédex</h1>
        <SearchBar value={search} onChange={setSearch} />
        <span className="count-label">
          {search.trim() ? `${filtered.length} match${filtered.length !== 1 ? 'es' : ''}` : `${allPokemon.length} / ${totalCount} loaded`}
        </span>
      </header>

      {error && <div className="error-banner">⚠ {error}</div>}

      <main className="pokemon-grid">
        {filtered.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </main>

      {!search.trim() && (
        <div className="load-more-row">
          {loading && <span className="loading">Loading…</span>}
          {!loading && hasMore && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load more ({totalCount - allPokemon.length} remaining)
            </button>
          )}
          {!loading && !hasMore && allPokemon.length > 0 && (
            <span className="all-loaded">All {totalCount} Pokémon loaded</span>
          )}
        </div>
      )}
    </>
  );
}
