"use server";

import {
  createStudentRepository,
  getUserRepository,
} from "@/lib/db/repositories/server/repositories";

async function createStudent(prevState, formData) {
  return await createStudentRepository(prevState, formData);
}

async function getUser() {
  const user = await getUserRepository();
  console.dir(user, { depth: 6 });
}

export { createStudent, getUser };
