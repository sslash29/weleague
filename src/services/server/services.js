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
  const { user } = await getUserRepository();
  return user ? { ...user } : null;
}

async function signOut() {
  return await signOutRepository();
}

export { createStudent, getUser, logIn, signOut };
