"use server";

import {
  createStudentQuery,
  getUserQuery,
} from "@/lib/db/queries/server/queries";

async function createStudentRepository(prevState, formData) {
  return await createStudentQuery(prevState, formData);
}

async function getUserRepository() {
  return await getUserQuery();
}

export { createStudentRepository, getUserRepository };
