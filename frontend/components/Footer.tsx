import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-light px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary">
              Catch<span className="text-primary">Am</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
              Your shield against synthetic identity fraud. Automated deepfake
              detection for enterprises, public figures, and everyday Nigerians.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-text-primary">Product</h4>
            <nav className="flex flex-col gap-3">
              <Link href="/scan" className="text-sm text-text-muted transition-colors hover:text-text-primary">
                Scanner
              </Link>
              <Link href="/enterprise" className="text-sm text-text-muted transition-colors hover:text-text-primary">
                Enterprise
              </Link>
              <Link href="/pro" className="text-sm text-text-muted transition-colors hover:text-text-primary">
                Pro Credits
              </Link>
              <Link href="/auth/signup" className="text-sm text-text-muted transition-colors hover:text-text-primary">
                Sign up
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-text-primary">Company</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-sm text-text-muted">About</span>
              <span className="text-sm text-text-muted">Contact</span>
              <span className="text-sm text-text-muted">Privacy Policy</span>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t border-border-light pt-6 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} CatchAm AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
