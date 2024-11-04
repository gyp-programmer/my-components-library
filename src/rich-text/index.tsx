/*
 * 富文本组件
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 18:40:19
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import React, { useEffect, useState } from 'react';

export interface IRichTextProps {
  /**
   * 富文本内容
   * @default ''
   */
  defaultContent?: string;
  /**
   * 富文本提示文字
   * @default '请输入内容'
   */
  placeholder?: string;
  /**
   * 富文本内容变化回调
   * @param html 富文本内容
   */
  onChange?: (html: string) => void;
}

export default function RichText(props: IRichTextProps) {
  const { defaultContent = '', placeholder = '请输入内容', onChange } = props;
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 编辑器内容
  const [html, setHtml] = useState(defaultContent);
  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder
  };
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const handleChange = (editor: IDomEditor) => {
    const h = editor.getHtml();
    setHtml(h);
    onChange && onChange(h);
  };    

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={handleChange}
          mode="default"
        />
      </div>
    </>
  );
}
