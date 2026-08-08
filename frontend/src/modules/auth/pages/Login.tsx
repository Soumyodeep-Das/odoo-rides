import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  )
}
