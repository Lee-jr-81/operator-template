export type HomepageContextAction = {
  title: string;
  copy: string;
  href: string;
};

export type HomepageContext = {
  heading: string;
  underline: string;
  paragraphs: readonly string[];
  actions: readonly HomepageContextAction[];
};

export function visibleHomepageContext(context: HomepageContext) {
  const heading = context.heading.trim();
  const paragraphs = context.paragraphs
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const actions = context.actions
    .map((action) => ({
      title: action.title.trim(),
      copy: action.copy.trim(),
      href: action.href.trim(),
    }))
    .filter((action) => action.title && action.copy && action.href);

  if (!heading || paragraphs.length === 0) {
    return null;
  }

  return {
    heading,
    underline: context.underline.trim(),
    paragraphs,
    actions,
  };
}
