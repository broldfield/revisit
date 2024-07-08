import { useEffect, useState } from 'react';
import {
  Box, Button, Text, Image,
} from '@mantine/core';

// import { useChartDimensions } from '../../card-sort-2/assets/hooks/useChartDimensions';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import cx from 'clsx';
import classes from './style/DndList.module.css';
import { StimulusParams } from '../../store/types';
import bushfireImage from './style/Bushfire Text image.png';

interface CardSortReponse {
  cardOrder: Array<object>;
}

export default function CardSortReponse({
  parameters,
  setAnswer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: StimulusParams<any>) {
  const { taskid, cards } = parameters;
  const [cardArray, setCardArray] = useState<Array<JSX.Element>>([]);
  const [state, handlers] = useListState(cards);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = state.map((item: any, index) => (
      <Draggable key={item.label} index={index} draggableId={item.label}>
        {(provided, snapshot) => (
          <div
            className={cx(classes.item, {
              [classes.itemDragging]: snapshot.isDragging,
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Text className={classes.symbol}>{item.label}</Text>
            <div>
              <Text>{item.text}</Text>
            </div>
          </div>
        )}
      </Draggable>
    ));
    setCardArray(items);
  }, [state]);

  // console.log(`State Log: ${JSON.stringify(state, null, 2)}`);
  // Map the state, item = data, index = position in array.
  // We want this items as the answer sent. Index is important.

  const clickCallback = () => {
    const answer = JSON.stringify(state, null, 2);
    setAnswer({
      status: true,
      answers: {
        [taskid]: answer,
      },
    });
  };

  return (
    <Box style={{ minWidth: 'fit-content' }}>
      <Image radius="md" h={500} w={1000} src={bushfireImage} />

      <DragDropContext
        onDragEnd={({ destination, source }) => handlers.reorder({ from: source.index, to: destination?.index || 0 })}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {cardArray}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={() => clickCallback()}>Confirm Cards</Button>
    </Box>
  );
}
