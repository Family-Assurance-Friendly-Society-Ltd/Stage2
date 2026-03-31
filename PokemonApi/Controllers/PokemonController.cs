using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using PokemonApi.Models;

namespace PokemonApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PokemonController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public PokemonController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet]
    public async Task<ActionResult<PokemonListResponse>> GetAll()
    {
        var client = _httpClientFactory.CreateClient("PokeApi");
        var response = await client.GetAsync($"pokemon");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var node = JsonNode.Parse(json)!;

        int count = node["count"]!.GetValue<int>();
        var results = node["results"]!.AsArray()
            .Select(r =>
            {
                var name = r!["name"]!.GetValue<string>();
                var url = r["url"]!.GetValue<string>();
                var id = ExtractIdFromUrl(url);
                return new PokemonListItem(id, name, url);
            });

        return Ok(new PokemonListResponse(count, results));
    }

    [HttpGet("{idOrName}")]
    public async Task<ActionResult<PokemonDetail>> GetById(string idOrName)
    {
        var client = _httpClientFactory.CreateClient("PokeApi");
        var response = await client.GetAsync($"pokemon/{idOrName}");

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return NotFound(new { message = $"Pokemon '{idOrName}' not found." });

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var node = JsonNode.Parse(json)!;

        var id = node["id"]!.GetValue<int>();
        var name = node["name"]!.GetValue<string>();
        var spriteUrl = node["sprites"]?["front_default"]?.GetValue<string>();
        var baseExp = node["base_experience"]?.GetValue<int>() ?? 0;
        var height = node["height"]?.GetValue<int>() ?? 0;
        var weight = node["weight"]?.GetValue<int>() ?? 0;

        var types = node["types"]!.AsArray()
            .Select(t => t!["type"]!["name"]!.GetValue<string>());

        var stats = node["stats"]!.AsArray()
            .Select(s => new PokemonStat(
                s!["stat"]!["name"]!.GetValue<string>(),
                s["base_stat"]!.GetValue<int>()
            ));

        var abilities = node["abilities"]!.AsArray()
            .Select(a => new PokemonAbility(
                a!["ability"]!["name"]!.GetValue<string>(),
                a["is_hidden"]!.GetValue<bool>()
            ));

        return Ok(new PokemonDetail(id, name, spriteUrl, types, stats, abilities, baseExp, height, weight));
    }

    private static int ExtractIdFromUrl(string url)
    {
        var trimmed = url.TrimEnd('/');
        var lastSegment = trimmed[(trimmed.LastIndexOf('/') + 1)..];
        return int.TryParse(lastSegment, out var id) ? id : 0;
    }
}
