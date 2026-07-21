import { SignIn } from "@clerk/nextjs"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={{
          variables: {
            colorBackground: "var(--bg-surface)",
          },
        }}
      />
    </AuthLayout>
  )
}
