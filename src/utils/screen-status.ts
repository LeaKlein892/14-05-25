const horizontalScreen = () => {
  return window.matchMedia("(orientation: landscape)").matches;
};

export { horizontalScreen };
