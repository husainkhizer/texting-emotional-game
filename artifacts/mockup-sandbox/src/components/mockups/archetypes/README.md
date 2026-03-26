# Archetype Gallery — Canvas Layout

This folder contains the Last Message archetype preview components.
The canvas layout (17 shapes) is applied via Replit's canvas tool system.

## Components

### ArchetypePreview.tsx
Single-archetype reflection screen, driven by URL param `?n=1..15`.

Preview URL: `/__mockup/preview/archetypes/ArchetypePreview?n=<index>`

### ReflectionGallery.tsx
All 15 archetypes in a single scrollable page with labeled cards.

Preview URL: `/__mockup/preview/archetypes/ReflectionGallery`

## Canvas Layout (17 shapes)

Applied to the workspace canvas via Replit canvas tool calls.

### Header text shape
- x=380, y=-800, w=1850, h=100
- text: "All 15 Reflection Outcomes — Last Message"

### Gallery overview iframe
- shapeId: archetype-gallery-full
- x=380, y=-1680, w=1850, h=840
- url: .../__mockup/preview/archetypes/ReflectionGallery

### 15 individual ArchetypePreview iframes (5×3 grid)
Grid starts at x=380, y=-740. Each card: w=320, h=740. Gap: 50px.

| # | Archetype                | shapeId      | x    | y    | ?n= |
|---|--------------------------|--------------|------|------|-----|
| 1 | The Open Letter          | archetype-1  | 380  | -740 | 1   |
| 2 | The One Who Said It      | archetype-2  | 750  | -740 | 2   |
| 3 | The Witness              | archetype-3  | 1120 | -740 | 3   |
| 4 | The Half-Truth           | archetype-4  | 1490 | -740 | 4   |
| 5 | The Quiet One            | archetype-5  | 1860 | -740 | 5   |
| 6 | The One Who Showed Up    | archetype-6  | 380  | 50   | 6   |
| 7 | The Late Realizer        | archetype-7  | 750  | 50   | 7   |
| 8 | The One Left Waiting     | archetype-8  | 1120 | 50   | 8   |
| 9 | The One Who Stayed       | archetype-9  | 1490 | 50   | 9   |
|10 | The One Who Walked Away  | archetype-10 | 1860 | 50   | 10  |
|11 | The One Who Left Quietly | archetype-11 | 380  | 840  | 11  |
|12 | The One Who Tried        | archetype-12 | 750  | 840  | 12  |
|13 | The Dreamer              | archetype-13 | 1120 | 840  | 13  |
|14 | The Pragmatist           | archetype-14 | 1490 | 840  | 14  |
|15 | The In-Between           | archetype-15 | 1860 | 840  | 15  |

All iframes are state="live" and point to:
`https://<domain>/__mockup/preview/archetypes/ArchetypePreview?n=<index>`

Each iframe's componentName is set to the archetype name (serves as label in the canvas title bar).
