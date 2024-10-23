<template>
  <div class="scroll-to-top" v-if="showButton" @click="scrollToTop">
    <svg
      width="24"
      height="24"
      viewBox="0 -4 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Lager_14" data-name="Lager 14" transform="translate(-6 -10)">
        <path
          id="Path_16"
          data-name="Path 16"
          d="M15.319,15.909a1.97,1.97,0,0,1,.732-.278,1,1,0,0,1,.679.278l5.732,5.517a2.116,2.116,0,0,0,2.887.01l.03-.028a1.958,1.958,0,0,0,.008-2.854l-8.613-8.267A1.077,1.077,0,0,0,16.051,10a2.115,2.115,0,0,0-.775.287L6.611,18.554a1.959,1.959,0,0,0,.012,2.854l.036.028a2.134,2.134,0,0,0,2.9-.01Z"
          fill="#fff"
        />
      </g>
    </svg>
  </div>
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
    // Появление кнопки при прокрутке более 300px
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
  transition: opacity 0.5s, transform 0.3s;
  opacity: 0;
  transform: translateY(30px); /* Кнопка сначала находится ниже */
}
.scroll-to-top:hover {
  background-color: #0056b3;
  opacity: 1;
}
.scroll-to-top:active {
  transform: scale(0.95); /* Эффект сжатия при клике */
}
/* Плавное появление кнопки */
.scroll-to-top-enter-active {
  opacity: 1;
  transform: translateY(0);
}
/* Плавное исчезновение кнопки */
.scroll-to-top-leave-active {
  opacity: 0;
  transform: translateY(30px);
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
