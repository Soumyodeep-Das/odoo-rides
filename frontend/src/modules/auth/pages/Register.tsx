import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'

export default function Register() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join Odoo Rides for a premium commuting experience"
    >
      <RegisterForm />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-indigo-500 hover:underline transition-colors">
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  )
}
