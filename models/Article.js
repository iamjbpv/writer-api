const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const User = require("./User");
const Company = require("./Company");

const Article = sequelize.define("Article", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  title: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  content: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false,
  },
  writerId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
  editorId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
  },
});
Article.belongsTo(User, { foreignKey: "writerId", as: "writer" });
Article.belongsTo(User, { foreignKey: "editorId", as: "editor" });
Article.belongsTo(Company);

module.exports = Article;
