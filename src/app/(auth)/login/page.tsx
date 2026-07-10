import AuthForm from "@/components/shared/AuthForm";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <AuthForm mode="login" redirectTo={redirect} />;
}
