"use server";

import { createStudentQuery } from "@/lib/db/queries/server/queries";

async function createStudentRepository(prevState, formData) {
  return await createStudentQuery(prevState, formData);
}

export { createStudentRepository };
