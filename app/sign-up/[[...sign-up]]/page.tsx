import { SignUp } from "@clerk/nextjs"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        appearance={{
          variables: {
            colorBackground: "var(--bg-surface)",
          },
        }}
      />
    </AuthLayout>
  )
}
