/**
 * Fills its positioned parent with a cover-fit photograph.
 *
 * Photos are served from `public/img/` — never hot-linked — so the page does not
 * wait on a third-party host. Pass `src` as the .jpg path; a matching .webp of
 * the same name is offered first and the .jpg is the fallback.
 *
 * Without a `src` it renders a labelled placeholder so the layout keeps its
 * shape until the real photo is supplied.
 */
export default function ImageSlot({
  src,
  alt = '',
  credit,
  creditHref,
  placeholder = 'Image',
  eager = false,
  sizes = '(max-width: 1024px) 100vw, 640px',
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={placeholder}
        className="absolute inset-0 grid place-items-center bg-grey p-6 text-center text-[13px] leading-normal text-ink/45 [background-image:linear-gradient(135deg,rgba(30,42,58,.03)_25%,transparent_25%,transparent_50%,rgba(30,42,58,.03)_50%,rgba(30,42,58,.03)_75%,transparent_75%)] [background-size:28px_28px]"
      >
        <span className="max-w-[28ch]">{placeholder}</span>
      </div>
    )
  }

  const webp = src.replace(/\.jpe?g$/i, '.webp')

  return (
    <figure className="absolute inset-0 m-0">
      <picture>
        {webp !== src && <source srcSet={webp} type="image/webp" sizes={sizes} />}
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          sizes={sizes}
          className="block h-full w-full object-cover"
        />
      </picture>
      {credit && (
        <a
          href={creditHref}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 bottom-2.5 rounded-md bg-navy/45 px-2 py-1 text-[11px] leading-tight text-white/85 backdrop-blur-sm hover:text-white"
        >
          {credit}
        </a>
      )}
    </figure>
  )
}
