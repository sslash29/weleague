"use server";

import { createReportRepository } from "@/lib/db/repositories/userRepositories";

async function createReport(prevState, formData) {
  return await createReportRepository(prevState, formData);
}

export { createReport };
