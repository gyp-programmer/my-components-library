/*
 * 目录
 *
 * @Author: grayson<grayson.gao@bvox.com>
 * @Date: 2024-10-29 11:08:12
 * 参考：http://www.csayc.com/article/anchor-title
 * Copyright © 2019-2024 bvox.com. All Rights Reserved.
 */
import cx from 'classnames';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ITocItem } from '../../utils/type';

export interface ITocTreeProps {
  /**
   * 目录树
   */
  tree: ITocItem[];
  /**
   * 点击目录项回调
   * @param toc 点击的目录项
   */
  onClickItem?: (toc: ITocItem) => void;
  /**
   * 目录是否粘性定位
   */
  isSticky?: false;
  /**
   * 粘性定位的top值
   */
  stickyTop?: number;
  baseClassName: string;
  /** 
   * 用来处理 fixed 的偏移量 （当有fixed元素遮挡时，可以使用此参数）
   */
  fixedTop?: number;
  /**
   * 处理偏移量 （处理文章内容每一小节padding出现的一些空白区域）
   */
  offsetNumber?: number;
  /**
   * 触发更新
   */
  changeCount: number;
}

interface IAnchors {
  dom: HTMLElement;
  id: string;
  offsetTop: number;
}

export default function TocTree(props: ITocTreeProps) {
  const {
    tree,
    onClickItem,
    baseClassName,
    isSticky = true,
    stickyTop = 80,
    fixedTop = 80,
    changeCount,
    offsetNumber = 10
  } = props;
  const [active, setActive] = useState<string>('');
  const articleAnchors = useRef<IAnchors[]>([]);

  /**
   * 为了获取一个元素距离文档顶部的位置信息，理应使用element.offsetTop来获取，但因为其指受offsetParent影响，
   * 因此需要递归累加offsetTop的值，以此正确的拿到当前锚点距离文档流顶部的距离
   * @param element
   * @returns
   */
  // 获取Element的offsetTop，忽略offsetParent的影响
  function getElementTop(element: HTMLElement) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent as HTMLElement | null;
    while (current !== null) {
      actualTop += current.offsetTop;
      current = current.offsetParent as HTMLElement | null;
    }
    return actualTop;
  }
  const initAnc = useCallback(() => {
    const targetDoms = document.querySelectorAll(
      '[data-target-id]',
    ) as NodeListOf<HTMLElement>;
    targetDoms.forEach((dom) => {
      articleAnchors.current.push({
        dom: dom,
        // 获取当前dom距离文档流顶部的距离
        // -1的目的是为了滚动到当前offsetTop值时，视窗顶部正好盖住1px的锚点元素，这样才能正确激活右侧目录
        offsetTop: getElementTop(dom) - fixedTop - offsetNumber,
        id: dom.dataset.targetId || '',
      });
    });
    articleAnchors.current.sort((a, b) => a.offsetTop - b.offsetTop);
  }, [articleAnchors]);

  /**
   * 二分法查找值
   */
  function searchAnchor(anchors: IAnchors[], target: number) {
    let left = 0;
    let right = anchors.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (anchors[mid].offsetTop < target) {
        left = mid + 1;
      } else if (anchors[mid].offsetTop > target) {
        right = mid - 1;
      } else {
        return anchors[mid];
      }
    }
    return anchors[right];
  }

  const scrollBehavior = useCallback(() => {
    // 获取滚动条高度兼容性写法
    const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    // 二分法在一个有序数组中查找对应值
    const anc = searchAnchor(articleAnchors.current, scrollTop);
    if (!anc) return;
    setActive(anc.id);
  }, [articleAnchors]);

  useEffect(() => {
    initAnc();
    window.addEventListener('scroll', scrollBehavior);
    return () => {
      window.removeEventListener('scroll', scrollBehavior);
    };
  }, [initAnc, scrollBehavior, tree]);

  useEffect(() => {
    /** 检测内容有变化，有变化则重新计算offsetTop */
    articleAnchors.current = articleAnchors.current.map((o) => ({
      ...o,
      offsetTop: getElementTop(o.dom) - fixedTop,
    }));
  }, [changeCount]);

  const renderTree = (tree: ITocItem[]): React.ReactNode => {
    return tree.map((item) => {
      return (
        <Fragment key={item.id}>
          <div
            className={cx(
              `${baseClassName}-toc-tree-item`,
              `${baseClassName}-toc-tree-item_${item.level}`,
              active === item.id && 'active',
            )}
            onClick={() => {
              setActive(item.id);
              onClickItem && onClickItem(item);
            }}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </div>
          {item.children.length > 0 && renderTree(item.children)}
        </Fragment>
      );
    });
  };

  return (
    <div
      style={{ top: `${stickyTop}px` }}
      className={cx(`${baseClassName}-toc-tree`, isSticky && 'sticky')}
    >
      {renderTree(tree)}
    </div>
  );
}
