/*
 * 富文本组件
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-11 18:40:19
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { comp_className } from '../constants';
import { buildTocTree } from '../utils';
import { ITocItem } from '../utils/type';
import TocTree from './components/toctree';
import './index.scss';

export interface IReaderProps {
  /**
   * 是否启用目录
   * @default true
   */
  isOpenDir?: boolean;
  /**
   * 点击目录的回调
   * @param toc 点击的目录项
   */
  onClickItem?: (toc: ITocItem) => void;
  /**
   * 富文本内容
   * @description 一段html字符串
   */
  html?: string;
  /**
   * 初始化之后的回调
   * @param dir 目录
   * @returns
   */
  onInit?: (dir: ITocItem[]) => void;
  className?: string;
}

const defaultHtml = `<div class="theme-default-content"><!--[--><h1 data-target-id="节点数据结构" id="节点数据结构" tabindex="-1"><a class="header-anchor" href="#节点数据结构" aria-hidden="true">#</a> 节点数据结构</h1><p>wangEditor 是基于 slate.js 为内核开发的，所以学习本文之前，要先了解 <a href="https://docs.slatejs.org/concepts/02-nodes" target="_blank" rel="noopener noreferrer">slate Node 设计<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> 。</p><h2 data-target-id="是什么" id="是什么" tabindex="-1"><a class="header-anchor" href="#是什么" aria-hidden="true">#</a> 是什么</h2><p>很多同学可能根本不知道本文要讲什么，对于这里的“节点”和“数据结构”也不知何意。<br> 没关系，接下来通过几个问题，就可以让你快速入门。</p><p>我们通过 <a href="/v5/API.html" class="">API</a> 的学习，已经知道了 wangEditor 有丰富的 API 可供使用。<br> 那么问题来了：</p><ul><li><code>editor.addMark(key, value)</code> 可以设置文本样式，如何设置删除线呢？此时 <code>key</code> <code>value</code> 该怎么写？</li><li><code>editor.insertNode(node)</code> 可以插入一个节点，如何插入一个链接呢？此时 <code>node</code> 该怎么写？</li><li><code>SlateTransforms.setNodes(editor, {...})</code> 可以设置节点的属性，如何设置行高呢？此时 <code>{...}</code> 这个属性该怎么写？</li></ul><p>通过上述问题，你大概知道了本文的目的 —— 就是告诉你，编辑器内所有内容、节点的数据结构 —— 它们都是由哪些数据构成的。</p><h2 data-target-id="快速了解" id="快速了解" tabindex="-1"><a class="header-anchor" href="#快速了解" aria-hidden="true">#</a> 快速了解</h2><p>如果想快速了解各个节点的数据结构，其实方法很简单。</p><ul><li>创建一个编辑器，操作一下</li><li>查看 <code>editor.children</code></li></ul><p>例如，写一段文字、设置一个标题或列表，查看 <code>editor.children</code> 即可看到他们的数据结构</p><p><img src="/image/数据结构-1.png" alt="" class="medium-zoom-image"></p><p>再例如，对文字设置行高，设置文本样式，查看 <code>editor.children</code> 即可看到他们的数据结构</p><p><img src="/image/数据结构-2.png" alt="" class="medium-zoom-image"></p><h2 data-target-id="text-node" id="text-node" tabindex="-1"><a class="header-anchor" href="#text-node" aria-hidden="true">#</a> Text Node</h2><p>文本节点，例如 <code>{ text: 'hello' }</code> <strong>必须有 <code>text</code> 属性</strong>。还可以自定义属性，例如加粗的文本可表示为 <code>{ text: 'hello', bold: true }</code> ，其他属性可自行扩展。</p><p>注意，文本节点是底层节点，所以没有子节点，<strong>没有 <code>children</code> 属性</strong>。</p><h2 data-target-id="element-node" id="element-node" tabindex="-1"><a class="header-anchor" href="#element-node" aria-hidden="true">#</a> Element Node</h2><p>元素节点，例如 <code>{ type: 'header1', children: [ { text: 'hello' } ] }</code> <strong>必须有两个属性 <code>type</code> 和 <code>children</code> 属性</strong>。还可以自定义属性，例如居中对齐可表示为 <code>{ type: 'header1', textAlign: 'center', children: [ { text: 'hello' } ] }</code> ，其他属性自行扩展。</p><h2 data-target-id="inline-element" id="inline-element" tabindex="-1"><a class="header-anchor" href="#inline-element" aria-hidden="true">#</a> Inline Element</h2><p>元素默认是 block 显示，即占满一整行。但有些元素需要变为 inline 显示，如 <code>&lt;img&gt;</code> <code>&lt;a&gt;</code> 等。</p><p>我们可以<strong>通过<a href="/v5/development.html#%E5%8A%AB%E6%8C%81%E7%BC%96%E8%BE%91%E5%99%A8%E4%BA%8B%E4%BB%B6%E5%92%8C%E6%93%8D%E4%BD%9C-%E6%8F%92%E4%BB%B6" class="">插件</a>来修改 <code>isInline</code> 把一个元素改为 inline</strong> ，参考链接元素的<a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/link/plugin.ts" target="_blank" rel="noopener noreferrer">插件源码<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a>。</p><h2 data-target-id="void-element" id="void-element" tabindex="-1"><a class="header-anchor" href="#void-element" aria-hidden="true">#</a> Void Element</h2><p>有些元素需要定义为 void 类型（即没有子节点），例如 <code>&lt;img&gt;</code> <code>&lt;video&gt;</code> 等。</p><p>我们可以<strong>通过<a href="/v5/development.html#%E5%8A%AB%E6%8C%81%E7%BC%96%E8%BE%91%E5%99%A8%E4%BA%8B%E4%BB%B6%E5%92%8C%E6%93%8D%E4%BD%9C-%E6%8F%92%E4%BB%B6" class="">插件</a>来修改 <code>isVoid</code> 把一个元素改为 void</strong> ，参考图片元素的<a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/image/plugin.ts" target="_blank" rel="noopener noreferrer">插件源码<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a>。</p><p>注意，void 类型虽然在语义上没有子节点，但 slate.js 规定，<strong>它必须有一个 <code>children</code> 属性，其中只有一个空字符串</strong>。例如图片元素：</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'image'</span><span class="token punctuation">,</span>
    <span class="token comment">// 其他属性 ...</span>
    <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">''</span> <span class="token punctuation">}</span><span class="token punctuation">]</span> <span class="token comment">// void 元素必须有一个 children ，其中只有一个空字符串，重要！！！</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h2 data-target-id="各种节点的数据结构"  id="各种节点的数据结构" tabindex="-1"><a class="header-anchor" href="#各种节点的数据结构" aria-hidden="true">#</a> 各种节点的数据结构</h2><p>详细的节点数据结构，可以直接查看源码中 <code>type</code> 定义。</p><ul><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/text-style/custom-types.ts" target="_blank" rel="noopener noreferrer">文本样式<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 text node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/color/custom-types.ts" target="_blank" rel="noopener noreferrer">文字颜色 背景色<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 text node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/paragraph/custom-types.ts" target="_blank" rel="noopener noreferrer">段落<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/line-height/custom-types.ts" target="_blank" rel="noopener noreferrer">行高<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 element node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/font-size-family/custom-types.ts" target="_blank" rel="noopener noreferrer">字号 字体<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 text node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/justify/custom-types.ts" target="_blank" rel="noopener noreferrer">对齐<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 element node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/indent/custom-types.ts" target="_blank" rel="noopener noreferrer">缩进<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 扩展 element node 属性</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/link/custom-types.ts" target="_blank" rel="noopener noreferrer">链接<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 <strong>inline</strong> element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/header/custom-types.ts" target="_blank" rel="noopener noreferrer">标题<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/blockquote/custom-types.ts" target="_blank" rel="noopener noreferrer">引用<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/image/custom-types.ts" target="_blank" rel="noopener noreferrer">图片<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 <strong>inline void</strong> element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/divider/custom-types.ts" target="_blank" rel="noopener noreferrer">分割线<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 <strong>void</strong> element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/basic-modules/src/modules/code-block/custom-types.ts" target="_blank" rel="noopener noreferrer">代码块<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/list-module/src/module/custom-types.ts" target="_blank" rel="noopener noreferrer">列表<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/table-module/src/module/custom-types.ts" target="_blank" rel="noopener noreferrer">表格<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 element node</li><li><a href="https://github.com/wangeditor-team/wangEditor/blob/master/packages/video-module/src/module/custom-types.ts" target="_blank" rel="noopener noreferrer">视频<span><svg class="external-link-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg><span class="external-link-icon-sr-only">open in new window</span></span></a> - 定义 <strong>void</strong> element node</li></ul><!--]--></div>`;

export default function Reader(props: IReaderProps) {
  const {
    isOpenDir = true,
    onClickItem,
    html = defaultHtml,
    className,
  } = props;
  const baseClassName = `${comp_className}reader`;
  const reader_className = cx(baseClassName, className);
  const [tree, setTree] = useState<ITocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    const template = document.createElement('div');
    template.innerHTML = html;
    const headings = template.querySelectorAll(
      'h1, h2, h3, h4, h5, h6',
    ) as NodeListOf<HTMLElement>;
    const dir = buildTocTree(headings);
    setTree(dir);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    /** 检测内容是否有变化，有变化则重新计算offsetTop */
    const mutaionObserver = new MutationObserver(() => {
      setChangeCount(changeCount + 1);
    });
    // childList - 子节点的变动（新增、删除或者更改）
    // characterData - 节点内容或节点文本的变动
    // subtree - 是否将观察器应用于该节点的所有后代节点
    mutaionObserver.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }, [contentRef.current]);

  return (
    <div className={reader_className}>
      <div
        className={`${baseClassName}-content`}
        dangerouslySetInnerHTML={{ __html: html }}
        ref={contentRef}
      ></div>
      {isOpenDir && (
        <TocTree
          tree={tree}
          changeCount={changeCount}
          onClickItem={onClickItem}
          baseClassName={baseClassName}
        />
      )}
    </div>
  );
}
