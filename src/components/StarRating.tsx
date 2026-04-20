interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  ratingsLabel?: string;
}

export default function StarRating({ rating, reviewCount, ratingsLabel = 'ratings' }: StarRatingProps) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <div className="flex items-center">
        {Array.from({ length: full  }).map((_, i) => <Star key={`f${i}`} type="full"  />)}
        {half &&                                       <Star type="half" />}
        {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} type="empty" />)}
      </div>
      <span className="text-sm font-semibold text-[#FF9900]">{rating > 0 ? rating.toFixed(1) : '—'}</span>
      {reviewCount != null && reviewCount > 0 && (
        <span className="text-sm text-[#007185]">{reviewCount.toLocaleString()} {ratingsLabel}</span>
      )}
    </div>
  );
}

function Star({ type }: { type: 'full' | 'half' | 'empty' }) {
  if (type === 'full') return (
    <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  if (type === 'half') return (
    <svg className="w-4 h-4" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="hg">
          <stop offset="50%" stopColor="#FF9900" />
          <stop offset="50%" stopColor="#d0d0d0" />
        </linearGradient>
      </defs>
      <path fill="url(#hg)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
  return (
    <svg className="w-4 h-4 text-[#d0d0d0]" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
