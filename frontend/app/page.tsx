import Link from "next/link";
import GridBackground from "@/components/GridBackground";

export default function Home() {
  return (
    <main>
      <GridBackground>
        <section className="px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-normal leading-tight tracking-[-0.65px] text-[#ffffff] sm:text-6xl lg:text-[60px] lg:leading-[64px]">
            Your eyes can miss a deepfake.
            <br />
            <span className="text-[#00d992]">Our engines cannot.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#bdbdbd] lg:text-xl">
              AI-generated voice and video bypass every security check your bank
              has. Upload a file or paste a link. Know if it is real before you
              act.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/scan"
                className="rounded-[6px] bg-[#00d992] px-6 py-3 text-base font-semibold text-[#101010] transition-opacity hover:opacity-90"
              >
                Scan a file
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-[6px] border border-[#3d3a39] px-6 py-3 text-base font-semibold text-[#f2f2f2] transition-colors hover:border-[#bdbdbd]"
              >
                Explore Pro Tier
              </Link>
            </div>
          </div>
        </section>
      </GridBackground>
    </main>
  );
}
