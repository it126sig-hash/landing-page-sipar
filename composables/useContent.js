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
    const tpl = content.meta.whatsapp.templates[key];
    const msg = tpl.replace('{project}', project).replace('{type}', vars.type || '');
    return `https://wa.me/${content.meta.whatsapp.number}?text=${encodeURIComponent(msg)}`;
  };

  const houseTypes = content.houseTypes.map(t => ({
    ...t,
    thumbnail: t.thumbnail ? withBase(t.thumbnail) : t.thumbnail,
    gallery: t.gallery.map(withBase),
    // facades ikut dilewatkan withBase seperti thumbnail & gallery — kalau tidak,
    // path-nya jadi satu-satunya yang salah begitu situs dipasang di sub-folder.
    facades: (t.facades || []).map(f => ({ ...f, src: withBase(f.src) })),
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
      }
    },
    wa,
    houseTypes,
    withBase,
  };
}