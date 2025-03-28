import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import database from "../config/database.cjs";
const sequelize = new Sequelize(database.development);

class User extends Model {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.Password);
  }

  generateToken() {
    return jwt.sign(
      { id: this.UserID, username: this.Username, role: this.Role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

User.init(
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "cs",
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    underscored: false
  }
);

export default User;
