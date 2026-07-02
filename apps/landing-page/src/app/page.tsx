import { redirect } from 'next/navigation';

// Root page temporarily redirects to client login for Phase 2
export default function RootPage() {
  redirect('/auth/client/login');
}
