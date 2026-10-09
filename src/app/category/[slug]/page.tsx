import CategoryContent from "./CategoryContent";

export const instant = false;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoryContent slug={slug} />;
}