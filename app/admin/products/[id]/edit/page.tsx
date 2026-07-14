import ProductPageForm from "../../../../../components/admin/ProductPageForm";

interface Props {
  params: { id: string };
}

export default function EditProductPage({ params }: Props) {
  return <ProductPageForm productId={params.id} />;
}
