module.exports = function (sequelize, DataTypes) {
    var Lunch = sequelize.define("Lunch", {
        userID: DataTypes.TINYINT,
        eater: DataTypes.STRING,
        lunch: DataTypes.STRING,
        ingredients: DataTypes.STRING,
        tradable: DataTypes.BOOLEAN,
    });
    return Lunch;
};