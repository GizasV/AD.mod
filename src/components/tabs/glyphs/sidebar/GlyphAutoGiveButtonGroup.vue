<script>

export default {
    name: "GlyphAutoGiveButtonGroup",
    data() {
        return {
            vIsFlipped: false,
            realityGlyphUnlocked: false,
            availableGlyphs: false,
            cursedOn: false,
            realityOn: false,
        };
    },
    computed: {
        questionMarkTooltip() {
            return `Creates the max amount of Cursed Glyphs possible on reality.
            Creates a Reality Glyph when reality resource reaches its cap and you dont have a Reality Glyph`;
        }
    },
    methods: {
        update() {
            this.vIsFlipped = V.isFlipped;
            this.realityGlyphUnlocked = AlchemyResource.reality.isUnlocked;
            this.availableGlyphs = ((this.vIsFlipped || this.realityGlyphUnlocked) && PlayerProgress.existenceUnlocked()); // need existence, may change to an existence milestone
            this.cursedOn = player.reality.autoCursedGlyph;
            this.realityOn = player.reality.autoRealityGlyph;
        },
        toglleAutoCursedGlyph() {
            player.reality.autoCursedGlyph = !player.reality.autoCursedGlyph
        },
        toglleAutoRealityGlyph() {
            player.reality.autoRealityGlyph = !player.reality.autoRealityGlyph
        },
    }
};
</script>

<template>
    <div class="o-glyph-inventory-management-group" v-if="availableGlyphs">
        <div class="l-glyph-sacrifice-options__header" v-if="availableGlyphs">
            <div class="o-questionmark" v-tooltip="questionMarkTooltip">
                ?
            </div>
            Toggle Auto Glyphs:
        </div>
        <button v-bind:class="{
            'c-glyph-inventory-option l-cursed-glyph-creation-off': !cursedOn,
            'c-glyph-inventory-option l-cursed-glyph-creation-on': cursedOn
        }" v-if="vIsFlipped" @click="toglleAutoCursedGlyph">
            Toggle Auto Cursed Glyph.
        </button>
        <button v-bind:class="{
            'c-glyph-inventory-option l-Reality-glyph-creation-off': !realityOn,
            'c-glyph-inventory-option l-Reality-glyph-creation-on': realityOn
        }" v-if="realityGlyphUnlocked" @click="toglleAutoRealityGlyph">
            Toggle Auto Reality Glyph.
        </button>
    </div>
</template>

<style scoped>
.l-cursed-glyph-creation-off {
    border-color: var(--color-effarig--base);
}

.l-cursed-glyph-creation-on {
    border-color: var(--color-effarig--base);
    background-color: var(--color-good);
}

.l-Reality-glyph-creation-off {
    animation: a-reality-glyph-tooltip-header-cycle 10s infinite;
    padding: 1.16rem;

}

.l-Reality-glyph-creation-on {
    animation: a-reality-glyph-tooltip-header-cycle 10s infinite;
    background-color: var(--color-good);
    padding: 1.16rem;
}
</style>
