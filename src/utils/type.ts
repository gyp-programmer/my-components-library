/*
 * 类型
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-29 10:57:13
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
export interface ITocItem {
  level: number;
  text: string;
  id: string;
  children: ITocItem[];
}
