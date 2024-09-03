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

import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";
import ThirdPartyEmailPassword, {
  Google,
} from "supertokens-auth-react/recipe/thirdparty";
export function getApiDomain() {
  const apiUrl = import.meta.env.VITE_API_DOMAIN || "http://localhost:3001/v1";
  console.log(apiUrl);
  return apiUrl;
}

export function getWebsiteDomain() {
  const websiteUrl = window.location.host;
  console.log(websiteUrl);
  return websiteUrl;
}

export const googleEnabled = "true";

export const initSuperTokens = () => {
  const providers = [];

  if (googleEnabled) {
    providers.push(Google.init());
  }

  SuperTokens.init({
    appInfo: {
      appName: "bhive",
      apiDomain: getApiDomain(),
      websiteDomain: getWebsiteDomain(),
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        signInAndUpFeature: {
          providers,
        },
      }),
      Session.init(),
    ],
  });
};

export const ComponentWrapper = (props: {
  children: JSX.Element;
}): JSX.Element => {
  return props.children;
};
