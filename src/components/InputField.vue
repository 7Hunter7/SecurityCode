<template>
  <div class="form-group">
    <label :for="fieldId">{{ label }}</label>
    <div>
      <select v-model="localValue" :id="fieldId" required>
        <option value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <input
        v-if="localValue === 'new'"
        v-model="localNewValue"
        type="text"
        :placeholder="newPlaceholder"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    newValue: String,
    fieldId: String,
    label: String,
    options: Array,
    placeholder: String,
    newPlaceholder: String,
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
    localNewValue: {
      get() {
        return this.newValue;
      },
      set(value) {
        this.$emit("update:newValue", value);
      },
    },
  },
};
</script>
