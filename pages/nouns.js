import Noggles from '@/components/asset/noggles'
import CardWrapper from '@/components/card/CardWrapper'
import NounsCard from '@/components/card/NounsCard'
import BackLink from '@/components/page/BackLink'
import Description from '@/components/page/Description'
import SearchBar from '@/components/page/SearchBar'
import Separator from '@/components/page/Separator'
import Title from '@/components/page/Title'
import useLocalStorage from '@/hooks/useLocalStorage'
import useScrollPosition from '@/hooks/useScrollPosition'
import { BASE_URL } from '@/lib/constants'
import generateRSSFeed from '@/lib/generateRSSFeed'
import { fixURL, toSlug } from '@/lib/utils'
import BaseTemplate from '@/template/BaseTemplate'
import { useState, useRef, useEffect } from 'react'

const DEBUG_MODE = false

export default function Nouns({ initialData, pageData }) {
    const [data, setData] = useState(initialData)

    const parentSlug = toSlug(pageData['Project Title'])
    const searchRef = useRef(null)
    const [scroll, setScroll] = useLocalStorage(`${parentSlug}-scroll`, 0)
    const [search, setSearch] = useLocalStorage(`${parentSlug}-search`, '')

    useScrollPosition(setScroll, scroll)

    const filterBySearch = (data, search) => {
        if (search === '') {
            return data
        } else {
            const filteredData = data.filter((entry) => {
                const tempTitle = entry['Project Title'].toLowerCase()

                return tempTitle.includes(search)
            })
            return filteredData
        }
    }

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase()
        const filteredData = filterBySearch(initialData, searchQuery)
        setData(filteredData)
        setSearch(searchQuery)
    }

    useEffect(() => {
        if (search !== '') {
            const filteredData = filterBySearch(initialData, search)
            setData(filteredData)
        }
        searchRef.current.value = search
    }, [setSearch, search, initialData])

    return (
        <BaseTemplate>
            <BackLink url={'/'} name={'Home'} />
            <Noggles />
            <Title title={pageData['Project Title']} />
            <Description desc={pageData.Description} link={pageData.Link} />
            <SearchBar handleSearch={handleSearch} ref={searchRef} />
            <Separator />
            {DEBUG_MODE && (
                <p className="mx-auto my-8 h-96 w-2/3 overflow-auto whitespace-pre-wrap p-8 text-justify">
                    {JSON.stringify(data, null, 2)}
                </p>
            )}
            <CardWrapper>
                {data.map((nouns) => (
                    <NounsCard nouns={nouns} key={nouns.id} />
                ))}
            </CardWrapper>
        </BaseTemplate>
    )
}

export async function getStaticProps() {
    const res = await fetch(
        'https://notion-api.splitbee.io/v1/table/c6b83e5671e340f58b07083a03b3de13',
    )
    const data = await res.json()

    const filteredData = data
        .filter((entry) => {
            return entry['No'] > 0
        })
        .filter((entry) => {
            return entry['DB'] !== undefined
        })

    const pageData = data.filter((entry) => {
        return entry['No'] === undefined
    })

    const rssData = filteredData.map((entry) => {
        return {
            id: entry.id,
            title: entry['Project Title'],
            link: `/nouns/${toSlug(entry['Project Title'])}`,
            description: entry.Description,
            image: fixURL(entry.Thumbnails?.[0]?.url),
            date: entry.Date ? new Date(entry.Date) : new Date(),
        }
    })

    const baseURL = BASE_URL
    const rssPath = '/nouns'

    generateRSSFeed(rssData, baseURL, rssPath)

    return {
        props: {
            initialData: filteredData,
            pageData: pageData[0],
            raw: data,
        },
        revalidate: 60,
    }
}
