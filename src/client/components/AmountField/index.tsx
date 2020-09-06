import React from "react";
import "./index.scss";
import Form, { FormItemProps } from "antd/lib/form";
import Input from "antd/lib/input";
import { useLocalStore } from "mobx-react";

interface IComponentProps {
  amount: string;
  label: string;
  min?: number;
  max?: number;
  onChange: Function;
  customAddon?: JSX.Element;
}

export const AmountField = (props: IComponentProps) => {
  const { min = 1, max = 10000 } = props;
  const store = useLocalStore(
    (props) => ({
      get validate(): { status: FormItemProps["validateStatus"]; errMsg?: string } {
        if (Number(props.amount) == 0) {
          return { status: "success" };
        }
        if (Number(props.amount) > props.max || Number(props.amount) < props.min) {
          return {
            status: "error",
            errMsg: `Amount must be between ${props.min} and ${props.max}`,
          };
        }
        return {
          status: "success",
        };
      },
    }),
    props
  );
  return (
    <Form.Item validateStatus={store.validate.status} help={store.validate.errMsg}>
      <Input
        autoComplete="off"
        className="component__amount_field bg-secondary c-white"
        prefix={
          <>
            <span className="text-xl font-thin">{props.label}</span>
            {props.customAddon || null}
          </>
        }
        placeholder="0.0"
        value={props.amount}
        onChange={(event) => {
          event.persist();
          props.onChange(event.target.value);
        }}
      />
    </Form.Item>
  );
};

const inputNumberValidator = (rule, value) => {
  let min = rule.min;
  let max = rule.max;
  const message = rule.message;
  if (min != null) min = Number(min);
  if (max != null) max = Number(max);
  try {
    const object = Number(value);
    if (min != null && object < min) throw new Error(message);
    if (max != null && object > max) throw new Error(message);
    if (isNaN(object)) throw new Error(message);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
