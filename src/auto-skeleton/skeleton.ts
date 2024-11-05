/*
 * 统一导出所有 skeleton 组件
 * 
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-11-05 11:04:14
 * 
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import Image from './image';
import Text from './text';

/** 为text类型的标签类型组合 */
export const textTypes = ['p', 'span', 'a', 'button', 'input', 'textarea', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'li', 'ul', 'ol', 'pre', 'code', 'blockquote', 'cite','strong', 'em','mark', 'del', 'ins','sub','sup','small', 'big']

/** 为image类型的标签类型组合 */
export const imageTypes = ['img','svg', 'picture', 'video', 'audio']

export {
  Image,
  Text,
};
