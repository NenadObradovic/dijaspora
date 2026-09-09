export const resolveEmbassyCountry = (country, embassyByCountry) => {
  const countryData = embassyByCountry[country]
  if (!countryData) return null

  if (countryData.covered_by && embassyByCountry[countryData.covered_by]) {
    return embassyByCountry[countryData.covered_by]
  }

  return countryData
}

export const buildEmbassyOptions = (country, embassyByCountry) => {
  const countryData = resolveEmbassyCountry(country, embassyByCountry)
  if (!countryData) return []

  const options = []

  if (countryData.address) {
    options.push({ value: 'default', label: countryData.address })
  }

  if (countryData.consulate) {
    Object.entries(countryData.consulate).forEach(([slug, consulate]) => {
      if (consulate.address) {
        options.push({ value: slug, label: consulate.address })
      }
    })
  }

  if (countryData.honorary_consulate) {
    Object.entries(countryData.honorary_consulate).forEach(
      ([slug, honorary_consulate]) => {
        if (honorary_consulate.address) {
          options.push({ value: slug, label: honorary_consulate.address })
        }
      },
    )
  }

  return options
}
