export const onClickOutside = (
  currentTarget: HTMLElement,
  callback: () => void
) => {
  const eventListener = (e: MouseEvent) => {
    const { target } = e;
    if (
      target &&
      !(currentTarget as HTMLElement).contains(target as HTMLElement)
    ) {
      document.removeEventListener("click", eventListener);
      callback();
    }
  };
  document.addEventListener("click", eventListener);
};
