/*
 * Copyright (c) 2024.  Footfallfit & FICTIVITY. All rights reserved.
 * This code is confidential and proprietary to Footfallfit & FICTIVITY.
 * Unauthorized copying, modification, or distribution of this code is strictly prohibited.
 *
 * Authors:
 *
 * [@sam1f100](https://www.github.com/sam1f100)
 *
 */

import React, {FC, useState, useEffect, FormEvent} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {getApiDomain} from '../../lib/auth/supertokens';
import {Place} from "../../models/models";

export const AdminplaceEdit: FC = () => {
  const {ID} = useParams<{ ID: string }>();

  const [walk, setWalk] = useState<Place>();
  const [updatedWalk, setUpdatedWalk] = useState<Partial<Place>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walkResponse = await axios.get<Place>(`${getApiDomain()}/v1/admin/placedetails?placeID=${ID}`);
        setWalk(walkResponse.data);
        setUpdatedWalk(walkResponse.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [ID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    if (name === "coordinate1") {
      // Split the value by comma and convert to numbers
      const [latitude, longitude] = value.split(",").map(parseFloat);
      // Update the corresponding coordinate in updatedWalk
      setUpdatedWalk(prevUpdatedWalk => ({
        ...prevUpdatedWalk,

        coordinate: [
          latitude,
          longitude
        ]


      }));
    } else {
      // For other input fields, update normally
      setUpdatedWalk(prevUpdatedWalk => ({
        ...prevUpdatedWalk,
        [name]: value,
      }));
    }
  };


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      setUpdatedWalk(prevState => ({
        ...prevState,
        logo: base64String,
      }));
    };

    reader.readAsDataURL(file);
  };


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${getApiDomain()}/v1/admin/updatePlace?Placeid=${ID}`, updatedWalk);
      // Handle success
      const timer = setTimeout(() => {
        // Redirect to the desired location after 3 seconds
        window.location.href = '/places/' + ID;
      }, 3000);
    } catch (error) {
      // Handle error
      console.log(error);
    }

  };

  // @ts-ignore
  return (
    <form onSubmit={handleFormSubmit}>
      {walk && (
        <div className="my-3 px-3">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 ">Place Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder={updatedWalk.name}
                value={updatedWalk.name}
                onChange={handleInputChange}
              />
            </p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Image</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="logo"
                    id="logo"
                    autoComplete="logo"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder={updatedWalk.logo}
                    defaultValue={updatedWalk.logo}
                    onChange={handleInputChange}
                  />
                  <div className="divider">OR</div>

                  <input
                    type="file"
                    name="logo"
                    id="logo"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    onChange={handleImageChange}
                  />
                  <div className="text-center rounded-lg overflow-hidden w-56 sm:w-96 mx-auto">
                    <img className="object-contain h-48 w-full "
                         src={updatedWalk.logo}/>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Details</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">

                  <textarea id="details"
                            name="details"
                            rows={3}
                            className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            defaultValue={updatedWalk.details}
                            onChange={handleInputChange}
                  />
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Food hygiene rating</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  enter NA or 1-5
                  <input
                    type="text"
                    name="rating"
                    id="rating"
                    autoComplete="rating"
                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder={updatedWalk.rating}
                    defaultValue={updatedWalk.rating}
                    onChange={handleInputChange}
                  />

                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Toilets</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">

                  <input
                    type="checkbox"
                    name="toilet"
                    id="toilet"
                    checked={updatedWalk.toilet} // Use checked attribute for boolean values
                    onChange={handleInputChange}
                    className="px-1 block rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />

                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Disabled Toilets</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">

                  <input
                    type="checkbox"
                    name="toilet"
                    id="toilet"
                    checked={updatedWalk.disabled} // Use checked attribute for boolean values
                    onChange={handleInputChange}
                    className="px-1 block rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />

                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Map</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                  <span className="text-sm font-medium leading-6 ">Start Lat/lng</span>

                  <input
                    type="text"
                    name="coordinate1"
                    id="coordinate1"
                    autoComplete="coordinate1"
                    onChange={handleInputChange}

                    className="px-1 block w-full rounded-md border-0 bg-white/5 py-1.5  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    placeholder={updatedWalk.coordinate?.[0]?.toString() + "," + updatedWalk.coordinate?.[1].toString()}
                    defaultValue={updatedWalk.coordinate?.[0]?.toString() + "," + updatedWalk.coordinate?.[1].toString()}
                  />

                  <br/>


                  <br/>

                </dd>
              </div>


            </dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-0">
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 ">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AdminplaceEdit;


