import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import Button from "../../components/Button";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Post, Profile } from "../../interfaces/interfaces";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import ReactQuill from "react-quill";
import { LoadingButton } from "../../components/LoadingButton"; // will work
import loadImage from "blueimp-load-image";
import { json } from "react-router-dom";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { PlusIcon, SmilePlusIcon } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { Editor, RawDraftContentState } from "draft-js";
import RTEditor from "../../components/Editor/RTEditor";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface CreateProps {
  onSubmit: () => void;
  channel: string;
  profiles: Profile[];
}

export default function Create({ onSubmit, channel, profiles }: CreateProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [post, setPost] = useState<Partial<Post>>({});
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (channel) {
      setPost((prevState) => ({
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
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const base64String = canvas.toDataURL("image/jpeg");
          setPost((prevState) => ({
            ...prevState,
            media: base64String,
          }));
          setSelectedImage(base64String);
          console.log(base64String);
        }
      },
      { orientation: true }, // This option ensures the image is correctly oriented
    );
  };

  const handleInputChange2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);

      await axios.post(`${getApiDomain()}/community/createpost`, post, {});
      // Clear form fields after successful submission
      setMessage("");
      setSelectedImage(null);
      toast.success("Post Created");
      onSubmit();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  useEffect(() => {
    setSuggestions(profiles);
  }, [profiles]);

  const handleInputChange = () => {
    const text = contentEditableRef.current.innerHTML;

    setContent(text);
    setPost((prevState) => ({
      ...prevState,
      desc: text,
    }));
    const lastWord = text
      .split(" ")
      .pop()
      .replace(/<[^>]*>?/gm, "");
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = suggestions.filter((suggestion) =>
        suggestion.first_name.toLowerCase().includes(query),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const text = contentEditableRef.current.innerHTML;
    const words = text.split(" ");
    words.pop();
    const newText = `${words.join(" ")} <a href="/profile/${suggestion.id}" class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">${suggestion.first_name} ${suggestion.last_name}</span> `;
    setContent(newText);
    setPost((prevState) => ({
      ...prevState,
      desc: newText,
      taggedUsers: Array.isArray(prevState.taggedUsers)
        ? [...prevState.taggedUsers, suggestion]
        : [suggestion], // Fallback to a new array if prevState.taggedUsers is not an array
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
    if (e.key === "Enter" && showSuggestions) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[0]);
    }
  };

  const HandleBG = (colour, custom) => {
    var newText =
      '<div  class="flex h-[200px] sm:h-[50vh] rounded-xl items-center justify-center ' +
      colour +
      '" style="' +
      custom +
      '">\n' +
      '      <div class="text-3xl text-white/50 text-center">Whats on your mind?</div>\n' +
      "  </div>";
    setContent(newText);
    setPost((prevState) => ({
      ...prevState,
      desc: newText,
    }));
    setTimeout(() => {
      contentEditableRef.current.innerHTML = newText;
      //placeCaretAtEnd(contentEditableRef.current);
    }, 0);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const editorRef = useRef<Editor>(null);
  const initialDraft = {
    blocks: [
      {
        key: "foo",
        text: "My Editor",
        type: "header-one",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "6p01e",
        text: "To view this page as a render view, visit here",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [{ offset: 42, length: 4, key: 0 }],
        data: {},
      },
      {
        key: "alt16",
        text: "Features:---",
        type: "header-three",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "bftea",
        text: "Headings 1-6",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "c08tp",
        text: "Quote",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "c6tu",
        text: "Dot list",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "731ff",
        text: "Num list",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "evq9t",
        text: "Code blocks",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "84v3i",
        text: "Inline styling : Bold, Italic, Underline, Monospace",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [
          { offset: 17, length: 4, style: "BOLD" },
          { offset: 23, length: 6, style: "ITALIC" },
          { offset: 42, length: 9, style: "CODE" },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: "e0nvn",
        text: "Image & link inserting (url only) into text.",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "90fd9",
        text: "seperator line",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "44kjq",
        text: "Examples :---",
        type: "header-three",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "7agkt",
        text: "Quote",
        type: "header-five",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "eqctr",
        text: "This is a quote",
        type: "blockquote",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "14oo3",
        text: "Lists",
        type: "header-five",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "agd4a",
        text: "Dot list",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "n40f",
        text: "Dot list 2",
        type: "unordered-list-item",
        depth: 1,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "dudg4",
        text: "Dot list 3 (max)",
        type: "unordered-list-item",
        depth: 2,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "31hkl",
        text: "there is also num list",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "ogr1",
        text: "num list",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "5b6l6",
        text: "num list 2",
        type: "ordered-list-item",
        depth: 1,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "9962f",
        text: "num list 3",
        type: "ordered-list-item",
        depth: 2,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "20ecj",
        text: "Code block---",
        type: "header-five",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "a7qca",
        text: "the code block is not highlighted in the editor, but can be highlighted when you render it (explanation below).",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "b2ank",
        text: "//this is a code block",
        type: "code",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "3s1gi",
        text: 'console.log("hello world");',
        type: "code",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "3drq8",
        text: "for inline code, use monospace",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [{ offset: 17, length: 13, style: "CODE" }],
        entityRanges: [],
        data: {},
      },
      {
        key: "3p4nl",
        text: "Images & links---",
        type: "header-five",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "4c3sg",
        text: "To add an image, select text to be an alt and click on the image button.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "1di14",
        text: "example",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [{ offset: 0, length: 7, key: 1 }],
        data: {},
      },
      {
        key: "7uc0q",
        text: "to insert link, simply paste it, or select a text and click on the link icon, my github",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [{ offset: 78, length: 9, key: 2 }],
        data: {},
      },
      {
        key: "e20da",
        text: "there are also undo and redo buttons, alongside some keyboard shortcuts.",
        type: "unstyled",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "5vdcf",
        text: "Tech stack :---",
        type: "header-three",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "urp9",
        text: "Next.js",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "b9mjj",
        text: "Draft.js + Draftjs-to-html",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "em47k",
        text: "cheerio",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "egcgl",
        text: "highlight.js",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "d25nl",
        text: "Shadcn + next themes",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "eramh",
        text: "Tailwind",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "11mi2",
        text: "Typescript",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "3c7p3",
        text: "React icons",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "7ckv",
        text: "How to use the editor:---",
        type: "header-three",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "6uffi",
        text: "make sure to copy the editor file, the editor styles, Shadcn, and initialize theme and css variables. (If you don't want to use shadcn or css variables, you can customize it with some work).",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "6sam6",
        text: "Create a component of which you will render the Editor inside and give it basic styles as width and height.",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "t1lg",
        text: "Create a react ref to forward to the editor and content state to store the content. (optionally) : give the editor initial content in a form of RawDraftContentState, useful for editing existing forms.",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [{ offset: 144, length: 20, style: "CODE" }],
        entityRanges: [],
        data: {},
      },
      {
        key: "65oeq",
        text: "When you are done with editing the form, use the getContent function to convert it to html string and save it how you want to.",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [{ offset: 49, length: 10, style: "CODE" }],
        entityRanges: [],
        data: {},
      },
      {
        key: "cpuvj",
        text: "when you want to render the html string, use the allPreCodeToHighlighted function on the string, then you can render it as dangerouslySetInnerHTML.",
        type: "ordered-list-item",
        depth: 0,
        inlineStyleRanges: [
          { offset: 17, length: 7, style: "BOLD" },
          { offset: 49, length: 23, style: "CODE" },
          { offset: 123, length: 23, style: "CODE" },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: "461u2",
        text: "Notes---",
        type: "header-three",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "33c63",
        text: "Unfortunately, this editor will not work well in mobile, because Draft.js mobile pairing is bad (selection problems).",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [{ offset: 0, length: 13, style: "BOLD" }],
        entityRanges: [],
        data: {},
      },
      {
        key: "6icjv",
        text: 'To use the seperator line, simply write "-" three times.',
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [{ offset: 40, length: 3, style: "CODE" }],
        entityRanges: [],
        data: {},
      },
      {
        key: "8k5an",
        text: "Using num list or dot list one after another without anything in between will cause weird behavior in rendering them, so simply seperate them using text or empty row in between.",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: "72tkd",
        text: "I recommend saving a JSON and an HTML versions of the editor if you need to edit it in the future, because as mentioned, you can give initial draft to the editor and it requires the JSON format. you can instead, switch to working with JSON only and convert it to html when rendering the page, but it will be more server heavy.",
        type: "unordered-list-item",
        depth: 0,
        inlineStyleRanges: [{ offset: 0, length: 11, style: "BOLD" }],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {
      "0": {
        type: "LINK",
        mutability: "MUTABLE",
        data: { url: "https://lirans-draft-editor.vercel.app/render" },
      },
      "1": {
        type: "IMG",
        mutability: "MUTABLE",
        data: {
          url: "https://i.ibb.co/WBHKj5X/best-text-editors-1024x512.webp",
        },
      },
      "2": {
        type: "LINK",
        mutability: "MUTABLE",
        data: {
          href: "https://github.com/iLiranS",
          rel: "noopener noreferrer",
          target: "_blank",
          title: "https://github.com/iLiranS",
          url: "https://github.com/iLiranS",
        },
      },
    },
  };
  // updates on each editor change
  const updateContentHandler = useCallback(
    (newContent: RawDraftContentState) => {
      setContent(newContent);
    },
    [],
  );

  // focus issues resolver
  useEffect(() => {
    editorRef.current?.focus();
  }, [content]);

  function onReactionClick(emojiData: EmojiClickData, event: MouseEvent) {
    const text = contentEditableRef.current.innerHTML;
    const newText = text + emojiData.emoji;
    setContent(newText);
    setPost((prevState) => ({
      ...prevState,
      desc: newText,
    }));

    setTimeout(() => {
      contentEditableRef.current.innerHTML = newText;
      placeCaretAtEnd(contentEditableRef.current);
    }, 0);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 dark:shadow-amber-500  dark:text-white shadow rounded-xl mb-6 p-4 "
      >
        {selectedImage && (
          <div className="mt-4 mx-auto">
            <img
              src={post.media}
              alt="Selected"
              className="max-w-full rounded-lg mx-auto"
            />
          </div>
        )}
        <textarea
          id="desc"
          name="desc"
          placeholder="Type something..."
          value={post.desc}
          onChange={handleInputChange}
          className="hidden w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-lg placeholder-gray-400 dark:bg-zinc-800"
        />

        <div
          ref={contentEditableRef}
          contentEditable
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          className="  w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-lg placeholder-gray-400 dark:bg-zinc-800 mb-4"
          style={{ minHeight: "4rem", whiteSpace: "pre-wrap" }}
        ></div>
        <div className="inline-flex w-full hidden">
          <RTEditor
            initialEditorState={initialDraft as RawDraftContentState}
            ref={editorRef}
            setContent={updateContentHandler}
          />
        </div>

        {showSuggestions && (
          <ul className="border border-gray-300 rounded mt-2 bg-white shadow-md max-h-40 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                <span className="inline-flex">
                  <div className="avatar mr-2">
                    <div className="w-8 rounded-full">
                      <img
                        src={suggestion.profilePicture}
                        alt="Tailwind-CSS-Avatar-component"
                      />
                    </div>
                  </div>
                  {suggestion.first_name} {suggestion.last_name}
                </span>
              </li>
            ))}
          </ul>
        )}

        <footer className="flex justify-between mt-2">
          <div className="flex gap-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="flex items-center transition ease-out duration-300 hover:bg-blue-500 hover:text-white bg-blue-100 w-8 h-8 px-2 rounded-full text-blue-400 cursor-pointer">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </span>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>{" "}
          </div>
          <div className="inline-flex rounded-md shadow-sm">
            <LoadingButton
              type="submit"
              variant="ghost"
              className=" py-3 font-medium rounded-r-none text-white bg-gray-950 hover:bg-gray-800 bg-primary"
              loading={loading}
            >
              {" "}
              Create
            </LoadingButton>
            <Menu as="div" className="relative -ml-px block">
              <Menu.Button className="relative inline-flex items-center rounded-r-md bg-primary px-2 py-2 text-white   hover:bg-gray-50 hover:text-black focus:z-10">
                <span className="sr-only">Open options</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-gray-800", "")}
                        className={classNames(
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-gray-800"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Dark Background
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-indigo-800", "")}
                        className={classNames(
                          "text-gray-700",
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-indigo-800"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Blue Background
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href="#"
                        onClick={() => HandleBG("bg-pink-400", "")}
                        className={classNames(
                          "text-gray-700",
                          "text-gray-700 hover:bg-gray-200",
                          "block px-4 py-2 text-sm inline-flex w-full",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-pink-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pink Background
                      </a>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </footer>
      </form>

      <div className="hidden container mx-auto mt-10 ">
        <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <ReactQuill
              theme="snow"
              className="border border-gray-300 rounded-md"
              style={{ height: "300px" }} // Set editor height
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500">
              Separate tags with commas (e.g., react, javascript)
            </p>
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
