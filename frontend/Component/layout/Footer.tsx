import { FaFacebook, FaYoutube } from "react-icons/fa";

/**
 * Renders the application footer.
 *
 * @returns {JSX.Element} The footer.
 */
export default function Footer() {
  return (
    <footer className="border-t border-[#23436c] bg-[#23436c] text-white">
      <div className="mx-auto  max-w-[90vw] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <h2 className="font-heading text-3xl tracking-[-0.03em] text-white">
              Funeral Home
            </h2>
            <div className="flex items-center gap-4 text-white/90">
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:bg-white/10"
              >
                <FaFacebook size={35}/>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-md  transition hover:bg-white/10"
              >
                <FaYoutube size={40}/>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <a href="#" className="transition hover:text-white">
                  Find a Memorial
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Submit Obituary
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Monument mason
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Funeral director
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <a href="#" className="transition hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <a href="#" className="transition hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-white/80">
          2026 .....com. All rights reserved
        </div>
      </div>
    </footer>
  );
}
