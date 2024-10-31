import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { logout } from '../logout/actions';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <div>
        <form action={logout}>
          <button type="submit">logout</button>
        </form>
      </div>
    </div>
  );
}
