import React from 'react';
import './index.scss';
import { Select, Avatar } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface IComponentProps {
  token: string;
  onChange: Function;
}

interface IToken {
  id: string;
  name: string;
  img: string;
}

const { Option } = Select;

export const TOKENS: IToken[] = [
  {
    name: 'ABC token (ERC-20)',
    id: 'ABC token (ERC-20)',
    img: require('../../static/images/icon-eth.png'),
  },
  {
    name: 'bcd token (ERC-20)',
    id: 'bcd token (ERC-20)',
    img: require('../../static/images/icon-eth.png'),
  },
  {
    name: 'qwe token (ERC-20)',
    id: 'qwe token (ERC-20)',
    img: require('../../static/images/icon-eth.png'),
  },
];

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
          <Avatar src={token.img} size="small" />
          <span className="flex-1 text-xl text-left ml-4 font-thin">
            {token.name}
          </span>
        </Option>
      ))}
    </Select>
  );
};
