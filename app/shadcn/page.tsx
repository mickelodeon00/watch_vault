import { type Watches } from '../data';
import { columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<Watches[]> {
  // fetching all watches data

  // const supabase = await createClient();
  // const { data, error } = await supabase.from('watches_v2').select('*');
  // if (error) {
  //   return [];
  // }
  const data = [] as any;

  return data as Watches[];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="bg-slate-200 p-8">
      <div className="container mx-auto p-8 bg-white rounded-3xl">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
