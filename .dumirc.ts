/*
 * dumi 的配置文件
 * 
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 09:39:50
 * 
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */

import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs_dist',
  themeConfig: {
    name: 'gyp-gao-ui',
  },
  apiParser: {},
  resolve: {
    // 配置入口文件路径，API 解析将从这里开始
    entryFile: './src/index.ts',
  },
});
