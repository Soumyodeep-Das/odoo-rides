import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { AuthLayout } from '../components/AuthLayout'

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-indigo-500 hover:underline transition-colors">
          Register now
        </Link>
      </div>
    </AuthLayout>
  )
}
