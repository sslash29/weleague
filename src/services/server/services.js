"use server";

import { createStudentRepository } from "@/lib/db/repositories/server/repositories";

async function createStudent(prevState, formData) {
  return await createStudentRepository(prevState, formData);
}

export { createStudent };
