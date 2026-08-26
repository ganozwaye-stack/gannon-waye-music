# Sonia's Garden — build spec

26 August 2026. Drafted from the verified transcript of Sonia Waye's memorial service,
17 May 2022. Nothing in this document is invented. Every quotation is a real line
spoken by a real person at that service.

**THE RULE THAT GOVERNS EVERYTHING BELOW:** no agent publishes anything in this garden.
Not one frame, not one caption, not one image. Agents may index, propose and build.
Gannon approves every single image and every single line, personally. This is his mother.

---

## Source material (all verified present in Drive)

```
Sonia-funeral-full-raw-transcript.txt                     43 KB   15Euhymv...
sonia-memorial-service-2022-05-17-transcript-clean.md    108 KB   1AS1NU9C...
Without You Here - Tribute Photos                    280+ images  1aRcBkXv...
sonia-memorial-intake-2026-07-21 / 01-sonia-portraits, 02-sonia-and-family
sonia-icloud-album-2026-07-28  + contact sheet
Sonia's Garden Image Catalogue   (Sheet, already exists - READ IT, do not recreate)
Sonia-voice-review-videos-first-then-voicemails.wav
Funeral card.jpg
```

---

## THE MOTIF — the last dot

From Sky's tribute at the service:

> "I painted her nails her favourite colours, and she'd leave the colour on until
> there was this last dot."

Every frame in the garden carries one small dot of colour, lower-right. Unlit while you
pass. On hover or focus the dot lights FIRST, a beat before the frame responds, then
the memory opens.

```
The dot          6px, lower-right, inset 14px
Resting          20% opacity
Hover / focus    100% opacity, 400ms ease, LEADS the frame by 350ms
Her colour       maroon #6B2B34 base (from the dressing gown she always wore),
                 each dot varying slightly across a small set of polish shades,
                 because "her favourite colours" is plural
Frame border     1px maroon at 30%, warming to 70% on hover
NOT gold         gold is the artist brand. This is her. No gold, no GW mark,
                 no logo anywhere in the garden. The garden does not carry the
                 brand. It carries her.
```

---

## Frames by section

The rebuilt garden has `arrival`, `trees`, `memories`, `garden`, `archway`, `rooms`,
`bench`, `conclusion`. Frames hang throughout.

| Section | What the frames hold |
|---|---|
| arrival | Her, alone. Portraits. The first frame is the mantelpiece one. |
| trees | Childhood, Jamestown, horse rides with Uncle Les, Grandma Olchen's house |
| memories | The grandchildren. Baby chinos, scratchy tickets, the cat show, doughnut balls |
| garden | Her and John. Married 1981. Hillcrest. Three babies under two. |
| archway | Work and service - the bread runs she volunteered for, feeding families |
| rooms | The domestic ones. The favourite chair out the front. Coffee at 3am. |
| bench | Her and her dad. She is buried beside him. |
| conclusion | Ave Maria. Gannon singing. The last frame is not a photograph. |

## Hotspot lines - real, attributed, verbatim

```
"She would always let me scratch it for her."                    - Sky
"Nanny is my best friend. She always will be."                   - Sky
"She would give us all nicknames. Mine was Fly Fly."
"I'm gonna miss her fried rice and her scrambled eggs.
 No one made them like her."
"Her long nails and the scent of her perfume and her laugh."
"She'd get up in the night and make her coffee and watch a
 movie on her phone."
"She wore pants, thongs, and a jumper, as usual."
"Crystal, my baby, this is the best coffee I've ever had."       - Sonia
"I love you more, more, more. Infinity. Full stop padlock."      - Crystal
```

The last one closes the memories section. It is how Crystal ended her tribute, and it
is a child's promise-format Sonia clearly taught her.

---

## WHO SHE WAS - restores the `who-she-was` section

Sonia Waye. Married John in 1981. Welcomed Crystal in 1987, Gannon not long after, then
Jared - three babies under the age of two. Raised them in Hillcrest after interest rates
pushed the family out of the Salisbury house in 1988.

She left school in Year 9. Worked at the Jane's Factory and hated it, so she left. Then
cleaning at Sefton Park Shopping Centre, the Adelaide Show, the F100 races, an
optometrist, and nursing homes. In the same years she volunteered on bread runs, helping
families feed themselves.

When her dad died in 2009 she began travelling between Adelaide and Alice Springs to be
with her grandchildren, and kept doing it until everyone was in one place again.

Her granddaughter used to pretend to be hurt so Sonia could play nurse. That
granddaughter became a nurse. Sonia was proud of that.

She died at 7:00am on a Wednesday, 27 April. She is buried beside her dad.

A woman who met her near the end, in a message read at the service:
> "There should be a hospital ward named after you. You are so caring and feisty."

---

## Build order

```
0. Index the images. READ the existing Sonia's Garden Image Catalogue Sheet.
   Do not start a new one.
1. MemoryFrame entity: image_url, section, caption, quote, attributed_to,
   dot_colour, sort_order, is_published (DEFAULT FALSE).
2. Curate, do not dump. 280 photos is an archive, not a garden. 30-50 frames.
   An agent may PROPOSE. Only Gannon approves.
3. Build the frame: 3D card, maroon border, the last dot, hover opens the memory.
4. Wire the hotspots with the attributed lines above.
5. Restore section id `who-she-was` holding the text above.
6. HER VOICE: there is a .wav of her voicemails. It is the most powerful and most
   dangerous asset in the folder. DO NOT TOUCH IT without Gannon saying so
   explicitly, on a day he chooses.
```

---

## Already done

- `/without-you-here` and `/withoutyouhere` route to the lyric page instead of 404
- `/mum`, `/mums`, `/sonias-garden` redirect to `/mums-garden`
- The `Without You Here` Lyric record's `inspiration` field holds the full story,
  drafted from the transcript, every quote Gannon's own words at the service
- Held behind all seven fail-closed publication gates. Admin-visible only.

## Three decisions only Gannon can make

1. Does the addiction line stay? He said it aloud at her funeral, and Carry The Message
   already carries recovery language - but publishing it on the site is a different act
   from saying it in a room of family.
2. Confirm the year of her passing - 27 April 2022, inferred from the service date.
3. Is "Mama Bear" right to use publicly?
