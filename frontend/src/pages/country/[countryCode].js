import axios from 'axios'
import 'chart.js/auto'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

const CountryInfo = () => {
	const router = useRouter()
	const { countryCode } = router.query
	const [country, setCountry] = useState(null)

	useEffect(() => {
		if (countryCode) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/country-info/${countryCode}`
				)
				.then(res => {
					setCountry(res.data)
				})
		}
	}, [countryCode])

	if (!country) return <div>Загрузка...</div>

	const populationData = {
		labels: country.population.map(pop => pop.year),
		datasets: [
			{
				label: 'Население',
				data: country.population.map(pop => pop.value),
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
			},
		],
	}

	return (
		<div className='container mx-auto my-6'>
			<h1 className='text-4xl font-bold mb-4'>{country.country.commonName}</h1>
			<img
				src={country.flagUrl}
				alt={`${country.country.commonName} Flag`}
				className='mb-4'
				style={{ width: '300px', height: 'auto' }}
			/>
			<h2 className='text-2xl font-semibold'>Соседние страны:</h2>
			<ul className='list-disc ml-4'>
				{country.country.borders.map(border => (
					<li key={border.countryCode}>
						<a
							href={`/country/${border.countryCode}`}
							className='text-blue-500 hover:underline'
						>
							{border.commonName}
						</a>
					</li>
				))}
			</ul>

			<h2 className='text-2xl font-semibold mt-6'>
				График численности населения:
			</h2>
			<Line data={populationData} />
		</div>
	)
}

export default CountryInfo
