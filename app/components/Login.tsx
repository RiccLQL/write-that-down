import React, { Component, useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { NavigationActions, NavigationDispatch, StackActions } from "react-navigation";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Auth0, { Auth0User } from "react-native-auth0";
import {AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE, AUTH0_SCOPE} from 'react-native-dotenv';
import SInfo from "react-native-sensitive-info";

import {
    headerColorStyle,
    headerTextColorStyle,
    buttonStyle
} from "../styles/colors";
import styles from "../styles/Login";
import { NavigationProp } from "@react-navigation/native";

const auth0 = new Auth0({
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENT_ID
});

export interface UserData {
    email: string;
    emailVerified: boolean;
    familyName: string;
    givenName: string;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updatedAt: string;
}

type RootStackParamList = {
    Home: undefined;
    Profile: { userId: string };
    Feed: { sort: 'latest' | 'top' } | undefined;
  };
  
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const Login = (props: Props): JSX.Element => {
    const [ state, setState ] = useState<boolean>(false);

    const navigationOptions = () => {
      return {
        headerTitle: "Login", // the title to display in the header
        headerStyle: { // style of the headers body
          backgroundColor: headerColorStyle
        },
        headerTitleStyle: { // style of the header text
          color: headerTextColorStyle
        }
      };
    };

    const gotoHome = (data: UserData) => {
        setState(true);
    
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: "Home",
              params: {
                name: data.name,
                picture: data.picture
              }
            })
          ]
        });
    
        props.navigation.dispatch(resetAction);
    };

    const login = () => {
        auth0.webAuth
          .authorize({
            scope: AUTH0_SCOPE,
            audience: AUTH0_AUDIENCE,
            prompt: "login"
          })
          .then(res => {
            auth0.auth
              .userInfo({ token: res.accessToken })
              .then(data => {
                gotoHome(data);
              })
              .catch(err => {
                console.log("err: ");
                console.log(JSON.stringify(err));
              });
    
            SInfo.setItem("accessToken", res.accessToken, {});
            SInfo.setItem("refreshToken", res.refreshToken?? "", {});
          })
          .catch(error => {
            console.log("error occurrdzz");
            console.log(error);
          });
    };


    useEffect(() => {
        SInfo.getItem("accessToken", {}).then(accessToken => {
            if (accessToken) {
                auth0.auth
                .userInfo({ token: accessToken })
                .then(data => {
                  gotoHome(data);
                })
                .catch(err => {
                  SInfo.getItem("refreshToken", {}).then(refreshToken => {
                    auth0.auth
                      .refreshToken({ refreshToken: refreshToken })
                      .then(newAccessToken => {
                        SInfo.setItem("accessToken", newAccessToken.accessToken, {});
                      })
                      .catch(err2 => {
                        console.log("err getting new access token");
                        console.log(err2);
                      });
                  });
                });
            } else {
              // no access token
              setState(true);
            }
          });
    });

    return (
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color="#05a5d1"
            animating={!state}
          />
          {state && (
            <Button onPress={login} title="Login" color={buttonStyle} />
          )}
        </View>
      );
}