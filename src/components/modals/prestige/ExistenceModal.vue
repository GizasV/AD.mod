 
<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "ExistenceModal",
  data() {
    return {
      hasMoreCosmetics: false,
      cosmeticLine: "",
    };
  },
  components: {
    ResetModal
  },
  computed: {
    message() {
    if (PlayerProgress.existenceUnlocked())
      return `Existence will reset everything except Challenge records and anything under the General header on the Statistics tab.`;
    else
      return `Existence will reset everything except Challenge records and anything under the General header on the Statistics tab. 
              Rows 14 to 18 of Achivments are also reset, but you will unlock a new row of Achivments. 
              You will also gain an Existece, an Existence point(temp name) and unlock various upgrades and milestones.
              You will also get a cosmetic set for Glyphs.These are freely modifiable, but are purely visual and offer no gameplay bonuses.`;
    },
    gain() {
      return `You will gain (nyi) on Existence.${this.cosmeticLine}`;
    },
    startWith() {
      return "";
    },
  },
  methods: {
    update() {
      this.hasMoreCosmetics = GlyphAppearanceHandler.lockedSets.length > 0;
      this.cosmeticLine = this.hasMoreCosmetics ? ' You also unlock a random new cosmetic set for Glyphs.' : '';
    },
    handleYesClick() {
      existenceReset();
    }
  },
};
</script>

<template>
  <ResetModal
    :header="'You are about to start a new Existence'"
    :message="message"
    :gained-resources="gain"
    :starting-resources="startWith"
    :confirm-fn="handleYesClick"
    confirm-option="existence"
  />
</template>
