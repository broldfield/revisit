import {
  Box, Checkbox, Flex, Input,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { CheckboxResponse } from '../../parser/types';
import { generateErrorMessage } from './utils';
import { ReactMarkdownWrapper } from '../ReactMarkdownWrapper';
import { HorizontalHandler } from './HorizontalHandler';
import classes from './css/Checkbox.module.css';
import inputClasses from './css/Input.module.css';

export function CheckBoxInput({
  response,
  disabled,
  answer,
  index,
  enumerateQuestions,
  otherValue,
}: {
  response: CheckboxResponse;
  disabled: boolean;
  answer: object;
  index: number;
  enumerateQuestions: boolean;
  otherValue?: object;
}) {
  const {
    prompt,
    required,
    options,
    secondaryText,
    horizontal,
    withOther,
  } = response;

  const optionsAsStringOptions = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option));

  const [otherSelected, setOtherSelected] = useState(false);

  const error = useMemo(() => generateErrorMessage(response, answer, optionsAsStringOptions), [response, answer, optionsAsStringOptions]);

  return (
    <Checkbox.Group
      label={(
        <Flex direction="row" wrap="nowrap" gap={4}>
          {enumerateQuestions && <Box style={{ minWidth: 'fit-content', fontSize: 16, fontWeight: 500 }}>{`${index}. `}</Box>}
          <Box style={{ display: 'block' }} className="no-last-child-bottom-padding">
            <ReactMarkdownWrapper text={prompt} required={required} />
          </Box>
        </Flex>
      )}
      description={secondaryText}
      {...answer}
      error={error}
      style={{ '--input-description-size': 'calc(var(--mantine-font-size-md) - calc(0.125rem * var(--mantine-scale)))' }}
    >
      <Box mt="xs">
        <HorizontalHandler horizontal={!!horizontal} style={{ flexGrow: 1 }}>
          {optionsAsStringOptions.map((option) => (
            <Checkbox
              key={option.value}
              disabled={disabled}
              value={option.value}
              label={option.label}
              classNames={{ input: classes.fixDisabled, label: classes.fixDisabledLabel, icon: classes.fixDisabledIcon }}
            />
          ))}
          {withOther && (
            <Checkbox
              key="__other"
              disabled={disabled}
              value="__other"
              checked={otherSelected}
              onClick={(event) => setOtherSelected(event.currentTarget.checked)}
              label={horizontal ? 'Other' : (
                <Input
                  mt={-8}
                  placeholder="Other"
                  disabled={!otherSelected}
                  {...otherValue}
                  classNames={{ input: inputClasses.fixDisabled }}
                />
              )}
              classNames={{ input: classes.fixDisabled, label: classes.fixDisabledLabel, icon: classes.fixDisabledIcon }}
            />
          )}
        </HorizontalHandler>
      </Box>
      {horizontal && withOther && (
        <Input
          mt="sm"
          placeholder="Other"
          disabled={!otherSelected}
          {...otherValue}
          w={216}
          classNames={{ input: inputClasses.fixDisabled }}
        />
      )}
    </Checkbox.Group>
  );
}
