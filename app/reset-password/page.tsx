import { ResetPasswordPage } from "@/components/auth/resetPasswordPage/ResetPasswordPage";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const token =
    typeof params.token === "string" ? params.token : params.token?.[0];

  if (!token) {
    return redirect("/login");
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex w-full max-w-4xl flex-col items-center gap-[32px] sm:items-start">
        <ResetPasswordPage token={token} />
      </main>
    </div>
  );
}
