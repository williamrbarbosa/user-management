import React from 'react';

type PositionType = 'start' | 'center' | 'end';

interface ItemProps extends React.PropsWithChildren {
  position?: PositionType;
}

const Item: React.FC<ItemProps> = (props) => {
  const { children, position } = props;

  const getPosition = () => {
    switch (position) {
      case 'start':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'end':
        return 'justify-end';
      default:
        return 'justify-between';
    }
  };
  return (
    <div
      className={`mb-3 flex w-full flex-row flex-wrap lg:flex-nowrap gap-5 ${getPosition()}`}
    >
      {children}
    </div>
  );
};

export type { ItemProps };

export default Item;
