export async function fetchData(
  endpoint: "cases" | "news",
  from: string,
  to: string,
  aggregateCountries: boolean,
  worldTotal: boolean
) {
  const response = await fetch(
    `https://yet-another-covid-api.herokuapp.com/${endpoint}?from=${from}&to=${to}&aggregateCountries=${aggregateCountries}&worldTotal=${worldTotal}`
  );
  return await response.json();
}
