# Module: Home canning

Version: Prepper v1.2.1 (2026-10-28). Opt-in, off by default.

Sources: National Center for Home Food Preservation (NCHFP) (https://nchfp.uga.edu/how/can), USDA FSIS Shelf-Stable Food Safety (in `reference/shelf-life-us.md`).

## Rules
- Only tested recipes from NCHFP, the USDA Complete Guide to Home Canning, or a Cooperative Extension office. The bot never writes, scales, or alters a canning recipe or process time.
- A canning batch is ONE inventory line: "Green beans, pressure canned, 14 pints, canned 2026-08-12". Quantity goes down as jars are used.
- Best-by is set to canned date plus 12 months (FSIS home-canned guidance), which drives the rotation queue.
- Home-canned food counts toward food days only if the owner says how much a jar feeds; otherwise the batch shows as "not counted yet".
- When a jar looks wrong (bulging lid, leaking, spurting, off smell), the guidance is: do not taste it; throw it out. Questions about a specific jar go to the local Extension office.

## Log format
`{id, item, method: "water bath" | "pressure", jars, jarSize, canned, bestBy, recipeSource}`. recipeSource is required; without it the batch is marked "recipe source unknown".
