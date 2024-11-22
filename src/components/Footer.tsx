import Items from './Items';
import { Item } from '../types';


interface Props {
    className?: string;
    initialItems: Item[];
}

function Footer(props: Props) {
    const { className, initialItems } = props;


    return (
        <div className={`grid grid-cols-4 gap-4 p-6 row-span-1 px-20 ${className}`}>
            {initialItems.map((item) => (
                <Items
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );

}

export default Footer;