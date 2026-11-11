import content from '~/data/content';

function mergeSpecs(defaultSpecs, specsOverride) {
  const overrideMap = new Map(specsOverride.map(s => [s.label, s.value]));
  return defaultSpecs.map(spec => ({
    label: spec.label,
    value: overrideMap.has(spec.label) ? overrideMap.get(spec.label) : spec.value,
  }));
}

export function useContent() {
  const project = content.meta.projectName;
  const withBase = (path) => useRuntimeConfig().app.baseURL.replace(/\/$/, '') + path;

  const wa = (key, vars = {}) => {
    let msg = content.meta.whatsapp.templates[key] || '';
    const allVars = { project, ...vars };
    Object.keys(allVars).forEach(k => {
      msg = msg.replaceAll(`{${k}}`, allVars[k] ?? '');
    });
    return `https://wa.me/${content.meta.whatsapp.number}?text=${encodeURIComponent(msg)}`;
  };

  const houseTypes = content.houseTypes.map(t => ({
    ...t,
    thumbnail: t.thumbnail ? withBase(t.thumbnail) : t.thumbnail,
    gallery: t.gallery.map(withBase),
    // facades ikut dilewatkan withBase seperti thumbnail & gallery — kalau tidak,
    // path-nya jadi satu-satunya yang salah begitu situs dipasang di sub-folder.
    facades: (t.facades || []).map(f => ({ ...f, src: withBase(f.src) })),
    perspectives: (t.perspectives || []).map(p => typeof p === 'string' ? withBase(p) : ({ ...p, src: withBase(p.src) })),
    plans: (t.plans || []).map(p => typeof p === 'string' ? withBase(p) : ({ ...p, src: withBase(p.src) })),
    specs: mergeSpecs(content.defaultSpecs, t.specsOverride),
    waLink: wa('type', { type: t.name }),
  }));

  return {
    content: { 
      ...content, 
      meta: {
        ...content.meta,
        logo: withBase(content.meta.logo),
        logoGroup: withBase(content.meta.logoGroup),
        logoGroupDark: withBase(content.meta.logoGroupDark),
      },
      hero: {
        ...content.hero,
        image: withBase(content.hero.image),
        imageMobile: withBase(content.hero.imageMobile),
        heroMobile: withBase(content.hero.heroMobile),
      },
      about: { 
        ...content.about, 
        awards: content.about.awards.map(a => ({ ...a, image: withBase(a.image) })) 
      },
      advantages: content.advantages.map(a => ({ ...a, image: withBase(a.image) })),
      banks: content.banks.map(b => ({ ...b, image: withBase(b.image), imageWhite: withBase(b.imageWhite) })),
      locationSection: { 
        ...content.locationSection, 
        mapImage: withBase(content.locationSection.mapImage) 
      },
      calculator: {
        ...content.calculator,
        image: content.calculator?.image ? withBase(content.calculator.image) : '',
        bankPartner: {
          ...content.calculator?.bankPartner,
          logo: content.calculator?.bankPartner?.logo ? withBase(content.calculator.bankPartner.logo) : '',
        },
      },
    },
    wa,
    houseTypes,
    withBase,
  };
}