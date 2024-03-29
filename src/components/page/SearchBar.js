import { forwardRef, useEffect } from 'react'
import { motion as m } from 'framer-motion'

const SearchBar = forwardRef(({ handleSearch }, ref) => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            // If Cmd/Ctrl + K is pressed, focus on the search input
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                ref.current.focus()
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [ref])

    return (
        <div className="mb-8 flex w-4/5 flex-col items-center gap-4 px-4 sm:w-1/2">
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full"
            >
                <input
                    className="mx-2 w-full rounded-xl border-2 border-black bg-transparent p-2"
                    type="text"
                    placeholder="Search here"
                    onChange={handleSearch}
                    ref={ref}
                />
                {ref.current?.value !== '' && (
                    <div
                        className="absolute top-3 right-2 text-sm text-gray-500 hover:cursor-pointer"
                        onClick={() => {
                            ref.current.value = ''
                            handleSearch({ target: { value: '' } })
                        }}
                    >
                        Clear
                    </div>
                )}
            </m.div>
            {/* {ref.current?.value === '' && (
                <div className="flex flex-row items-center gap-2">
                    <p className="text-sm text-gray-500">
                        Press <span className="font-bold">Ctrl/Cmd + K</span> to
                        focus on the search bar
                    </p>
                </div>
            )} */}
        </div>
    )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar
