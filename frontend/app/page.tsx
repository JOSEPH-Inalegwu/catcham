import Link from "next/link";
import GridBackground from "@/components/GridBackground";

export default function Home() {
  return (
    <main>
      <GridBackground>
        <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-normal leading-[1.05] tracking-[-0.65px] text-[#ffffff] sm:text-6xl lg:text-[60px] lg:leading-[64px]">
                Your eyes can miss a deepfake.
                <br />
                <span className="text-[#00d992]">Our engines cannot.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#bdbdbd] lg:mx-0">
                AI-generated deepfake videos and images easily bypass standard bank security checks.
                Upload a file to our free scanner and know if it is real or fake before it is too late.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
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
            <div className="flex justify-center lg:justify-end">
              <div className="">
                <img
                  src="/hero.jpg"
                  alt="CatchAm AI hero"
                  className="h-auto w-full max-w-[420px] rounded-[8px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </GridBackground>
    </main>
  );
}
