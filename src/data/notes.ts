import { Note } from "@/types";

export const NOTES: Note[] = [
  // ─── BIOLOGY — Cell Division ───────────────────────────────────────────────
  {
    id: "cell-division",
    title: "Cell Division",
    subject: "Biology",
    filePath: "Cell division.md",
    tags: ["biology", "cell-division"],
    wordCount: 120,
    headings: ["Two Types", "How do we get Gametes?", "Revision Questions"],
    rawContent: "",
    content: `Cell division is the process by which a parent cell copies its DNA and divides into daughter cells. Both types involve nuclear division of chromosomes.

## Two Types

| | Mitosis | Meiosis |
|---|---|---|
| Daughter cells | 2 | 4 |
| Ploidy | Diploid (2n) | Haploid (n) |
| Identical? | Yes | No |
| Purpose | Growth, repair, maintenance | Sexual reproduction |

## How do we get Gametes?

Meiosis is the specific type that produces gametes (sperm and egg). Mitosis replaces and grows body tissue.

## Revision Questions

1. What are the two types of cell division and how do their outputs differ?
2. Which type of division would you expect in a wound healing process?
3. Why must gamete-producing division be different from somatic cell division?`,
  },
  {
    id: "mitosis",
    title: "Mitosis",
    subject: "Biology",
    filePath: "Mitosis.md",
    tags: ["biology", "cell-division"],
    wordCount: 180,
    headings: ["Stages (IPMAT)", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Mitosis divides one cell into two genetically identical diploid daughters, used for growth, repair, and maintenance.

Mitosis is one of two types of cell division (the other is Meiosis). It copies the parent cell's chromosomes exactly, so both daughters are **diploid (2n)** — they carry two full sets of chromosomes.

Purpose: **growth, repair, and maintenance** of body tissue. Not used to make gametes.

## Stages (mnemonic: IPMAT)

1. **Interphase** — DNA replicates; sister chromatids form
2. **Prophase** — chromosomes condense; spindle fibres extend from centrioles; nuclear membrane breaks down
3. **Metaphase** — chromosomes line up along the equator
4. **Anaphase** — spindle fibres pull chromatids to opposite poles
5. **Telophase** — two new nuclei form, each with the same chromosome count as the parent
6. **Cytokinesis** — cytoplasm divides; two daughter cells produced

## Revision Questions

1. What is the ploidy of mitosis daughter cells, and why does it stay the same?
2. Why does the body need mitosis but not meiosis for growth and repair?
3. What is the role of spindle fibres in anaphase?
4. At which stage do chromosomes first become visible under a microscope?`,
  },
  {
    id: "meiosis",
    title: "Meiosis",
    subject: "Biology",
    filePath: "Meiosis.md",
    tags: ["biology", "cell-division", "reproduction"],
    wordCount: 190,
    headings: ["How Genetic Variation is Created", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Meiosis produces four genetically unique haploid gametes through two rounds of division, enabling sexual reproduction and genetic diversity.

Meiosis is the reason siblings look different from each other and from parents. It is a specialised form of cell division that produces gametes (sperm and egg).

Key differences from mitosis:
- Produces **4 daughter cells** (not 2), all **haploid (n)**
- Daughter cells are **not identical** — genetic variation is built in
- Involves **two rounds of division**: Meiosis I and Meiosis II
- Purpose: **sexual reproduction**

## How Genetic Variation is Created

Two mechanisms during Meiosis I:

**1. Crossing Over**: During Prophase I, homologous chromosomes physically overlap and swap segments of DNA at points called chiasmata. This shuffles allele combinations.

**2. Independent Assortment**: Each pair of homologous chromosomes aligns randomly at the equator during Meiosis I. Which chromosome goes to which daughter cell is entirely random, producing all possible allele combinations in gametes.

## Revision Questions

1. Why does meiosis produce 4 cells but mitosis only produces 2?
2. What is the ploidy of meiosis daughter cells, and why must it be that way?
3. What happens at the chiasmata during Prophase I?
4. How does independent assortment increase genetic diversity?
5. Why do siblings who share the same parents look different from each other?`,
  },
  {
    id: "interphase",
    title: "Interphase",
    subject: "Biology",
    filePath: "Notes/Interphase.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 90,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Interphase is the preparation stage before mitosis begins, during which the cell replicates its DNA so each chromosome has two identical sister chromatids.

Interphase is not technically a phase of mitosis itself — it is the growth and preparation period that precedes it.

During interphase:
- The cell grows and carries out normal functions.
- DNA replicates: each chromosome is copied, producing two identical **sister chromatids** joined at the **centromere**.
- The cell prepares the proteins and energy needed for division.

Interphase is the "I" in the mnemonic **IPMAT** (Interphase, Prophase, Metaphase, Anaphase, Telophase).

## Revision Questions

1. Does interphase count as a stage of mitosis? Why or why not?
2. What is produced by DNA replication during interphase?
3. What joins the two sister chromatids together?`,
  },
  {
    id: "prophase",
    title: "Prophase",
    subject: "Biology",
    filePath: "Notes/Prophase.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Prophase is the first stage of mitosis — chromosomes condense and become visible, the nuclear membrane breaks down, and spindle fibres begin to form.

Prophase is the "P" in IPMAT and the first active stage of mitosis.

Key events:
- **Chromosomes condense** — they become tightly coiled and visible under a microscope for the first time.
- The **nuclear membrane breaks down**, releasing the chromosomes into the cytoplasm.
- **Centrioles** move to opposite poles of the cell.
- Centrioles send out **spindle fibres** that will later attach to chromosomes.

In meiosis, Prophase I is especially important: this is when **crossing over** occurs between homologous chromosomes, creating genetic variation.

## Revision Questions

1. What makes chromosomes visible for the first time during prophase?
2. What is the role of centrioles in prophase?
3. What additional event occurs during Prophase I of meiosis that does not happen in mitosis?`,
  },
  {
    id: "metaphase",
    title: "Metaphase",
    subject: "Biology",
    filePath: "Notes/Metaphase.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** In metaphase, replicated chromosomes line up along the cell's equator, each attached to spindle fibres from opposite poles.

Metaphase is the "M" in IPMAT — the stage where chromosomes are most visible and easiest to count, which is why karyotypes are made from metaphase cells.

Key events:
- Replicated chromosomes (sister chromatids still joined) line up along the **equator** of the cell (metaphase plate).
- **Spindle fibres** extend from the centrioles at each pole and attach to the **centromere** of each chromosome.
- Each chromosome is pulled from both sides, holding it precisely at the midline.

This alignment ensures that when chromatids are pulled apart in anaphase, each daughter cell receives exactly one copy of every chromosome.

## Revision Questions

1. Where exactly do chromosomes sit during metaphase?
2. Why is metaphase the best stage for counting chromosomes?
3. What holds the chromosomes at the equator during metaphase?`,
  },
  {
    id: "anaphase",
    title: "Anaphase",
    subject: "Biology",
    filePath: "Notes/Anaphase.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** In anaphase, spindle fibres pull the sister chromatids apart to opposite poles of the cell, so each pole receives one copy of every chromosome.

Anaphase is the "A" in IPMAT — the stage where the actual separation of genetic material happens.

Key events:
- **Spindle fibres shorten**, pulling the sister chromatids apart at the centromere.
- Separated chromatids are now called **independent chromosomes** as they move to opposite poles.
- By the end of anaphase, each pole has a full diploid set of chromosomes.

In meiosis (Anaphase I), it is the **homologous chromosomes** that are pulled apart — not the sister chromatids. This is what reduces the chromosome number from 2n to n.

## Revision Questions

1. What causes chromatids to move to opposite poles during anaphase?
2. At what point during anaphase does a chromatid become an independent chromosome?
3. How does Anaphase I in meiosis differ from anaphase in mitosis?`,
  },
  {
    id: "telophase",
    title: "Telophase",
    subject: "Biology",
    filePath: "Notes/Telophase.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 90,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Telophase reverses the setup of prophase — chromosomes decondense and a new nuclear membrane forms around each set of chromosomes at opposite poles.

Telophase is the "T" in IPMAT — the final stage of nuclear division before cytokinesis splits the cell.

Key events:
- A **new nuclear membrane** forms around each group of chromosomes at the two poles.
- Chromosomes begin to **decondense** (uncoil) back into chromatin.
- Two separate nuclei now exist in one cell.
- Each nucleus contains the **same number of chromosomes as the parent cell**.

After telophase, the cell proceeds to cytokinesis to physically divide the cytoplasm.

## Revision Questions

1. What is "reformed" during telophase that was broken down in prophase?
2. How many nuclei exist in the cell at the end of telophase?
3. Is the cell haploid or diploid at the end of mitotic telophase?`,
  },
  {
    id: "cytokinesis",
    title: "Cytokinesis",
    subject: "Biology",
    filePath: "Notes/Cytokinesis.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 90,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Cytokinesis is the physical splitting of the cytoplasm after telophase, producing two separate daughter cells.

Cytokinesis follows telophase and completes cell division. While telophase divides the nucleus, cytokinesis divides everything else — the cytoplasm, organelles, and cell membrane.

Result: **two daughter cells**, each with:
- Its own nucleus
- A full set of chromosomes identical to the parent (in mitosis)
- Roughly equal cytoplasm and organelles

Cytokinesis is technically separate from the stages of mitosis (IPMAT) because it is the division of the **cytoplasm**, not the **nucleus**. Mitosis ends at telophase; cytokinesis is the follow-on step.

## Revision Questions

1. What is the difference between mitosis and cytokinesis?
2. At what stage does cytokinesis occur relative to IPMAT?
3. How many daughter cells result from one round of mitosis + cytokinesis?`,
  },
  {
    id: "sister-chromatids",
    title: "Sister Chromatids",
    subject: "Biology",
    filePath: "Notes/Sister Chromatids.md",
    tags: ["biology", "cell-division"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Sister chromatids are the two identical copies of a chromosome produced during DNA replication in interphase, joined at the centromere until anaphase pulls them apart.

During interphase, the cell replicates its DNA. Each chromosome is copied, producing two identical strands called **sister chromatids**. They remain joined at the **centromere**.

Sister chromatids are:
- **Genetically identical** to each other (they are exact copies)
- Held together until anaphase
- Separated by spindle fibres during anaphase, at which point each becomes an independent chromosome

Do not confuse with **homologous chromosomes** — homologues are a matching pair of chromosomes (one from each parent) and are **not** identical. Sister chromatids are identical copies of the same chromosome.

## Revision Questions

1. At what stage of the cell cycle are sister chromatids formed?
2. What joins sister chromatids together?
3. How do sister chromatids differ from homologous chromosomes?
4. At what stage are sister chromatids finally separated?`,
  },
  {
    id: "spindle-fibres",
    title: "Spindle Fibres",
    subject: "Biology",
    filePath: "Notes/Spindle Fibres.md",
    tags: ["biology", "cell-division", "mitosis"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Spindle fibres are protein threads produced by centrioles that attach to chromosomes and pull them to opposite poles during cell division.

Spindle fibres (also called the spindle apparatus) are made of protein and form during prophase.

- Produced by **centrioles**, which migrate to opposite poles during prophase.
- Fibres extend from each pole and attach to the **centromere** of each chromosome.
- During **metaphase**, they hold chromosomes aligned at the equator.
- During **anaphase**, they **shorten and pull** sister chromatids (or homologous chromosomes in meiosis) to opposite poles.

Without spindle fibres, chromosomes could not be distributed equally — daughter cells would receive the wrong number of chromosomes.

## Revision Questions

1. What produces spindle fibres and when do they appear?
2. Where exactly do spindle fibres attach on a chromosome?
3. What is the function of spindle fibres during anaphase?`,
  },
  {
    id: "haploid-diploid",
    title: "Haploid and Diploid",
    subject: "Biology",
    filePath: "Notes/Haploid and Diploid.md",
    tags: ["biology", "cell-division", "genetics"],
    wordCount: 110,
    headings: ["Why the Distinction Matters", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Diploid cells (2n) carry two copies of every chromosome; haploid cells (n) carry one — the difference is what makes sexual reproduction work.

Ploidy describes how many complete sets of chromosomes a cell carries.

| Term | Symbol | Copies of each chromosome | Example |
|------|--------|--------------------------|---------|
| Haploid | n | 1 | Gametes (sperm, egg) |
| Diploid | 2n | 2 | All other body cells |

In humans: n = 23, so 2n = 46 chromosomes.

## Why the Distinction Matters

- **Meiosis** halves the chromosome count: diploid (2n) → haploid (n) gametes.
- **Fertilisation** restores it: haploid (n) + haploid (n) = diploid (2n) zygote.
- Without this halving, the chromosome number would double every generation.
- **Mitosis** keeps cells diploid — it copies all chromosomes, so daughter cells stay at 2n.

## Revision Questions

1. What does "2n" mean in terms of chromosomes?
2. What is the human haploid number?
3. Which type of cell division produces haploid cells?
4. What happens to ploidy at fertilisation?`,
  },
  {
    id: "gametes",
    title: "Gametes",
    subject: "Biology",
    filePath: "Gametes.md",
    tags: ["biology", "reproduction", "cell-division"],
    wordCount: 140,
    headings: ["Haploid vs Diploid", "Why Gametes Increase Genetic Diversity", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Gametes are haploid sex cells (sperm and egg) produced by meiosis; they fuse during fertilisation to restore the diploid chromosome number.

Gametes are the reproductive cells — sperm (male) and egg/ovum (female). They are produced by meiosis.

## Haploid vs Diploid

- Gametes are **haploid (n)** — they contain only one copy of each chromosome, half the full set.
- All other body cells are **diploid (2n)** — two copies of each chromosome (one from each parent).
- When two gametes fuse during **fertilisation**, the resulting cell (zygote) is diploid again (n + n = 2n).

This halving is essential: without it, chromosome numbers would double with every generation.

## Why Gametes Increase Genetic Diversity

- Half of our DNA comes from each parent.
- Crossing over during Meiosis I shuffles alleles between homologous chromosomes.
- The Law of Independent Assortment ensures all allele combinations are equally probable.
- Result: every gamete is genetically unique.

## Revision Questions

1. What is the ploidy of a gamete, and why must it be haploid?
2. What happens to the chromosome number at fertilisation?
3. Name two mechanisms that ensure gametes are genetically unique.
4. Which type of cell division produces gametes — mitosis or meiosis?`,
  },
  {
    id: "crossing-over",
    title: "Crossing Over",
    subject: "Biology",
    filePath: "Notes/Crossing Over.md",
    tags: ["biology", "cell-division", "meiosis", "genetics"],
    wordCount: 120,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Crossing over is the exchange of DNA segments between homologous chromosomes during Prophase I of meiosis, creating new combinations of alleles and driving genetic diversity.

Crossing over occurs during Prophase I of meiosis, when **homologous chromosomes physically overlap** and their chromatids intertwine.

At points of contact, chromatids break and **swap segments of DNA** with each other. The points where this exchange happens are called **chiasmata** (singular: chiasma).

Result: each chromosome now carries a **new combination of alleles** — some from the maternal chromosome, some from the paternal. This is a major source of genetic variation in gametes.

Crossing over does **not** occur in mitosis — mitosis needs to produce identical copies, so no swapping happens.

## Revision Questions

1. During which stage and which division of meiosis does crossing over occur?
2. What is the physical structure at the point of crossing over called?
3. Why does crossing over not happen in mitosis?
4. How does crossing over contribute to genetic diversity?`,
  },
  {
    id: "chiasmata",
    title: "Chiasmata",
    subject: "Biology",
    filePath: "Notes/Chiasmata.md",
    tags: ["biology", "cell-division", "meiosis"],
    wordCount: 90,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Chiasmata are the physical crossing points where homologous chromosomes exchange DNA during crossing over in Prophase I of meiosis.

Chiasmata (singular: chiasma) are the visible X-shaped junctions formed when homologous chromosomes overlap and swap DNA segments during crossing over.

- Each chiasma marks a point where **DNA has been exchanged** between non-sister chromatids of homologous chromosomes.
- Multiple chiasmata can form along a single pair of homologues.
- Chiasmata are visible under a microscope during Prophase I of meiosis.

Chiasmata are the physical evidence of crossing over — the mechanism that reshuffles alleles to create genetically unique gametes.

## Revision Questions

1. What is the singular form of "chiasmata"?
2. At what stage of meiosis are chiasmata formed?
3. What does each chiasma represent in terms of DNA?
4. Can more than one chiasma form between a pair of homologues?`,
  },
  {
    id: "law-independent-assortment",
    title: "Law of Independent Assortment",
    subject: "Biology",
    filePath: "Notes/Law of Independent Assortment.md",
    tags: ["biology", "genetics", "meiosis"],
    wordCount: 130,
    headings: ["How it works in Meiosis", "Why this increases genetic diversity", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Alleles for different genes are sorted into gametes independently of each other, so all allele combinations are equally probable.

The Law of Independent Assortment (Mendel's second law) states that alleles on different chromosome pairs are distributed to gametes independently — the inheritance of one trait does not influence another.

## How it works in Meiosis

During Meiosis I, each pair of homologous chromosomes aligns at the equator **randomly** — either the maternal or paternal chromosome of each pair can face either pole. Because this happens independently for every chromosome pair, all allele combinations are possible in the resulting gametes.

**Example:** A parent with genotype **AaBb** (heterozygous for two traits) produces gametes with all four combinations — AB, Ab, aB, ab — in equal proportions.

## Why this increases genetic diversity

Combined with crossing over, independent assortment means the number of genetically unique gametes a human can produce is astronomically large (2²³ combinations from assortment alone, before crossing over).

## Revision Questions

1. In your own words: what does "independent" mean in "independent assortment"?
2. An organism with genotype AaBb — list all possible gamete genotypes.
3. At which stage of meiosis does independent assortment occur?
4. How does independent assortment interact with crossing over to increase diversity?`,
  },
  {
    id: "dna",
    title: "DNA",
    subject: "Biology",
    filePath: "DNA.md",
    tags: ["biology"],
    wordCount: 80,
    headings: ["DNA structure"],
    rawContent: "",
    content: `**DNA stands for 'DEOXYRIBONUCLEIC ACID'**

One of the most important molecules in biology.

## DNA structure

- The DNA double helix is tightly wound around histone proteins
- This then forms the shape of a chromosome
- Chromosomes are what scientists usually see under a microscope
- Nucleotides are the building blocks of DNA
- They are made of a phosphate, deoxyribose sugar and a nitrogenous base`,
  },
  {
    id: "nucleotides",
    title: "Nucleotides",
    subject: "Biology",
    filePath: "Nucleotides.md",
    tags: ["biology"],
    wordCount: 70,
    headings: ["Nucleotide structure", "There are four different nitrogenous bases", "Nucleotide pairing"],
    rawContent: "",
    content: `## Nucleotide structure

Each Nucleotide has three parts:
- Phosphate
- Sugar
- Nitrogen-rich bases

## There are four different nitrogenous bases

- Adenine **(A)**
- Thymine **(T)**
- Guanine **(G)**
- Cytosine **(C)**

## Nucleotide pairing

- Adenine pairs with Thymine
- Guanine pairs with Cytosine

In a double-stranded DNA molecule, **A** and **T** always form a pair and **C** and **G** always form a pair. They are called **complementary pairs**.`,
  },
  {
    id: "chromosome",
    title: "Chromosome",
    subject: "Biology",
    filePath: "Chromosome.md",
    tags: ["biology"],
    wordCount: 100,
    headings: [],
    rawContent: "",
    content: `Chromosomes are thread-like structures located inside the nucleus of animal and plant cells, made of protein and a single molecule of DNA. They carry genomic information, organized into genes, which are passed from parents to offspring. Humans have 46 chromosomes (23 pairs) in most cells.

- DNA is tightly wound up to make a chromosome shape.
- Chromatids are a strand of DNA that has been tightly wound up.
- The centromere is the joining of the two chromatids.
- Telomeres are the ends of the chromatids and they are associated with aging, as they progressively get shorter as we age.

Humans have 46 chromosomes in each nucleus of their body cells (somatic cells):
- 44 Autosomes (non sex-chromosomes)
- 2 sex chromosomes (XX for females or XY - males)

Gametes contain half the genetic material:
- 22 autosomes
- 1 sex chromosome`,
  },
  {
    id: "homologous-chromosomes",
    title: "Homologous Chromosomes",
    subject: "Biology",
    filePath: "Homologus chromosomes.md",
    tags: ["biology"],
    wordCount: 60,
    headings: [],
    rawContent: "",
    content: `Each chromosome is in a pair, known as homologous chromosomes. Homologous chromosomes have:
- **Similar banding pattern**
- **Similar length and shape**
- **Similar centromere position**

They are matched because they contain the same genes on each of the chromosomes.`,
  },

  // ─── CHEMISTRY ─────────────────────────────────────────────────────────────
  {
    id: "physical-change",
    title: "Physical Change",
    subject: "Chemistry",
    filePath: "Notes/Physical Change.md",
    tags: ["chemistry", "change"],
    wordCount: 100,
    headings: ["Examples", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A physical change alters the appearance or state of a substance but does not produce any new substances — the same particles remain.

In a physical change, only the **physical properties** are altered. No new substance is created.

What changes:
- Shape (cutting, bending)
- **State** — solid, liquid, or gas (e.g. melting, boiling, freezing)
- Position and speed of particles

What stays the same:
- The identity of the substance
- The particles themselves

Physical changes are **often reversible** — you can melt ice and freeze it again. Compare with chemical change, where new substances are formed.

## Examples

- Ice melting to water
- Glass breaking
- Sugar dissolving in water

## Revision Questions

1. What is the key test for whether a change is physical?
2. Give one example of a reversible physical change and explain why it's reversible.
3. How do the particles of a substance differ before and after a physical change?`,
  },
  {
    id: "chemical-change",
    title: "Chemical Change",
    subject: "Chemistry",
    filePath: "Notes/Chemical Change.md",
    tags: ["chemistry", "change", "reactions"],
    wordCount: 120,
    headings: ["Evidence of a Chemical Change", "Physical vs Chemical Change", "Examples", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A chemical change produces one or more new substances through a chemical reaction and is usually irreversible.

In a chemical change, the atoms of reactants are rearranged to form entirely new substances (products). This is a chemical reaction. Chemical changes are **usually not reversible** — you cannot un-bake a cake.

## Evidence of a Chemical Change

Any one of these signals a chemical change has occurred:
- **Colour change**
- **Gas produced** (bubbles)
- **Temperature change** (heat released or absorbed)
- **Light produced**
- **Precipitate** forms (solid appearing in a liquid)
- **New smell**

## Physical vs Chemical Change

| | Physical Change | Chemical Change |
|---|---|---|
| New substance? | No | Yes |
| Reversible? | Often yes | Often no |
| What changes? | Size, state, shape | Chemical identity |

## Examples

- Burning wood
- Baking a cake
- Rusting iron
- Mixing vinegar and baking soda

## Revision Questions

1. List four pieces of evidence that indicate a chemical change.
2. Why is baking a cake a chemical change and not a physical one?
3. Is dissolving salt in water a chemical or physical change? Justify your answer.`,
  },
  {
    id: "states-of-matter",
    title: "States of Matter",
    subject: "Chemistry",
    filePath: "Notes/States of Matter.md",
    tags: ["chemistry", "states", "matter"],
    wordCount: 90,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Matter exists as solid, liquid, gas, or aqueous solution — each has a symbol used in chemical equations.

The four states of matter relevant to chemistry:

| State | Symbol | Description |
|-------|--------|-------------|
| Solid | (s) | Fixed shape and volume |
| Liquid | (l) | Fixed volume, takes shape of container |
| Gas | (g) | No fixed shape or volume |
| Aqueous | (aq) | Dissolved in water |

These symbols are written after the chemical formula in balanced equations — e.g. H₂O(l), NaCl(aq), O₂(g).

State changes (melting, boiling) are physical changes — no new substance is formed.

## Revision Questions

1. What symbol is used for a substance dissolved in water?
2. Is a change of state a physical or chemical change? Why?
3. Write the state symbols for: oxygen gas, liquid water, dissolved salt.`,
  },
  {
    id: "ionic-compounds",
    title: "Ionic Compounds",
    subject: "Chemistry",
    filePath: "Notes/Ionic Compounds.md",
    tags: ["chemistry", "bonding", "ionic"],
    wordCount: 110,
    headings: ["Example: Potassium Nitrate", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Ionic compounds are formed when positive and negative ions bond together; they are solid at room temperature and many dissolve in water.

Ionic compounds form when a positively charged ion (cation) bonds with a negatively charged ion (anion) through electrostatic attraction — an **ionic bond**.

Properties:
- **Solid (s)** at room temperature
- Can become **liquid (molten)** when heated to very high temperatures
- Many are **soluble in water**, forming **aqueous (aq) solutions**
- Some are **insoluble** and remain solid in water

## Example: Potassium Nitrate (KNO₃)

KNO₃ is made of K⁺ (potassium ion) and NO₃⁻ (nitrate, a polyatomic ion) bonded together.

## Revision Questions

1. What type of particles make up an ionic compound?
2. What does "aqueous" mean, and which ionic compounds can form aqueous solutions?
3. At what state is an ionic compound at room temperature?
4. What must happen for an ionic compound to become molten?`,
  },
  {
    id: "chemical-equations",
    title: "Chemical Equations",
    subject: "Chemistry",
    filePath: "Notes/Chemical Equations.md",
    tags: ["chemistry", "equations"],
    wordCount: 110,
    headings: ["Three Types of Equation", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A chemical equation represents a chemical reaction using names or formulas, showing reactants → products.

A chemical equation is a written representation of a chemical reaction.

Structure:
\`\`\`
reactants → products
\`\`\`

- **Reactants** are on the left of the arrow (substances that react)
- **Products** are on the right (new substances formed)
- A **+** symbol separates multiple reactants or products
- The **arrow** means "reacts to form"

## Three Types of Equation

| Type | Uses | Balanced? |
|------|------|-----------|
| Word Equations | Chemical names | N/A |
| Formula Equations | Chemical formulas | No |
| Balanced Equations | Chemical formulas | Yes |

## Revision Questions

1. What does the arrow in a chemical equation represent?
2. Which side of the equation holds the reactants?
3. Name the three types of chemical equation in order of complexity.`,
  },
  {
    id: "balanced-equations",
    title: "Balanced Equations",
    subject: "Chemistry",
    filePath: "Notes/Balanced Equations.md",
    tags: ["chemistry", "equations"],
    wordCount: 120,
    headings: ["Balancing Steps", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A balanced equation uses chemical formulas AND adjusts coefficients so the number of each type of atom is equal on both sides.

A balanced equation satisfies the Law of Conservation of Mass by ensuring atom counts match on both sides.

**How to balance:** Add **coefficients** (numbers in front of formulas) — never change the subscripts inside a formula.

**Example:**
| Step | Equation |
|------|----------|
| Formula (unbalanced) | Ca(OH)₂ + H₂SO₄ → CaSO₄ + H₂O |
| Balanced | Ca(OH)₂ + H₂SO₄ → CaSO₄ + **2**H₂O |

## Balancing Steps

1. Write the formula equation
2. Count atoms of each element on each side
3. Add/adjust coefficients (never subscripts) until counts match
4. Recount to verify

## Revision Questions

1. What is a coefficient in a balanced equation?
2. Why must you never change the subscript when balancing?
3. Balance: H₂ + O₂ → H₂O
4. What law makes balancing a requirement?`,
  },
  {
    id: "law-conservation-mass",
    title: "Law of Conservation of Mass",
    subject: "Chemistry",
    filePath: "Notes/Law of Conservation of Mass.md",
    tags: ["chemistry", "equations", "fundamental-laws"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Matter cannot be created or destroyed — the total mass of reactants must equal the total mass of products in any chemical reaction.

The Law of Conservation of Mass states:

> Matter cannot be created or destroyed in a chemical reaction.

This means every atom present in the reactants must appear somewhere in the products. No atoms disappear; no new atoms appear from nowhere.

**Consequence for equations:** the total mass of **reactants = total mass of products**. This is why chemical equations must be balanced — an unbalanced equation violates this law.

**Example:** Ca(OH)₂ + H₂SO₄ → CaSO₄ + 2H₂O — count Ca, O, H, S on both sides — they all match.

## Revision Questions

1. State the Law of Conservation of Mass in one sentence.
2. Why does this law require chemical equations to be balanced?
3. If 10g of reactants undergo a reaction, what is the total mass of products?`,
  },
  {
    id: "reaction-rate",
    title: "Reaction Rate",
    subject: "Chemistry",
    filePath: "Notes/Reaction Rate.md",
    tags: ["chemistry", "kinetics", "rates"],
    wordCount: 110,
    headings: ["Factors That Affect Reaction Rate", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Reaction rate measures how fast a chemical reaction proceeds — tracked by how quickly products form or reactants disappear over time.

Reaction rate is a measure of how fast a chemical reaction happens.

It can be measured by:
- The **increase in products** over time
- The **decrease in reactants** over time

## Factors That Affect Reaction Rate

Five main factors — each works through collision theory:

1. **Concentration** — more particles in the same volume = more collisions
2. **Surface area** — more exposed surface = more collisions possible
3. **Temperature** — more energy = more frequent and more energetic collisions
4. **Agitation** — mixing speeds up contact between particles
5. **Catalysts** — lower the activation energy needed for a collision to succeed

## Revision Questions

1. How is reaction rate measured in terms of reactants and products?
2. Name four factors that can increase reaction rate.
3. What is the difference between average and instantaneous rate?`,
  },
  {
    id: "collision-theory",
    title: "Collision Theory",
    subject: "Chemistry",
    filePath: "Notes/Collision Theory.md",
    tags: ["chemistry", "kinetics", "rates"],
    wordCount: 120,
    headings: ["How Each Factor Links to Collision Theory", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Reactions only happen when particles collide with enough energy and the correct orientation — anything that increases the frequency or energy of collisions increases the reaction rate.

Collision theory explains why chemical reactions happen and why reaction rates vary.

Two conditions must be met for a collision to result in a reaction:
1. Particles must actually **collide** (make contact)
2. The collision must have enough **energy** — at or above the **activation energy**

## How Each Factor Links to Collision Theory

| Factor | How it increases collisions |
|--------|----------------------------|
| Concentration | More particles per volume → more frequent collisions |
| Surface Area | More exposed area → more particles available to collide |
| Temperature | More kinetic energy → faster particles, more energetic collisions |
| Agitation | Mixing brings particles into contact faster |
| Catalysts | Lower activation energy → more collisions have enough energy to react |

## Revision Questions

1. State the two conditions a collision must meet to result in a reaction.
2. What is "activation energy"?
3. Using collision theory, explain why increasing concentration speeds up a reaction.`,
  },
  {
    id: "catalysts",
    title: "Catalysts",
    subject: "Chemistry",
    filePath: "Notes/Catalysts.md",
    tags: ["chemistry", "kinetics", "rates"],
    wordCount: 110,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A catalyst speeds up a reaction by lowering the activation energy needed, and is not consumed in the process — it can be used repeatedly.

A catalyst increases reaction rate without being permanently changed or consumed by the reaction.

Key properties:
- **Not used up** — the catalyst is the same at the end as the beginning
- **Lowers activation energy** — more collisions now have enough energy to result in a reaction
- Written **above the arrow** in a chemical equation (not as a reactant or product)

**Example:** H₂O₂(aq) → (catalyst) → H₂O(l) + O₂(g)
The catalyst (e.g. manganese dioxide) causes hydrogen peroxide to decompose faster but is not consumed.

Enzymes are biological catalysts — a specific type of catalyst found in living organisms.

## Revision Questions

1. What happens to a catalyst during and after a reaction?
2. How do catalysts increase reaction rate at a particle level?
3. Where is a catalyst written in a chemical equation?
4. Give one industrial and one biological example of catalysis.`,
  },
  {
    id: "exothermic-reactions",
    title: "Exothermic Reactions",
    subject: "Chemistry",
    filePath: "Notes/Exothermic Reactions.md",
    tags: ["chemistry", "energy", "reactions"],
    wordCount: 110,
    headings: ["Common Examples", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Exothermic reactions release energy as heat — the products have less chemical potential energy than the reactants, and the surroundings get warmer.

In an exothermic reaction, chemical energy stored in the reactants is converted to **heat energy** and released to the surroundings.

Key indicators:
- Products have **less** chemical potential energy than reactants
- **Temperature of the surroundings increases** (feels warm/hot)
- Energy is released, not absorbed

On an energy diagram, the products sit **lower** than the reactants — the difference is the energy released.

## Common Examples

- Combustion (burning fuel)
- Respiration (cells releasing energy from glucose)
- Hand warmers
- Neutralisation reactions

Compare with endothermic reactions, where energy is absorbed and temperature drops.

## Revision Questions

1. In an exothermic reaction, do products have more or less energy than reactants?
2. What happens to the temperature of the surroundings in an exothermic reaction?
3. Give two real-world examples of exothermic reactions.`,
  },
  {
    id: "endothermic-reactions",
    title: "Endothermic Reactions",
    subject: "Chemistry",
    filePath: "Notes/Endothermic Reactions.md",
    tags: ["chemistry", "energy", "reactions"],
    wordCount: 110,
    headings: ["Common Examples", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Endothermic reactions absorb heat energy from the surroundings — the products store more chemical potential energy than the reactants, and the surroundings get cooler.

In an endothermic reaction, heat energy is absorbed from the surroundings and stored as chemical potential energy in the products.

Key indicators:
- Products have **more** chemical potential energy than reactants
- **Temperature of the surroundings decreases** (feels cold)
- Energy is absorbed, not released

On an energy diagram, the products sit **higher** than the reactants — the difference is the energy absorbed.

## Common Examples

- Photosynthesis (plants absorbing light energy)
- Dissolving ammonium nitrate in water (cold packs)
- Thermal decomposition reactions

Compare with exothermic reactions, where energy is released and temperature rises.

## Revision Questions

1. In an endothermic reaction, do products have more or less energy than reactants?
2. What happens to the temperature of the surroundings during an endothermic reaction?
3. Give two real-world examples of endothermic reactions.`,
  },
  {
    id: "types-chemical-reactions",
    title: "Types of Chemical Reactions",
    subject: "Chemistry",
    filePath: "Notes/Types of Chemical Reactions.md",
    tags: ["chemistry", "reactions"],
    wordCount: 120,
    headings: ["Tips for Identification", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Chemical reactions fall into four main patterns — composition, decomposition, single displacement, and double displacement.

All chemical reactions can be categorised by how atoms are rearranged:

| Type | What Happens | Pattern |
|------|-------------|---------|
| **Composition** | Two or more substances combine into one | A + B → AB |
| **Decomposition** | One substance breaks into two or more | AB → A + B |
| **Single Displacement** | One element replaces another in a compound | A + BC → AC + B |
| **Double Displacement** | Two compounds swap partners | AB + CD → AD + CB |

## Tips for Identification

- If substances **combine**: composition
- If one substance **splits**: decomposition
- If a **free element** reacts with a compound: single displacement
- If **two compounds** react and swap: double displacement

## Revision Questions

1. Write the general pattern for a double displacement reaction.
2. Identify the reaction type: 2H₂O → 2H₂ + O₂
3. Identify the reaction type: Zn + CuSO₄ → ZnSO₄ + Cu
4. How do you distinguish single from double displacement?`,
  },
  {
    id: "enzymes",
    title: "Enzymes",
    subject: "Chemistry",
    filePath: "Notes/Enzymes.md",
    tags: ["chemistry", "biology", "kinetics", "catalysts"],
    wordCount: 110,
    headings: ["Examples", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Enzymes are biological catalysts — proteins that speed up specific chemical reactions in living organisms without being consumed.

Enzymes are a specialised type of catalyst found in living systems.

Key properties:
- Made of **protein**
- **Specific** — each enzyme catalyses only one particular reaction (or type of reaction)
- **Not consumed** — like all catalysts, they are reusable
- Speed up **biological reactions** that would otherwise be too slow at body temperature

## Examples

- Amylase (in saliva) — breaks down starch into sugars
- DNA polymerase — catalyses DNA replication
- Digestive enzymes — break down proteins, fats, carbohydrates

## Revision Questions

1. What is the relationship between an enzyme and a catalyst?
2. Why are enzymes described as "specific"?
3. Give two examples of enzymes and the reactions they catalyse.
4. Why does the body need enzymes if reactions could happen without them?`,
  },

  // ─── PHYSICS ───────────────────────────────────────────────────────────────
  {
    id: "scalars-vectors",
    title: "Scalars and Vectors",
    subject: "Physics",
    filePath: "Notes/Scalars and Vectors.md",
    tags: ["physics", "motion", "fundamentals"],
    wordCount: 110,
    headings: ["Why It Matters", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Scalars have magnitude only; vectors have magnitude and direction — the distinction determines which formulas apply and how quantities combine.

All physical quantities are either scalars or vectors.

| Type | Has magnitude? | Has direction? | Examples |
|------|---------------|----------------|---------|
| **Scalar** | Yes | No | time, distance, speed, volume, temperature, mass |
| **Vector** | Yes | Yes | displacement, velocity, acceleration, force, momentum |

## Why It Matters

Scalars add simply: 5m + 5m = 10m.

Vectors must account for direction: walking 5m north then 5m south gives displacement = 0m, not 10m.

Speed is a scalar; velocity is a vector. That's why you can have a constant speed but a changing velocity (e.g. going around a corner at steady speed).

Acceleration is a vector — it has direction, which is why decelerating is just acceleration in the opposite direction.

## Revision Questions

1. What is the difference between a scalar and a vector?
2. Classify: speed, velocity, force, temperature, displacement, mass.
3. A car drives in a circle at constant speed — is its velocity constant? Why?`,
  },
  {
    id: "force",
    title: "Force",
    subject: "Physics",
    filePath: "Notes/Force.md",
    tags: ["physics", "motion", "forces"],
    wordCount: 100,
    headings: ["Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** A force is a push or pull acting on an object — it can set a stationary object in motion or change the speed or direction of a moving one.

A force is a push or pull that acts on an object. Forces are **vectors** — they have both magnitude and direction.

What a force can do:
- Cause a **resting object to move**
- **Accelerate** a moving object — by increasing its speed
- **Decelerate** a moving object — by decreasing its speed
- Change the **direction** of a moving object

Forces are represented by arrows: the arrow's direction shows the direction of the force; its length represents the magnitude.

Multiple forces acting on an object combine to produce a **net force** (resultant force). If forces are balanced, the object remains stationary or continues at constant velocity.

## Revision Questions

1. Define force in one sentence.
2. Is force a scalar or a vector? What does that mean?
3. A moving object changes direction but not speed — is a force acting on it?
4. What happens to an object when the net force on it is zero?`,
  },
  {
    id: "distance-displacement",
    title: "Distance and Displacement",
    subject: "Physics",
    filePath: "Notes/Distance and Displacement.md",
    tags: ["physics", "motion"],
    wordCount: 110,
    headings: ["Example: Baseball diamond", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Distance is how far you travel in total; displacement is how far and in what direction you end up from your starting point.

| | Distance | Displacement |
|---|---|---|
| What it measures | Total path length travelled | Straight-line change in position from start to end |
| Direction? | No | Yes |
| Type | **Scalar** | **Vector** |
| Unit | metres (m) | metres (m) + direction |

## Example: Baseball diamond

Running three sides of the diamond (90 ft each):
- **Distance** = 270 ft (total path)
- **Displacement** = 90 ft (straight-line from start to current position)

If you return to where you started:
- Distance = the full journey length
- Displacement = **zero** (start and end at same point)

## Revision Questions

1. A runner completes a full lap of a 400m track. What is their distance? What is their displacement?
2. Why is displacement a vector but distance is a scalar?
3. Can displacement ever be greater than distance? Explain.`,
  },
  {
    id: "speed",
    title: "Speed",
    subject: "Physics",
    filePath: "Notes/Speed.md",
    tags: ["physics", "motion"],
    wordCount: 110,
    headings: ["Formula", "Instantaneous vs Average Speed", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Speed is the distance an object travels per unit of time — a scalar quantity measured in m/s.

Speed measures how fast an object is moving, without regard to direction. It is a **scalar**.

## Formula

s = d / t

| Symbol | Quantity | Unit |
|--------|----------|------|
| s | speed | metres per second (m/s) |
| d | distance | metres (m) |
| t | time | seconds (s) |

Formula triangle — cover what you want to find:
- Speed: s = d / t
- Distance: d = s × t
- Time: t = d / s

## Instantaneous vs Average Speed

- **Instantaneous speed** — speed at one specific moment in time
- **Average speed** — total distance / total time for a whole journey

## Revision Questions

1. State the formula for speed and give the units.
2. A car travels 150m in 10s. What is its speed?
3. What is the difference between average and instantaneous speed?`,
  },
  {
    id: "velocity",
    title: "Velocity",
    subject: "Physics",
    filePath: "Notes/Velocity.md",
    tags: ["physics", "motion"],
    wordCount: 110,
    headings: ["Formula", "Velocity vs Speed", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Velocity is speed in a given direction — a vector quantity that can change even when speed stays constant.

Velocity is the rate at which displacement changes. It is a **vector** — it has both magnitude and direction.

## Formula

v = Δs / Δt = displacement / time

Units: metres per second (m/s) with a stated direction.

## Velocity vs Speed

| | Speed | Velocity |
|---|---|---|
| Type | Scalar | Vector |
| Measures | Rate of distance | Rate of displacement |
| Direction? | No | Yes |

A car going around a roundabout at a constant 30 mph has **constant speed** but **changing velocity** — because its direction keeps changing.

## Revision Questions

1. What is the difference between velocity and speed?
2. Can an object have constant speed but changing velocity? Give an example.
3. A ball is thrown upward then caught — what is its average velocity for the trip?`,
  },
  {
    id: "acceleration",
    title: "Acceleration",
    subject: "Physics",
    filePath: "Notes/Acceleration.md",
    tags: ["physics", "motion"],
    wordCount: 120,
    headings: ["Formula", "Worked Example", "On a Velocity-Time Graph", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Acceleration is the rate of change of velocity — a vector measured in m/s², calculated as (v - u) / t.

Acceleration measures how quickly velocity changes. It is a **vector**.

## Formula

a = (v - u) / t

| Symbol | Quantity | Unit |
|--------|----------|------|
| a | acceleration | metres per second per second (m/s² or ms⁻²) |
| v | final velocity | m/s |
| u | initial velocity | m/s |
| t | time | seconds (s) |

**Deceleration** is simply acceleration in the opposite direction (negative value).

## Worked Example: Usain Bolt

Top speed: 12.42 m/s. Time to reach it: 8s. Starting from rest (u = 0).
a = (12.42 - 0) / 8 = **1.55 ms⁻²**

## On a Velocity-Time Graph

Acceleration = the **gradient** of a velocity-time graph.
- Positive gradient = acceleration
- Negative gradient = deceleration
- Flat line = constant velocity (zero acceleration)

## Revision Questions

1. State the formula for acceleration with units for each symbol.
2. A car goes from 0 to 27.8 m/s in 10s. Calculate its acceleration.
3. What does a negative acceleration value mean physically?
4. How do you find acceleration from a velocity-time graph?`,
  },
  {
    id: "acceleration-gravity",
    title: "Acceleration Due to Gravity",
    subject: "Physics",
    filePath: "Notes/Acceleration Due to Gravity.md",
    tags: ["physics", "motion", "forces", "gravity"],
    wordCount: 100,
    headings: ["Using g in Calculations", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Any object in free fall near Earth's surface accelerates at 9.8 m/s² downward — regardless of its mass.

When an object falls freely (no air resistance), Earth's gravity causes it to accelerate downward at a constant rate.

**g = 9.8 ms⁻²** (at Earth's surface)

This value is the same for all objects regardless of mass — a feather and a hammer fall at the same rate in a vacuum (demonstrated on the Moon by Apollo 15).

| g-force | Acceleration |
|---------|-------------|
| 1g | 9.8 ms⁻² |
| 2g | ~19.6 ms⁻² |
| 3g | ~29.4 ms⁻² |

## Using g in Calculations

g acts as the value for **a** in the formula a = (v - u) / t when dealing with free-fall problems. Starting from rest (u = 0), after 3 seconds of free fall: v = 9.8 × 3 = 29.4 m/s downward.

## Revision Questions

1. What is the value of g at Earth's surface and what are its units?
2. Does a heavier object fall faster than a lighter one? Explain.
3. An object is dropped from rest. What is its speed after 4 seconds?`,
  },
  {
    id: "distance-time-graphs",
    title: "Distance-Time Graphs",
    subject: "Physics",
    filePath: "Notes/Distance-Time Graphs.md",
    tags: ["physics", "motion", "graphs"],
    wordCount: 120,
    headings: ["Reading the Graph", "Calculating Speed from the Graph", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** On a distance-time graph, the gradient equals speed — a steeper line means faster, a flat line means stationary, a curve means changing speed.

A distance-time graph plots distance on the y-axis and time on the x-axis.

## Reading the Graph

| Line shape | What it means |
|------------|---------------|
| Straight line (any slope) | Constant speed |
| Steeper straight line | Faster constant speed |
| Shallower straight line | Slower constant speed |
| Horizontal (flat) line | Stationary (not moving) |
| Curved line (concave up) | Speeding up (accelerating) |
| Curved line (concave down) | Slowing down (decelerating) |

## Calculating Speed from the Graph

Speed = gradient = rise / run = change in distance / change in time

s = Δd / Δt

## Revision Questions

1. What does a horizontal line on a distance-time graph represent?
2. How do you calculate speed from a distance-time graph?
3. What does a steeper gradient tell you about the speed?
4. Sketch the distance-time graph for: walk 200m in 4 min, wait 2 min, run 400m in 2 min.`,
  },
  {
    id: "velocity-time-graphs",
    title: "Velocity-Time Graphs",
    subject: "Physics",
    filePath: "Notes/Velocity-Time Graphs.md",
    tags: ["physics", "motion", "graphs"],
    wordCount: 130,
    headings: ["Reading the Graph", "Calculating Acceleration", "Calculating Displacement", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** On a velocity-time graph, gradient = acceleration and area under the line = displacement — two powerful tools in one graph.

A velocity-time graph plots velocity on the y-axis and time on the x-axis. More powerful than distance-time graphs because you can extract both acceleration and displacement.

## Reading the Graph

| Line shape | What it means |
|------------|---------------|
| Positive gradient | Accelerating (speeding up) |
| Negative gradient | Decelerating (slowing down) |
| Flat (horizontal) line | Constant velocity |
| Line at v = 0 | Stationary |

## Calculating Acceleration (Gradient)

a = Δv / Δt = gradient of the line

## Calculating Displacement (Area Under the Line)

displacement = area under the velocity-time graph

- Rectangle area = base × height
- Triangle area = ½ × base × height

## Revision Questions

1. What does a negative gradient on a v-t graph represent physically?
2. A v-t graph shows a straight line from v=0 to v=20 m/s over 5 seconds. Calculate the acceleration.
3. Using the same graph, calculate the displacement for those 5 seconds.
4. What would the v-t graph look like for an object moving at constant velocity?`,
  },
  {
    id: "instantaneous-average-speed",
    title: "Instantaneous vs Average Speed",
    subject: "Physics",
    filePath: "Notes/Instantaneous vs Average Speed.md",
    tags: ["physics", "motion"],
    wordCount: 110,
    headings: ["Instantaneous", "Average", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Instantaneous speed/velocity is measured at one moment; average speed uses total distance over total time.

## Instantaneous

Instantaneous speed/velocity is how fast an object is moving at a **single point in time**.
- What a speedometer reads
- Speed and velocity are equal in magnitude at any instant

## Average

**Average speed** = total distance / total time
**Average velocity** = total displacement / total time

These can differ significantly:
- A car that drives 100km in 1 hour has an **average speed** of 100 km/h but at no single point was necessarily going exactly that speed.
- A runner who goes around a 400m track in 80s and returns to the start has average speed = 5 m/s but average **velocity** = 0 (zero displacement).

Average speed uses **distance** (scalar); average velocity uses **displacement** (vector).

## Revision Questions

1. What does a car's speedometer show — instantaneous or average speed?
2. A journey covers 60km in 45 minutes. Calculate the average speed in m/s.
3. Someone runs a full lap of a 400m track in 80s. State their average speed and average velocity.`,
  },

  // ─── HISTORY ───────────────────────────────────────────────────────────────
  {
    id: "treaty-versailles",
    title: "Treaty of Versailles",
    subject: "History",
    filePath: "Notes/History — Treaty of Versailles.md",
    tags: ["history", "WWI", "treaty"],
    wordCount: 250,
    headings: ["Key Terms", "What Germany Lost", "The Stab in the Back Myth", "Reactions", "Why It Matters", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The Treaty of Versailles (1919) ended WWI by punishing Germany — forcing it to accept war guilt, pay massive reparations, lose territory, and disarm.

## Key Terms

| Term | Meaning |
|---|---|
| **War Guilt Clause** | Article 231 — Germany forced to accept full responsibility for causing WWI |
| **Reparations** | Financial compensation paid by Germany to the Allies — £6.6 billion |
| **Demilitarisation** | Army capped at 100,000 men; no air force; navy drastically reduced |
| **Territorial losses** | Germany lost 13% of territory, including Alsace-Lorraine (to France) |
| **League of Nations** | International peacekeeping body proposed by Wilson |

## What Germany Lost

- **13%** of its territory
- **10%** of its population
- **13%** of its economic productivity
- **75%** of its iron ore deposits
- **26%** of its coal
- All overseas colonies
- Army reduced to 100,000

## The Stab in the Back Myth

Many Germans believed their troops had not been defeated on the battlefield — instead, they had been "stabbed in the back" by traitors, communists, and pacifists at home. Hitler exploited this myth to justify his rise to power.

## Reactions

- Germany: outrage, humiliation, resentment
- France: wanted it harsher — still feared Germany
- Britain: somewhere in between
- USA: Senate rejected the treaty entirely
- Australia: broadly supportive — Billy Hughes pushed for harsh terms

## Why It Matters

The Treaty created the conditions for WWII:
- German resentment fuelled the rise of the Nazis
- Economic devastation → hyperinflation → Great Depression hit harder
- The "unfair" peace gave Hitler a powerful propaganda tool

## Revision Questions

1. What were the five main terms of the Treaty of Versailles?
2. Why did Germany find the War Guilt Clause particularly humiliating?
3. How does Henig argue the treaty was actually moderate?
4. What is the connection between the Treaty and the outbreak of WWII?`,
  },
  {
    id: "attitudes-treaty",
    title: "Attitudes to the Treaty of Versailles",
    subject: "History",
    filePath: "Notes/History — Attitudes to the Treaty of Versailles.md",
    tags: ["history", "WWI", "treaty"],
    wordCount: 280,
    headings: ["Britain", "France", "USA", "Australia", "Germany", "Key Figures Summary", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Every major power had a different view of the Treaty. France wanted Germany crushed. The USA wanted a fair peace. Germany felt betrayed. Australia wanted punishment.

## Britain

- Germany was a potential future trading partner
- Lloyd George worried a too-harsh treaty would push Germany toward communism
- Agreed Germany should pay reparations but concerned French attitudes were too harsh
- **Key figure:** PM David Lloyd George — seen as a hero by most Britons

## France

- Viewed the treaty as a way to permanently cripple Germany
- Germany should be crippled, lose large amounts of land
- France had land borders with Germany — far more concerned about future threat
- **Key figure:** Georges Clemenceau — pragmatist, wanted to destroy German power

## USA

- Wilson's Fourteen Points emphasised self-determination and a fair peace
- Strong support for the League of Nations
- **Outcome:** The US Senate rejected the Treaty — a catastrophic blow to Wilson's vision
- **Key figure:** President Woodrow Wilson — idealist, wanted peace and unity

## Australia

- Enthusiastic support for harsh terms
- Wanted Germany's colonies taken away (Australia gained German New Guinea)
- **Key figure:** PM Billy Hughes — pushed hard for harsh terms, broadly satisfied

## Germany

- Outrage and humiliation — expected a peace based on Wilson's Fourteen Points
- Forced to accept sole responsibility (War Guilt Clause)
- Reparations seen as designed to cripple the economy
- "Stab in the back" myth spread

## Key Figures Summary

| Figure | Country | Position |
|---|---|---|
| Woodrow Wilson | USA | Idealist — fair peace, self-determination |
| Georges Clemenceau | France | Pragmatist — cripple Germany, prevent future war |
| David Lloyd George | Britain | Middle ground — firm but not excessive |
| Billy Hughes | Australia | Hawk — Germany should pay heavily |

## Revision Questions

1. Why did France want harsher terms than Britain?
2. Why did the US Senate reject the treaty?
3. How did Australia's position differ from the USA's?
4. How did German reaction to the Treaty contribute to the rise of Hitler?`,
  },
  {
    id: "league-of-nations",
    title: "League of Nations",
    subject: "History",
    filePath: "Notes/History — League of Nations.md",
    tags: ["history", "WWI", "league of nations"],
    wordCount: 240,
    headings: ["What Was It?", "Fatal Weaknesses", "Key Failures", "Why the USA Didn't Join", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The League of Nations was Woodrow Wilson's vision for collective security after WWI — but it was fatally weakened when the US Senate refused to join, and it ultimately failed to stop WWII.

## What Was It?

The League of Nations was an international organisation established after WWI (1920) to:
- Maintain world peace through collective security
- Settle disputes between nations through negotiation
- Prevent future wars by punishing aggressors

Proposed by Woodrow Wilson as part of his Fourteen Points, written into the Treaty of Versailles.

## Fatal Weaknesses

| Weakness | Impact |
|---|---|
| **USA didn't join** | Senate refused to ratify the treaty — crippled the League's credibility |
| **No enforcement power** | The League could condemn countries but had no army |
| **Not universal** | Germany, Russia initially excluded |
| **Slow and unanimous** | Decisions required full agreement |

## Key Failures

- **1931 — Manchuria:** Japan invaded Manchuria. The League sent a letter. Japan left the League.
- **1935 — Abyssinia:** Italy invaded Abyssinia. The League imposed weak sanctions. Italy ignored them.
- **1936 — Rhineland:** Germany remilitarised the Rhineland. The League did nothing.

Each failure emboldened Hitler further.

## Why the USA Didn't Join

- Republican-controlled Senate opposed Democratic President Wilson
- Isolationist sentiment — Americans didn't want to be dragged into European wars
- Concerns about surrendering US sovereignty
- Wilson refused to compromise → Senate voted it down

## Revision Questions

1. Who proposed the League of Nations and why?
2. Why was the USA's absence so damaging to the League?
3. Give two specific examples where the League failed to stop aggression.
4. How did the League's failures contribute to WWII?`,
  },
  {
    id: "rise-of-hitler",
    title: "Rise of Hitler",
    subject: "History",
    filePath: "Notes/History — Rise of Hitler.md",
    tags: ["history", "hitler", "nazi", "germany"],
    wordCount: 380,
    headings: ["Timeline", "Why the Weimar Republic Failed", "Hitler's Ideology", "The Enabling Act", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Hitler rose to power through Germany's humiliation after WWI, economic devastation from the Great Depression, weak democratic institutions, and his own ruthless political skill. By 1933 he was Chancellor; by 1934 he was dictator.

## Timeline

| Date | Event |
|---|---|
| 1919 | Treaty of Versailles signed — Germany humiliated |
| 1919 | Weimar Republic established |
| 1923 | Munich Beer Hall Putsch — Hitler's failed coup |
| 1923 | Hyperinflation devastated Germany |
| 1924 | Hitler wrote Mein Kampf in prison |
| 1929 | Wall Street Crash → Great Depression |
| 1932 | Nazis became largest party in the Reichstag |
| 1933 | Hitler appointed Chancellor of Germany |
| 1933 | Enabling Act passed — democracy ended |
| 1934 | Hitler declared himself Führer after Hindenburg's death |
| 1935 | Nuremberg Laws — stripped Jews of citizenship |
| 1936 | Germany remilitarised the Rhineland |
| 1938 | Anschluss — Germany annexed Austria |
| 1938 | Munich Agreement — Sudetenland given to Hitler |
| Sept 1939 | Germany invaded Poland → WWII began |

## Why the Weimar Republic Failed

- Born in defeat (1918) — associated with the humiliation of Versailles
- Hyperinflation (1923) destroyed middle-class savings
- Depression (1929–32) caused mass unemployment
- Political extremists fought in the streets
- The Enabling Act legally abolished democracy

## Hitler's Ideology (Mein Kampf)

- **Lebensraum** — "living space" — Germany needed to expand east
- **Antisemitism** — Jews were blamed for all of Germany's problems
- **Reverse the Treaty of Versailles** — restore German greatness
- **Racial hierarchy** — Aryan supremacy
- **Anti-communism** — communist USSR was Germany's main enemy

## The Enabling Act (1933)

- Passed by the Reichstag (with Nazi intimidation and pressure)
- Allowed Hitler to make laws without parliamentary approval
- Effectively ended the Weimar Republic
- Hitler was now legally a dictator

## Revision Questions

1. How did the Great Depression help Hitler rise to power?
2. What was the Enabling Act and why was it significant?
3. How did Hitler's ideology (Mein Kampf) shape his later actions?
4. Why did the Weimar Republic fail to stop Hitler?`,
  },
  {
    id: "causes-wwii",
    title: "Causes of WWII",
    subject: "History",
    filePath: "Notes/History — Causes of WWII.md",
    tags: ["history", "WWII", "causes"],
    wordCount: 320,
    headings: ["Diamond Nine — Most Important Causes", "Policy of Appeasement", "Nazi-Soviet Non-Aggression Pact", "The Munich Agreement", "Steps to War", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** WWII had no single cause — it was the product of a decade of compounding failures: a resentful Germany, collapsed economy, weak institutions, appeasing democracies, and Hitler's unchecked aggression.

## Diamond Nine — Most Important Causes

1. Treaty of Versailles — created German resentment, gave Hitler propaganda
2. The Great Depression — destroyed the German economy, drove people to extremism
3. Hitler's Foreign Policy Aims — Lebensraum, reversing Versailles
4. Failure of the League of Nations — no enforcement, USA absent
5. Policy of Appeasement — Britain and France gave Hitler what he wanted
6. The Nazi-Soviet Pact — removed Hitler's fear of a two-front war
7. The Sudetenland Crisis — appeasement reached its peak
8. The Anschluss with Austria — no consequences
9. The Munich Agreement — Chamberlain gave Hitler the Sudetenland

## Policy of Appeasement

Britain and France repeatedly chose not to confront Hitler:
- **Why:** War-weary; hoped Hitler could be satisfied; feared communism more than fascism
- 1936: Germany remilitarised the Rhineland — no response
- 1938: Munich Agreement — gave Hitler the Sudetenland
- **The result:** Each concession convinced Hitler he could go further

## Nazi-Soviet Non-Aggression Pact (August 1939)

- Ideological enemies suddenly agreeing not to fight
- Hitler needed to avoid a two-front war before invading Poland
- Removed Hitler's last reason to hesitate — he invaded Poland 8 days later

## The Munich Agreement (September 1938)

- Hitler demanded the Sudetenland
- Chamberlain and France met Hitler — without Czechoslovakia present
- Gave Hitler the Sudetenland for a promise of no further demands
- March 1939: Germany invaded the rest of Czechoslovakia — the promise was worthless

## Steps to War — Key Dates

| Date | Event |
|---|---|
| 1933 | Hitler became Chancellor; Enabling Act passed |
| 1936 | Rhineland remilitarised |
| 1938 | Anschluss — Austria annexed |
| 1938 | Munich Agreement |
| Sept 1939 | Germany invaded Poland |
| 3 Sept 1939 | Britain and France declared war |

## Revision Questions

1. What was the Policy of Appeasement and why did Britain and France pursue it?
2. Why was the Nazi-Soviet Pact such a shock?
3. How did the Munich Agreement fail?
4. Rank the causes of WWII and justify your top three.`,
  },
  {
    id: "nazi-propaganda",
    title: "Nazi Propaganda",
    subject: "History",
    filePath: "Notes/History — Nazi Propaganda.md",
    tags: ["history", "nazi", "propaganda"],
    wordCount: 260,
    headings: ["What Is Propaganda?", "The 5 Key Messages", "Key Techniques", "Josef Goebbels", "Why It Worked", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Nazi propaganda was a systematic, state-run campaign to dehumanise enemies, manufacture loyalty, and justify violence. Goebbels orchestrated it across every medium.

## What Is Propaganda?

Propaganda is any form of advertising commissioned by and/or in service of a government. Nazi Germany used it to:
- **Dehumanise "enemies"** (Jews, communists, Roma, disabled people)
- **Manufacture mass support** for the Nazi regime
- **Justify violence** against those deemed "inferior"

## The 5 Key Messages

Every piece of Nazi propaganda pushed one or more of these:

1. **The Friend/Enemy Distinction** — "Us and Them." Germans vs. the "other."
2. **The overwhelming power of the Nazi Party** — strength, inevitability, destiny.
3. **The persecution of Germans by "the other"** — Jews and communists had stabbed Germany in the back.
4. **The evil/weakness of "the other"** — Jews portrayed as cowardly, greedy, subhuman.
5. **Might Makes Right** — violence is justified in service of the Volk.

## Key Techniques

- **Caricature** — exaggerating physical or cultural features to mock or dehumanise
- **Repetition** — the same messages hammered constantly across all media
- **Emotional appeals** — fear, pride, anger, hope — never reason
- **Film** — Triumph of the Will (Riefenstahl, 1935) presented Hitler as a messianic figure
- **Radio** — Hitler spoke directly into German living rooms

## Josef Goebbels

- Chief Minister of Propaganda in the Nazi Party
- Master of political messaging and media manipulation
- Used classic friend/enemy rhetoric, blamed communists and Jews, presented Nazis as Germany's only salvation

## Why It Worked

- Germans were desperate after the Depression
- Goebbels controlled all media — alternative viewpoints were banned
- Mass rallies (Nuremberg) created overwhelming emotional experiences
- Children were indoctrinated from a young age

## Revision Questions

1. What are the five key messages of Nazi propaganda? Give an example of each.
2. How did Goebbels use film and radio differently from posters?
3. Why was the "Us and Them" message so effective in 1930s Germany?
4. How does Nazi propaganda connect to the Holocaust?`,
  },
  {
    id: "holocaust",
    title: "The Holocaust — Six Stages",
    subject: "History",
    filePath: "Notes/History — The Holocaust — Six Stages.md",
    tags: ["history", "holocaust", "WWII"],
    wordCount: 380,
    headings: ["Stage 1 — Definition", "Stage 2 — Isolation", "Stage 3 — Emigration", "Stage 4 — Ghettoisation", "Stage 5 — Deportation", "Stage 6 — Mass Murder", "The Nuremberg Laws", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The Holocaust was the systematic, state-organised genocide of six million Jews (and five million others) by Nazi Germany between 1933–1945. It escalated through six deliberate stages.

## Stage 1 — Definition (1933–1935)

Jews are defined as "inferior" through legalised discrimination.
- **Nuremberg Laws** (1935) legally defined who was a Jew
- Jews stripped of German citizenship
- Propaganda portrayed Jews as dangerous, greedy, subhuman

## Stage 2 — Isolation (1935–1938)

Once labelled as Jews, people are separated from mainstream society.
- Jews barred from German schools, universities, public parks
- Jewish businesses forcibly taken over
- Jewish doctors and lawyers lost their licences

## Stage 3 — Emigration (1938)

Jews are encouraged/pressured/forced to leave Germany.
- Jews could get exit visas — but had to leave all property behind
- **Kristallnacht** (November 9–10, 1938) — nationwide pogrom; ~30,000 Jews sent to concentration camps; ~7,500 businesses destroyed

## Stage 4 — Ghettoisation (1939–1942)

Jews forcibly removed to walled-off sections of Eastern European cities.
- Overcrowded, filthy, disease-ridden conditions
- Food was deliberately scarce — starvation was common
- The largest ghetto was the **Warsaw Ghetto** (400,000 people)

## Stage 5 — Deportation (1942–1944)

Jews transported from ghettos to concentration camps and death camps.
- **Concentration camps:** forced labour; prisoners worked until they died
- **Death camps:** built specifically to kill large numbers efficiently
- Key death camps: Auschwitz-Birkenau, Treblinka, Sobibor, Belzec

## Stage 6 — Mass Murder (1942–1945)

Systematic genocide on an industrial scale.
- ~**11 million civilians** murdered total: 6 million Jews + 5 million others
- Methods: shooting, gas chambers, starvation, disease, forced labour
- At Auschwitz alone: ~1.1 million killed
- **Wannsee Conference** (January 1942) formalised the "Final Solution"

## The Nuremberg Laws (1935)

- Banned marriage between Jews and Germans
- Stripped Jews of German citizenship — they became "subjects" with no rights

## Revision Questions

1. What were the Nuremberg Laws? Give one specific example of what they prohibited.
2. What was Kristallnacht and why did it mark an escalation?
3. Define: Ghetto, Concentration Camp, Extermination Camp.
4. How many people were killed in the Holocaust? How many were Jewish?`,
  },
  {
    id: "great-depression",
    title: "The Great Depression",
    subject: "History",
    filePath: "Notes/History — The Great Depression.md",
    tags: ["history", "great depression", "1930s"],
    wordCount: 240,
    headings: ["Causes", "Effects — USA", "Effects — Germany", "Effects — Australia", "Global Political Impact", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The Wall Street Crash (1929) triggered a global economic collapse. In Germany, 6 million were unemployed by 1932 — the desperation that brought Hitler to power. In Australia, 1 in 3 workers lost their jobs.

## Causes

| Cause | Explanation |
|---|---|
| **Wall Street Crash** (Black Thursday, Oct 24 1929) | Stock prices collapsed after years of speculation on credit |
| **Overproduction** | Factories made more than consumers could buy |
| **Bank failures** | As stocks fell, banks collapsed, wiping out savings |
| **Global trade collapse** | Countries raised tariffs → trade fell → factories closed worldwide |
| **Weak regulation** | No safety nets — no unemployment benefits, no deposit insurance |

## Effects — USA

- 25% unemployment at peak
- "Hoovervilles" — shantytowns named mockingly after President Hoover
- The "Dust Bowl" — drought devastated the midwest

## Effects — Germany

- Already weakened by WWI reparations
- Unemployment reached **6 million** by 1932 (out of ~66m population)
- Desperate, humiliated Germans turned to extremists — including Hitler

## Effects — Australia

- **1 in 3 Australians** were unemployed at the peak
- Wages were cut by 20%
- Families relied on charity, itinerant work, and government relief

## Global Political Impact

- Germany → Hitler and the Nazis
- Italy → Mussolini's fascism grew stronger
- Japan → military government, expansion into Asia

## Revision Questions

1. What caused the Wall Street Crash of 1929?
2. How did the Depression affect Germany specifically?
3. What was the impact on ordinary Australians?
4. How did the Depression contribute to the rise of dictators like Hitler?`,
  },
  {
    id: "roaring-20s",
    title: "The Roaring 20s",
    subject: "History",
    filePath: "Notes/History — The Roaring 20s.md",
    tags: ["history", "1920s"],
    wordCount: 220,
    headings: ["Why Did the 20s Roar?", "Jazz & Youth Culture", "The Motor Car", "Dark Side of the Boom", "Prohibition", "The End of the Boom", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The 1920s in America was a decade of rapid economic growth, mass consumerism, new technology, jazz culture, and social rebellion — but built on fragile credit, setting the stage for the Great Depression.

## Why Did the 20s Roar?

- **Economic boom** — mass production, rising wages, consumer spending
- **New technology** — cars (Ford Model T), radio, cinema
- **The Assembly Line** — Henry Ford's innovation made cars affordable
- **Urbanisation** — millions moved to cities

## Jazz & Youth Culture

Jazz emerged from African-American communities and spread across the USA:
- Associated with flappers, dancing, nightclubs
- Seen by older generations as immoral — "youth rebellion"

## The Motor Car

- Henry Ford's **Model T** and the assembly line democratised car ownership
- Created new industries (petrol, roads, motels, tyres)
- Changed urban geography — suburbanisation

## Dark Side of the Boom

- **African Americans** — ongoing racism; the KKK was at its peak
- **Farmers** — agricultural prices fell; rural America didn't share the boom
- **Prohibition (1920–1933)** — ban on alcohol created organised crime

## Prohibition

- 18th Amendment (1920) banned manufacture and sale of alcohol
- Created a black market controlled by gangsters (Al Capone)
- Repealed by 21st Amendment in 1933

## The End of the Boom

The prosperity was built on stock market speculation, overproduction, and weak regulation — when the Wall Street Crash hit on Black Thursday (24 October 1929), it triggered the Great Depression.

## Revision Questions

1. What technologies drove the economic boom of the 1920s?
2. Why is jazz described as "youth rebellion"?
3. What was Prohibition and why did it fail?
4. What fragilities in the 1920s economy made the Wall Street Crash so devastating?`,
  },
  {
    id: "source-analysis",
    title: "Source Analysis Method (ICCR)",
    subject: "History",
    filePath: "Notes/History — Source Analysis Method.md",
    tags: ["history", "skills", "methodology"],
    wordCount: 230,
    headings: ["The ICCR Framework", "Corroboration", "What to Avoid", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** The ICCR method is the standard framework for analysing historical sources. Always ask: who made it, what does it show, what context shaped it, and how reliable is it? Never just describe — evaluate.

## The ICCR Framework

### I — Identification (5Ws)
- **Who** created it?
- **What** type of source is it?
- **When** was it created?
- **Where** was it produced?
- **Why** was it created? What was its purpose?

### C — Content
- What is this source depicting or communicating?
- Note symbols, images, words, tone
- For visual sources: describe foreground, midground, background

### C — Context
- In what historical context was this source made?
- What was happening at the time?
- How might the context have influenced the source?

### E — Evaluation (Note: "R" in ICCR stands for Reliability/Evaluation)
- How reliable do you think the source is?
- Is it useful for understanding the historical question?
- What perspective does it present?
- What perspectives are *not* included?

## Corroboration

Strong historical analysis doesn't rely on one source alone:
- Compare with other sources from the same period
- Look for agreement (corroboration) or disagreement (contestation)

## What to Avoid

- Don't just describe — evaluate
- Don't take a source at face value — ask *why* it was created
- Don't ignore the date — context at the moment of creation matters

## Revision Questions

1. What does each letter in ICCR stand for?
2. Why is context important when analysing a source?
3. What is corroboration and why does it strengthen historical argument?
4. What makes a source "reliable"? Can an unreliable source still be "useful"?`,
  },
  {
    id: "essay-writing",
    title: "Essay Writing",
    subject: "History",
    filePath: "Notes/History — Essay Writing.md",
    tags: ["history", "skills", "essay"],
    wordCount: 220,
    headings: ["The Golden Rules", "Structure for a 10-Mark Question", "Command Terms", "Useful Connective Words", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** History essays need a clear contention, ideas-based topic sentences, evidence with dates and sources, and no "I". For 10-mark questions, write at least 300 words.

## The Golden Rules

1. **Never use "I"** — always third-person academic voice
2. **State your contention upfront** — what is your argument?
3. **Sustain the contention throughout** — every paragraph links back to the central argument
4. **Use ideas-based topic sentences** — not "This paragraph is about..." but "The Treaty of Versailles created the conditions for WWII by..."
5. **Back every claim with evidence** — dates, names of historians, quotes from sources

## Structure for a 10-Mark Question

Focus statement + contention → Body paragraph 1 (Point + evidence + link) → Body paragraph 2 → Body paragraph 3 → Conclusion (restate contention, no new ideas)

## Command Terms

| Term | What it means |
|---|---|
| **Describe** | What happened? Give factual detail |
| **Explain** | Why/how did it happen? Give reasons |
| **Analyse** | Break it down — examine factors, weigh importance |
| **Evaluate** | Make a judgement — argue a position, weigh evidence |
| **Assess** | "To what extent...?" — argue with nuance |

## Useful Connective Words

- Introduce evidence: *Such as, For example, According to*
- Add a point: *Moreover, Furthermore, Additionally*
- Contrast: *However, Although, While, Despite*
- Conclude: *Thus, Therefore, As a result*

## Revision Questions

1. What is a "contention" and where does it go in your essay?
2. What is the difference between "describe" and "analyse"?
3. Why should you never use "I" in a history essay?
4. What makes a topic sentence "ideas-based"?`,
  },
  {
    id: "who-blame-wwi",
    title: "Who Was to Blame for WWI",
    subject: "History",
    filePath: "Notes/History — Who Was to Blame for WWI.md",
    tags: ["history", "WWI", "causation"],
    wordCount: 190,
    headings: ["The Trigger", "Historiography", "Underlying Causes (MAIN)", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Historians disagree on WWI's causes — some blame German aggression, others point to a system of alliances, imperial rivalry, or the assassination as the trigger.

## The Trigger

Archduke Franz Ferdinand was assassinated in Sarajevo on **28 June 1914** by Gavrilo Princip (a Bosnian-Serb nationalist).

This set off a chain reaction through the alliance system:
- Austria-Hungary blamed Serbia and issued an ultimatum
- Russia mobilised to support Serbia
- Germany declared war on Russia
- France was drawn in
- Germany invaded Belgium → Britain declared war

## Historiography

Historians have debated WWI's causes for over a century:
- Was Germany the primary aggressor? (Fischer thesis)
- Was it a system failure — alliances, mobilisation timetables, imperial competition?
- Could it have been avoided?

## Underlying Causes (MAIN)

| Cause | Explanation |
|---|---|
| **Militarism** | European powers built up massive armies — an arms race made war more likely |
| **Alliances** | Triple Alliance vs Triple Entente meant a local conflict became a world war |
| **Imperialism** | Competition for colonies created tensions |
| **Nationalism** | Ethnic nationalism (especially in the Balkans) destabilised empires |

## Revision Questions

1. What was the immediate trigger of WWI?
2. Why did the assassination of Franz Ferdinand lead to a world war?
3. What is the Fischer thesis, and what are its criticisms?`,
  },
  {
    id: "cartoon-analysis",
    title: "Cartoon Analysis",
    subject: "History",
    filePath: "Notes/History — Cartoon Analysis.md",
    tags: ["history", "skills", "cartoons", "methodology"],
    wordCount: 200,
    headings: ["The 4-Step Method", "Key Questions to Always Ask", "Revision Questions"],
    rawContent: "",
    content: `**TL;DR:** Political cartoons are powerful evidence of what people thought at a moment in history. Analyse them in four steps: scan, context, conclusions, evaluate.

## The 4-Step Method

### Step 1 — Scan (Initial Analysis)
- Who produced it? What type of source? When and where?
- What point of view does it put forward?
- How is this viewpoint conveyed? (Images, text, caricature, stereotypes)

### Step 2 — Context
- What was happening politically, socially, economically at the time?
- What circumstances led to this viewpoint?

### Step 3 — Conclusions
- What does the cartoon suggest about people, events, or issues of the time?
- What specific perspective is being presented?
- What perspectives are **left out**?

### Step 4 — Evaluate Value as Evidence
- How typical is this cartoon of views at the time?
- Compare with other sources — does it corroborate or contradict them?
- What gaps remain?

## Key Questions to Always Ask

| Question | Why it matters |
|---|---|
| How many people read this publication? | A niche cartoon has less influence than a major newspaper |
| What were the specific events at the time? | Context changes meaning entirely |
| Who is the cartoonist? | Their background and political allegiance shape the message |

## Revision Questions

1. What are the four steps of cartoon analysis?
2. Why is the political alignment of a publication important?
3. What is caricature and how does it work?
4. What does it mean that cartoons show "perspectives that are left out"?`,
  },
];
