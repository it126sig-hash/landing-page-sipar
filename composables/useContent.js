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
    gallery: t.gallery.map(withBase),
    specs: mergeSpecs(content.defaultSpecs, t.specsOverride),
    waLink: wa('type', { type: t.name }),
  }));

  return {
    content: { ...content, meta: { ...content.meta, logo: withBase(content.meta.logo) } },
    wa,
    houseTypes,
    withBase,
  };
}
