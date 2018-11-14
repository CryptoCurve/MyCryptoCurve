type ConsoleColors = 'lightGreen' | 'white' | 'lightBlue' | 'black';
export const renderConsoleText = (
  message: string,
  background: ConsoleColors,
  color?: ConsoleColors
) => {
  return [`%c${message}`, `background: ${background};color: ${color ? color : 'black'};`];
};
