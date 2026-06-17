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

      <section id="how-it-works" className="px-4 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[2.52px] text-[#00d992]">
              How It Works
            </p>
            <h2 className="mt-2 text-2xl font-normal text-[#ffffff] sm:text-3xl">
              Three steps to verify any file
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[8px] border border-[#3d3a39] p-6">
              <span className="font-mono text-2xl font-bold text-[#00d992]/40">01</span>
              <h3 className="mt-3 text-base font-semibold text-[#ffffff]">Upload a file</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0]">
                Drag and drop or select a video, image, or audio file. No account needed.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#3d3a39] p-6">
              <span className="font-mono text-2xl font-bold text-[#00d992]/40">02</span>
              <h3 className="mt-3 text-base font-semibold text-[#ffffff]">AI analysis</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0]">
                Our engine checks for synthetic manipulation across visual, audio, and deepfake vectors.
              </p>
            </div>
            <div className="rounded-[8px] border border-[#3d3a39] p-6">
              <span className="font-mono text-2xl font-bold text-[#00d992]/40">03</span>
              <h3 className="mt-3 text-base font-semibold text-[#ffffff]">Get your verdict</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#a0a0a0]">
                Instant on-screen authenticity rating with confidence scores and generative model attribution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
