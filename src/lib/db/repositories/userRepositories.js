"use server";

import { createReportQuery } from "../queries/userQueries";

async function createReportRepository(prevState, formData) {
  return await createReportQuery(prevState, formData);
}

export { createReportRepository };
