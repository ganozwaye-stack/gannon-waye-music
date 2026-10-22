import { Link } from 'react-router-dom';
import HeroGlassPanel from '@/components/public/setfree-hero/HeroGlassPanel';
import { PUBLIC_JOURNALS } from '@/lib/publicJournalCatalogue';

export default function GannonWayeGroupFeature() {
  return (
    <section aria-labelledby="resilience-wellbeing-heading" data-testid="gannon-waye-group-feature" className="h-full min-w-0">
      <HeroGlassPanel>
        <div className="home-resilience-intro">
          <p className="home-feature-eyebrow">A space for your next chapter</p>
          <h2 id="resilience-wellbeing-heading" className="font-poppins font-bold gradient-gold-text">Resilience Wellbeing</h2>
          <h3 className="font-poppins">Life Coaching and Mindset Mentorship</h3>
          <p>Explore one-on-one coaching with Gannon and six reflective journals, with space to consider your goals, self-worth and next steps.</p>
          <nav aria-label="Explore Resilience Wellbeing" className="home-feature-actions">
            <Link to="/coaching?view=journals" data-testid="group-journals-link" className="home-feature-button">Explore journal previews</Link>
            <Link to="/coaching?view=coaching" data-testid="group-coaching-link" className="home-feature-button">Explore one-on-one coaching</Link>
          </nav>
          <p className="home-feature-price">Journals A$9.90 each · All six A$45 <span>Purchasing and downloads are being prepared.</span></p>
        </div>
        <div className="home-journal-gallery" aria-label="The six journal previews">
          {PUBLIC_JOURNALS.map(book => <Link key={book.id} to={'/coaching?view=journals&journal=' + book.id} aria-label={'Preview ' + book.title}>
            <div className="home-journal-cover"><img src={book.coverImageUrl} alt={book.title + ' cover'} loading="eager" /></div>
            <span>{book.title}</span>
          </Link>)}
        </div>
      </HeroGlassPanel>
    </section>
  );
}

