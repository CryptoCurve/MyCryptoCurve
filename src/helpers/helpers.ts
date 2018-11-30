type ConsoleColors = 'lightGreen' | 'white' | 'lightBlue' | 'black';
export const helperRenderConsoleText = (
  message: string,
  background: ConsoleColors,
  color?: ConsoleColors
) => {
  return [`%c${message}`, `background: ${background};color: ${color ? color : 'black'};`];
};
