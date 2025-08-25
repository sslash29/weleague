"use server";

import {
  createStudentRepository,
  getUserRepository,
  logInRepository,
  signOutRepository,
} from "@/lib/db/repositories/server/repositories";

async function createStudent(prevState, formData) {
  return await createStudentRepository(prevState, formData);
}

async function logIn(prevState, formData) {
  return await logInRepository(prevState, formData);
}

async function getUser() {
  const user = await getUserRepository();
  console.dir(user, { depth: 6 });
}

async function signOut() {
  return await signOutRepository();
}

export { createStudent, getUser, logIn, signOut };
