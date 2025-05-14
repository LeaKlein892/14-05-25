import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { API, graphqlOperation } from "aws-amplify";
import { getExtendedProfile } from "../graphql/queries";
import { createUserProfile } from "../graphql/mutations";
import { Project, UserProfile } from "../models";
import { analyticsEvent } from "./analytics";
import { emptyArray } from "./render-utils";

let username = "";
let phoneNumber = "";
let email = "";
let hadFirstSignIn = false;
let tmpProjects: Project[];
let tmpLoggedUser: UserProfile;

const onUserAuth = (
  user: any,
  setLoggedUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setProjects: React.Dispatch<React.SetStateAction<Project[] | undefined>>
) => {
  if (!hadFirstSignIn && user && user.username) {
    username = user.username;
    hadFirstSignIn = true;
    syncUserProfile(user, setLoggedUser, setProjects);
  }
};

const syncUserProfile = async (
  user: CognitoUser,
  setLoggedUser: React.Dispatch<React.SetStateAction<UserProfile>>,
  setProjects: React.Dispatch<React.SetStateAction<Project[] | undefined>>
) => {
  try {
    await setUser(user);
    const userProfileData: any = (await API.graphql(
      graphqlOperation(getExtendedProfile, { username })
    )) as any;

    const { userProfile, projects = emptyArray } =
      userProfileData.data.getExtendedProfile;
    if (!userProfile || userProfile.username === "") {
      analyticsEvent("Account", "User Profile Created", username);
      (
        API.graphql(
          graphqlOperation(createUserProfile, {
            input: {
              username,
              email,
              phoneNumber,
              participatesInProjects: emptyArray,
            },
          })
        ) as Promise<any>
      ).then((res: any) => {
        tmpLoggedUser = { ...tmpLoggedUser, id: res.data.createUserProfile.id };
      });
    } else {
      tmpLoggedUser = {
        ...tmpLoggedUser,
        id: userProfile.id,
        role: userProfile.role,
        participatesInProjects: userProfile.participatesInProjects,
        isProgressAdmin: userProfile.isProgressAdmin,
        progressEditor: userProfile.progressEditor,
        unsubscribedToEmails: userProfile.unsubscribedToEmails,
      };
    }
    tmpProjects = projects;
    setLoggedUser(tmpLoggedUser);
    setProjects(tmpProjects);
  } catch (e: any) {
    console.log("Error in saving user profile: ", e);
  }
};

const updateUserDetails = (user: CognitoUser) => {
  const userDetails = new Promise((res, rej) => {
    if (user) {
      user.getUserAttributes((e, attributes) => {
        if (e) {
          console.log("Error in getting user details: ", e);
          rej(e);
        } else {
          if (attributes) {
            email = getUserFieldByProperty("email", attributes);
            phoneNumber = getUserFieldByProperty("phone_number", attributes);
          }
        }
        username = user.getUsername();
        tmpLoggedUser = { ...tmpLoggedUser, email, phoneNumber, username };
        res("");
      });
    } else {
      rej("No user");
    }
  });
  return userDetails;
};

const setUser = async (user: CognitoUser) => {
  try {
    return updateUserDetails(user);
  } catch (err) {
    console.log("Error Not signed in: ", err);
  }
};

const getUserFieldByProperty = (
  property: string,
  attributes: CognitoUserAttribute[]
) => {
  const fieldIndex = attributes?.findIndex(
    (attr) => attr.getName() === property
  );
  if (fieldIndex !== undefined && fieldIndex !== -1) {
    return attributes[fieldIndex].getValue();
  }
  return "";
};

const checkEditAllowed = (
  writtenBy: string | undefined | null,
  loggedUser: string | undefined | null
) => {
  return writtenBy === loggedUser;
};

const verifyLoggedUser = (writtenBy: string | undefined | null) => {
  return checkEditAllowed(writtenBy, username);
};

export { onUserAuth, verifyLoggedUser };
