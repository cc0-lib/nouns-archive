export default function SearchBar({ handleSearch }) {
    return (
        <div className="mb-8 flex w-1/2 flex-col items-center gap-4">
            <input
                className="mx-2 w-full rounded-xl border-2 border-black bg-transparent p-2"
                type="text"
                placeholder="Search here"
                onChange={handleSearch}
            />
        </div>
    )
}