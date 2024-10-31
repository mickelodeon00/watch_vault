'use server';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
// import { cookies } from 'next/headers';

export async function deleteWatch(formData: FormData): Promise<void> {
  const watchId = formData.get('id');
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      'User is not authenticated within delete watch server action'
    );
    return;
  }

  const { data, error } = await supabase
    .from('watches')
    .delete()
    .match({ id: watchId, user_id: user.id });

  if (error) {
    console.error('Error deleting data', error);
    return;
  }

  revalidatePath('/watch-list');

  // return { message: 'Success' };
}
