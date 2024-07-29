import { useEffect, useState, Dispatch, SetStateAction } from "react";

type Observer = {
  notify: Dispatch<SetStateAction<boolean>>;
};

type Observers = Array<Observer>;

export const createGlobalState = <T>(initialValue: T) => {
  let observers: Observers = [];
  let state = initialValue;

  const useGlobalState = (): [T, (newState: T) => void] => {
    // dummy state to force re-render
    // the actual state is stored in the closure to prevent deuplication
    const [_state, _setState] = useState(true);

    const setState = (newState: T) => {
      state = newState;
      observers.forEach((observer) => {
        observer.notify(!_state);
      });
    };

    const removeObserverHOF = (observerToRemove: Observer) => () => {
      observers = observers.filter((observer) => observer !== observerToRemove);
    };

    useEffect(() => {
      const observer = { notify: _setState };
      observers.push(observer);
      return removeObserverHOF(observer);
    }, []);

    return [state, setState];
  };

  return useGlobalState;
};
