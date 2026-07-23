import { SITE, CALCULATORS } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap() {
  return CALCULATORS.map(({ path }) => ({
    url: path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
