<script>
export default {
  name: "NewGame", // existence
  data() {
    return {
      opacity: 0,
      visible: false,
    };
  },
  computed: {
    style() {
      return {
        opacity: this.opacity,
        visibility: this.visible ? "visible" : "hidden",
      };
    }
  },
  methods: {
    update() {
      this.visible = GameEnd.endState > END_STATE_MARKERS.SHOW_NEW_GAME && !GameEnd.removeAdditionalEnd;
      this.opacity = (GameEnd.endState - END_STATE_MARKERS.SHOW_NEW_GAME) * 2;
    },
    startNewexistence() {
      existenceResetRequest();
    },
  }
};
</script>

<template>
  <div class="c-new-existence-container" :style="style">
    <h2>There is nothing you can do here to change this outcome.</h2>
    <h2> Yet it must be Undone...</h2>
    <div class="c-new-existence-button-container">
      <button class="c-new-existence-button" @click="startNewexistence">
        Start a new Existence
      </button>
    </div>
  </div>
</template>

<style scoped>
.c-new-existence-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}

.t-s12 .c-new-existence-container {
  color: white;
}

.c-new-existence-button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.c-new-existence-button {
  animation: a-existence-mod 4s infinite;
  font-size: 2.1rem;
  font-family: Typewriter;
  border: black;
  background: black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 1rem;
  padding: 1rem;
  cursor: pointer;
}
</style>
