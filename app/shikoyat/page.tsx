import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplaintForm from "@/components/ComplaintForm";

export const metadata: Metadata = {
  title: "Shikoyat va takliflar",
  alternates: { canonical: "/shikoyat" },
};

export default function ComplaintPage() {
  return (
    <>
      <Header />
      <main className="container py-12 md:py-20">
        <ComplaintForm />
      </main>
      <Footer />
    </>
  );
}
