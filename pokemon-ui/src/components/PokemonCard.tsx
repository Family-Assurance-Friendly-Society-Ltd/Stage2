import { useState } from "react";
import type { PokemonListItem } from "../types/pokemon";
import type { PokemonDetail } from "../types/pokemon";

const TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

interface Props {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: Props) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.pngg`;

  const handleOpen = async () => {
    setOpen(true);
    if (!detail) {
      setLoading(true);
      try {
        const res = await fetch(
          `api/pokemon/${pokemon.id}`,
        );
        const data: PokemonDetail = await res.json();
        setDetail(data);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        className="pokemon-card"
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        <img src={spriteUrl} alt={pokemon.name} loading="lazy" />
        <div className="pokemon-id">#{String(pokemon.id).padStart(4, "0")}</div>
        <div className="pokemon-name">{pokemon.name}</div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={`${pokemon.name} details`}
          >
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            {loading || !detail ? (
              <p className="loading">Loading…</p>
            ) : (
              <>
                <img
                  className="modal-sprite"
                  src={detail.spriteUrl ?? spriteUrl}
                  alt={detail.name}
                />
                <h2>
                  #{String(detail.id).padStart(4, "0")} {detail.name}
                </h2>

                <div className="type-badges">
                  {detail.types.map((t) => (
                    <span
                      key={t}
                      className="badge"
                      style={{ background: TYPE_COLORS[t] ?? "#888" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="detail-grid">
                  <span>Height</span>
                  <span>{detail.height / 10} m</span>
                  <span>Weight</span>
                  <span>{detail.weight / 10} kg</span>
                  <span>Base XP</span>
                  <span>{detail.baseExperience}</span>
                </div>

                <h3>Stats</h3>
                <div className="stats">
                  {detail.stats.map((s) => (
                    <div key={s.name} className="stat-row">
                      <span className="stat-name">{s.name}</span>
                      <div className="stat-bar-bg">
                        <div
                          className="stat-bar"
                          style={{
                            width: `${Math.min((s.baseStat / 255) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="stat-val">{s.baseStat}</span>
                    </div>
                  ))}
                </div>

                <h3>Abilities</h3>
                <ul className="ability-list">
                  {detail.abilities.map((a) => (
                    <li key={a.name}>
                      {a.name}
                      {a.isHidden && <em> (hidden)</em>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
