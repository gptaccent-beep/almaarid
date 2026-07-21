import {Header} from '@/components/site/header';
import {Footer} from '@/components/site/footer';
import {RegionPageClient} from '@/components/regions/region-page-client';
import {repository} from '@/lib/server/repository';
import {notFound} from 'next/navigation';

type Props = {
  params: Promise<{slug: string}>;
};

export default async function RegionPage({params}: Props) {
  const {slug} = await params;
  const repo = repository();
  const [region, siteSettings] = await Promise.all([repo.getRegion(slug), repo.getSiteSettings()]);

  if (!region) {
    notFound();
  }

  const cooperatives = await repo.listCooperatives(region.id);

  return (
    <>
      <Header initialSettings={siteSettings} />
      <RegionPageClient slug={slug} initialRegion={region} initialCooperatives={cooperatives} />
      <Footer settings={siteSettings} />
    </>
  );
}
