"use server";

import {
  createStudentQuery,
  getUserDataQuery,
  getUserQuery,
  logInQuery,
  signOutQuery,
} from "@/lib/db/queries/server/queries";

async function createStudentRepository(prevState, formData) {
  return await createStudentQuery(prevState, formData);
}

async function logInRepository(prevState, formData) {
  return await logInQuery(prevState, formData);
}

async function getUserRepository() {
  return await getUserQuery();
}

async function signOutRepository() {
  return await signOutQuery();
}

export {
  createStudentRepository,
  getUserRepository,
  logInRepository,
  signOutRepository,
};
