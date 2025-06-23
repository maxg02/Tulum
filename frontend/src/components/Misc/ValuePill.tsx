function ValuePill({ title, value }: { title: string; value: number }) {
    return (
        <div className="infoContainer2 p-3 w-full h-full xl:text-start xl:gap-y-2">
            <p className="max-xl:hidden self-start">{`${title}`}</p>
            <div className="border-s-4 border-custom-secondary self-start ps-2 py-1 xl:h-full xl:my-2 xl:flex xl:border-s-[6px]">
                <p className="xl:hidden">{`${title}`}</p>
                <h1 className="text-xl font-normal xl:my-auto xl:text-4xl">RD${value}</h1>
            </div>
        </div>
    );
}

export default ValuePill;
