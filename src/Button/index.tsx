/*
 * 按钮组件
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 10:44:03
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import React from 'react';
import { comp_className } from '../constants';
import cx from 'classnames';
import './index.scss';



export default function Button(props: {
  /** 按钮文字 */
  text: string;
  /** 按钮颜色 */
  color?: string;
  /** 按钮点击事件 */
  onClick?: () => void;
  /**
   * 按钮样式
   * @default primary
   */
  type?: 'primary' | 'secondary';
  /** 自定义样式 */
  className?: string;
}) {
  const { color, text, onClick, type } = props;
  const button_className = cx(`${comp_className}button`, {
    [`${comp_className}button-${type}`]: type,
  });
  return (
    <div onClick={onClick} className={button_className}>
      <button type="button" style={{ color }}>
        {text}
      </button>
    </div>
  );
}
