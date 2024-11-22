import { useEffect } from 'react';
import Main from './components/Main';
import Footer from './components/Footer';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { Item, PlaceHolder } from './types';
import { DragOverlay, DragStartEvent } from '@dnd-kit/core';
import Items from './components/Items';
import { createPortal } from 'react-dom';
import ReloadIcon from './icons/ReloadIcon';
import { SendIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Game() {
    const navigate = useNavigate();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [placeHolders] = useState<PlaceHolder[]>([
        { id: 1, title: 'Drop here' },
        { id: 2, title: 'Drop here' },
        { id: 3, title: 'Drop here' },
        { id: 4, title: 'Drop here' },
        { id: 5, title: 'Drop here' },
        { id: 6, title: 'Drop here' },
    ]);
    const [activeItems, setActiveItems] = useState<Item | null>(null);
    const [placeholderItems, setPlaceholderItems] = useState<{ [key: string]: Item }>({});

    const fetchImages = async () => {
        try {
            const response = await fetch(
                `https://api.unsplash.com/photos/random?count=7&orientation=portrait&query=nature&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
            );
            const data = await response.json();

            const newItems = data.map((image: { urls: { regular: string }, alt_description: string }, index: number) => ({
                id: index + 1,
                content: image.urls.regular,
                alt: image.alt_description || 'Unsplash image',
                score: Math.floor(Math.random() * 100) + 1 // Add random score 1-100
            }));

            setItems(newItems);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching images:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Item") {
            setActiveItems(event.active.data.current.item);
            return;
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveItems(null);
        const { active, over } = event;

        if (!over) return;

        // Check if dropping onto a placeholder
        if (over.id.toString().startsWith('droppable-')) {
            const placeholderId = over.id.toString();
            const activeItem = items.find(item => item.id === active.id);

            if (activeItem) {
                // Add item to placeholder
                setPlaceholderItems(prev => ({
                    ...prev,
                    [placeholderId]: activeItem
                }));

                // Remove item from bottom items
                setItems(prev => prev.filter(item => item.id !== active.id));
            }
        }
    };

    const handleReset = () => {
        setLoading(true);
        setPlaceholderItems({}); // Clear placeholder items
        // Fetch new images when reset is clicked
        fetchImages();
    };

    const handleSendToAnalysis = () => {
        const selectedItems = Object.values(placeholderItems).filter(item => item);

        if (selectedItems.length === 0) {
            alert('Please select some images first!');
            return;
        }

        const analysisMessage = `Analiza las siguientes imágenes y sus puntajes tomando en cuenta que el puntaje va de 0 a 100 y 100 es lo mejor y 0 lo peor:\n\n${selectedItems.map((item, index) =>
            `Imagen ${index + 1}: ${item.alt} - Puntaje: ${item.score}`
        ).join('\n')
            }\n\nPor favor, proporciona un análisis detallado de los puntajes y su significado.`;

        navigate('/agente-inteligente', {
            state: {
                message: analysisMessage,
                selectedItems: selectedItems
            }
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    )

    if (loading) {
        return <div className="h-dvh flex items-center justify-center">Loading...</div>;
    }

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={onDragStart}
            sensors={sensors}
        >
            <div className="relative h-dvh">
                <button
                    onClick={handleReset}
                    className="absolute bottom-2 right-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                >
                    <ReloadIcon />
                </button>
                <button
                    onClick={handleSendToAnalysis}
                    className="absolute bottom-2 right-20 px-4 py-2 bg-accent text-white rounded-md hover:bg-opacity-90"
                >
                    <SendIcon />
                </button>
                <div className="grid grid-cols-1 gap-4 h-full">
                    <Main initialItems={placeHolders} placeholderItems={placeholderItems} />
                    <Footer initialItems={items} />
                </div>
            </div>
            {createPortal(
                <DragOverlay>
                    {activeItems &&
                        <Items
                            key={activeItems.id}
                            item={activeItems}
                        />
                    }
                </DragOverlay>, document.body
            )}
        </DndContext>
    );
}

export default Game;