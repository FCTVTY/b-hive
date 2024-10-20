import React, { useEffect, useState } from "react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { Community } from "../../interfaces/interfaces";
import { BoxIcon } from "lucide-react";
import logo from "../../assets/bob-badge.svg";
import ReactQuill from "react-quill";

interface HomeProps {
  host?: string;
  channel?: string;
  roles?: any; // Add appropriate type
  setRoles?: (roles: any) => void; // Add appropriate type
}

export default function Site({ host, channel, roles, setRoles }: HomeProps) {
  const [community, setCommunity] = useState<Community | undefined>(undefined);

  useEffect(() => {
    if (host) {
      fetchDetails();
    } else {
      console.warn("Host is undefined");
    }
  }, [host, channel]);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`${getApiDomain()}/community?name=${host}`);
      if (!response.ok) {
        throw new Error("Network response was not ok for community fetch");
      }
      const data = await response.json();
      setCommunity(data.community);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCommunity((prevState) =>
      prevState
        ? {
            ...prevState,
            [name]: value,
          }
        : prevState,
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setCommunity((prevState) =>
        prevState
          ? {
              ...prevState,
              logo: base64String,
            }
          : prevState,
      );
    };
    reader.readAsDataURL(file);
  };
  const handledImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setCommunity((prevState) =>
        prevState
          ? {
              ...prevState,
              dLogo: base64String,
            }
          : prevState,
      );
    };
    reader.readAsDataURL(file);
  };
  const handlelImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setCommunity((prevState) =>
        prevState
          ? {
              ...prevState,
              landingBg: base64String,
            }
          : prevState,
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${getApiDomain()}/admin/community`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(community),
      });
      if (!response.ok) {
        throw new Error("Failed to update community details");
      }
      alert("Community details updated successfully");
    } catch (error) {
      console.error("Error saving community details:", error);
      alert("Error saving community details");
    }
  };

  const handlePublishToggle = async () => {
    try {
      if (!community) return;

      const response = await fetch(`${getApiDomain()}/admin/community`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...community, published: !community.published }),
      });
      if (!response.ok) {
        throw new Error("Failed to update community publish status");
      }
      setCommunity((prevState) =>
        prevState
          ? {
              ...prevState,
              published: !prevState.published,
            }
          : prevState,
      );
      alert(
        `Community has been ${community.published ? "unpublished" : "published"} successfully`,
      );
    } catch (error) {
      console.error("Error updating publish status:", error);
      alert("Error updating publish status");
    }
  };

  const colorFamilies = [
    "bg-black",
    "bg-white",
    "bg-slate-50",
    "bg-slate-100",
    "bg-slate-200",
    "bg-slate-300",
    "bg-slate-400",
    "bg-slate-500",
    "bg-slate-600",
    "bg-slate-700",
    "bg-slate-800",
    "bg-slate-900",
    "bg-slate-950",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
    "bg-gray-950",
    "bg-zinc-50",
    "bg-zinc-100",
    "bg-zinc-200",
    "bg-zinc-300",
    "bg-zinc-400",
    "bg-zinc-500",
    "bg-zinc-600",
    "bg-zinc-700",
    "bg-zinc-800",
    "bg-zinc-900",
    "bg-gray-900",
    "bg-neutral-50",
    "bg-neutral-100",
    "bg-neutral-200",
    "bg-neutral-300",
    "bg-neutral-400",
    "bg-neutral-500",
    "bg-neutral-600",
    "bg-neutral-700",
    "bg-neutral-800",
    "bg-neutral-900",
    "bg-neutral-950",
    "bg-stone-50",
    "bg-stone-100",
    "bg-stone-200",
    "bg-stone-300",
    "bg-stone-400",
    "bg-stone-500",
    "bg-stone-600",
    "bg-stone-700",
    "bg-stone-800",
    "bg-stone-900",
    "bg-stone-950",
    "bg-red-50",
    "bg-red-100",
    "bg-red-200",
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
    "bg-red-900",
    "bg-red-950",
    "bg-orange-50",
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",
    "bg-orange-950",
    "bg-amber-50",
    "bg-amber-100",
    "bg-amber-200",
    "bg-amber-300",
    "bg-amber-400",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-700",
    "bg-amber-800",
    "bg-amber-900",
    "bg-amber-950",
    "bg-yellow-50",
    "bg-yellow-100",
    "bg-yellow-200",
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-yellow-800",
    "bg-yellow-900",
    "bg-yellow-950",
    "bg-lime-50",
    "bg-lime-100",
    "bg-lime-200",
    "bg-lime-300",
    "bg-lime-400",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-lime-800",
    "bg-lime-900",
    "bg-lime-950",
    "bg-green-50",
    "bg-green-100",
    "bg-green-200",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
    "bg-green-900",
    "bg-green-950",
    "bg-emerald-50",
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-emerald-700",
    "bg-emerald-800",
    "bg-emerald-900",
    "bg-emerald-950",
    "bg-teal-50",
    "bg-teal-100",
    "bg-teal-200",
    "bg-teal-300",
    "bg-teal-400",
    "bg-teal-500",
    "bg-teal-600",
    "bg-teal-700",
    "bg-teal-800",
    "bg-teal-900",
    "bg-teal-950",
    "bg-cyan-50",
    "bg-cyan-100",
    "bg-cyan-200",
    "bg-cyan-300",
    "bg-cyan-400",
    "bg-cyan-500",
    "bg-cyan-600",
    "bg-cyan-700",
    "bg-cyan-800",
    "bg-cyan-900",
    "bg-cyan-950",
    "bg-sky-50",
    "bg-sky-100",
    "bg-sky-200",
    "bg-sky-300",
    "bg-sky-400",
    "bg-sky-500",
    "bg-sky-600",
    "bg-sky-700",
    "bg-sky-800",
    "bg-sky-900",
    "bg-sky-950",
    "bg-blue-50",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-blue-800",
    "bg-blue-900",
    "bg-blue-950",
    "bg-indigo-50",
    "bg-indigo-100",
    "bg-indigo-200",
    "bg-indigo-300",
    "bg-indigo-400",
    "bg-indigo-500",
    "bg-indigo-600",
    "bg-indigo-700",
    "bg-indigo-800",
    "bg-indigo-900",
    "bg-indigo-950",
    "bg-violet-50",
    "bg-violet-100",
    "bg-violet-200",
    "bg-violet-300",
    "bg-violet-400",
    "bg-violet-500",
    "bg-violet-600",
    "bg-violet-700",
    "bg-violet-800",
    "bg-violet-900",
    "bg-violet-950",
    "bg-purple-50",
    "bg-purple-100",
    "bg-purple-200",
    "bg-purple-300",
    "bg-purple-400",
    "bg-purple-500",
    "bg-purple-600",
    "bg-purple-700",
    "bg-purple-800",
    "bg-purple-900",
    "bg-purple-950",
    "bg-fuchsia-50",
    "bg-fuchsia-100",
    "bg-fuchsia-200",
    "bg-fuchsia-300",
    "bg-fuchsia-400",
    "bg-fuchsia-500",
    "bg-fuchsia-600",
    "bg-fuchsia-700",
    "bg-fuchsia-800",
    "bg-fuchsia-900",
    "bg-fuchsia-950",
    "bg-pink-50",
    "bg-pink-100",
    "bg-pink-200",
    "bg-pink-300",
    "bg-pink-400",
    "bg-pink-500",
    "bg-pink-600",
    "bg-pink-700",
    "bg-pink-800",
    "bg-pink-900",
    "bg-pink-950",
    "bg-rose-50",
    "bg-rose-100",
    "bg-rose-200",
    "bg-rose-300",
    "bg-rose-400",
    "bg-rose-500",
    "bg-rose-600",
    "bg-rose-700",
    "bg-rose-800",
    "bg-rose-900",
  ];
  const colorList = [
    "text-black",
    "text-white",
    "text-slate-50",
    "text-slate-100",
    "text-slate-200",
    "text-slate-300",
    "text-slate-400",
    "text-slate-500",
    "text-slate-600",
    "text-slate-700",
    "text-slate-800",
    "text-slate-900",
    "text-slate-950",
    "text-gray-50",
    "text-gray-100",
    "text-gray-200",
    "text-gray-300",
    "text-gray-400",
    "text-gray-900 dark:text-gray-400",
    "text-gray-600",
    "text-gray-700",
    "text-gray-800",
    "text-gray-900 dark:text-gray-400",
    "text-gray-950",
    "text-zinc-50",
    "text-zinc-100",
    "text-zinc-200",
    "text-zinc-300",
    "text-zinc-400",
    "text-zinc-500",
    "text-zinc-600",
    "text-zinc-700",
    "text-zinc-800",
    "text-zinc-900",
    "text-zinc-950",
    "text-neutral-50",
    "text-neutral-100",
    "text-neutral-200",
    "text-neutral-300",
    "text-neutral-400",
    "text-neutral-500",
    "text-neutral-600",
    "text-neutral-700",
    "text-neutral-800",
    "text-neutral-900",
    "text-neutral-950",
    "text-stone-50",
    "text-stone-100",
    "text-stone-200",
    "text-stone-300",
    "text-stone-400",
    "text-stone-500",
    "text-stone-600",
    "text-stone-700",
    "text-stone-800",
    "text-stone-900",
    "text-stone-950",
    "text-red-50",
    "text-red-100",
    "text-red-200",
    "text-red-300",
    "text-red-400",
    "text-red-500",
    "text-red-600",
    "text-red-700",
    "text-red-800",
    "text-red-900",
    "text-red-950",
    "text-orange-50",
    "text-orange-100",
    "text-orange-200",
    "text-orange-300",
    "text-orange-400",
    "text-orange-500",
    "text-orange-600",
    "text-orange-700",
    "text-orange-800",
    "text-orange-900",
    "text-orange-950",
    "text-amber-50",
    "text-amber-100",
    "text-amber-200",
    "text-amber-300",
    "text-amber-400",
    "text-amber-500",
    "text-amber-600",
    "text-amber-700",
    "text-amber-800",
    "text-amber-900",
    "text-amber-950",
    "text-yellow-50",
    "text-yellow-100",
    "text-yellow-200",
    "text-yellow-300",
    "text-yellow-400",
    "text-yellow-500",
    "text-yellow-600",
    "text-yellow-700",
    "text-yellow-800",
    "text-yellow-900",
    "text-yellow-950",
    "text-lime-50",
    "text-lime-100",
    "text-lime-200",
    "text-lime-300",
    "text-lime-400",
    "text-lime-500",
    "text-lime-600",
    "text-lime-700",
    "text-lime-800",
    "text-lime-900",
    "text-lime-950",
    "text-green-50",
    "text-green-100",
    "text-green-200",
    "text-green-300",
    "text-green-400",
    "text-green-500",
    "text-green-600",
    "text-green-700",
    "text-green-800",
    "text-green-900",
    "text-green-950",
    "text-emerald-50",
    "text-emerald-100",
    "text-emerald-200",
    "text-emerald-300",
    "text-emerald-400",
    "text-emerald-500",
    "text-emerald-600",
    "text-emerald-700",
    "text-emerald-800",
    "text-emerald-900",
    "text-emerald-950",
    "text-teal-50",
    "text-teal-100",
    "text-teal-200",
    "text-teal-300",
    "text-teal-400",
    "text-teal-500",
    "text-teal-600",
    "text-teal-700",
    "text-teal-800",
    "text-teal-900",
    "text-teal-950",
    "text-cyan-50",
    "text-cyan-100",
    "text-cyan-200",
    "text-cyan-300",
    "text-cyan-400",
    "text-cyan-500",
    "text-cyan-600",
    "text-cyan-700",
    "text-cyan-800",
    "text-cyan-900",
    "text-cyan-950",
    "text-sky-50",
    "text-sky-100",
    "text-sky-200",
    "text-sky-300",
    "text-sky-400",
    "text-sky-500",
    "text-sky-600",
    "text-sky-700",
    "text-sky-800",
    "text-sky-900",
    "text-sky-950",
    "text-blue-50",
    "text-blue-100",
    "text-blue-200",
    "text-blue-300",
    "text-blue-400",
    "text-blue-500",
    "text-blue-600",
    "text-blue-700",
    "text-blue-800",
    "text-blue-900",
    "text-blue-950",
    "text-indigo-50",
    "text-indigo-100",
    "text-indigo-200",
    "text-indigo-300",
    "text-indigo-400",
    "text-indigo-500",
    "text-indigo-600",
    "text-indigo-700",
    "text-indigo-800",
    "text-indigo-900",
    "text-indigo-950",
    "text-violet-50",
    "text-violet-100",
    "text-violet-200",
    "text-violet-300",
    "text-violet-400",
    "text-violet-500",
    "text-violet-600",
    "text-violet-700",
    "text-violet-800",
    "text-violet-900",
    "text-violet-950",
    "text-purple-50",
    "text-purple-100",
    "text-purple-200",
    "text-purple-300",
    "text-purple-400",
    "text-purple-500",
    "text-purple-600",
    "text-purple-700",
    "text-purple-800",
    "text-purple-900",
    "text-purple-950",
    "text-fuchsia-50",
    "text-fuchsia-100",
    "text-fuchsia-200",
    "text-fuchsia-300",
    "text-fuchsia-400",
    "text-fuchsia-500",
    "text-fuchsia-600",
    "text-fuchsia-700",
    "text-fuchsia-800",
    "text-fuchsia-900",
    "text-fuchsia-950",
    "text-pink-50",
    "text-pink-100",
    "text-pink-200",
    "text-pink-300",
    "text-pink-400",
    "text-pink-500",
    "text-pink-600",
    "text-pink-700",
    "text-pink-800",
    "text-pink-900",
    "text-pink-950",
    "text-rose-50",
    "text-rose-100",
    "text-rose-200",
    "text-rose-300",
    "text-rose-400",
    "text-rose-500",
    "text-rose-600",
    "text-rose-700",
    "text-rose-800",
    "text-rose-900",
    "text-rose-950",
  ];

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTColor, setSelectedTColor] = useState("");
  const handleDescChange = (content, delta, source, editor) => {
    console.log("HTML Content:", content);

    setCommunity((prevState) =>
      prevState
        ? {
            ...prevState,
            desc: content,
          }
        : prevState,
    );
  };
  const handleChange = (event) => {
    setSelectedColor(event.target.value);
    setCommunity((prevState) =>
      prevState
        ? {
            ...prevState,
            menu: event.target.value,
          }
        : prevState,
    );
  };
  const handleTChange = (event) => {
    setSelectedTColor(event.target.value);
    setCommunity((prevState) =>
      prevState
        ? {
            ...prevState,
            menutext: event.target.value,
          }
        : prevState,
    );
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "image",
    "background",
    "align",
    "size",
    "font",
  ];

  return (
    <>
      {community &&
        roles &&
        (roles.includes("admin") || roles.includes("moderator")) && (
          <div className="container mx-auto p-6 min-h-screen">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">General Settings</h2>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Community Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={community.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:text-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4 p-4 rounded-2xl bg-gray-50">
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 "
                  >
                    Branding Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    onChange={handleImageChange}
                  />
                  {community.logo && (
                    <img
                      src={community.logo}
                      alt="Community Logo"
                      className="mt-2 max-w-full h-auto"
                    />
                  )}
                </div>
                <div className="mb-4 bg-gray-900 rounded-2xl p-4">
                  <label
                    htmlFor="dLogo"
                    className="block text-sm font-medium text-white"
                  >
                    Branding Logo (dark theme)
                  </label>
                  <input
                    type="file"
                    id="dLogo"
                    name="dLogo"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    onChange={handledImageChange}
                  />
                  {community.dLogo && (
                    <img
                      src={community.dLogo}
                      alt="Community Logo dark"
                      className="mt-2 max-w-full h-auto"
                    />
                  )}
                </div>{" "}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4 ">
                  <label
                    htmlFor="landingBg"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Login page background
                  </label>
                  <input
                    type="file"
                    id="landingBg"
                    name="landingBg"
                    className="my-2 block w-full border-gray-300 rounded-md shadow-sm"
                    onChange={handlelImageChange}
                  />
                  <div className="mockup-browser bg-base-300 border dark:border-gray-900">
                    <div className="mockup-browser-toolbar">
                      <div className="input">
                        https://{community.url}
                        .app.bhivecommunity.co.uk
                      </div>
                    </div>
                    <div className="relative flex h-[60vh] justify-center md:px-12 lg:px-0">
                      <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-18">
                        <div className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
                          <div className="flex flex-col">
                            <a
                              aria-label="Feed"
                              href="https://bhivecommunity.co.uk"
                            >
                              <img
                                src={community.logo}
                                className="h-5 w-auto"
                                alt="Logo"
                              />
                            </a>
                            <div className="mt-20">
                              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-400">
                                Sign in to your account
                              </h2>
                              <p className="mt-2 text-xs text-gray-700">
                                Don’t have an account?{" "}
                                <a
                                  className="text-xs font-medium text-blue-600 hover:underline"
                                  href="/register"
                                >
                                  Sign up
                                </a>{" "}
                                for a free account.
                              </p>
                            </div>
                          </div>
                          <div className="mb-4 mt-6" />
                          <form className="mt-10 grid grid-cols-1 gap-y-8">
                            <div className="col-span-full">
                              <input
                                type="email"
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:text-gray-400 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 text-xs h-7"
                                name="email"
                                placeholder="Email"
                                defaultValue=""
                              />
                            </div>
                            <div className="col-span-full">
                              <input
                                type="password"
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 dark:text-gray-400 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 text-xs h-7"
                                name="password"
                                placeholder=""
                                defaultValue=""
                              />
                            </div>

                            <div>
                              <button
                                className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-xs font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 w-full"
                                type="button"
                              >
                                <span>
                                  Sign in <span aria-hidden="true">→</span>
                                </span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
                        <img
                          className="absolute inset-0 h-full w-full object-cover"
                          src={
                            community.landingBg ||
                            "https://images.pexels.com/photos/3280130/pexels-photo-3280130.jpeg"
                          }
                          alt="Community Background"
                        />
                        <a
                          aria-label="Feed"
                          href="https://bhivecommunity.co.uk"
                        >
                          <img
                            src={logo}
                            className="h-10 w-auto absolute bottom-5 right-5"
                            alt="Logo"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={community.desc}
                  onChange={handleDescChange}
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600"
              >
                Save
              </button>
            </div>

            <div className="hidden bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-6">Theme Settings</h2>

              <div className="w-full max-w-xs mx-auto">
                <label htmlFor="color-dropdown" className="block text-gray-700">
                  Select a Color:
                </label>
                <select
                  id="color-dropdown"
                  value={selectedColor}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a Color --</option>
                  {colorFamilies.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <select
                  id="color-dropdown"
                  value={selectedTColor}
                  onChange={handleTChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a Text Color --</option>
                  {colorList.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {selectedColor && (
                  <div
                    className="mt-4 p-4 text-white"
                    style={{
                      backgroundColor: `var(--tw-${selectedColor}-500)`,
                    }}
                  >
                    <div
                      className={`${selectedTColor} ${selectedColor} group flex gap-x-3 rounded-md p-2 text-sm leading-6 mr-[26px]`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium  group-hover:text-white">
                        <BoxIcon />
                      </span>
                      <span className="mt-[2px]">Menu Item</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600"
              >
                Save
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-bold mb-6">Publish Settings</h2>
              <div className="mb-4">
                <p>
                  Your website is currently{" "}
                  {community.published ? "published" : "unpublished"} and can
                  only be viewed by administrators.
                </p>
                <button
                  onClick={handlePublishToggle}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                >
                  {community.published ? "Unpublish Site" : "Publish Site"}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
