# The demand test — how we find out what to make, before we make it

Issued 24 Aug 2026. This is the answer to "what merch should we make?" and it is also
the fastest legitimate route to the 30-outcome unlock threshold in the Agent Operating
Constitution. Until this runs, every merch decision is a guess wearing a confident face.

---

## The problem with just asking

Asking "what merch would appeal to you?" gets you an answer. It does not get you data.

Stated preference and revealed preference come apart badly on merch. People say
"a nice tote bag" and then buy the hoodie. People say "under $40" and then spend $98
because the thing meant something. An open text box on a subscribe form produces a list
of things nobody will pay for, and then we spend three weeks producing them.

So we do both, and we weight them differently:

- **Stated preference** — cheap, fast, directional. Good for finding out what we haven't
  thought of. Treated as a hint, never as a reason to produce.
- **Revealed preference** — a real click on a real product page with a real price.
  This is evidence. This is what unlocks production under the Constitution.

---

## Mechanism 1 — the subscribe-time question (stated)

One question. Priced options, not an open box. Open boxes get "idk" and "more stuff".

Added to the existing subscribe flow, after email capture, skippable:

> **One question, then you're done.**
> If you were buying today, which of these would you actually reach for?

```
o  A hoodie with a line from a song on the back          ~$98
o  A candle for someone I've lost                        ~$45
o  A tee I could wear to work                            ~$59
o  A signed physical copy of the music                   ~$25
o  Something for my mum / for a memorial                 ~$35
o  Honestly, I just want the music
```

Then one optional free-text field, and this is the one that earns its place:

> **Is there something you've looked for and couldn't find?**

That second field is where the ideas we haven't had will come from. It is not a
popularity vote — one good sentence from one grieving person is worth more than
forty clicks on "tee".

**Entity:** `VisitorSignal`
```
email            string, optional (blank = anonymous)
signal_type      enum: stated_preference | revealed_interest | open_text
option_selected  string
open_text        string
price_band       number
source_page      string
created_at       datetime
```

**Rule:** a `VisitorSignal` of type `stated_preference` may never on its own move a
`DeegoDesignAsset` past `brief`. It can only justify creating a fake-door test.

---

## Mechanism 2 — the fake door (revealed)

This is the one that actually matters.

Put the products we are *considering* on the site as real product pages — real photo
or mockup, real price, real description — with the buy button replaced by:

```
[  Tell me when this exists  ]
```

Click it, we take an email, we show:

> "You're on the list. I'll only email you when it's real — and you'll get it first."

**That click is a purchase intent with a price attached.** It is the closest thing to
sales data we can generate without stock, and it costs nothing to be wrong.

**CORRECTION, 25 Aug 2026 — the prices in the original version of this table were wrong
and have been removed. Read this before using anything below.**

The earlier table priced a memorial candle at $45 and a dressing gown at $120. Those
numbers were market-rate for established Australian boutique brands (Ivy & Wood $44.95;
the nearest memorial comparable, Aroma Pot, $39.90 for a 50-hour candle) — but they were
applied to a business with **one real customer order in its history**. That is the same
error as citing a comparable as "our data", which evidence rule 2 forbids. A price is a
claim about who you are. We have not earned the boutique claim yet.

**No agent may put a price on a fake door until base cost is pulled from the actual
POD account.** Price = verified base cost + verified shipping + platform fee + margin.
Not a number that felt right.

**Product filter — a candidate must pass all three, or it is not a candidate:**

1. **Made one at a time, no money upfront.** If it needs a minimum order or a
   storage box in his house, it is out until there is revenue to risk.
2. **Produced in Australia.** Gelato produces locally in AU; Printify routes AU mugs
   to Prima Printing. Anything shipping from the US loses the margin to freight and
   loses the customer to a three-week delivery.
3. **The line works with no context.** A stranger who has never heard the song still
   wants it.

**Killed outright:** the maroon dressing gown. Not on price — on profile. There is no
print-on-demand path for a robe, so it means inventory, sizing, and returns. Worst
possible product shape for a business with one sale. Revisit only after apparel sells.

**Candidates, prices deliberately blank until base costs are read:**

| Product | Price | Status |
|---|---|---|
| Sonia's candle | TBD | Blocked — needs a real AU supplier quote. POD candle options exist but must be costed. |
| Carrying Your Love With Me tee | TBD | Cleared to cost. POD, AU production, line works with no context. |
| Memorial memory-card set | TBD | Cleared to cost. Cheap, and it is the piece people keep. |
| Set Free hoodie | TBD | Fake door only. Song unreleased — gate blocks production, not interest. |

That last row is the important one. The publication gate stops us *selling* an
unreleased song. It does not stop us finding out whether anyone wants it. A fake door
is gate-safe by construction because nothing ships.

**Entity:** reuse `VisitorSignal` with `signal_type: revealed_interest` and
`option_selected` = the product slug.

---

## The threshold

From the Constitution: determinate work only until sales data exists, 30 outcomes
before a channel unlocks.

A fake-door click counts as an outcome for **product selection** decisions only.
It does not count as revenue, it does not count toward the sales-data unlock, and it
does not license price changes or ad spend.

```
< 10 clicks on a fake door   ->  no signal, do nothing
10-29 clicks                 ->  worth a supplier conversation, not a production run
30+ clicks                   ->  produce it, and say so in the brief with the number
```

Deego reports the number. Deego does not decide. Every production decision still goes
to the approval queue with the click count attached as evidence.

---

## On using other businesses' analytics

Legitimate — as a **prior**, not as a fact about this audience.

Comparable data tells you what is *normal* in independent music merch. It does not tell
you what is *true* for an Australian artist writing about grief and leaving. Those are
different questions and conflating them is exactly the error the evidence rule exists
to prevent.

What the current comparables say, cited:

- Apparel is consistently the volume driver; hoodies carry the highest margin per unit
  in the category — [Hypebot, Musician's Guide to Merch Margins 2026](https://www.hypebot.com/musicians-guide-to-merch-margins-2026/)
- Items with a *use* outsell items with a *logo*. Something you can wear to work, drink
  from, or carry — [d4musicmarketing, What Merch To Make](https://d4musicmarketing.com/what-merch-to-make/)
- Bundles raise order value more reliably than discounting, and gift-buyers search by
  occasion rather than artist name — consistent with the eBay bundle strategy already written
- Print-on-demand for CD/DVD/vinyl does exist at low or no MOQ, via Kunaki and similar
  — [TheCleverBusiness](https://thecleverbusiness.com/print-on-demand-cds-dvds/),
  [Kunakify](https://www.kunakify.com/), [Noiseyard](https://noiseyard.com/en/blog-for-musicians/print-on-demand-for-musicians)

**Rule for agents:** a comparable may be cited in a brief. It may never be cited as
"our data". Any brief that says "customers want X" without a `VisitorSignal` reference
is rejected at write time under evidence rule 2.

---

## What nobody has considered yet

Three things the comparables do not cover, because they assume an artist selling to fans.
This isn't that. The hoodie sells because of the sentence, not because of the signature.

1. **The line is the product; the artist is the provenance.** Someone buys
   "respect is earned, not a game you make me play" because it says something they
   can't. That means the addressable market is not his listener count — it is everyone
   who has left someone. Test this directly: run one fake door on a design with *no*
   artist name visible and compare click rates.

2. **Occasion beats fandom.** Mother's Day, anniversaries of a death, the day someone
   moves out. These are search terms with volume and intent, and they are when memorial
   products get bought. The candle with a date on the label is not a gimmick, it is the
   product finding its moment.

3. **Gift buyers are a separate audience with separate copy.** The person buying the
   memorial candle is often not the bereaved — it is their friend who doesn't know what
   to say. Written for that person, the product copy changes completely, and that is a
   test worth running.

Each of these is a fake door, not an opinion. Build the door, count the clicks.

---

## Build order

0. **Pull real base costs** from the connected POD account for every candidate product,
   AU production route only. No price goes on any page before this. Determinate job.
1. `VisitorSignal` entity (schema above)
2. Subscribe-flow question — one screen, skippable, priced options + one open field
3. Fake-door product pages for the five candidates, with `[Tell me when this exists]`
4. Deego reads `VisitorSignal` weekly and reports counts. Reports only. No decisions.
5. Threshold rules written into `AgentMemory` as an amendment to the Constitution
