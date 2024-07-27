# Fade Wrapper

A wrapper that adds a custom background indicates users can still scroll top/bottom.

It uses `Intersection Observer API
` and renders custom components provided by its consumer

## Usage Example

```

const TopFade = styled.div`
  background: linear-gradient(lightgray 0%, rgba(255, 255, 255, 0));
  height: 20px;
`;

const BottomFade = styled.div`
  background: linear-gradient(rgba(255, 255, 255, 0) 0%, lightgray);
  height: 20px;
`;

const ContentContainer = styled.div`
  height: 300px;
  overflow-y: hidden;
  &:hover {
    overflow-y: auto;
  }
`;

export const App = () => {
  return (
    <FadeWrapper
      TopFadeComponent={TopFade}
      BottomFadeComponent={BottomFade}
      ChildrenContainer={ContentContainer}
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i}>{i}</div>
      ))}
    </FadeWrapper>
  );
};

```