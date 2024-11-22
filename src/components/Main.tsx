import { Item, PlaceHolder } from "../types";
import PlaceHolders from "./PlaceHolders";

interface Props {
    className?: string;
    initialItems: PlaceHolder[];
    placeholderItems: { [key: string]: Item };
}

function Main(props: Props) {
    const { className, initialItems, placeholderItems } = props;

    return (
        <div className={`grid grid-cols-3 gap-4 p-6 row-span-3 h-[350px] min-h-[350px] max-h-[350px] ${className}`}>
            {initialItems.map((item) => (
                <div key={item.id}>
                    <PlaceHolders
                        item={item}
                        droppedItem={placeholderItems[`droppable-${item.id}`]}
                    />
                </div>
            ))}
        </div>
    );
}

export default Main;