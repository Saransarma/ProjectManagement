import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Function logic goes here
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_addres,
        name: data?.first_name + " " + data?.last_name,
        image: data?.profile_image_url,
      },
    });
  }
);

//Inngest Function to delete user from database

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    // Function logic goes here
    const { data } = event;
    await prisma.user.delete({
      data: {
        id: data.id,
      },
    });
  }
);

//Inngest Function to Update the User data in the database when user is updated in clerk
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    // Function logic goes here
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses[0]?.email_addres,
        name: data?.first_name + " " + data?.last_name,
        image: data?.profile_image_url,
      },
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
