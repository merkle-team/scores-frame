import React from 'react';

import { useFrameContext } from './FrameContextProvider';

function FrameSafeAreaProvider({ children }: React.PropsWithChildren) {
  const { safeAreaInsets } = useFrameContext();

  const style = React.useMemo(() => {
    if (typeof safeAreaInsets === 'undefined') {
      return undefined;
    }

    return {
      paddingTop: safeAreaInsets.top,
      paddingBottom: safeAreaInsets.bottom,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
    };
  }, [safeAreaInsets]);

  if (typeof safeAreaInsets === 'undefined') {
    return children;
  }

  return <div style={style}>{children}</div>;
}

export { FrameSafeAreaProvider };
