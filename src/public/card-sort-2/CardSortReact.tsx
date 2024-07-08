import { useEffect, useState } from 'react';
import {
  Box, Button, Text, Image, Grid, Flex,
} from '@mantine/core';

// import { useChartDimensions } from '../../card-sort-2/assets/hooks/useChartDimensions';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import cx from 'clsx';
import styles from './style/DndList.module.css';
import { StimulusParams } from '../../store/types';
import bushfireImage from './style/bushfire-image.png';

interface CardSortReponse {
  cardOrder: Array<object>;
}

export default function CardSortReponse({
  parameters,
  setAnswer,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
StimulusParams<any>) {
  const { taskid, cards } = parameters;
  const [cardArray, setCardArray] = useState<Array<JSX.Element>>([]);
  const [state, handlers] = useListState(cards);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = state.map((item: any, index) => (
      <Draggable key={item.label} index={index} draggableId={item.label}>
        {(provided, snapshot) => (
          <div
            className={cx(styles.item, {
              [styles.itemDragging]: snapshot.isDragging,
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Text className={styles.symbol}>{item.label}</Text>
            {/* <div>
              <Text>{item.text}</Text>
            </div> */}
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
      <Text size="lg" fw={700} style={{ marginBottom: '10px' }}>
        Below is a map showing the potential burn zones of a bushfire.
      </Text>
      <Image radius="md" h={500} w={1000} src={bushfireImage} />
      <Text
        size="md"
        fw={500}
        style={{ marginBottom: '10px', marginTop: '20px' }}
      >
        Drag and re-arrange the cards below on the left to match the cards on
        the right.
      </Text>
      <Grid>
        <Grid.Col
          span={{ base: 12, md: 6, lg: 3 }}
          style={{ borderRight: '1px dotted LightGray' }}
        >
          <DragDropContext
            onDragEnd={({ destination, source }) => handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            })}
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
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Flex
            justify="space-between"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <div className={styles.item}>
              <Text className={styles.symbol} style={{ width: '400px' }}>
                1 Most Impacted
              </Text>
            </div>
            <div className={styles.item}>
              <Text className={styles.symbol} style={{ width: '400px' }}>
                2
              </Text>
            </div>
            <div className={styles.item}>
              <Text className={styles.symbol} style={{ width: '400px' }}>
                3
              </Text>
            </div>
            <div className={styles.item}>
              <Text className={styles.symbol} style={{ width: '400px' }}>
                4
              </Text>
            </div>
            <div className={styles.item}>
              <Text className={styles.symbol} style={{ width: '400px' }}>
                5 Least Impacted
              </Text>
            </div>
          </Flex>
        </Grid.Col>
      </Grid>

      <Button onClick={() => clickCallback()}>Confirm Cards</Button>
    </Box>
  );
}
