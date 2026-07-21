import {Header} from '@/components/site/header';
import {AdminDashboard} from '@/components/admin/admin-dashboard';
import {repository} from '@/lib/server/repository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const siteSettings = await repository().getSiteSettings();

  return (
    <>
      <Header initialSettings={siteSettings} />
      <AdminDashboard />
    </>
  );
}
