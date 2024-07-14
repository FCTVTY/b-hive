import React, {Fragment, useEffect, useState} from 'react';
import {
    BriefcaseIcon,
    CheckIcon,
    ChevronRightIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon, PlusIcon, QuestionMarkCircleIcon
} from "@heroicons/react/16/solid";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {CalendarIcon} from "@heroicons/react/24/outline";
import {
    Community,
    CommunityCollection,
    Post,
    PPosts,
    Profile,
    Channel,
    EventDetails, PEvent, Courses
} from "../../interfaces/interfaces";
import axios from "axios";
import {getApiDomain} from "../../lib/auth/supertokens";
import moment from 'moment';
import {date} from "zod";
import {TicketPlus} from "lucide-react";
import {json} from "react-router-dom";
import EventItem from "./Eventitem";
import Button from "../../components/Button";

interface HomeProps {
    host?: string;
    channel?: string;
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function CoursesPage({ host, channel ,roles, setRoles}: HomeProps) {
    const [posts, setPosts] = useState<Courses[]>([]);
    const [community, setCommunity] = useState<CommunityCollection>();
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (host) {
            fetchDetails();
        }
    }, [host, channel]);

    const fetchDetails = async () => {
        try {
            const communityResponse = await fetch(`${getApiDomain()}/community?name=${host}`);
            if (!communityResponse.ok) {
                throw new Error('Network response was not ok for community fetch');
            }
            const communityData = await communityResponse.json();
            setCommunity(communityData);

            const postsResponse = await fetch(`${getApiDomain()}/community/courses?oid=${communityData.community.id}&page=1`);
            if (!postsResponse.ok) {
                throw new Error('Network response was not ok for courses fetch');
            }
            const postsData = await postsResponse.json();
            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching community details:', error);
        }
    };

    const handleRefresh = () => {
        if (channel) {
            fetchDetails();
        }
    };
    const [eventData, setEventData] = useState<EventDetails>({
        allowSignups: false,
        date: '',
        location: '',
        etype: 'online',
        logo: ''
    });
    const [postData, setPostData] = useState<PEvent>({
        postComments: [],
        _id: '',
        channel: '',
        channelstring: '',
        commentsallowed: true,
        date: '',
        desc: '',
        article: '',
        locked: false,
        media: '',
        profile: {} as Profile,
        softdelete: false,
        tags: [],
        userid: '',
        postLikes: [],
        type: 'event',
        channels: {} as Channel,
        communites: {} as Community,
        eventDetails: eventData
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData({ ...postData, [name]: value });
    };
    const handleImageCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setPostData(prevState => ({
                ...prevState,
                media: base64String,
            }));
            // @ts-ignore
            setSelectedImage(base64String)
        };

        reader.readAsDataURL(file);
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const base64String = event.target?.result as string;
            setPostData(prevState => ({
                ...prevState,

                    logo: base64String,

            }));

            // @ts-ignore
            setSelectedImage(base64String)
        };

        reader.readAsDataURL(file);
    };
    const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
        setPostData({ ...postData, eventDetails: { ...eventData, [name]: value } });
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({ ...eventData, etype: e.target.value });
        setPostData({ ...postData, eventDetails: { ...eventData, etype: e.target.value } });
    };
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        postData.communites = community?.community;
        // @ts-ignore
        postData.channelstring = community?.channels[0].id;
        const date = new Date();

        postData.date = formatDate(date);
        if (postData.eventDetails?.date) {
            const eventDate = new Date(postData.eventDetails.date);
            postData.eventDetails.date = formatDate(eventDate);
        }
        // Handle form submission, e.g., send postData to an API
        console.log(postData);
        await axios.post(`${getApiDomain()}/community/createEvent`, postData, {});
        setOpen(false);
        //window.location.reload();
    };
    const products = [
        {
            id: 1,
            name: 'Course title',
            category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
            href: '#',
            price: '4h',
            imageSrc: 'https://images.pexels.com/photos/5940836/pexels-photo-5940836.jpeg?auto=compress&cs=tinysrgb&w=800',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },{
            id: 1,
            name: 'Course title number 2',
            category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
            href: '#',
            price: '1d',
            imageSrc: 'https://images.pexels.com/photos/5940846/pexels-photo-5940846.jpeg?auto=compress&cs=tinysrgb&w=800',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },{
            id: 1,
            name: 'Course title number 3',
            category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
            href: '#',
            price: '20m',
            imageSrc: 'https://images.pexels.com/photos/5905557/pexels-photo-5905557.jpeg?auto=compress&cs=tinysrgb&w=800',
            imageAlt:
              'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
        },
        // More products...
    ]
    return (
      <>
          <div
            className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 -ml-72">
              <div className="min-w-0 flex-1">

                  <h2
                    className="mt-2 text-3xl leading-7 tracking-wider text-sky-950 sm:truncate sm:text-3xl sm:tracking-tight">
                      {community?.community?.name} Courses
                  </h2>

              </div>
              <div className=" absolute right-5 mt-5 flex lg:ml-4 lg:mt-0">


          <span className="sm:ml-3">
    {community && community.community?.create && (
      <button
        type="button"
        onClick={() => setOpen(true)}

        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
          <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
          Create
      </button>
    )}
              {roles && (roles.includes("admin") || roles.includes("moderator")) && (<button
                  type="button"
                  onClick={() => setOpen(true)}

                  className="inline-flex items-center rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <CalendarIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
                    Create
                </button>
              )}
                  </span>


              </div>
          </div>


          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {posts.filter(post => post.featured).map((product) => (
              <div className="bg-white shadow rounded-xl">
                  <section aria-labelledby="features-heading" className="relative">
                      <div
                        className="overflow-hidden aspect-square	 rounded-l-lg  lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-16">
                          <div className="badge badge-neutral absolute top-[10px] left-[10px]">FEATURED</div>

                          <img
                            src={product.media}
                            alt="Black leather journal with silver steel disc binding resting on wooden shelf with machined steel pen."
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          />
                      </div>

                      <div
                        className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 sm:pb-10 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:pt-15">
                          <div className="lg:col-start-2">
                              <h2 id="features-heading" className="font-medium text-cyan-900">
                                  Coruse of the month
                              </h2>
                              <p className="mt-4 text-4xl font-bold tracking-tight text-gray-900">{product.name}</p>
                              <p className="mt-4 text-gray-500">
                                  {product.desc}
                              </p>

                              <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 text-sm sm:grid-cols-2">

                                  <div>
                                      <dt className="font-medium text-gray-900">Course length: {product.hours}</dt>
                                      <dd className="mt-4 text-gray-500">
                                          <a         className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                     href={`/course/${product.name.replace(/ /g,"_")}`}>View</a>

                                      </dd>

                                  </div>

                              </dl>
                          </div>
                      </div>
                  </section>
              </div>
                ))}

              <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
                  {posts.map((product) => (
                    <div key={product._id}
                         className="group relative divide-x divide-gray-200 rounded-lg bg-white shadow">
                        <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-t-lg ">
                            <img src={product.media} alt={product.desc}
                                 className="object-cover object-center"/>
                            <div className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                                 aria-hidden="true">
                                <a
                                  href={`/course/${product.name.replace(/ /g,"_")}`}
                                  className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter">
                                    View Course
                                </a>
                            </div>
                        </div>
                        <div
                          className="mt-2 p-2 flex items-center justify-between space-x-8 text-base font-medium text-gray-900">
                            <h3>
                                <a                                   href={`/course/${product.name.replace(/ /g,"_")}`}
                                >
                                    <span aria-hidden="true" className="absolute inset-0"/>
                                    {product.name}
                                </a>
                            </h3>
                            <p className="text-gray-900 text-sm">{product.hours}</p>
                        </div>
                        <p className="m-2 text-sm text-gray-500">{product.desc}</p>
                    </div>
                  ))}
              </div>
          </div>

          <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-[99999]" onClose={setOpen}>
                  <div className="fixed inset-0"/>
                  <div className="fixed inset-0 overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                              <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                              >
                                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                                      <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
                                            onSubmit={handleSubmit}>
                                          <div className="flex-1">
                                              {/* Header */}
                                              <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                  <div className="flex items-start justify-between space-x-3">
                                                      <div className="space-y-1">
                                                          <Dialog.Title
                                                            className="text-base font-semibold leading-6 text-gray-900">
                                                              New Event
                                                          </Dialog.Title>
                                                          <p className="text-sm text-gray-500">
                                                              Get started by filling in the information below to
                                                              create your new Event.
                                                          </p>
                                                      </div>
                                                      <div className="flex h-7 items-center">
                                                          <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-gray-500"
                                                            onClick={() => setOpen(false)}
                                                          >
                                                              <span className="sr-only">Close panel</span>
                                                              <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                                          </button>
                                                      </div>
                                                  </div>
                                              </div>

                                              {/* Divider container */}
                                              <div
                                                className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                                  {/* Event name */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="desc"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Event name
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="text"
                                                            name="desc"
                                                            id="desc"
                                                            value={postData.desc}
                                                            onChange={handleChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>

                                                  {/* Event description */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="article"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Description
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                            <textarea
                              id="article"
                              name="article"
                              rows={3}
                              value={postData.article}
                              onChange={handleChange}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                                                      </div>
                                                  </div>

                                                  {/* Event image */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <h3
                                                            className="text-sm font-medium leading-6 text-gray-900">Cover
                                                              Image</h3>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <div className="flex space-x-2 mb-2">
                                                              <label htmlFor="imagec-upload"
                                                                     className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                              >
                                                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                              </label>


                                                          </div>
                                                          <img src={postData.media}/>
                                                      </div>
                                                  </div>
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <h3
                                                            className="text-sm font-medium leading-6 text-gray-900">Logo</h3>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <div className="flex space-x-2 mb-2">
                                                              <label htmlFor="image-upload"
                                                                     className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                              >
                                                                  <PlusIcon className="h-5 w-5" aria-hidden="true"/>
                                                              </label>


                                                          </div>
                                                          <img src={postData.logo}/>
                                                      </div>
                                                  </div>
                                                  {/* Event Type */}
                                                  <fieldset
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <legend className="sr-only">Event Type</legend>
                                                      <div className="text-sm font-medium leading-6 text-gray-900"
                                                           aria-hidden="true">
                                                          Event Type
                                                      </div>
                                                      <div className="space-y-5 sm:col-span-2">
                                                          <div className="space-y-5 sm:mt-0">
                                                              <div className="relative flex items-start">
                                                                  <div className="absolute flex h-6 items-center">
                                                                      <input
                                                                        id="online-event"
                                                                        name="etype"
                                                                        value="Zoom"
                                                                        onChange={handleRadioChange}
                                                                        type="radio"
                                                                        checked={eventData.etype === 'Zoom'}
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                      />
                                                                  </div>
                                                                  <div className="pl-7 text-sm leading-6">
                                                                      <label htmlFor="online-event"
                                                                             className="font-medium text-gray-900">
                                                                          Online Event
                                                                      </label>
                                                                      <p id="online-event-description"
                                                                         className="text-gray-500">
                                                                          People join via Zoom or Google Meet
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                              <div className="relative flex items-start">
                                                                  <div className="absolute flex h-6 items-center">
                                                                      <input
                                                                        id="in-person-event"
                                                                        name="etype"
                                                                        value="In-Person"
                                                                        onChange={handleRadioChange}
                                                                        type="radio"
                                                                        checked={eventData.etype === 'In-Person'}
                                                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                                      />
                                                                  </div>
                                                                  <div className="pl-7 text-sm leading-6">
                                                                      <label htmlFor="in-person-event"
                                                                             className="font-medium text-gray-900">
                                                                          In-Person
                                                                      </label>
                                                                      <p id="in-person-event-description"
                                                                         className="text-gray-500">
                                                                          Meet at a conference center or other
                                                                          location
                                                                      </p>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </fieldset>

                                                  {/* Event Date */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="date"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Date
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="datetime-local"
                                                            name="date"
                                                            id="date"
                                                            value={eventData.date}
                                                            onChange={handleEventChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>
                                                  <input type="file" id="imagec-upload" accept="image/*"
                                                         style={{display: 'none'}}
                                                         onChange={handleImageCChange}/>
                                                  <input type="file" id="image-upload" accept="image/*"
                                                         style={{display: 'none'}}
                                                         onChange={handleImageChange}/>
                                                  {/* Event Location */}
                                                  <div
                                                    className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                                      <div>
                                                          <label htmlFor="location"
                                                                 className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
                                                              Location
                                                          </label>
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                          <input
                                                            type="text"
                                                            name="location"
                                                            id="location"
                                                            value={eventData.location}
                                                            onChange={handleEventChange}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                          />
                                                      </div>
                                                  </div>
                                              </div>

                                              {/* Action buttons */}
                                              <div
                                                className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                                  <div className="flex justify-end space-x-3">
                                                      <button
                                                        type="button"
                                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                        onClick={() => setOpen(false)}
                                                      >
                                                          Cancel
                                                      </button>
                                                      <button
                                                        type="submit"
                                                        className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                      >
                                                          Create
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      </form>
                                  </Dialog.Panel>
                              </Transition.Child>
                          </div>
                      </div>
                  </div>
              </Dialog>
          </Transition.Root>

      </>
    )

};

