/*
 * Singleton class for persistent Redux store
 */
import {
  configureStore,
  Store,
} from "@reduxjs/toolkit";
import userReducer from "./User";
import spotReducer from "./Spot";

const LOCAL_STORAGE_NAME = "localData";

export class PersistedStore {
  // Singleton property
  private static DefaultStore: PersistedStore | null = null;

  // Get Redux store
  public static getStore() {
    if (PersistedStore.DefaultStore === null) {
      PersistedStore.DefaultStore = new PersistedStore();
    }

    return PersistedStore.DefaultStore._store;
  }

  // Redux store
  private _store: Store;

  // Initialize the store
  constructor() {
    this._store = configureStore({
      reducer: {
        user: userReducer,
        spot: spotReducer,
      },
      preloadedState: PersistedStore.loadState(),
    });
    this._store.subscribe(() => {
      if (this._store !== null) {
        PersistedStore.saveState(this._store.getState());
      }
    });
  }

  // Getter to access the Redux store
  get store() {
    return this._store;
  }

  // Loading persisted state from localStorage
  static loadState() {
    try {
      let serializedState = localStorage.getItem(LOCAL_STORAGE_NAME);

      if (serializedState === null) {
        return {};
      }

      return JSON.parse(serializedState);
    } catch (err) {
      return {};
    }
  }

  // Saving persisted state to localStorage every time something
  // changes in the Redux Store
  static saveState(state: any) {
    try {
      let serializedState = JSON.stringify(state);
      localStorage.setItem(LOCAL_STORAGE_NAME, serializedState);
    } catch (err) {}
  }

  // Clear & reset persisted state from localStorage
  static clearState() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_NAME);
    } catch (err) {}
    this.loadState();
  }
}
