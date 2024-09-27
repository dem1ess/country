const axios = require('axios')

const getAvailableCountries = async (req, res) => {
	try {
		const response = await axios.get(
			'https://date.nager.at/api/v3/AvailableCountries'
		)
		res.json(response.data)
	} catch (error) {
		res.status(500).json({ message: 'Error fetching countries' })
	}
}

const getCountryInfo = async (req, res) => {
	const { countryCode } = req.params
	try {
		const availableCountriesResponse = await axios.get(
			'https://date.nager.at/api/v3/AvailableCountries'
		)
		const countryInfo = availableCountriesResponse.data.find(
			country => country.countryCode === countryCode
		)

		if (!countryInfo) {
			return res.status(404).json({ message: 'Country not found' })
		}

		const countryName = countryInfo.name

		const [countryResponse, populationResponse, flagResponse] =
			await Promise.all([
				axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`),
				axios.get('https://countriesnow.space/api/v0.1/countries/population'),
				axios.get('https://countriesnow.space/api/v0.1/countries/flag/images'),
			])

		const populationData = populationResponse.data.data.find(
			country => country.country === countryName
		)

		const flagData = flagResponse.data.data.find(
			flag => flag.iso2 === countryCode
		)

		if (!populationData) {
			return res.status(404).json({ message: 'Population data not found' })
		}

		res.json({
			country: countryResponse.data,
			population: populationData.populationCounts || [],
			flagUrl: flagData ? flagData.flag : null,
		})
	} catch (error) {
		console.error('Error fetching country info:', error)
		res.status(500).json({ message: 'Error fetching country info' })
	}
}

module.exports = { getAvailableCountries, getCountryInfo }
