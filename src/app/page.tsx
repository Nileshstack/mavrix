import {
  DeferredArchitecturePlayground,
  DeferredDelivery,
} from "@/src/components/sections/DeferredSections";
import { EntryPoints } from "@/src/components/sections/EntryPoints";
import { Faq } from "@/src/components/sections/Faq";
import { Hero } from "@/src/components/sections/Hero";
import { Manifesto } from "@/src/components/sections/Manifesto";
import { Proof } from "@/src/components/sections/Proof";
import { Services } from "@/src/components/sections/Services";
import { StackMarquee } from "@/src/components/sections/StackMarquee";
import { Contact } from "@/src/components/sections/Contact";
import { FinalCta } from "@/src/components/sections/FinalCta";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
      <Hero />
      <Proof />
      <Manifesto />
      <Services />
      <StackMarquee />
      <DeferredArchitecturePlayground />
      <EntryPoints />
      <DeferredDelivery />
      <Faq />
      <Contact />
      <FinalCta />
    </main>
  );
}
