// Redirect to my-complaints
import { Navigate } from 'react-router-dom'

export default function Complaints() {
  return <Navigate to="/my-complaints" replace />
}
