/*
 * 工具
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-29 10:53:32
 *
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import { ITocItem } from './type';

/**
 * 生成目录树
 * @param headings
 * @returns
 */
export const buildTocTree = (headings: NodeListOf<HTMLElement>) => {
  const tocTree: ITocItem[] = [];
  let currentLevel = 0;
  let currentParent = [{ level: 0, children: tocTree }];

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    const id = heading.id;
    const text = heading.innerText;

    const node: ITocItem = { level, text, id, children: [] };

    if (level > currentLevel) {
      currentParent[currentParent.length - 1].children.push(node);
      currentParent.push({ level, children: node.children });
    } else if (level === currentLevel) {
      currentParent[currentParent.length - 2].children.push(node);
    } else {
      while (level <= currentParent[currentParent.length - 1].level) {
        currentParent.pop();
      }

      currentParent[currentParent.length - 1].children.push(node);
    }

    currentLevel = level;
  });
  return tocTree;
};
