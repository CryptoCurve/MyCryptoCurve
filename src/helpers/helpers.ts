import { Routes } from '../context/RouteContext';

type ConsoleColors = 'lightGreen' | 'white' | 'lightBlue' | 'black';
export const helperRenderConsoleText = (
  message: string,
  background: ConsoleColors,
  color?: ConsoleColors
) => {
  return [`%c${message}`, `background: ${background};color: ${color ? color : 'black'};`];
};

export const helperHandleNavigateTo = (location:Routes, navigateTo:(location:Routes)=>void) => ()=> navigateTo(location);
