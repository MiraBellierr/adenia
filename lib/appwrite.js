import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
require("dotenv").config();

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.adenia",
  projectId: process.env.PROJECTID,
  storageId: "663f2b3e000ba63fcc6a",
  databaseId: "663f2a03000f36f36c72",
  userCollectionId: "663f2a28002ba8b07133",
  reminderCollectionId: "6655f916001a8fd629c0",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );

    if (!newAccount) throw Error;

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
      },
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const databaseId = appwriteConfig.databaseId;
    const collectionId = appwriteConfig.userCollectionId;
    let currentAccount = await account.get();

    const searchResponse = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (searchResponse.total === 0) {
      throw new Error("No document found with the given accountId");
    }
    const info = searchResponse.documents[0];

    currentAccount = {
      ...currentAccount,
      ...info,
    };

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export const updateProfile = async (accountId, username, age, phone) => {
  try {
    const databaseId = appwriteConfig.databaseId;
    const collectionId = appwriteConfig.userCollectionId;

    account.updateName(username);

    // Search for the document with the accountId
    const searchResponse = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("accountId", accountId)],
    );

    if (searchResponse.total === 0) {
      throw new Error("No document found with the given accountId");
    }

    const documentId = searchResponse.documents[0].$id;

    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      {
        username,
        age,
        phone,
      },
    );

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createReminder(userId, title, date) {
  try {
    const newReminder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reminderCollectionId,
      ID.unique(),
      {
        userId,
        title,
        date,
      },
    );

    return newReminder;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUserReminders(userId) {
  try {
    const reminders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reminderCollectionId,
      [Query.equal("userId", userId)],
    );

    return reminders.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const deleteReminder = async (documentId) => {
  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.reminderCollectionId,
    documentId,
  );
};
