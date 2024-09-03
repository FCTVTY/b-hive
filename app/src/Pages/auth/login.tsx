import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { SelectField, TextField } from "../../components/Fields";
import { Link } from "react-router-dom";
import logo from "../../assets/bob-badge.svg";
import mlogo from "../../assets/logo-light.svg";
import GoogleIcon from "../../assets/icons/google.svg";

import { useForm } from "react-hook-form";
import * as z from "zod";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { Form, FormField, FormItem, FormMessage } from "../../components/form";
import { Input } from "../../components/input";
import { Alert, AlertDescription, AlertTitle } from "../../components/alert";
import { emailPasswordSignIn } from "supertokens-web-js/lib/build/recipe/thirdpartyemailpassword";
import { CommunityCollection } from "../../interfaces/interfaces";
import axios from "axios";
import { getApiDomain } from "../../lib/auth/supertokens";
import ThirdPartyEmailPassword, {
  getAuthorisationURLWithQueryParamsAndSetState,
} from "supertokens-auth-react/recipe/thirdparty";

interface LoginProps {
  host?: string;
}
export default function Login({ host }: LoginProps) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot_password">(
    "signin",
  );
  const [thirdPartyLoading, setThirdPartyLoading] = useState<boolean>(false);

  const [community, setCommunity] = useState<Partial<CommunityCollection>>();

  useEffect(() => {
    fetchDetails();
  }, [host]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${getApiDomain()}/community?name=${host}`,
      );
      setCommunity(response.data);
    } catch (error) {
      console.error("Error fetching community details:", error);
    }
  };

  const handleSetMode = (mode: "signin" | "signup" | "forgot_password") => {
    setMode(mode);
    emailPasswordForm.clearErrors();
  };

  const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, "Password is required"),
  });

  const formSchema = signInSchema;

  const emailPasswordForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onEmailPasswordSubmit = async (
    formValues: z.infer<typeof formSchema>,
  ) => {
    try {
      await emailPasswordSignIn(formValues.email, formValues.password);
    } catch (error) {
      // @ts-ignore
      setError(error.message);
    }
  };

  const emailPasswordSignIn = async (email: string, password: string) => {
    const response = await EmailPassword.signIn({
      formFields: [
        { id: "email", value: email },
        { id: "password", value: password },
      ],
    });

    console.log(response);
    if (response.status == "OK") {
      window.location.assign("/s");
    }
    if (response.status == "WRONG_CREDENTIALS_ERROR") {
      setError("Wrong username/password");
    }
    // Redirect user to desired page upon successful registration
    // window.location.assign('/feed');
  };
  const GENERIC_ERROR = "Something went wrong. Please try again later.";

  const handleThirdPartySignIn = async (providerId: "google") => {
    setError(null);
    setThirdPartyLoading(true);

    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "google",

        // This is where Google should redirect the user back after login or error.
        // This URL goes on the Google's dashboard as well.
        frontendRedirectURI: `${window.location.origin}/auth/callback/google`,
      });

      /*
      Example value of authUrl: https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&client_id=1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com&state=5a489996a28cafc83ddff&redirect_uri=https%3A%2F%2Fsupertokens.io%2Fdev%2Foauth%2Fredirect-to-app&flowName=GeneralOAuthFlow
      */

      // we redirect the user to google for auth.
      window.location.assign(authUrl);
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        window.alert(err.message);
      } else {
        window.alert("Oops! Something went wrong.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <Link to="https://bhivecommunity.co.uk" aria-label="Feed">
          <img
            src={community?.community?.logo || mlogo}
            className="h-10 w-auto"
            alt="Logo"
          />
        </Link>
        <div className="mt-20">
          <h2 className="text-lg font-semibold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>{" "}
            for a free account.
          </p>
        </div>
      </div>

      <div className="mb-4 mt-6">
        {error && (
          <Alert variant="destructive" className="dark:bg-white">
            <AlertTitle>Oops!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Form {...emailPasswordForm}>
        <form
          onSubmit={emailPasswordForm.handleSubmit(onEmailPasswordSubmit)}
          className="mt-10 grid grid-cols-1 gap-y-8"
        >
          <FormField
            control={emailPasswordForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <Input {...field} size="lg" type="email" placeholder="Email" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={emailPasswordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <Input {...field} size="lg" type="password" placeholder="" />
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              variant="solid"
              color="slate"
              className="w-full"
            >
              <span>
                Sign in <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>

            <Button
              size="lg"
              className="w-full bg-neutral-200 text-neutral-800 hover:bg-neutral-200 hover:text-neutral-700"
              onClick={() => handleThirdPartySignIn("google")}
              loading={thirdPartyLoading}
            >
              <img src={GoogleIcon} alt="Google Logo" className="mr-3 h-5" />
              Login with Google
            </Button>
          </div>
          <a className="mt-2 text-sm text-gray-700" href="/auth/reset-password">
            Forgotten password?
          </a>
        </form>
      </Form>
    </>
  );
}
