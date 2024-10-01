<template>
  <div class="form-group">
    <label :for="fieldId">{{ label }}</label>
    <div>
      <!-- Проверяем, нужно ли рендерить select -->
      <select v-if="options" v-model="localValue" :id="fieldId" required>
        <option value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <!-- Если 'options' не переданы, рендерим input -->
      <input
        v-else
        :type="inputType"
        v-model="localValue"
        :id="fieldId"
        :placeholder="placeholder"
        required
      />

      <!-- Показ поля для ввода нового значения, если выбрано "new" -->
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
    modelValue: [String, Number], // Поддержка строк и чисел
    newValue: String,
    fieldId: String,
    label: String,
    options: Array, // Опции для select
    placeholder: String, // Текст placeholder
    newPlaceholder: String, // Placeholder для нового значения
    inputType: {
      type: String,
      default: "text", // Тип input по умолчанию
    },
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value); // Синхронизация с родительским компонентом
      },
    },
    localNewValue: {
      get() {
        return this.newValue;
      },
      set(value) {
        this.$emit("update:newValue", value); // Синхронизация нового значения
      },
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
