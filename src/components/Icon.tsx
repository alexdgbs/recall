type IconName =
  | "arrow"
  | "back"
  | "close"
  | "book"
  | "code"
  | "chart"
  | "home"
  | "learn"
  | "practice"
  | "profile"
  | "fundamentals"
  | "control"
  | "loops"
  | "arrays"
  | "methods"
  | "functions"
  | "objects"
  | "collections"
  | "async"
  | "dom"
  | "errors"
  | "algorithms";
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const content = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5" />
        <path d="m10 7-5 5 5 5" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    book: (
      <>
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" />
        <path d="M8 20a3 3 0 0 1 0-6h11" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-3 3 3 3" />
        <path d="m16 9 3 3-3 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    chart: (
      <>
        <path d="M5 19V9M12 19V5M19 19v-7" />
      </>
    ),
    home: (
      <>
        <path d="m4 11 8-7 8 7" />
        <path d="M6 10v10h12V10" />
      </>
    ),
    learn: (
      <>
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" />
        <path d="M8 20a3 3 0 0 1 0-6h11" />
      </>
    ),
    practice: (
      <>
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    fundamentals: <path d="M6 7h12M6 12h12M6 17h8" />,
    control: <path d="M5 5v14M5 9h7l4 4v6M13 10l3 3 3-3" />,
    loops: (
      <>
        <path d="M20 7h-9a5 5 0 0 0 0 10h8M17 14l3 3-3 3M7 4 4 7l3 3" />
      </>
    ),
    arrays: <path d="M7 4H4v16h3M17 4h3v16h-3M10 8h4M10 12h4M10 16h4" />,
    methods: <path d="M4 7h16M7 12h10M10 17h4" />,
    functions: <path d="M5 6h4l3 6-3 6H5M14 8h5M14 16h5" />,
    objects: (
      <path d="M8 4H5v6a2 2 0 0 1-2 2 2 2 0 0 1 2 2v6h3M16 4h3v6a2 2 0 0 0 2 2 2 2 0 0 0-2 2v6h-3" />
    ),
    collections: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <circle cx="12" cy="16" r="3" />
      </>
    ),
    async: (
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l3 3M15.5 15.5l3 3" />
    ),
    dom: <path d="M4 5h16v14H4zM8 9h8M8 13h5" />,
    errors: (
      <>
        <path d="m12 3 10 18H2Z" />
        <path d="M12 9v5M12 18h.01" />
      </>
    ),
    algorithms: (
      <>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="12" cy="18" r="2" />
        <path d="M8 6h8M7 8l4 8M17 8l-4 8" />
      </>
    ),
  }[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {content}
    </svg>
  );
}
