// /// <reference types="typescript" />
//
// import ReactN, {
//   Component as ReactComponent,
//   ComponentType,
//   PureComponent as ReactPureComponent,
//   ReactElement
// } from 'react';
//
// interface AnyObject {
//   [key: string]: any;
// }
//
// type GlobalCallback = (global: GlobalState) => void;
//
// // TypeScript does not allow props P to be passed to static methods.
// declare class GlobalComponent<P = {}, S = {}> extends ReactComponent<P, S> {
//   static getDerivedGlobalFromProps?: (
//     props: AnyObject,
//     prevGloba: GlobalState,
//     prevState: AnyObject
//   ) => NewGlobal;
//   private _globalCallback: () => void;
//   readonly global: Readonly<GlobalState>;
//   setGlobal(newGlobal: NewGlobal, callback?: GlobalCallback): Promise<void> | void;
// }
//
// declare class GlobalPureComponent<P = {}, S = {}> extends ReactPureComponent<P, S> {
//   static getDerivedGlobalFromProps?: (
//     props: AnyObject,
//     prevGloba: GlobalState,
//     prevState: AnyObject
//   ) => NewGlobal;
//   private _globalCallback: () => void;
//   readonly global: Readonly<GlobalState>;
//   setGlobal(newGlobal: NewGlobal, callback?: GlobalCallback): Promise<void> | void;
// }
//
// type GlobalReducer = (state: GlobalState, ...args: any[]) => NewGlobal;
//
// type GlobalPropertySetter = (value: any) => void;
//
// interface GlobalState {
//   [key: string]: any;
// }
//
// type GlobalStateSetter = (newGlobal: NewGlobal, callback?: GlobalCallback) => Promise<void> | void;
//
// type LocalReducer = (...args: any[]) => void;
//
// type MapGlobalToProps<ComponentProps, NewProps> = (
//   global: GlobalState,
//   props: ComponentProps
// ) => NewProps;
//
// type NewGlobal =
//   | NewGlobalFunction
//   | null
//   | Partial<GlobalState>
//   | Promise<NewGlobalFunction>
//   | Promise<null>
//   | Promise<Partial<GlobalState>>;
//
// type NewGlobalFunction = (global: GlobalState) => NewGlobal;
//
// interface reactn {
//   (Component: ComponentType): GlobalComponent;
//   addReducer: (name: string, reducer: GlobalReducer) => void;
//   Component: GlobalComponent;
//   default: reactn;
//   PureComponent: GlobalPureComponent;
//   setGlobal: (newGlobal: NewGlobal, callback?: GlobalCallback) => Promise<void> | void;
//   useGlobal:
//     | (() => [GlobalState, GlobalStateSetter])
//     | (<Property extends keyof GlobalState>(
//         property: Property,
//         setterOnly?: boolean
//       ) => [GlobalState[Property], GlobalPropertySetter])
//     | ((reducer: GlobalReducer) => LocalReducer);
//   withGlobal: <CP, NP>(
//     getGlobal: MapGlobalToProps<CP, NP>
//   ) => (Component: ComponentType<CP & NP>) => GlobalPureComponent<CP, never>;
// }
//
// export = reactn;
