<template>
  <div class="scroll-to-top" v-if="showButton" @click="scrollToTop">⬆️</div>
</template>

<script>
export default {
  name: "ScrollTopButton",
  data() {
    return {
      // Флаг видимости кнопки
      showButton: false,
    };
  },
  // Добавление бработчика события scroll
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  // Удаление обработчика, чтобы предотвратить утечку памяти.
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // Если прокрутка превышает заданное значение, кнопка становится видимой.
    handleScroll() {
      const scrollPosition = window.scrollY;
      this.showButton = scrollPosition > 300;
    },
    // Плавная прокрутка вверх
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #007bff;
  color: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s;
  opacity: 0.8;
}
.scroll-to-top:hover {
  background-color: #0056b3;
  opacity: 1;
}
.scroll-to-top:active {
  transform: scale(0.95);
}
/* Поддержка адаптивности  */
@media (max-width: 768px) {
  .scroll-to-top {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
