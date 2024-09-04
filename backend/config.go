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

package main

import (
	"fmt"
	"github.com/mailjet/mailjet-apiv3-go/v4"
	"github.com/mailjet/mailjet-apiv3-go/v4/resources"
	"github.com/supertokens/supertokens-golang/recipe/dashboard"
	"github.com/supertokens/supertokens-golang/recipe/dashboard/dashboardmodels"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword"
	"github.com/supertokens/supertokens-golang/recipe/emailpassword/epmodels"
	"github.com/supertokens/supertokens-golang/recipe/session"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty"
	"github.com/supertokens/supertokens-golang/recipe/thirdparty/tpmodels"
	"github.com/supertokens/supertokens-golang/recipe/usermetadata"
	"github.com/supertokens/supertokens-golang/recipe/userroles"
	"github.com/supertokens/supertokens-golang/supertokens"
)

var SuperTokensConfig = supertokens.TypeInput{
	Supertokens: &supertokens.ConnectionInfo{
		ConnectionURI: "https://core.bhivecommunity.co.uk",
		APIKey:        "813c8221ba50ceccb85bcab2e96cd0c4",
	},
	AppInfo: supertokens.AppInfo{
		AppName:       "B:Hive Community",
		APIDomain:     "https://sdk.bhivecommunity.co.uk",
		WebsiteDomain: "https://app.bhivecommunity.co.uk",
	},
	RecipeList: []supertokens.Recipe{
		userroles.Init(nil),
		emailpassword.Init(&epmodels.TypeInput{
			SignUpFeature: &epmodels.TypeInputSignUp{
				FormFields: []epmodels.TypeInputFormField{
					{ID: "email"},
					{ID: "password"},
					{ID: "first_name"},
					{ID: "last_name"},
				},
			},
			Override: &epmodels.OverrideStruct{

				APIs: func(originalImplementation epmodels.APIInterface) epmodels.APIInterface {
					// First we copy the original implementation
					originalEmailPasswordSignUpPOST := *originalImplementation.SignUpPOST

					*originalImplementation.SignUpPOST = func(formFields []epmodels.TypeFormField, tenantId string, options epmodels.APIOptions, userContext supertokens.UserContext) (epmodels.SignUpPOSTResponse, error) {

						// First we call the original implementation
						resp, err := originalEmailPasswordSignUpPOST(formFields, tenantId, options, userContext)
						if err != nil {
							return epmodels.SignUpPOSTResponse{}, err
						}

						// if sign up was successful
						if resp.OK != nil {
							// TODO: The input of this function is the formFields array.
							// You can also retrieve the user object like this:
							user := resp.OK.User
							_, err = usermetadata.UpdateUserMetadata(user.ID, map[string]interface{}{
								"first_name": formFields[2].Value,
								"last_name":  formFields[3].Value,
								"roles":      []string{"user"},
							})

							mailjetClient := mailjet.NewMailjetClient("64dd14ec7f5d2456d348c2f5331462ac", "9384f5cd0c51dd09e1e50b6da8520b9c")
							var data []resources.Contact
							mr := &mailjet.Request{
								Resource: "contact",
							}
							fmr := &mailjet.FullRequest{
								Info: mr,
								Payload: &resources.Contact{
									Email:                   formFields[0].Value,
									IsExcludedFromCampaigns: false,
									Name:                    formFields[2].Value + " " + formFields[3].Value,
								},
							}
							err := mailjetClient.Post(fmr, &data)
							if err != nil {
								fmt.Println(err)
							}
							fmt.Printf("Data array: %+v\n", data)

							var data2 []resources.ContactManagecontactslists
							mr = &mailjet.Request{
								Resource: "contact",
								ID:       data[0].ID, // replace with your contact ID here
								Action:   "managecontactslists",
							}
							fmr = &mailjet.FullRequest{
								Info: mr,
								Payload: &resources.ContactManagecontactslists{
									ContactsLists: []resources.ContactsListAction{ // replace with your contact lists here

										{
											ListID: 362887,
											Action: "addforce",
										},
									},
								},
							}
							err = mailjetClient.Post(fmr, &data2)
							if err != nil {
								fmt.Println(err)
							}
						}

						return resp, err
					}

					return originalImplementation
				},

				Functions: func(originalImplementation epmodels.RecipeInterface) epmodels.RecipeInterface {
					originalSignUp := *originalImplementation.SignUp

					*originalImplementation.SignUp = func(email, password string, tenant string, userContext supertokens.UserContext) (epmodels.SignUpResponse, error) {

						response, err := originalSignUp(email, password, tenant, userContext)
						if err != nil {
							return epmodels.SignUpResponse{}, err
						}

						return response, err
					}
					return originalImplementation
				},
			},
			EmailDelivery: nil,
		}),
		session.Init(nil),
		usermetadata.Init(nil),
		thirdparty.Init(&tpmodels.TypeInput{
			Override: &tpmodels.OverrideStruct{
				Functions: func(originalImplementation tpmodels.RecipeInterface) tpmodels.RecipeInterface {
					ogSignInUp := *originalImplementation.SignInUp

					*originalImplementation.SignInUp = func(thirdPartyID string, thirdPartyUserID string, email string, oAuthTokens map[string]interface{}, rawUserInfoFromProvider tpmodels.TypeRawUserInfoFromProvider, tenantId string, userContext *map[string]interface{}) (tpmodels.SignInUpResponse, error) {
						resp, err := ogSignInUp(thirdPartyID, thirdPartyUserID, email, oAuthTokens, rawUserInfoFromProvider, tenantId, userContext)

						if err != nil {
							return tpmodels.SignInUpResponse{}, err
						}

						if resp.OK != nil {

							firstName, ok := rawUserInfoFromProvider.FromUserInfoAPI["given_name"].(string)
							if !ok {
								firstName = "" // or handle the case where "given_name" is not a string or doesn't exist
							}

							lastName, ok := rawUserInfoFromProvider.FromUserInfoAPI["family_name"].(string)
							if !ok {
								lastName = "" // or handle accordingly
							}
							var details, err = usermetadata.UpdateUserMetadata(resp.OK.User.ID, map[string]interface{}{
								"first_name": firstName,
								"last_name":  lastName,
								"roles":      []string{"user"},
								"email":      email,
							})

							fmt.Println(details)

							mailjetClient := mailjet.NewMailjetClient("64dd14ec7f5d2456d348c2f5331462ac", "9384f5cd0c51dd09e1e50b6da8520b9c")
							var data []resources.Contact
							mr := &mailjet.Request{
								Resource: "contact",
							}
							fmr := &mailjet.FullRequest{
								Info: mr,
								Payload: &resources.Contact{
									Email:                   email,
									IsExcludedFromCampaigns: false,
									Name:                    firstName + " " + lastName,
								},
							}
							err = mailjetClient.Post(fmr, &data)
							if err != nil {
								fmt.Println(err)
								return resp, nil
							}
							fmt.Printf("Data array: %+v\n", data)

							var data2 []resources.ContactManagecontactslists
							mr = &mailjet.Request{
								Resource: "contact",
								ID:       data[0].ID, // replace with your contact ID here
								Action:   "managecontactslists",
							}
							fmr = &mailjet.FullRequest{
								Info: mr,
								Payload: &resources.ContactManagecontactslists{
									ContactsLists: []resources.ContactsListAction{ // replace with your contact lists here

										{
											ListID: 362887,
											Action: "addforce",
										},
									},
								},
							}
							err = mailjetClient.Post(fmr, &data2)
							if err != nil {
								fmt.Println(err)
							}

							(*userContext)["isSignUp"] = true
						}
						return resp, nil
					}

					return originalImplementation
				},
			},
			SignInAndUpFeature: tpmodels.TypeInputSignInAndUp{
				Providers: []tpmodels.ProviderInput{
					// We have provided you with development keys which you can use for testing.
					// IMPORTANT: Please replace them with your own OAuth keys for production use.
					{
						Config: tpmodels.ProviderConfig{
							ThirdPartyId: "google",
							Clients: []tpmodels.ProviderClientConfig{
								{
									ClientID:     "325267472132-olf6ko3lq9ttvnms6v8kjme8ig2tg5ci.apps.googleusercontent.com",
									ClientSecret: "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",
									Scope:        []string{"profile", "email"},
								},
							},
						},
					},
				},
			},
		}),
		dashboard.Init(&dashboardmodels.TypeInput{
			Admins: &[]string{
				"samwood1989@gmail.com",
			},
		}),
	},
}
