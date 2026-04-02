export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  page: number;
  limit: number;
  results: PokemonListItem[];
}

export interface PokemonStat {
  name: string;
  baseStat: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonDetail {
  id: number;
  name: string;
  spriteUrl: string | null;
  types: string[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  baseExperience: number;
  height: number;
  weight: number;
}
