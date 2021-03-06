// These identifiers originate from the excel file in the ETL process.
export const probabilityConfig = [
  { title: 'alles weergeven', identifier: 'no_filter' },
  { title: 'grote kans (groter dan 1:30)', identifier: 'lt30' },
  { title: 'middelgrote kans (1:30 tot 1:300)', identifier: 'f30t300' },
  { title: 'kleine kans (1:300 tot 1:3000)', identifier: 'f300t3000' },
  { title: 'zeer kleine kans (1:3000 tot 1:30.000)', identifier: 'f3000t30k' },
  { title: 'extreem kleine kans (kleiner dan 1:30.000)', identifier: 'gt30k' }
]

export const probabilityTitles = probabilityConfig.map((entry) => entry.title)
