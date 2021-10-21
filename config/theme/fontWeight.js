// NOTE: medium and extrabold are here for back compatibility
let mediumWarn = false;
let extraBoldWarn = false;

module.exports = {
  normal: 400,
  get medium() {
    if (!mediumWarn) {
      mediumWarn = true;
      console.log(
        "warn - `font-medium` does not exist in the design library.  The font weight will resolve to `600`. Please replace instances of `font-medium` with `font-semibold`."
      );
    }
    return 600;
  },
  semibold: 600,
  bold: 700,
  get extrabold() {
    if (!extraBoldWarn) {
      extraBoldWarn = true;
      console.log(
        "warn - `font-extrabold` does not exist in the design library.  The font weight will resolve to `700`.  Please replace instances of `font-extrabold` with `font-bold`."
      );
    }
    return 700;
  },
};
