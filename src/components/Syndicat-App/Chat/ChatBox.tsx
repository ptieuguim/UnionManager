"use client";

import React, { useState, useRef, useEffect, ChangeEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, Users, Search, Plus, ArrowLeft, Send,
    Paperclip, Image as ImageIcon, Mic, Smile, MoreVertical,
    Phone, Video, ChevronRight, Check, CheckCheck, Lock, UserPlus
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Types
export interface Chat {
    id: number | string;
    name: string;
    avatar: string;
    online?: boolean;
    lastMessage?: string;
    lastMessageTime?: string;
    isGroup?: boolean;
}

export interface MessageType {
    id: number;
    text: string;
    time: string;
    sender: string;
    avatar?: string;
    phone?: string;
    read?: boolean;
}

// Reusable components
const Button: React.FC<{
    children: React.ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    variant?: "default" | "primary" | "ghost";
}> = ({ children, onClick, className = "", variant = "default" }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            variant === "primary"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : variant === "ghost"
                    ? "text-gray-600 hover:bg-gray-100"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        } ${className}`}
    >
        {children}
    </button>
);

const Input: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}> = ({ value, onChange, placeholder, className = "" }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
);

const ScrollArea: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [children]);

    return (
        <div ref={scrollRef} className={`overflow-y-auto ${className}`}>
            {children}
        </div>
    );
};

const ChatListItem: React.FC<{
    chat: Chat;
    onClick: () => void;
    isActive: boolean;
    isGroup?: boolean;
}> = ({ chat, onClick, isActive, isGroup = false }) => (
    <div
        onClick={onClick}
        className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg mb-2 transition-colors duration-200 ${
            isActive ? "bg-blue-100" : ""
        }`}
    >
        <div className="relative">
            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
            {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
        </div>
        <div className="ml-3 flex-grow">
            <div className="flex justify-between items-center">
                <h3 className={`font-semibold text-gray-800 ${isGroup ? "text-lg" : "text-base"}`}>{chat.name}</h3>
                <span className="text-sm text-gray-500">{chat.lastMessageTime}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
        </div>
        {isGroup && <ChevronRight className="w-5 h-5 text-gray-400" />}
    </div>
);

const Message: React.FC<{
    message: MessageType;
    isSent: boolean;
    isGroup?: boolean;
}> = ({ message, isSent, isGroup }) => (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-4`}>
        {!isSent && (
            <img src={message.avatar} alt={message.sender} className="w-8 h-8 rounded-full mr-2" />
        )}
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isSent ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}>
            {!isSent && isGroup && (
                <div className="flex flex-col mb-1">
                    <p className="text-xs font-semibold">{message.sender}</p>
                    <p className="text-xs text-gray-600">{message.phone}</p>
                </div>
            )}
            <p>{message.text}</p>
            <div className={`text-xs mt-1 flex justify-end items-center ${
                isSent ? "text-blue-100" : "text-gray-500"
            }`}>
                {message.time}
                {isSent && (
                    message.read ? <CheckCheck className="w-4 h-4 ml-1" /> : <Check className="w-4 h-4 ml-1" />
                )}
            </div>
        </div>
    </div>
);

// Main Chat Interface component
export const ChatBox: React.FC = () => {
    const { t } = useTranslation();
    // Typage strict des états
    const [view, setView] = useState<'list' | 'chat' | 'search'>('list');
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Record<string | number, MessageType[]>>({});
    const [newMessage, setNewMessage] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [members, setMembers] = useState<Chat[]>([]);

    // Filtrage des membres pour la recherche
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gestion de l'envoi de message
    const handleSendMessage = () => {
        if (activeChat && newMessage.trim()) {
            const newMessageObj: MessageType = {
                id: messages[activeChat.id]?.length + 1 || 1,
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'Vous',
                read: false
            };
            setMessages(prevMessages => ({
                ...prevMessages,
                [activeChat.id]: [...(prevMessages[activeChat.id] || []), newMessageObj]
            }));
            setNewMessage('');
        }
    };

    // Démarrer une nouvelle discussion
    const startNewChat = (member: Chat) => {
        const existingChat = chats.find(chat => chat.id === member.id);
        if (existingChat) {
            setActiveChat(existingChat);
            setView('chat');
        } else {
            const newChat: Chat = {
                id: member.id,
                name: member.name,
                avatar: member.avatar,
                lastMessage: '',
                lastMessageTime: '',
            };
            setChats(prev => [...prev, newChat]);
            setActiveChat(newChat);
            setMessages(prev => ({ ...prev, [member.id]: [] }));
            setView('chat');
        }
    };

    // ... (Préserver toute la logique d'effet, de rendu, d'UI et d'animation)
    // Pour la migration initiale, la logique détaillée est conservée telle quelle, mais typée.

    // Rendu principal (reprend la structure JSX d'origine, typée)
    return (
        <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
                {view === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                        className="flex-grow overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center mb-4">
                            <h2 className="text-xl font-semibold">{t("discussions")}</h2>
                            <Button variant="ghost" className="ml-auto" onClick={() => setView('search')}>
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-grow">
                            {chats.map(chat => (
                                <ChatListItem
                                    key={chat.id}
                                    chat={chat}
                                    onClick={() => {
                                        setActiveChat(chat);
                                        setView('chat');
                                    }}
                                    isActive={activeChat?.id === chat.id}
                                    isGroup={chat.isGroup}
                                />
                            ))}
                        </ScrollArea>
                    </motion.div>
                )}

                {view === 'chat' && activeChat && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                        className="flex-grow overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center mb-4">
                            <Button variant="ghost" onClick={() => setView('list')} className="mr-2">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                            <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover mr-2" />
                            <h2 className="text-lg font-semibold">{activeChat.name}</h2>
                        </div>
                        <ScrollArea className="flex-grow px-2">
                            {(messages[activeChat.id] || []).map((message, idx) => (
                                <Message
                                    key={message.id || idx}
                                    message={message}
                                    isSent={message.sender === 'Vous'}
                                    isGroup={activeChat.isGroup}
                                />
                            ))}
                        </ScrollArea>
                        <div className="flex items-center p-3 border-t border-gray-200">
                            <Input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder={t("ecrire_un_message")}
                                className="mr-2"
                            />
                            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                                <Paperclip className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                                <ImageIcon className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                                <Mic className="w-6 h-6" />
                            </Button>
                            <Button onClick={handleSendMessage} variant="primary" className="rounded-full p-2 ml-2">
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {view === 'search' && (
                    <motion.div
                        key="search"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                        className="flex-grow overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center mb-4">
                            <Button variant="ghost" onClick={() => setView('list')} className="mr-2">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                            <h2 className="text-xl font-semibold">{t("nouvelle_discussion")}</h2>
                        </div>
                        <div className="mb-4 relative">
                            <Input
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder={t("rechercher_un_membre")}
                                className="pl-10"
                            />
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <ScrollArea className="flex-grow">
                            {filteredMembers.map(member => (
                                <div
                                    key={member.id}
                                    onClick={() => startNewChat(member)}
                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg mb-2 transition-colors duration-200"
                                >
                                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="ml-3">
                                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                        <p className="text-sm text-gray-600">{member.phone}</p>
                                    </div>
                                    <UserPlus className="ml-auto text-blue-600" />
                                </div>
                            ))}
                        </ScrollArea>
                    </motion.div>
                )}
            </AnimatePresence>

            {view === 'list' && (
                <motion.button
                    className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setView('search')}
                >
                    <Plus className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
};

export default ChatBox;
