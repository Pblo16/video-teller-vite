import { useDraggable } from "@dnd-kit/core";
import { Item } from "../types";

interface Props {
    item: Item;
    isInPlaceholder?: boolean;
}

function Items({ item, isInPlaceholder = false }: Props) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: {
            type: "Item",
            item,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`w-full ${isInPlaceholder ? 'h-full' : 'h-[90px]'} cursor-grab overflow-hidden ${isDragging ? 'opacity-50' : ''}`}
        >
            <img
                src={item.content}
                alt={item.alt || 'Draggable item'}
                className="w-full h-full object-cover rounded-lg"
            />
        </div>
    );
}

export default Items;
