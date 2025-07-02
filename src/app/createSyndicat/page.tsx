import AuthGuard from '../../helpers/AuthGuard';
import {CreateSyndicat} from '../../components/CreateSyndicatPage/CreateSyndicat';

export default function CreateSyndicatPage() {
  return (
    <AuthGuard>
      <CreateSyndicat />
    </AuthGuard>
  );
}
