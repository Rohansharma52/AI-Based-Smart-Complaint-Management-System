// Redirect to admin complaints page
import { Navigate } from 'react-router-dom'

export default function Admin() {
  return <Navigate to="/admin/complaints" replace />
}
