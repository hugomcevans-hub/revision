import { TrueFalseQuestion } from "@/types";

const tf = (
  id: string,
  noteId: string,
  subject: string,
  statement: string,
  isTrue: boolean,
  explanation: string,
): TrueFalseQuestion => ({ type: "true-false", id, noteId, subject, statement, isTrue, explanation });

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  // ── BIOLOGY ──
  tf("tfb1", "mitosis", "Biology", "Mitosis produces four haploid daughter cells.", false, "Mitosis produces 2 identical diploid daughters. Meiosis produces 4 haploid cells."),
  tf("tfb2", "mitosis", "Biology", "Mitosis is used for growth and repair of body tissue.", true, "Correct — mitosis is for somatic cell maintenance, growth, and repair."),
  tf("tfb3", "meiosis", "Biology", "Crossing over occurs during Prophase I of meiosis.", true, "Yes — homologous chromosomes exchange DNA at chiasmata during Prophase I."),
  tf("tfb4", "interphase", "Biology", "DNA replication happens during prophase.", false, "DNA replicates during interphase, before mitosis begins."),
  tf("tfb5", "metaphase", "Biology", "In metaphase, chromosomes line up along the equator.", true, "Correct — alignment at the metaphase plate is the defining event."),
  tf("tfb6", "sister-chromatids", "Biology", "Sister chromatids are genetically identical.", true, "They are exact copies produced by DNA replication."),
  tf("tfb7", "homologous-chromosomes", "Biology", "Homologous chromosomes are identical copies of each other.", false, "Homologues have the same genes but can carry different alleles — they aren't identical."),
  tf("tfb8", "haploid-diploid", "Biology", "Human gametes are diploid.", false, "Gametes are haploid (n=23). Body cells are diploid (2n=46)."),
  tf("tfb9", "dna", "Biology", "Adenine pairs with Guanine in DNA.", false, "Adenine pairs with Thymine. Guanine pairs with Cytosine."),
  tf("tfb10", "chromosome", "Biology", "Humans have 46 chromosomes in each body cell.", true, "23 pairs — 22 autosome pairs and 1 sex chromosome pair."),

  // ── CHEMISTRY ──
  tf("tfc1", "physical-change", "Chemistry", "Melting ice is a chemical change.", false, "Melting is a physical change — the substance (water) stays the same."),
  tf("tfc2", "chemical-change", "Chemistry", "A colour change can indicate a chemical reaction has occurred.", true, "Yes — colour change is one of the six classic indicators."),
  tf("tfc3", "law-conservation-mass", "Chemistry", "Matter can be created during a chemical reaction.", false, "The Law of Conservation of Mass states matter cannot be created or destroyed."),
  tf("tfc4", "balanced-equations", "Chemistry", "To balance an equation, you can change the subscripts.", false, "Never change subscripts — only add coefficients in front of formulas."),
  tf("tfc5", "catalysts", "Chemistry", "A catalyst is consumed during a reaction.", false, "Catalysts are not consumed — they're the same at the end as the beginning."),
  tf("tfc6", "exothermic-reactions", "Chemistry", "Exothermic reactions release heat to the surroundings.", true, "Correct — products have less chemical energy than reactants."),
  tf("tfc7", "endothermic-reactions", "Chemistry", "Photosynthesis is an endothermic reaction.", true, "Yes — plants absorb light energy to drive the reaction."),
  tf("tfc8", "reaction-rate", "Chemistry", "Lowering temperature usually increases reaction rate.", false, "Lower temperature = slower particles = fewer energetic collisions = slower rate."),
  tf("tfc9", "states-of-matter", "Chemistry", "The state symbol (aq) means a substance is dissolved in water.", true, "Aqueous solutions use (aq)."),
  tf("tfc10", "enzymes", "Chemistry", "Enzymes are a type of carbohydrate.", false, "Enzymes are proteins that act as biological catalysts."),

  // ── PHYSICS ──
  tf("tfp1", "scalars-vectors", "Physics", "Velocity is a scalar quantity.", false, "Velocity is a vector — it has magnitude AND direction. Speed is the scalar."),
  tf("tfp2", "distance-displacement", "Physics", "Distance and displacement are always equal.", false, "They differ whenever you change direction. A full lap = 400m distance but 0m displacement."),
  tf("tfp3", "acceleration-gravity", "Physics", "All objects in free fall (no air resistance) accelerate at the same rate.", true, "g = 9.8 m/s² regardless of mass."),
  tf("tfp4", "force", "Physics", "A force can change an object's direction without changing its speed.", true, "Circular motion at constant speed — direction changes, so velocity changes, so a force is acting."),
  tf("tfp5", "velocity-time-graphs", "Physics", "The area under a velocity-time graph equals displacement.", true, "Correct — gradient gives acceleration, area gives displacement."),
  tf("tfp6", "distance-time-graphs", "Physics", "A flat horizontal line on a distance-time graph means the object is moving at constant speed.", false, "A flat line means distance isn't changing — the object is stationary."),
  tf("tfp7", "acceleration", "Physics", "Negative acceleration always means moving backwards.", false, "Negative acceleration means deceleration — slowing down (or accelerating in the opposite direction)."),

  // ── HISTORY ──
  tf("tfh1", "treaty-versailles", "History", "The Treaty of Versailles forced Germany to accept full blame for WWI.", true, "Article 231, the War Guilt Clause."),
  tf("tfh2", "league-of-nations", "History", "The USA was a founding member of the League of Nations.", false, "The US Senate rejected the treaty — the USA never joined, fatally weakening the League."),
  tf("tfh3", "rise-of-hitler", "History", "The Enabling Act of 1933 allowed Hitler to make laws without Reichstag approval.", true, "Effectively ended the Weimar Republic and made him a dictator."),
  tf("tfh4", "causes-wwii", "History", "Appeasement is the policy of confronting an aggressor with military force.", false, "Appeasement was the opposite — giving in to demands to avoid war."),
  tf("tfh5", "holocaust", "History", "The Nuremberg Laws stripped Jews of German citizenship.", true, "Passed in 1935 — defined who counted as a Jew and removed their rights."),
  tf("tfh6", "great-depression", "History", "The Wall Street Crash happened in 1939.", false, "Black Thursday was 24 October 1929. 1939 was when WWII began."),
  tf("tfh7", "roaring-20s", "History", "Prohibition banned the sale of alcohol in the USA during the 1920s.", true, "18th Amendment (1920) — repealed by the 21st (1933)."),
  tf("tfh8", "nazi-propaganda", "History", "Josef Goebbels was the chief minister of Nazi propaganda.", true, "He controlled all media and orchestrated the propaganda campaign."),
];
