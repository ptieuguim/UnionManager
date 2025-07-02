import AuthGuard from '@/helpers/AuthGuard';

export default function UserPageLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
