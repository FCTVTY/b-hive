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
import {PaperClipIcon} from "@heroicons/react/20/solid";
import {Place, Voucher, Walk} from "../../models/models";

export const AdminWalkPlaces: FC = () => {
  const {ID} = useParams<{ ID: string }>();

  const [walk, setWalk] = useState<Walk>();
  const [updatedWalk, setUpdatedWalk] = useState<Partial<Walk>>({});
  const [places, setPlaces] = useState<Place[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walkResponse = await axios.get<Walk>(`${getApiDomain()}/v1/walkdetails?walkID=${ID}`);
        setWalk(walkResponse.data);
        setUpdatedWalk(walkResponse.data);

        const pResponse = await axios.get<Place[]>(`${getApiDomain()}/v1/adminplaces`);

        setPlaces(pResponse.data)


      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [ID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    if (name === "coordinate1" || name === "coordinate2") {
      // Split the value by comma and convert to numbers
      const [latitude, longitude] = value.split(",").map(parseFloat);
      // Update the corresponding coordinate in updatedWalk
      setUpdatedWalk(prevUpdatedWalk => ({
        ...prevUpdatedWalk,
        geo: [
          {
            coordinate: [
              name === "coordinate1" ? latitude : prevUpdatedWalk.geo?.[0]?.coordinate[0] ?? 0,
              name === "coordinate1" ? longitude : prevUpdatedWalk.geo?.[0]?.coordinate[1] ?? 0
            ]
          },
          {
            coordinate: [
              name === "coordinate2" ? latitude : prevUpdatedWalk.geo?.[1]?.coordinate[0] ?? 0,
              name === "coordinate2" ? longitude : prevUpdatedWalk.geo?.[1]?.coordinate[1] ?? 0
            ]
          }
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

  const handleAddPlace = (placeID: string) => {
    const data = {wid: walk?.id, placeid: placeID}; // Corrected the object structure

    console.log(data)

    axios.post(`${getApiDomain()}/v1/admin/attachplace`, data) // Added data parameter
      .then(response => {
        console.log(response.data);
        // Handle success, maybe show a notification
      })
      .catch(error => {
        console.error(error);
        // Handle error, maybe show an error message to the user
      });
  };
  const handleRemovePlace = (placeID: string) => {
    const data = {wid: walk?.id, placeid: placeID}; // Corrected the object structure

    console.log(data)

    axios.post(`${getApiDomain()}/v1/admin/removeplace`, data) // Added data parameter
      .then(response => {
        console.log(response.data);
        // Handle success, maybe show a notification
      })
      .catch(error => {
        console.error(error);
        // Handle error, maybe show an error message to the user
      });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${getApiDomain()}/v1/admin/updateWalk?Walkid=${ID}`, updatedWalk);
      // Handle success
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
            <h3 className="text-base font-semibold leading-7 ">Walk Information</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
              {walk.name}
            </p>
          </div>
          <div className="mt-6 border-t border-white/10">
            <dl className="divide-y divide-white/10">

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Attachment Places
                </dt>

                <dd className="mt-2 text-sm  sm:col-span-2 sm:mt-0">
                  <ul role="list" className="divide-y divide-white/10 rounded-md border border-white/20">
                    {places && places.map((place, i) => (
                      walk.places.includes(place.id) && (


                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={i}>
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="flex-shrink-0 text-gray-400"><img
                              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                              src={place.logo}/> </span>
                              <span className="truncate font-medium">{place.name}</span>

                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRemovePlace(place.id)}

                              className="rounded bg-red-500 px-2 py-1 text-xs font-semibold  shadow-sm hover:bg-white/20"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      )))}
                  </ul>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 ">Available Places
                </dt>

                <dd className="mt-2 text-sm  sm:col-span-2 sm:mt-0">
                  <ul role="list" className="divide-y divide-white/10 rounded-md border border-white/20">
                    {places && places.map((place, i) => (
                      !walk.places.includes(place.id) && (
                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6" key={i}>
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="flex-shrink-0 text-gray-400"><img
                              className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                              src={place.logo}/> </span>
                              <span className="truncate font-medium">{place.name}</span>

                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddPlace(place.id)}
                              className="rounded bg-white/10 px-2 py-1 text-xs font-semibold  shadow-sm hover:bg-white/20"
                            >
                              Add
                            </button>
                          </div>
                        </li>
                      )))}
                  </ul>
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

export default AdminWalkPlaces;


