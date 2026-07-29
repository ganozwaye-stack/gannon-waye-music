import React from 'react';
import { ArrowRight, Coffee, Heart, Images, Music2, Sparkles } from 'lucide-react';

const GARDEN_IMAGES = {
  realGarden: '/images/mum/mum_garden.jpg',
  babySonia: '/images/mum/memory-lane/ML001_FS006.jpg',
  youngSonia: '/images/mum/memory-lane/ML005_FS010.jpg',
  sparkSonia: '/images/mum/memory-lane/ML007_FS013.jpg',
  children: '/images/mum/memory-lane/ML023_FS057.jpg',
  jewellery: '/images/mum/memory-lane/ML052_FS107.jpg',
  soniaPa: '/images/mum/memory-lane/ML058_FS116.jpg',
  love: '/images/mum/memory-lane/ML061_FS120.jpg',
  singleArtwork: '/images/music/without-you-here-cover.png',
};

const GARDEN_MOMENTS = [
  {
    id: 'single-artwork',
    icon: Music2,
    eyebrow: 'Top feature piece',
    title: 'Without You Here belongs at the front.',
    body: 'The single artwork stays close to the opening because the song is the emotional spine of this garden.',
    image: GARDEN_IMAGES.singleArtwork,
    imageAlt: 'Without You Here single artwork featuring Gannon and Sonia above him in the sky.',
    source: 'Approved single artwork',
  },
  {
    id: 'coffee-garden',
    icon: Coffee,
    eyebrow: 'Coffee in the garden',
    title: "Macca's coffee run, every time.",
    body: "Any drive with the kids could turn into a Macca's coffee run for an extra-extra-hot cappuccino. If they said it was a health and safety risk, Mum would tell them to take extra care then.",
    image: GARDEN_IMAGES.realGarden,
    imageAlt: 'Sonia in her real garden with a coffee mug.',
    source: 'Original family garden photo',
  },
  {
    id: 'younger-years',
    icon: Sparkles,
    eyebrow: 'Younger years',
    title: 'Little Sonia, held softly.',
    body: 'The younger-years tribute starts with real archive photos only, softened by layout and light rather than changing who is in the picture.',
    image: GARDEN_IMAGES.babySonia,
    imageAlt: 'A young Sonia family archive photograph.',
    source: 'Younger years family archive',
  },
  {
    id: 'her-children',
    icon: Heart,
    eyebrow: 'Her children',
    title: 'Her children were the centre.',
    body: 'This memory stays family-first: Sonia present, surrounded by the people who mattered most to her.',
    image: GARDEN_IMAGES.children,
    imageAlt: 'Sonia with family around her.',
    source: 'Approved family memory',
  },
  {
    id: 'sonia-and-pa',
    icon: Images,
    eyebrow: 'Real memory',
    title: 'Sonia and Pa.',
    body: 'A real photo, kept simple and close. This is the grounding point among the garden images.',
    image: GARDEN_IMAGES.soniaPa,
    imageAlt: 'Sonia and Pa together.',
    source: 'Original family photo',
  },
  {
    id: 'gold-details',
    icon: Sparkles,
    eyebrow: 'Favourite details',
    title: 'Gold jewellery and that little bit of shine.',
    body: 'The favourite-things area uses real Sonia photos as placeholders until individual perfume, jewellery, and keepsake cutouts are approved.',
    image: GARDEN_IMAGES.jewellery,
    imageAlt: 'Sonia holding a little one, with her rings and watch visible.',
    source: 'Approved family detail photo',
  },
];

function openMoment(onOpenMemory, moment) {
  if (!onOpenMemory) return;
  onOpenMemory({
    src: moment.image,
    label: moment.eyebrow,
    caption: `${moment.title} ${moment.body}`,
    source: moment.source,
  });
}

function MomentCard({ moment, index, onOpenMemory }) {
  const Icon = moment.icon;
  const reverse = index % 2 === 1;

  return (
    <article className={`grid gap-5 md:grid-cols-2 md:items-stretch ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <button
        type="button"
        onClick={() => openMoment(onOpenMemory, moment)}
        className="group relative min-h-[360px] overflow-hidden rounded-[1.6rem] border border-[#d4af37]/16 bg-[#071007] text-left shadow-[0_26px_90px_rgba(0,0,0,0.38)]"
      >
        <img
          src={moment.image}
          alt={moment.imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          loading={index > 1 ? 'lazy' : undefined}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,3,0.02),rgba(3,7,3,0.60)),radial-gradient(circle_at_50%_8%,rgba(255,235,175,0.18),transparent_42%)]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-full border border-[#fff7df]/14 bg-black/46 px-4 py-3 backdrop-blur-md">
          <span className="font-body text-[10px] uppercase tracking-[0.24em] text-[#fff7df]/72">{moment.source}</span>
          <ArrowRight className="h-4 w-4 text-[#f5d06e]" />
        </div>
      </button>

      <div className="flex min-h-[320px] flex-col justify-center rounded-[1.6rem] border border-[#d4af37]/14 bg-[#071007]/74 p-6 shadow-[0_24px_85px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/24 bg-[#f5d06e]/10 text-[#f5d06e]">
          <Icon className="h-5 w-5" />
        </div>
        <p className="font-body text-[9px] uppercase tracking-[0.36em] text-[#d4af37]/62">{moment.eyebrow}</p>
        <h3 className="mt-3 font-display text-3xl leading-tight text-[#fff7df] md:text-4xl">{moment.title}</h3>
        <p className="mt-5 font-body text-sm leading-7 text-[#fff7df]/66 md:text-base">{moment.body}</p>
      </div>
    </article>
  );
}

export default function GardenWalkEntrance({ onOpenMemory, onFinish }) {
  return (
    <section id="garden-walk" className="relative overflow-hidden bg-[#020502] text-[#fff7df]">
      <div className="relative min-h-screen overflow-hidden">
        <img
          src={GARDEN_IMAGES.realGarden}
          alt="Sonia in her real garden with a coffee mug."
          className="absolute inset-0 h-full w-full object-cover object-[50%_24%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,2,0.90),rgba(2,5,2,0.36)_50%,rgba(2,5,2,0.82)),linear-gradient(180deg,rgba(2,5,2,0.06),rgba(2,5,2,0.42)_62%,#020502)]" />

        <div className="relative z-10 grid min-h-screen items-center gap-8 px-5 py-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="max-w-3xl">
            <p className="font-body text-[10px] uppercase tracking-[0.48em] text-[#f5d06e]/76 [text-shadow:0_3px_18px_rgba(0,0,0,0.78)]">
              From sky to backyard
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.92] text-[#fff7df] [text-shadow:0_8px_32px_rgba(0,0,0,0.72)] md:text-7xl">
              Walk into Mum's garden.
            </h1>
            <p className="mt-6 max-w-xl font-body text-base leading-8 text-[#fff7df]/74">
              Sonia first: her real garden, the single artwork, family memories, coffee, favourite details, and the song all sit on the same path.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onFinish}
                className="inline-flex items-center gap-2 rounded-full bg-[#f5d06e] px-6 py-3 font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#071007] transition hover:-translate-y-0.5 hover:bg-[#ffe691]"
              >
                Continue through the garden <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openMoment(onOpenMemory, GARDEN_MOMENTS[0])}
                className="inline-flex items-center gap-2 rounded-full border border-[#fff7df]/18 bg-black/24 px-6 py-3 font-body text-[11px] font-bold uppercase tracking-[0.22em] text-[#fff7df]/72 transition hover:border-[#f5d06e]/42 hover:text-[#f5d06e]"
              >
                Coffee memory
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openMoment(onOpenMemory, GARDEN_MOMENTS[0])}
            className="group relative min-h-[440px] overflow-hidden rounded-[1.8rem] border border-[#f5d06e]/24 bg-[#071007] text-left shadow-[0_30px_110px_rgba(0,0,0,0.54)]"
          >
            <img
              src={GARDEN_IMAGES.singleArtwork}
              alt="Without You Here single artwork."
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,2,0.00),rgba(2,5,2,0.70))]" />
            <div className="absolute bottom-4 left-4 right-4 rounded-[1.2rem] border border-[#fff7df]/14 bg-black/54 p-4 backdrop-blur-md">
              <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#f5d06e]/72">Featured single artwork</p>
              <p className="mt-2 font-display text-2xl leading-tight text-[#fff7df]">Without You Here</p>
            </div>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,208,110,0.14),transparent_34%),linear-gradient(180deg,#020502,rgba(7,16,7,0.84)_28%,#020502)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-[9px] uppercase tracking-[0.42em] text-[#d4af37]/62">The garden rooms</p>
            <h2 className="mt-4 font-display text-4xl leading-tight text-[#fff7df] md:text-5xl">
              Where the memories settle.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-7 text-[#fff7df]/58">
              Each stop keeps Sonia visible: the artwork, coffee runs, younger years, family, love, and favourite details.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {GARDEN_MOMENTS.map((moment, index) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                index={index}
                onOpenMemory={onOpenMemory}
              />
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
            <div className="relative min-h-[380px] overflow-hidden rounded-[1.8rem] border border-[#d4af37]/14 bg-[#071007] shadow-[0_28px_95px_rgba(0,0,0,0.36)]">
              <img src={GARDEN_IMAGES.youngSonia} alt="Young Sonia in a family archive photograph." className="absolute inset-0 h-full w-full object-cover object-[50%_34%]" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,2,0.02),rgba(2,5,2,0.58))]" />
              <div className="absolute bottom-5 left-5 right-5 max-w-xl">
                <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#f5d06e]/70">Younger years</p>
                <h3 className="mt-3 font-display text-3xl text-[#fff7df]">The tribute has a place for who she was before everyone called her Mum.</h3>
              </div>
            </div>
            <div className="relative min-h-[380px] overflow-hidden rounded-[1.8rem] border border-[#d4af37]/14 bg-[#071007] shadow-[0_28px_95px_rgba(0,0,0,0.36)]">
              <img src={GARDEN_IMAGES.sparkSonia} alt="Sonia looking back in a family archive photograph." className="absolute inset-0 h-full w-full object-cover object-[50%_34%]" loading="lazy" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,2,0.05),rgba(2,5,2,0.66))]" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-body text-[9px] uppercase tracking-[0.34em] text-[#f5d06e]/70">That spark</p>
                <h3 className="mt-3 font-display text-3xl text-[#fff7df]">Older photos stay real, close, and unblurred.</h3>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/28 bg-[#f5d06e]/10 px-7 py-4 font-body text-[11px] font-bold uppercase tracking-[0.24em] text-[#f5d06e] transition hover:-translate-y-0.5 hover:bg-[#f5d06e]/16"
            >
              Enter memory lane <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
