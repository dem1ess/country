import axios from 'axios'
import Link from 'next/link'

export async function getServerSideProps() {
	const res = await axios.get(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/available-countries`
	)
	console.log(res.data)
	return {
		props: { countries: res.data },
	}
}

const Home = ({ countries }) => {
	return (
		<div className='container mx-auto p-8'>
			<h1 className='text-4xl font-bold text-center my-10 text-gray-800 dark:text-white'>
				Список стран
			</h1>
			<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{countries.map(country => (
					<li
						key={country.countryCode}
						className='bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-200'
					>
						<Link
							href={`/country/${country.countryCode}`}
							className='text-blue-500 hover:underline text-lg font-semibold'
						>
							{country.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Home
