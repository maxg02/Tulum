import ProgressBar from "../Graphs/ProgressBar";

type progressRow = { value: number; total: number };
export type tableRow = {
    id: number;
    data: (string | number | progressRow | null | undefined)[];
};
export type dataObject = {
    columns: {
        name: string;
        type: "string" | "amount" | "list" | "date" | "progress";
        values?: string[];
    }[];
    rows: tableRow[];
};

function Table({
    data,
    dark = false,
    detailsFunction,
}: {
    data: dataObject;
    dark?: boolean;
    detailsFunction: (itemId: number) => void;
}) {
    const TableHeader = () =>
        data.columns.map((item, key) => (
            <th key={key}>
                <div className="flex items-center gap-x-2 overflow-hidden">
                    <p>{item.name}</p>
                </div>
            </th>
        ));

    const TableRows = () =>
        data.rows.map((item, key) => (
            <tr
                className={`tableRow border-b ${
                    dark
                        ? "border-custom-ly1/60 hover:bg-custom-ly1"
                        : "border-custom-ly2/60 hover:bg-custom-ly2"
                } cursor-pointer`}
                key={key}
                onClick={() => detailsFunction(item.id)}
            >
                {item.data.map((content, key) => (
                    <td key={key}>
                        {data.columns[key].type === "string" || data.columns[key].type === "date" ? (
                            <p>{content as string}</p>
                        ) : data.columns[key].type === "amount" ? (
                            <p>{content === null || content === undefined ? "" : `RD$${content}`}</p>
                        ) : data.columns[key].type === "list" ? (
                            <p>{data.columns[key].values![content as number]}</p>
                        ) : (
                            <ProgressBar
                                dark={dark}
                                value={(content as progressRow)?.value ?? 0}
                                total={(content as progressRow)?.total ?? 0}
                            />
                        )}
                    </td>
                ))}
            </tr>
        ));

    return (
        <div className="flex flex-col flex-1 w-full h-full overflow-hidden overflow-y-auto">
            <table className="w-full border-collapse">
                <thead className={`sticky top-0 z-10 ${dark ? "bg-custom-ly2" : "bg-custom-ly1"}`}>
                    <tr className="tableRow shadow-[0_1px_0px_0_#DACEAF]">
                        <TableHeader />
                    </tr>
                </thead>
                <tbody>
                    <TableRows />
                </tbody>
            </table>
        </div>
    );
}

export default Table;
