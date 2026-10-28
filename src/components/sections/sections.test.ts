import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ArchitecturePlayground } from "./ArchitecturePlayground";
import { Delivery } from "./Delivery";
import { EntryPoints } from "./EntryPoints";
import { StackMarquee } from "./StackMarquee";
import { siteContent } from "@/src/content/site";

function escapeHtml(text: string) {
  return text.replaceAll("&", "&amp;");
}

describe("landing page sections", () => {
  it("renders all architecture layers enabled by default", () => {
    const markup = renderToStaticMarkup(createElement(ArchitecturePlayground));

    expect(markup.match(/aria-pressed="true"/g)).toHaveLength(4);
    for (const layer of siteContent.playground.layers) {
      expect(markup).toContain(layer.name);
      expect(markup).toContain(layer.value);
    }
    expect(markup).toContain(siteContent.playground.header);
  });

  it("renders all stack entries in the opposing marquee rows", () => {
    const markup = renderToStaticMarkup(createElement(StackMarquee));

    for (const item of siteContent.stack.marqueeItems) {
      const [name, subtitle] = item.split(" / ");
      expect(markup).toContain(name);
      expect(markup).toContain(subtitle);
    }
  });

  it("renders each entry point and its work-flow link", () => {
    const markup = renderToStaticMarkup(createElement(EntryPoints));

    expect(markup).toContain('id="entry-points"');
    expect(markup).toContain(siteContent.entryPoints.cta);
    for (const entry of siteContent.entryPoints.items) {
      expect(markup).toContain(escapeHtml(entry.title));
      expect(markup).toContain(escapeHtml(entry.description));
    }
  });

  it("renders all delivery stages in the accessible vertical layout", () => {
    const markup = renderToStaticMarkup(createElement(Delivery));

    expect(markup).toContain('id="how-we-work"');
    expect(markup).toContain(siteContent.delivery.cta);
    for (const stage of siteContent.delivery.stages) {
      expect(markup).toContain(`STAGE ${stage.number}`);
      expect(markup).toContain(escapeHtml(stage.title));
      expect(markup).toContain(escapeHtml(stage.description));
      expect(markup).toContain(`Phase ${stage.number} / 05`);
    }
  });
});
