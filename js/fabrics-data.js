/* Dragon Ink and Thread — the fabric library (single source of truth).
   ===========================================================================
   Written by tools/rename-fabrics.html. See that file, or the notes below.

   ADD A FABRIC:
     1. Put the photo in assets/fabrics/ (see the note on processing below)
     2. Add a { file, name } entry to the right group here
     3. node tools/build-fabrics.js     (regenerates fabrics.html)
     4. node tools/bump-assets.js       (restamps cache tokens)

   REMOVE ONE when the bolt runs out: delete its entry and re-run. Better to
   remove it than to have someone fall in love with fabric you no longer have.

   PHOTO PROCESSING — the originals are 3-7 MB phone JPEGs and must NOT be
   committed raw (53 of them was 188 MB). They're resized to 640px on the long
   edge at quality 78 (~81 KB each) and re-encoded, which also strips EXIF.
   That last part matters: 5 of these were shot in landscape with an EXIF
   orientation tag, and without baking the rotation into the pixels they
   display on their side. Jimp v1 auto-rotates on read; re-encoding drops the
   tag so nothing rotates them a second time. */
window.DIT_FABRICS = {
  GROUPS: [
    {
      label: "The Cup and Cozy",
      note: "For anyone whose day doesn't start until the kettle does.",
      items: [
        { file: "fabric-05.jpg", name: "Brew and Bloom" },
        { file: "fabric-10.jpg", name: "Roasted Roses" },
        { file: "fabric-11.jpg", name: "The Daily Grind" },
        { file: "fabric-15.jpg", name: "The Daily Grind - Ivory" },
        { file: "fabric-12.jpg", name: "Cup of Cozy" },
        { file: "fabric-18.jpg", name: "Cup of Cozy - Cream" },
        { file: "fabric-20.jpg", name: "Cup of Cozy - Sage" },
        { file: "fabric-13.jpg", name: "Espresso Roses" },
        { file: "fabric-14.jpg", name: "Freshly Roasted" },
        { file: "fabric-21.jpg", name: "The Daily Grind - Sage" },
        { file: "fabric-16.jpg", name: "Cinnamon Marble" },
        { file: "fabric-17.jpg", name: "Mocha Marble" }
      ]
    },
    {
      label: "Florals & Botanicals",
      note: "From the tiniest ditsy print to a full blowsy bouquet.",
      items: [
        { file: "fabric-27.jpg", name: "Sweetheart Bramble" },
        { file: "fabric-32.jpg", name: "Wine and Roses" },
        { file: "fabric-35.jpg", name: "Ashen Blooms" },
        { file: "fabric-53.jpg", name: "Flowers of Adarlan" },
        { file: "fabric-42.jpg", name: "Midnight Garden" },
        { file: "fabric-29.jpg", name: "Dew Kissed Rosebud" },
        { file: "fabric-34.jpg", name: "Rosebud Sprig" },
        { file: "fabric-28.jpg", name: "Rose Lattice" },
        { file: "fabric-26.jpg", name: "Feyre's Garden" },
        { file: "fabric-06.jpg", name: "Golden Meadows" },
        { file: "fabric-39.jpg", name: "Buttercup Ditsy" },
        { file: "fabric-41.jpg", name: "Sunlit Truce" },
        { file: "fabric-40.jpg", name: "Trailing Sweetpea" },
        { file: "fabric-52.jpg", name: "Piglet Pressed Wildflowers" },
        { file: "fabric-45.jpg", name: "Steel Blue Blooms" },
        { file: "fabric-38.jpg", name: "Solstice Sunflowers" },
        { file: "fabric-47.jpg", name: "Berry Sweet" },
        { file: "fabric-23.jpg", name: "Silver Flames" },
        { file: "fabric-50.jpg", name: "Ashes and Ivy" },
        { file: "fabric-09.jpg", name: "The Fall Court" },
        { file: "fabric-24.jpg", name: "Verdant Curse" }
      ]
    },
    {
      label: "Creatures & Curiosities",
      note: "Woodland things, garden things, a few with wings — and one shelf of curiosities.",
      items: [
        { file: "fabric-01.jpg", name: "Spellbound Shelves" },
        { file: "fabric-02.jpg", name: "Court of the Owl King" },
        { file: "fabric-36.jpg", name: "Bunny Meadows" },
        { file: "fabric-37.jpg", name: "Whimsical Woods" },
        { file: "fabric-31.jpg", name: "Baby Bunny Gingham" },
        { file: "fabric-33.jpg", name: "Little Goose Gingham" },
        { file: "fabric-30.jpg", name: "Gingham Teddy Bears" },
        { file: "fabric-25.jpg", name: "Nesta's Cats" },
        { file: "fabric-55.jpg", name: "Blush and Whiskers" },
        { file: "fabric-49.jpg", name: "Mushrooms and Whimsy" },
        { file: "fabric-04.jpg", name: "Sealed in Wax" },
        { file: "fabric-46.jpg", name: "Sprite's Breath" },
        { file: "fabric-44.jpg", name: "Honey Field" },
        { file: "fabric-48.jpg", name: "Wings and Whimsy" },
        { file: "fabric-51.jpg", name: "Wings and Ruin" }
      ]
    },
    {
      label: "Blenders & Textures",
      note: "Tonal prints and near-solids — what I reach for when the main fabric is doing the talking.",
      items: [
        { file: "fabric-22.jpg", name: "Valerian Blue" },
        { file: "fabric-43.jpg", name: "Cauldron Forged" },
        { file: "fabric-03.jpg", name: "Blushing Linen" },
        { file: "fabric-07.jpg", name: "Toffee Windowpane" },
        { file: "fabric-08.jpg", name: "Sage Windowpane" },
        { file: "fabric-19.jpg", name: "Peach Windowpane" }
      ]
    },
    {
      label: "Once Upon a Woodland",
      note: "Storybook creatures and the woods they live in — soft, faded, and half-remembered.",
      items: [
        { file: "fabric-63.jpg", name: "Bouncing Beginnings" },
        { file: "fabric-64.jpg", name: "Thistles and Tails" },
        { file: "fabric-65.jpg", name: "Twilight Owls" },
        { file: "fabric-66.jpg", name: "Amber Wildflowers" }
      ]
    },
    {
      label: "Tea with the Suriel",
      note: "Blue and white, florals and lace — the prettiest table in the house.",
      items: [
        { file: "fabric-58.jpg", name: "Something Blue" },
        { file: "fabric-59.jpg", name: "Sidra Vines" },
        { file: "fabric-60.jpg", name: "Afternoon Tea" },
        { file: "fabric-61.jpg", name: "Lace of Velaris" },
        { file: "fabric-62.jpg", name: "Suriel's Bouquet" }
      ]
    },
    {
      label: "Postcards and Pumpkins",
      note: "Autumn by post — sunflowers, pumpkins, and the last warm afternoons.",
      items: [
        { file: "fabric-67.jpg", name: "Pumpkin Patch Picnic" },
        { file: "fabric-68.jpg", name: "Postmarked Sunshine" }
      ]
    }
  ]
};
