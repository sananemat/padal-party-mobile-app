import { Client, Account, Avatars } from "react-native-appwrite";

export const client = new Client()
    .setProject('68a9959b0018d72e9bfa')
    .setPlatform('dev.ib.PaddleParty');

export const account = new Account(client);
export const avatars = new Avatars(client);