import React, {
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type Children = Array<React.ReactElement>;

interface FadeWrapperProps {
  children: Children;
  ChildrenContainer: FC<{ children: Children } & { ref: Ref<HTMLElement> }>;
  TopFadeComponent: FC;
  BottomFadeComponent: FC;
  /**
   * @default 1
   * @description a number between 0 and 1
   */
  instersectionRatio?: number;
}

type FadeWrapperComponent = FC<FadeWrapperProps>;

export const FadeWrapper: FadeWrapperComponent = (props) => {
  const {
    children,
    TopFadeComponent,
    BottomFadeComponent,
    ChildrenContainer,
    instersectionRatio = 1,
  } = props;
  const [displayTopFade, setDisplayTopFade] = useState(false);
  const [displayBottomFade, setDisplayBottomFade] = useState(false);
  const containerRef = useRef(null);
  const firstChildRef = useRef<HTMLDivElement>(null);
  const lastChildRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observerOptions = {
      root: containerRef.current,
      threshold: [instersectionRatio],
    };
    const generateObserver = (
      setDisplayFade: Dispatch<SetStateAction<boolean>>
    ) => {
      return new IntersectionObserver(([entry]) => {
        const isHidden = entry.intersectionRatio < instersectionRatio;
        setDisplayFade(isHidden);
      }, observerOptions);
    };

    const observerFirst = generateObserver(setDisplayTopFade);
    const observerLast = generateObserver(setDisplayBottomFade);

    if (firstChildRef.current) {
      observerFirst.observe(firstChildRef.current);
    }

    if (lastChildRef.current) {
      observerLast.observe(lastChildRef.current);
    }

    return () => {
      observerFirst.disconnect();
      observerLast.disconnect();
    };
  }, [containerRef, firstChildRef, lastChildRef]);

  const clonedChildren = React.Children.map(children, (child) => {
    return React.cloneElement(child);
  });

  const firstElement = clonedChildren[0];
  const lastElementIndex = clonedChildren.length - 1;
  const lastElement = clonedChildren[lastElementIndex];
  clonedChildren[0] = React.cloneElement(firstElement, {
    ref: firstChildRef,
  });
  clonedChildren[lastElementIndex] = React.cloneElement(lastElement, {
    ref: lastChildRef,
  });

  return (
    <>
      {displayTopFade && <TopFadeComponent />}
      <ChildrenContainer ref={containerRef}>{clonedChildren}</ChildrenContainer>
      {displayBottomFade && <BottomFadeComponent />}
    </>
  );
};
