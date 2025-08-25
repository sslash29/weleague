import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // ✅ success → redirect to "next" or root
      return NextResponse.redirect(new URL(next, request.url));
    }

    // ❌ failed → pass error message as query param
    return NextResponse.redirect(
      new URL(
        `/error?message=${encodeURIComponent(error.message)}`,
        request.url
      )
    );
  }

  return NextResponse.redirect(
    new URL(
      `/error?message=${encodeURIComponent("Invalid request")}`,
      request.url
    )
  );
}
