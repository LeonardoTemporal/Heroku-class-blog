const { db, DataTypes } = require("../utils/database.util");

const User = db.define("user", {
  //user MODEL
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // campo obligatorio en el formulario
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Que no se repitan los datos de este caracter, debe ser unico
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "normal",
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // active, disconnect, banned, deleted
    defaultValue: "active",
  },
});

module.exports = { User };
