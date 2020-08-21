import React from 'react';
import './index.scss';
import { Select, Avatar } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { publicConfig } from '../../../../configs/public';

const TOKEN_IMG = require('../../static/images/icon-eth.png');

interface IComponentProps {
  token: string;
  onChange: Function;
}

interface IToken {
  id: string;
  name: string;
}

const { Option } = Select;

export const TOKENS: IToken[] = publicConfig.APP_TOKENS.split(
  ';'
).map((id) => ({ id, name: id }));

export const TokenSelectField = (props: IComponentProps) => {
  return (
    <Select
      className="component__token_select w-full c-white"
      suffixIcon={<DownOutlined className="c-gray-10 text-base mr-2" />}
      dropdownClassName="component__token_select__dropdown"
      onChange={(value) => {
        props.onChange(value);
      }}
    >
      {TOKENS.map((token) => (
        <Option
          key={token.id}
          value={token.id}
          className="flex bg-secondary c-white items-center"
        >
          <Avatar src={TOKEN_IMG} size="small" />
          <span className="flex-1 text-xl text-left ml-4 font-thin">
            {token.name}
          </span>
        </Option>
      ))}
    </Select>
  );
};
