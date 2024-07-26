import { renderHook, act } from "@testing-library/react-hooks";
import { createGlobalState } from "./createGlobalState";

const INITIAL_COUNT = 0;
const useCounter = createGlobalState(INITIAL_COUNT);
const INTIAL_USER = { name: "John Doe", petName: "Fluffy" };
const useUser = createGlobalState(INTIAL_USER);

describe("createGlobalState", () => {
  test("should initialize with the correct initial state", () => {
    const { result } = renderHook(() => useCounter());
    const [state] = result.current;
    expect(state).toBe(INITIAL_COUNT);
  });

  test("should update the state and notify all observers", () => {
    const { result: result1 } = renderHook(() => useCounter());
    const { result: result2 } = renderHook(() => useCounter());
    const newCounterValue = 10;
    act(() => {
      const [, setState] = result1.current;
      setState(newCounterValue);
    });

    const [state1] = result1.current;
    const [state2] = result2.current;

    expect(state1).toBe(newCounterValue);
    expect(state2).toBe(newCounterValue);
  });

  test("should maintain state for first consumer when second consumer unmounts", () => {
    const { result: consumerAResult, unmount } = renderHook(() => useCounter());
    const { result: consumerBResult } = renderHook(() => useCounter());
    const consumerAUpdatedValue = 2;
    const consumerAUpdatedValue2 = 4;
    act(() => {
      const [, setState] = consumerAResult.current;
      setState(consumerAUpdatedValue);
    });

    unmount();

    const [state1] = consumerBResult.current;
    expect(state1).toBe(consumerAUpdatedValue);

    act(() => {
      const [, setState] = consumerBResult.current;
      setState(consumerAUpdatedValue2);
    });

    const [newState1] = consumerBResult.current;
    expect(newState1).toBe(consumerAUpdatedValue2);
  });

  test("should handle multiple global states independently", () => {
    const { result: countResult } = renderHook(() => useCounter());
    const { result: userResult } = renderHook(() => useUser());
    const updatedCount = 10;
    const updatedUser = { name: "Jane Doe", petName: "Buddy" };
    act(() => {
      const [, setCount] = countResult.current;
      setCount(updatedCount);
    });

    act(() => {
      const [, setUser] = userResult.current;
      setUser(updatedUser);
    });

    const [countState] = countResult.current;
    expect(countState).toBe(updatedCount);

    const [userState] = userResult.current;
    expect(userState.petName).toEqual(updatedUser.petName);
  });
});
