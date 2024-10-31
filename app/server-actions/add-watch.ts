'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function addWatch(formData: FormData): Promise<void> {
  const model = formData.get('model');
  const brand = formData.get('brand');
  const referenceNumber = formData.get('referenceNumber');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('User is not authenticated within addWatch server action');
    return;
  }

  const { data, error } = await supabase.from('watches').insert([
    {
      model,
      brand,
      reference_number: referenceNumber,
      user_id: user.id,
    },
  ]);

  if (error) {
    return;
  }

  revalidatePath('/');
}
