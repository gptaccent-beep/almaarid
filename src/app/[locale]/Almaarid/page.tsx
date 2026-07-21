import {Header} from '@/components/site/header';
import {Footer} from '@/components/site/footer';
import {HomeExperience} from '@/components/home/home-experience';
import {repository} from '@/lib/server/repository';
import {shuffleArray} from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const repo = repository();
  const [regions, cooperatives, siteSettings] = await Promise.all([
    repo.listRegions(),
    repo.listCooperatives(),
    repo.getSiteSettings()
  ]);

  return (
    <>
      <Header initialSettings={siteSettings} />
      <HomeExperience
        initialRegions={shuffleArray(regions)}
        initialCooperatives={shuffleArray(cooperatives)}
        initialSettings={siteSettings}
      />
      <Footer settings={siteSettings} />
    </>
  );
}
