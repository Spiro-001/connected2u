type ActionType = {
  ArrowLeft: () => void;
  ArrowRight: () => void;
};

let handleKeyDown: (e: KeyboardEvent) => void;

export const keyboardListener = (action: ActionType) => {
  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        action.ArrowLeft();
        break;
      case "ArrowRight":
        action.ArrowRight();
        break;
      default:
        break;
    }
  };
  document.addEventListener("keydown", handleKeyDown);
};

export const removeKeyboardListener = () => {
  document.removeEventListener("keydown", handleKeyDown);
};
