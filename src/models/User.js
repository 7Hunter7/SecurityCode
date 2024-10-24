import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user", // По умолчанию роль обычного пользователя
    validate: {
      isIn: [["user", "advanced_user", "admin"]], // Роли пользователя
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/, // Валидация телефона
      notNull: {
        msg: "Телефон обязателен",
      },
    },
  },
  profilePhoto: {
    type: DataTypes.STRING, // Ссылка на фото
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notifications: {
    type: DataTypes.JSON, // Хранит настройки уведомлений
    defaultValue: {
      email: false,
      phone: false,
    },
  },
  //Двухфакторная аутентификация
  twoFactorCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twoFactorExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Хэширование пароля перед сохранением нового пользователя
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Хэширование пароля перед обновлением, если пароль был изменён
User.beforeUpdate(async (user) => {
  if (user.password && user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Метод для сравнения пароля
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default User;
