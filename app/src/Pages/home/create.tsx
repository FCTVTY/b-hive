import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Button from "../../components/Button";
import {getApiDomain} from "../../lib/auth/supertokens";
import {Post, Profile} from "../../interfaces/interfaces";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill";
import {LoadingButton} from "../../components/LoadingButton"; // will work
import loadImage from 'blueimp-load-image';


interface CreateProps {
    onSubmit: () => void,
    channel: string,
    profiles: Profile[]
}

export default function Create({onSubmit, channel, profiles}: CreateProps) {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [post, setPost] = useState<Partial<Post>>({});
    const [content, setContent] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const contentEditableRef = useRef(null);

    useEffect(() => {
        if (channel) {
            setPost(prevState => ({
                ...prevState,
                channelstring: channel,
            }));
        }
    }, [channel]);


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        loadImage(
            file,
            (img) => {
                // Convert the image to a base64 string
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const base64String = canvas.toDataURL('image/jpeg');
                    setPost(prevState => ({
                        ...prevState,
                        media: base64String,
                    }));
                    setSelectedImage(base64String);
                    console.log(base64String);
                }
            },
            {orientation: true} // This option ensures the image is correctly oriented
        );
    };

    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {

            setLoading(true)


            await axios.post(`${getApiDomain()}/community/createpost`, post, {});
            // Clear form fields after successful submission
            setMessage("");
            setSelectedImage(null);

            onSubmit();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };
    useEffect(() => {
        setSuggestions(profiles);
    }, [profiles]);

    const handleInputChange = () => {
        const text = contentEditableRef.current.innerHTML;
        setContent(text);
        setPost(prevState => ({
            ...prevState,
            desc: text,
        }));
        const lastWord = text.split(' ').pop().replace(/<[^>]*>?/gm, '');
        if (lastWord.startsWith('@')) {
            const query = lastWord.slice(1).toLowerCase();
            const filtered = suggestions.filter(suggestion =>
                suggestion.first_name.toLowerCase().includes(query)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        const text = contentEditableRef.current.innerHTML;
        const words = text.split(' ');
        words.pop();
        const newText = `${words.join(' ')} <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">@${suggestion.first_name} ${suggestion.last_name}</span> `;
        setContent(newText);
        setPost(prevState => ({
            ...prevState,
            desc: newText,
            taggedUsers: Array.isArray(prevState.taggedUsers)
                ? [...prevState.taggedUsers, suggestion]
                : [suggestion] // Fallback to a new array if prevState.taggedUsers is not an array
        }));
        setShowSuggestions(false);
        setTaggedUsers([...taggedUsers, suggestion]);

        setTimeout(() => {
            contentEditableRef.current.innerHTML = newText;
            placeCaretAtEnd(contentEditableRef.current);
        }, 0);
    };

    const placeCaretAtEnd = (element) => {
        element.focus();
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && showSuggestions) {
            e.preventDefault();
            handleSuggestionClick(filteredSuggestions[0]);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}
                  className="bg-white dark:bg-zinc-950 dark:border-zinc-800 dark:border-2 dark:text-white shadow rounded-lg mb-6 p-2 ">
                {selectedImage && (
                    <div className="mt-4 mx-auto">
                        <img src={post.media} alt="Selected" className="max-w-full rounded-lg mx-auto"/>
                    </div>
                )}
                <textarea
                    id="desc"
                    name="desc"
                    placeholder="Type something..."
                    value={post.desc}
                    onChange={handleInputChange}
                    className="hidden w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400 dark:bg-zinc-800"
                />

                <div
                    ref={contentEditableRef}
                    contentEditable
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind?"
                    className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400 dark:bg-zinc-800"
                    style={{minHeight: '4rem', whiteSpace: 'pre-wrap'}}
                ></div>
                {showSuggestions && (
                    <ul className="border border-gray-300 rounded mt-2 bg-white shadow-md max-h-40 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                            ><span className="inline-flex">
                                <div className="avatar mr-2">
                                    <div className="w-8 rounded-full">
                                        <img
                                            src={suggestion.profilePicture}
                                            alt="Tailwind-CSS-Avatar-component"/>
                                    </div>
                                </div>
                                {suggestion.first_name} {suggestion.last_name}</span>
                            </li>
                        ))}
                    </ul>
                )}


                <footer className="flex justify-between mt-2">
                    <div className="flex gap-2">
                        <label htmlFor="image-upload" className="cursor-pointer">
    <span
        className="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"
             strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
    </span>
                        </label>
                    </div>
                    <label htmlFor="image-upload" className="cursor-pointer">
                        <LoadingButton
                            type="submit"
                            size="sm"

                            variant="default"
                            className={`my-2 flex items-center justify-center rounded-md py-3 font-medium text-white bg-gray-950 hover:bg-gray-800 `}
                            loading={loading}

                        > Upload

                        </LoadingButton>
                        <input type="file" id="image-upload" accept="image/*" style={{display: 'none'}}
                               onChange={handleImageChange}/>
                    </label>
                </footer>
            </form>

            <div className="container mx-auto mt-10 hidden">
                <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"

                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <ReactQuill
                            theme="snow"
                            className="border border-gray-300 rounded-md"
                            style={{height: '300px'}} // Set editor height
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"

                        />
                        <p className="text-sm text-gray-500">Separate tags with commas (e.g., react, javascript)</p>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Publish
                    </button>
                </form>
            </div>

        </>
    );
}


