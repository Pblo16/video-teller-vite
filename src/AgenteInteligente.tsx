import { useEffect, useRef, useState } from 'react'
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm'
import { TextareaAutosize } from './components/ui/input'
import { Button } from './components/ui/button'
import { SendIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'

function AgenteInteligente() {
    const location = useLocation();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
    const [input, setInput] = useState('')
    const [info, setInfo] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef<any>(null)
    const welcomeMessageSent = useRef(false)

    const SELECTED_MODEL = 'Llama-3.2-1B-Instruct-q4f32_1-MLC'

    useEffect(() => {
        const initEngine = async () => {
            engineRef.current = await CreateWebWorkerMLCEngine(
                new Worker(new URL('./workers/worker.js', import.meta.url), { type: 'module' }),
                SELECTED_MODEL,
                {
                    initProgressCallback: (info) => {
                        setInfo(info.text)
                        if (info.progress === 1 && !welcomeMessageSent.current) {
                            setIsLoading(false)
                            addMessage("¡Hola! Soy Torito un asistente de edicion. ¿En qué puedo ayudarte hoy?", 'assistant')
                            welcomeMessageSent.current = true
                        }
                    }
                }
            )
        }

        initEngine()

    }, [location.state, isLoading])

    useEffect(() => {
        if (location.state?.message && !isLoading) {
            setInput(location.state.message);
            // Optional: Auto-submit the analysis
            handleSubmit(new Event('submit') as any);
        }
    }, [location.state, isLoading])
    const addMessage = (text: string, role: 'user' | 'assistant') => {
        setMessages(prev => [...prev, { role, content: text }])
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
        }, 100)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const messageText = input.trim()
        if (!messageText || !engineRef.current) return

        setInput('')
        addMessage(messageText, 'user')

        const chunks = await engineRef.current.chat.completions.create({
            messages: [...messages, { role: 'user', content: messageText }],
            stream: true
        })

        let reply = ""
        for await (const chunk of chunks) {
            const content = chunk.choices[0]?.delta?.content ?? ""
            reply += content
            setMessages(prev => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage?.role === 'assistant') {
                    lastMessage.content = reply
                    return newMessages
                }
                return [...newMessages, { role: 'assistant', content: reply }]
            })
        }
    }

    return (
        <div className="p-4 flex flex-col h-[100vh]">
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto rounded-lg shadow p-4 mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            >
                {isLoading ? (
                    <div className="text-center mt-20">
                        <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
                        <h4>Cargando...</h4>
                        <h5 className="text-sm text-gray-500">Esto puede tardar un poco. Paciencia.</h5>
                    </div>
                ) : (
                    <ul className="space-y-4 flex flex-col-reverse">
                        {messages.map((msg, idx) => (
                            <li key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                                    <p className={`mt-1 p-2 rounded break-words whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-500' : 'bg-zinc-500'} text-white`}>
                                        {msg.content}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
                <TextareaAutosize
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    value={input}
                    placeholder="Tu mensaje"
                    className='max-w-md'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <div className='flex items-center'>
                    <Button disabled={isLoading}>
                        <SendIcon />
                    </Button>
                </div>

            </form>
            <small className="block mt-2 text-center text-gray-500">{info}</small>
        </div>
    )
}

export default AgenteInteligente
