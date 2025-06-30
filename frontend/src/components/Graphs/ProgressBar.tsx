function ProgressBar({ value, total, dark = false }: { value: number; total: number; dark?: boolean }) {
    return (
        <div className="flex flex-col min-w-72">
            <div className={`${dark ? "bg-custom-ly1" : "bg-custom-ly2"} h-3 w-full rounded-[0.30rem]`}>
                <div
                    className="h-full bg-gradient-to-r from-custom-secondary to-custom-accent rounded-[0.30rem]"
                    style={{
                        width: `min(${(value * 100) / total}%,100%)`,
                    }}
                ></div>
            </div>
            <div className="flex justify-between">
                <p className="text-xs">RD${value}</p>
                <p className="text-xs">RD${total}</p>
            </div>
        </div>
    );
}

export default ProgressBar;
