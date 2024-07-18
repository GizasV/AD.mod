<script>

export default {
    name: "GlyphGiveButtonGroup",
    data() {
        return {
            vIsFlipped: false,
            realityGlyphLevel: false,
            realityGlyphUnlocked: false,
            availableGlyphs: false,
        };
    },
    methods: {
        update() {
            this.vIsFlipped = V.isFlipped;
            this.realityGlyphLevel = AlchemyResource.reality.amount;
            this.realityGlyphUnlocked = AlchemyResource.reality.isUnlocked;
            this.availableGlyphs = (((this.vIsFlipped || this.realityGlyphUnlocked) && PlayerProgress.existenceUnlocked())&& !Pelle.isDoomed); // need existence, may change to an existence milestone
        },
        createRealityGlyph() {
            Glyphs.giveRealityGlyph()
        },
        createCursedGlyph() {
            Glyphs.giveCursedGlyph();
        },
    }
};
</script>

<template>
    <div class="o-glyph-inventory-management-group" v-if="availableGlyphs">
        <div class="l-glyph-sacrifice-options__header" v-if="availableGlyphs">
            Create Glyphs:
        </div>
        <button class="c-glyph-inventory-option  l-cursed-glyph-creation" v-if="vIsFlipped" @click="createCursedGlyph">
            Create a Cursed Glyph...
        </button>
        <button class="c-glyph-inventory-option  l-Reality-glyph-creation" v-if="realityGlyphUnlocked"  @click="createRealityGlyph">
            Create a level {{ formatInt(realityGlyphLevel) }}<br> Reality Glyph!
        </button>
    </div>
</template>

<style scoped>
.l-cursed-glyph-creation {
    border-color: var(--color-effarig--base);
}

.l-Reality-glyph-creation {
    animation: a-reality-glyph-tooltip-header-cycle 10s infinite;
}
</style>