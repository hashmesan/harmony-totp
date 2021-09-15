import React, {useState} from 'react';
import { useId } from '@mantine/hooks';
import { DefaultProps, MantineSize } from '@mantine/core';
import { Input, InputBaseProps, InputStylesNames } from '@mantine/core';
import {
  InputWrapperBaseProps,
  InputWrapper,
  InputWrapperStylesNames,
} from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { isValidAddress,isBech32Address } from "@harmony-js/utils";
const { toBech32, fromBech32 } = require('@harmony-js/crypto');

export type TextInputStylesNames = InputStylesNames | InputWrapperStylesNames;
export function normalizeHarmonyAddress(address) {
  if(isBech32Address(address)) {
    return fromBech32(address);
  }
  return address;
}

export interface TextInputProps
  extends DefaultProps<TextInputStylesNames>,
    InputBaseProps,
    InputWrapperBaseProps,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'| 'onChange' | 'value' | 'defaultValue'> {
  /** id is used to bind input and label, if not passed unique id will be generated for each input */
  id?: string;

  /** Adds icon on the left side of input */
  icon?: React.ReactNode;

  /** Input element type */
  type?: 'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number';

  /** Props passed to root element (InputWrapper component) */
  wrapperProps?: Record<string, any>;

  /** Get element ref */
  elementRef?: React.ForwardedRef<HTMLInputElement>;

  /** Format json on blur */
  formatOnBlur?: boolean;

  value?: string;
  defaultValue?: string;
  /** onChange value for controlled input */
  onChange?(value: string): void;

  /** Input size */
  size?: MantineSize;

  /** Error message shown when json is not valid */
  validationError?: React.ReactNode;

  /** Static css selector base */
  __staticSelector?: string;
}

export function HarmonyAddressInput({
  className,
  id,
  label,
  error,
  required,
  type = 'text',
  style,
  icon,
  description,
  themeOverride,
  wrapperProps,
  elementRef,
  validationError = "Invalid address",
  size = 'sm',
  formatOnBlur = false,
  value,
  defaultValue = "",  
  onChange,
  onFocus,
  onBlur,
  classNames,
  styles,
  __staticSelector = 'text-input',
  ...others
}: TextInputProps) {
  const uuid = useId(id);

  const [valid, setValid] = useState(null);
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: '',
    rule: (val) => typeof val === 'string',
    onChange,
  });

  const validate = (value) =>{
    return isValidAddress(value);
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    typeof onFocus === 'function' && onFocus(event);
    setValid(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    typeof onBlur === 'function' && onBlur(event);
    const isValid = validate(event.currentTarget.value);
    formatOnBlur &&
      isValid &&
      event.currentTarget.value.trim() !== '' &&
      setValue(JSON.stringify(JSON.parse(event.currentTarget.value), null, 2));
    setValid(isValid);
  };

  console.log("Value=", value);

  return (
    <InputWrapper
      required={required}
      id={uuid}
      label={label}
      error={valid || value=="" ? error : validationError || true}
      description={description}
      size={size}
      className={className}
      style={style}
      themeOverride={themeOverride}
      classNames={classNames}
      styles={styles}

      __staticSelector={__staticSelector}
      {...wrapperProps}
    >
      <Input<'input', HTMLInputElement>
        {...others}
        required={required}
        elementRef={elementRef}
        value={_value}
        id={uuid}
        type={type}
        invalid={!!error}
        icon={icon}
        size={size}
        themeOverride={themeOverride}
        classNames={classNames}
        onFocus={handleFocus}
        onBlur={handleBlur}  
        styles={styles}
        onChange={(event) => setValue(event.currentTarget.value.trim())}

        __staticSelector={__staticSelector}
      />
    </InputWrapper>
  );
}

HarmonyAddressInput.displayName = '@mantine/core/TextInput';
