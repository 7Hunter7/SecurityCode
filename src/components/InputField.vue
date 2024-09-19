<template>
  <div class="form-group">
    <label :for="fieldId">{{ label }}</label>
    <div>
      <select v-model="modelValue" :id="fieldId" :required="required">
        <option value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <input
        v-if="modelValue === 'new'"
        v-model="newValue"
        type="text"
        :placeholder="newPlaceholder"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "InputField",
  props: {
    fieldId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    newPlaceholder: {
      type: String,
      default: "",
    },
    newValue: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "update:newValue"],
  watch: {
    modelValue(newVal) {
      this.$emit("update:modelValue", newVal);
    },
    newValue(newVal) {
      this.$emit("update:newValue", newVal);
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
