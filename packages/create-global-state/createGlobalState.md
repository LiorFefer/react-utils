# Create Global State

A wrapper of a custom hook, `useGlobalState`, allows global state management using React hooks only.

## Usage Example

### Use Global Counter

##### Create The `useGlobalCounter` with an initial value set to `0`

```
const useGlobalCounter = createGlobalState(0);
```

##### Implement a `Counter` component that uses the `useGlobalCounter` custom hook

```
const Counter = () => {
  const [count, setCount] = useGlobalCount();
  const onClick = () => setCount(count + 1);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={onClick}>Increment</button>
    </>
  );
};
```

##### Render two instances of the `Counter` component

```
const App = () => {
    return (
        <>
            <Counter />
            <Counter />
        </>
    )
}
```

#### Click on the `Increment` button and see the results

- Further examples can be found in the [unit tests](./createGlobalState.spec.ts).
