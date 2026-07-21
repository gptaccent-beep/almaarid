import {Header} from '@/components/site/header';
import {Footer} from '@/components/site/footer';
import {CooperativeDetailClient} from '@/components/cooperatives/cooperative-detail-client';
import {repository} from '@/lib/server/repository';
import {notFound} from 'next/navigation';

type Props = {
  params: Promise<{id: string}>;
};

export default async function CooperativePage({params}: Props) {
  const {id} = await params;
  const repo = repository();
  const [cooperative, siteSettings] = await Promise.all([repo.getCooperative(id), repo.getSiteSettings()]);

  if (!cooperative) {
    notFound();
  }

  const regions = await repo.listRegions();

  return (
    <>
      <Header initialSettings={siteSettings} />
      <CooperativeDetailClient id={id} initialCooperative={cooperative} initialRegions={regions} />
      <Footer settings={siteSettings} />
    </>
  );
}
