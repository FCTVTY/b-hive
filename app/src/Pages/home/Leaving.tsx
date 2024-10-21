import React, { Fragment, useEffect, useState } from "react";
import {
  ChevronDownIcon,
  MinusSmallIcon,
  PlusSmallIcon,
} from "@heroicons/react/20/solid";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { getApiDomain } from "../../lib/auth/supertokens";
import { CommunityCollection, Courses } from "../../interfaces/interfaces";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

interface HomeProps {
  host?: string;
  channel?: string;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Leaving({ host, channel }: HomeProps) {
  const locationu = useLocation();

  // Extract the query string parameters
  const queryParams = new URLSearchParams(locationu.search);
  const loggedin = queryParams.get("url");
  useEffect(() => {
    toast("Redirecting to: " + loggedin);
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = loggedin;
    setTimeout(() => {
      a.click();
    }, 2000);
  }, [loggedin]);

  return (
    <div className="h-[100vh]">
      <div className="lg:flex lg:items-center lg:justify-between mt-[-2.5rem] p-3 pl-4 text-center mb-3 ">
        <div className="min-w-0 flex-1">
          <div
            id="redirect-notification"
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="">
              <div className="flex">
                <div>
                  <p className="font-bold">Redirecting...</p>
                  <p className="text-sm">
                    You will be redirected shortly. Please wait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
