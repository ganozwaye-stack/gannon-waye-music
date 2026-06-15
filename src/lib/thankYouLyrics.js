export const THANK_YOU_TITLE = 'Thank You';

export const THANK_YOU_WRITTEN_CREDIT = 'Written by Gannon Waye 02 January 2026';

export const THANK_YOU_LYRICS = `Verse 1
I crossed the oceans just to see your face
But you met my love with cold, entitled grace
You wore your ego like a crown so high
Now I see the truth and I won’t stand by
The spell is broken, I can feel it lift
You were never home, you were just a drift

Pre-Chorus
I won’t take this anymore
Watch me walking out that door

Chorus
Thank you for showing me just who you are
Never once did you shine like a loving star
I see you clearly now, I choose another way
Respect is earned, not a game you make me play
You showed me everything I’ll never desire
Now I’m free and I’m dancing in the fire
Goodbye, dear sir, your arrogance exposed
I’m leaving for good, every chapter closed
Thank you

Verse 2
I spent the holidays with your family
They were the ones who really valued me
They saw my heart, they saw the love I gave
While you just took and tried to make me misbehave
They had the grace that you could never find
They held the warmth you left behind

Pre-Chorus
I won’t take this anymore
Watch me walking out that door

Chorus
Thank you for showing me just who you are
Never once did you shine like a loving star
I see you clearly now, I choose another way
Respect is earned, not a game you make me play
You showed me everything I’ll never desire
Now I’m free and I’m dancing in the fire
Goodbye, dear sir, your arrogance exposed
I’m leaving for good, every chapter closed
Thank you

Bridge
You thought you broke me, but I broke the chain
Turned all your chaos into my champagne
I found my power in the hurt you gave
Turned every tear into a tidal wave
Now when I look back, I just raise a glass
To the boy who chose himself at last

Chorus
Thank you for showing me just who you are
Never once did you shine like a loving star
I see you clearly now, I choose another way
Respect is earned, not a game you make me play
You showed me everything I’ll never desire
Now I’m free and I’m dancing in the fire
Goodbye, dear sir, your arrogance exposed
I’m leaving for good, every chapter closed
Thank you`;

export function isThankYouRelease(release = {}) {
  const joined = `${release.id || ''} ${release.slug || ''} ${release.title || ''}`.toLowerCase();
  const compact = joined.replace(/[^a-z0-9]/g, '');
  return compact.includes('thankyou');
}

export function applyThankYouLyrics(release) {
  if (!release || !isThankYouRelease(release)) return release;

  return {
    ...release,
    title: THANK_YOU_TITLE,
    lyrics: THANK_YOU_LYRICS,
    credits: release.credits || THANK_YOU_WRITTEN_CREDIT,
  };
}
