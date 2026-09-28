import type { Concept } from "@/types/palace";

/**
 * Five biology topics that are genuinely hard to hold in memory, each anchored to
 * a physical object in the palace. `explanation` is the real science, `visualHint`
 * is the deliberately silly image the learner encodes instead.
 */
export const concepts: Concept[] = [
  {
    id: "krebs-cycle",
    title: "Krebs Cycle",
    explanation:
      "The citric acid cycle oxidises acetyl-CoA into CO₂ and loads electron carriers, running eight enzyme-driven stages that regenerate the molecule they started from.",
    visualHint:
      "Picture a clock dial whose hand never stops: the same eight numbered stages, round and round, feeding themselves.",
  },
  {
    id: "meiosis",
    title: "Meiosis",
    explanation:
      "One diploid cell divides twice in meiosis to make four haploid cells that are genetically different, so gametes are not clones of the parent.",
    visualHint:
      "Picture a mirror that splits into two mirrors, and each of those splits again, until four smaller copies stare back at you.",
  },
  {
    id: "action-potential",
    title: "Action Potential",
    explanation:
      "A neuron fires when its membrane depolarises past threshold, opening voltage-gated channels and firing once, all-or-none, before resetting itself.",
    visualHint:
      "Picture a spring-loaded chest lid that stays shut and shut, then the instant the charge crosses the threshold, flings open all at once.",
  },
  {
    id: "enzyme-kinetics",
    title: "Enzyme Kinetics",
    explanation:
      "A Michaelis-Menten reaction rate rises with substrate only while enzyme is in excess, then plateaus at Vmax when every active site is saturated.",
    visualHint:
      "Picture a recipe book that only cooks at full speed once the right key ingredient is handed to the chef, and plateaus no matter how much more you add.",
  },
  {
    id: "protein-synthesis",
    title: "Protein Synthesis",
    explanation:
      "DNA is transcribed into mRNA in the nucleus, then that message is translated at the ribosome into a chain of amino acids with a completely different language.",
    visualHint:
      "Picture a book copied out by hand word for word, then handed to a translator who writes the same story in a totally different language.",
  },
];
