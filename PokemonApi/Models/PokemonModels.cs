namespace PokemonApi.Models;

public record PokemonListItem(int Id, string Name, string Url);

public record PokemonListResponse(int Count, IEnumerable<PokemonListItem> Results);

public record PokemonStat(string Name, int BaseStat);

public record PokemonAbility(string Name, bool IsHidden);

public record PokemonDetail(
    int Id,
    string Name,
    string? SpriteUrl,
    IEnumerable<string> Types,
    IEnumerable<PokemonStat> Stats,
    IEnumerable<PokemonAbility> Abilities,
    int BaseExperience,
    int Height,
    int Weight
);
