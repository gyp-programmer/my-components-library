/*
 * @Todo: 请补充模块描述
 * 
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 19:36:16
 * 
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import React from 'react';
import { IEditorConfig } from '@wangeditor/editor';
import { Editor } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';

interface IRichTextRenderProps {
  /**
   * 富文本内容
   */
  content: string;
}
export default function RichTextRender(props: IRichTextRenderProps) {
    const { content } = props;
    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        readOnly: true,
    };

    return (
        <Editor
          defaultConfig={editorConfig}
          value={content}
          mode="default"
        />
    )
}
