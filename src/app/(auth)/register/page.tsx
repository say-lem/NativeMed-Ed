import AuthForm from "@/components/shared/AuthForm";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <AuthForm mode="register" redirectTo={redirect} />;
}
