import AuthGuard from '../../helpers/AuthGuard';
import SyndicatApp from '../../components/Syndicat-App/SyndicatApp/Syndicat-App';

export default function UserSyndicatAppPage() {
  return (
    <AuthGuard>
      <SyndicatApp />
    </AuthGuard>
  );
}
