module.exports = function (sequelize, DataTypes) {
    var Lunch = sequelize.define("Lunch", {
        userID: DataTypes.TINYINT,
        eater: DataTypes.STRING,
        lunch: DataTypes.STRING,
        ingredients: DataTypes.STRING,
        school: DataTypes.STRING,
        tradable: DataTypes.BOOLEAN,
        requested: DataTypes.BOOLEAN,
    });
    return Lunch;
};