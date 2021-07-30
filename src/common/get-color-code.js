const getColorCode = (colorText) => {
  let colorCode;
  switch (colorText) {
    case "red":
      colorCode = "#FF5252";
      break;
    case "blue":
      // colorCode = "#3F51B5";
      colorCode = "#3D5AFE";
      break;
    case "green":
      colorCode = "#4CAF50";
      break;
    case "yellow":
      colorCode = "#FFAB00";
      break;
    default:
      colorCode = "#fff";
  }
  return colorCode;
};

export default getColorCode;
