/* Dragon Ink and Thread — the fabric library (single source of truth).
   ===========================================================================
   What's on the shelf, for people planning a CUSTOM order. Not the shop —
   nothing here is a product, it's "which of these would you like it made in".

   ADD A FABRIC:
     1. Put the photo in assets/fabrics/ (see the note on processing below)
     2. Add a { file, name } entry to the right group here
     3. node tools/build-fabrics.js     (regenerates fabrics.html)

   REMOVE ONE when the bolt runs out: delete its entry and re-run. Better to
   remove it than to have someone fall in love with fabric you no longer have.

   PHOTO PROCESSING — the originals are 3–7 MB phone JPEGs and must NOT be
   committed raw (53 of them was 188 MB). They're resized to 640px on the long
   edge at quality 78 (~81 KB each) and re-encoded, which also strips EXIF.
   That last part matters: 5 of these were shot in landscape with an EXIF
   orientation tag, and without baking the rotation into the pixels they
   display on their side. Jimp v1 auto-rotates on read; re-encoding drops the
   tag so nothing rotates them a second time.

   NAMES are descriptive, not manufacturer names — they exist so a customer can
   say "the one with the owls" and be understood. Rename freely. */
window.DIT_FABRICS = {
  GROUPS: [
    {
      label: "The Cup and Cozy",
      note: "For anyone whose day doesn't start until the kettle does.",
      items: [
        { file: "fabric-05.jpg", name: "Coffee and Cream Roses" },
        { file: "fabric-10.jpg", name: "Coffee and Roses, Gold" },
        { file: "fabric-11.jpg", name: "Coffee Shop Script, Dark" },
        { file: "fabric-15.jpg", name: "Coffee Shop Script, Cream" },
        { file: "fabric-12.jpg", name: "Mug Collection, Cocoa" },
        { file: "fabric-18.jpg", name: "Mug Collection, Cream" },
        { file: "fabric-20.jpg", name: "Mug Collection, Sage" },
        { file: "fabric-13.jpg", name: "Café Blooms" },
        { file: "fabric-14.jpg", name: "Coffee Beans" },
        { file: "fabric-21.jpg", name: "Coffee Labels, Sage" }
      ]
    },
    {
      label: "Florals & Botanicals",
      note: "From the tiniest ditsy print to a full blowsy bouquet.",
      items: [
        { file: "fabric-27.jpg", name: "Cottage Rose" },
        { file: "fabric-32.jpg", name: "Vintage Rose Bouquet" },
        { file: "fabric-35.jpg", name: "Moody Peony" },
        { file: "fabric-53.jpg", name: "Dutch Masters" },
        { file: "fabric-42.jpg", name: "Midnight Garden" },
        { file: "fabric-29.jpg", name: "Ditsy Rose" },
        { file: "fabric-34.jpg", name: "Rosebud Sprig" },
        { file: "fabric-28.jpg", name: "Rose Lattice" },
        { file: "fabric-26.jpg", name: "Violet Posy" },
        { file: "fabric-06.jpg", name: "Golden Meadow" },
        { file: "fabric-39.jpg", name: "Buttercup Ditsy" },
        { file: "fabric-41.jpg", name: "Wildflower Sprig" },
        { file: "fabric-40.jpg", name: "Trailing Sweetpea" },
        { file: "fabric-52.jpg", name: "Pressed Wildflowers" },
        { file: "fabric-45.jpg", name: "Daisies on Teal" },
        { file: "fabric-38.jpg", name: "Sunflower Patch" },
        { file: "fabric-47.jpg", name: "Wild Strawberries" }
      ]
    },
    {
      label: "Creatures & Curiosities",
      note: "Woodland things, garden things, and a few with wings.",
      items: [
        { file: "fabric-02.jpg", name: "Midnight Owls" },
        { file: "fabric-36.jpg", name: "Meadow Rabbits" },
        { file: "fabric-37.jpg", name: "Woodland Story" },
        { file: "fabric-31.jpg", name: "Bunnies on Pink Gingham" },
        { file: "fabric-33.jpg", name: "Geese on Sage Gingham" },
        { file: "fabric-30.jpg", name: "Teddies on Gingham" },
        { file: "fabric-25.jpg", name: "Cats and Vines" },
        { file: "fabric-49.jpg", name: "Robins and Berries" },
        { file: "fabric-04.jpg", name: "Bees and Letters" },
        { file: "fabric-46.jpg", name: "Bees and Dandelions" },
        { file: "fabric-44.jpg", name: "Bees and Sunflowers" },
        { file: "fabric-48.jpg", name: "Fairy Garden, Cream" },
        { file: "fabric-51.jpg", name: "Fairy Garden, Navy" }
      ]
    },
    {
      label: "Plaids & Checks",
      note: "The quiet ones. Lovely as a lining, or for a piece that isn't shouting.",
      items: [
        { file: "fabric-03.jpg", name: "Faded Rose Gingham" },
        { file: "fabric-07.jpg", name: "Toffee Plaid" },
        { file: "fabric-08.jpg", name: "Sage Plaid" },
        { file: "fabric-19.jpg", name: "Apricot Plaid" }
      ]
    },
    {
      label: "Blenders & Textures",
      note: "Tonal prints and near-solids — what I reach for when the main fabric is doing the talking.",
      items: [
        { file: "fabric-22.jpg", name: "Chambray Blue" },
        { file: "fabric-16.jpg", name: "Mocha Marble" },
        { file: "fabric-17.jpg", name: "Olive Marble" },
        { file: "fabric-23.jpg", name: "Grey Damask" },
        { file: "fabric-50.jpg", name: "Indigo Leaves" },
        { file: "fabric-09.jpg", name: "Autumn Leaves" },
        { file: "fabric-24.jpg", name: "Violet Vine" },
        { file: "fabric-43.jpg", name: "Honeycomb" }
      ]
    }
  ]
};
