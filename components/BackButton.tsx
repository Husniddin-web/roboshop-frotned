import { useRouter } from "next/navigation";

import { FiArrowLeft } from "react-icons/fi";

interface BackButtonProps {
  text: string;
}

export default function BackButton({ text }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        btn btn-outline text-white border-white hover:bg-neutral-800 
        mb-6 flex items-center gap-2 
        px-3 py-2 text-xs 
        sm:px-4 sm:py-2 sm:text-sm 
        md:px-5 md:py-2.5 md:text-base 
        transition-colors duration-200
      "
    >
      <FiArrowLeft size={16} />
      {text}
    </button>
  );
}
