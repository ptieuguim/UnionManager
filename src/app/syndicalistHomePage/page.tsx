import AuthGuard from '../../helpers/AuthGuard';
import SyndicalistHomePage from '../../SyndicalistComponents/HomePageSyndicaliste'; // Now TSX version

export default function SyndicalistHomePagePage() {
  return (
    <AuthGuard>
      <SyndicalistHomePage />
    </AuthGuard>
  );
}
