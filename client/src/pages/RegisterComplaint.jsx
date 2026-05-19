// Redirect to user register complaint page
import { Navigate } from 'react-router-dom'

export default function RegisterComplaint() {
  return <Navigate to="/register-complaint" replace />
}
